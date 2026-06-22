"""
ModelService — Manages model lifecycle & ensemble inference
============================================================
Responsibilities:
  • Load all 3 models + scaler at startup
  • GPU / CPU device selection
  • Ensemble soft-voting (classification)
  • Ensemble averaging (regression)
  • Inverse-scale + physiological clipping
"""

import logging
import os
import joblib   
import time
from pathlib import Path

import numpy as np
import torch

from models.multitask_model import MultiTaskModel
from utils.postprocessing import clip_features, FEATURE_NAMES

logger = logging.getLogger("ecg_ai_service.model_service")

# ─────────────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────────────
_SERVICE_DIR = Path(__file__).resolve().parent.parent
_WEIGHTS_DIR = _SERVICE_DIR / "Models"

CLASS_NAMES = [
    "Normal",
    "Myocardial_Infarction",
    "Other_Heart_Disease",
]

BACKBONE_NAMES = [
    "vgg16",
    "resnet34",
    "densenet121",
]


class ModelService:
    """Singleton-style service that holds all models in memory."""

    def __init__(self):
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        self.models: dict[str, MultiTaskModel] = {}
        self.scaler = None
        self.is_loaded = False

    # ─────────────────────────────────────────────────
    # LOAD
    # ─────────────────────────────────────────────────
    def load_all(self) -> None:
        """Load all model weights and the regression scaler."""
        logger.info(f"Device selected: {self.device}")

        # Load each backbone
        for name in BACKBONE_NAMES:
            self._load_model(name)

        # Load scaler
        self._load_scaler()

        self.is_loaded = True

    def _load_model(self, backbone_name: str) -> None:
        """Load a single model's weights from disk."""
        weight_path = _WEIGHTS_DIR / f"best_{backbone_name}.pth"

        if not weight_path.exists():
            raise FileNotFoundError(
                f"Weight file not found: {weight_path}"
            )

        logger.info(f"Loading {backbone_name} from {weight_path} ...")
        start = time.perf_counter()

        model = MultiTaskModel(backbone_name=backbone_name)

        state_dict = torch.load(
            weight_path,
            map_location=self.device,
            weights_only=True,
        )

        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()

        elapsed = time.perf_counter() - start
        logger.info(
            f"  ✓ {backbone_name} loaded in {elapsed:.2f}s  "
            f"({weight_path.stat().st_size / 1024**2:.1f} MB)"
        )

        self.models[backbone_name] = model

    def _load_scaler(self) -> None:
        """Load the sklearn scaler used during training."""
        
        scaler_path = _WEIGHTS_DIR / "ecg_scaler.pkl"

        if not scaler_path.exists():
            raise FileNotFoundError(
                f"Scaler file not found: {scaler_path}"
            )

        self.scaler = joblib.load(
            scaler_path
        )

        logger.info(
            f"  ✓ Scaler loaded from {scaler_path}"
        )

    # ─────────────────────────────────────────────────
    # INFERENCE
    # ─────────────────────────────────────────────────
    @torch.inference_mode()
    def predict(
        self,
        input_tensor: torch.Tensor,
    ) -> dict:
        """
        Run ensemble inference on a preprocessed input tensor.

        Args:
            input_tensor: shape (1, 3, 224, 224) on self.device

        Returns:
            {
                "prediction": str,
                "confidence": float,
                "features": { ... }
            }
        """
        if not self.is_loaded:
            raise RuntimeError("Models not loaded. Call load_all() first.")

        all_probs = []
        all_regs = []

        for name, model in self.models.items():
            class_out, reg_out = model(input_tensor)

            probs = torch.softmax(class_out, dim=1)
            all_probs.append(probs)
            all_regs.append(reg_out)

        # Ensemble soft voting (average probabilities)
        avg_probs = torch.stack(all_probs).mean(dim=0)  # (1, 3)

        # Ensemble average regression
        avg_reg = torch.stack(all_regs).mean(dim=0)     # (1, 10)

        # Classification result
        confidence, pred_idx = torch.max(avg_probs, dim=1)
        predicted_class = CLASS_NAMES[pred_idx.item()]
        confidence_pct = round(confidence.item() * 100, 2)

        # Regression result → inverse transform → clip
        reg_values = avg_reg.cpu().numpy()  # (1, 10)

        if self.scaler is not None:
            reg_values = self.scaler.inverse_transform(reg_values)

        features = clip_features(reg_values[0])

        return {
            "prediction": predicted_class,
            "confidence": confidence_pct,
            "features": features,
        }
