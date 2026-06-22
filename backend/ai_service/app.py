"""
ECG AI Inference Service — FastAPI Application
================================================
Production-ready AI service for ECG image analysis using
an ensemble of VGG16, ResNet34, and DenseNet121 multitask models.
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.model_service import ModelService
from routes.predict import router as predict_router

# ─────────────────────────────────────────────────────
# LOGGING
# ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger("ecg_ai_service")

# ─────────────────────────────────────────────────────
# GLOBAL MODEL SERVICE (singleton)
# ─────────────────────────────────────────────────────
model_service = ModelService()


# ─────────────────────────────────────────────────────
# LIFESPAN — Load models at startup
# ─────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load all models and scaler once at startup."""
    logger.info("=" * 60)
    logger.info("ECG AI SERVICE — STARTING UP")
    logger.info("=" * 60)

    start = time.perf_counter()
    model_service.load_all()
    elapsed = time.perf_counter() - start

    logger.info(f"All models loaded in {elapsed:.2f}s")
    logger.info("=" * 60)
    logger.info("ECG AI SERVICE — READY")
    logger.info("=" * 60)

    # Make the service available to routes via app.state
    app.state.model_service = model_service

    yield  # Application is running

    logger.info("ECG AI SERVICE — SHUTTING DOWN")


# ─────────────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────────────
app = FastAPI(
    title="ECG AI Inference Service",
    description=(
        "Ensemble deep-learning inference for ECG image analysis. "
        "Classifies cardiac conditions and predicts ECG features."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ─────────────────────────────────────────────────────
# CORS (allow Golang backend & local dev)
# ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────
app.include_router(predict_router)


# ─────────────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    """Quick liveness / readiness probe."""
    return {
        "status": "healthy",
        "models_loaded": model_service.is_loaded,
        "device": str(model_service.device),
    }
