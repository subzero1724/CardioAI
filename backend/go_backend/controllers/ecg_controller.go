package controllers

import (
	"log"
	"net/http"

	"ecg-backend/configs"
	"ecg-backend/services"
	"ecg-backend/utils"

	"github.com/gin-gonic/gin"
)

// ECGController handles ECG prediction endpoints.
type ECGController struct {
	ecgService *services.ECGService
	cfg        *configs.Config
}

// NewECGController creates a new ECGController.
func NewECGController(ecgService *services.ECGService, cfg *configs.Config) *ECGController {
	return &ECGController{
		ecgService: ecgService,
		cfg:        cfg,
	}
}

// Predict handles POST /api/ecg/predict
func (ec *ECGController) Predict(c *gin.Context) {
	// ── Get uploaded file ────────────────────────────────────────────
	file, err := c.FormFile("file")
	if err != nil {
		utils.ValidationError(c, "ECG image file is required (form field: 'file')")
		return
	}

	// ── Validate file extension ──────────────────────────────────────
	if !utils.IsAllowedImageExtension(file.Filename) {
		utils.ValidationError(c, "Invalid file type. Accepted: PNG, JPG, JPEG")
		return
	}

	// ── Validate file size ───────────────────────────────────────────
	maxBytes := ec.cfg.MaxUploadSizeMB * 1024 * 1024
	if file.Size > maxBytes {
		utils.ValidationError(c, "File too large. Maximum size: 10 MB")
		return
	}

	// ── Log request ──────────────────────────────────────────────────
	userID, _ := c.Get("user_id")
	log.Printf("[ECG] Prediction request from user=%v  file=%s  size=%d bytes",
		userID, file.Filename, file.Size)

	// ── Call AI service ──────────────────────────────────────────────
	result, err := ec.ecgService.Predict(file)
	if err != nil {
		log.Printf("[ECG] AI service error: %v", err)
		utils.InternalError(c, "ECG analysis failed. Please try again later.")
		return
	}

	log.Printf("[ECG] Prediction result: %s (%.2f%%)", result.Prediction, result.Confidence)

	utils.Success(c, http.StatusOK, "ECG analysis completed", result)
}
