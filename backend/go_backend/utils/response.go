package utils

import (
	"ecg-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Success sends a standard success JSON response.
func Success(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, models.APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// Error sends a standard error JSON response.
func Error(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, models.APIResponse{
		Success: false,
		Error:   message,
	})
}

// ValidationError sends a 400 response with validation details.
func ValidationError(c *gin.Context, message string) {
	Error(c, http.StatusBadRequest, message)
}

// Unauthorized sends a 401 response.
func Unauthorized(c *gin.Context, message string) {
	Error(c, http.StatusUnauthorized, message)
}

// InternalError sends a 500 response.
func InternalError(c *gin.Context, message string) {
	Error(c, http.StatusInternalServerError, message)
}
