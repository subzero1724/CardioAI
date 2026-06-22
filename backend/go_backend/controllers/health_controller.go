package controllers

import (
	"net/http"

	"ecg-backend/services"
	"ecg-backend/utils"

	"github.com/gin-gonic/gin"
)

// HealthController handles health check endpoints.
type HealthController struct {
	ecgService *services.ECGService
}

// NewHealthController creates a new HealthController.
func NewHealthController(ecgService *services.ECGService) *HealthController {
	return &HealthController{ecgService: ecgService}
}

// Health handles GET /api/health
func (hc *HealthController) Health(c *gin.Context) {
	// Check AI service connectivity
	aiHealthy, aiErr := hc.ecgService.HealthCheck()

	aiStatus := "healthy"
	if aiErr != nil || !aiHealthy {
		aiStatus = "unreachable"
	}

	data := gin.H{
		"backend":    "healthy",
		"ai_service": aiStatus,
	}

	utils.Success(c, http.StatusOK, "Health check", data)
}
