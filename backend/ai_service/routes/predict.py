"""
Prediction Route — POST /predict
==================================
Accepts an ECG image upload and returns ensemble prediction results.
"""

import logging
import time

from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from PIL import Image

from utils.preprocessing import preprocess_image

logger = logging.getLogger("ecg_ai_service.routes.predict")

router = APIRouter()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_FILE_SIZE_MB = 10


def _validate_file(file: UploadFile) -> None:
    """Validate uploaded file type."""
    if file.content_type not in (
        "image/png",
        "image/jpeg",
        "image/jpg",
    ):
        ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Invalid file type: {file.content_type}. "
                    f"Accepted: PNG, JPG, JPEG."
                ),
            )


@router.post("/predict")
async def predict(
    request: Request,
    file: UploadFile = File(..., description="ECG image (PNG/JPG/JPEG)"),
):
    """
    Perform ensemble ECG inference on an uploaded image.

    Returns:
        JSON with prediction, confidence (%), and ECG features.
    """
    # ── Validate ──────────────────────────────────────
    _validate_file(file)

    # ── Read image ────────────────────────────────────
    try:
        contents = await file.read()

        if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {MAX_FILE_SIZE_MB} MB.",
            )

        import io
        image = Image.open(io.BytesIO(contents))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to read image: {e}")
        raise HTTPException(
            status_code=400,
            detail="Could not read the uploaded image. Ensure it is a valid image file.",
        )

    # ── Inference ─────────────────────────────────────
    model_service = request.app.state.model_service

    try:
        start = time.perf_counter()

        input_tensor = preprocess_image(image, model_service.device)
        result = model_service.predict(input_tensor)

        elapsed = time.perf_counter() - start
        logger.info(
            f"Inference complete: {result['prediction']} "
            f"({result['confidence']}%) — {elapsed*1000:.1f}ms"
        )

    except Exception as e:
        logger.exception(f"Inference failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Inference failed. Please try again.",
        )

    return result
