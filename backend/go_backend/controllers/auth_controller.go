package controllers

import (
	"net/http"

	"ecg-backend/models"
	"ecg-backend/services"
	"ecg-backend/utils"

	"github.com/gin-gonic/gin"
)

// AuthController handles authentication endpoints.
type AuthController struct {
	authService *services.AuthService
}

// NewAuthController creates a new AuthController.
func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

// Register handles POST /api/auth/register
func (ac *AuthController) Register(c *gin.Context) {
	var req models.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, "Invalid request: "+err.Error())
		return
	}

	result, err := ac.authService.Register(&req)
	if err != nil {
		utils.Error(c, http.StatusConflict, err.Error())
		return
	}

	utils.Success(c, http.StatusCreated, "Registration successful", result)
}

// Login handles POST /api/auth/login
func (ac *AuthController) Login(c *gin.Context) {
	var req models.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, "Invalid request: "+err.Error())
		return
	}

	result, err := ac.authService.Login(&req)
	if err != nil {
		utils.Unauthorized(c, err.Error())
		return
	}

	utils.Success(c, http.StatusOK, "Login successful", result)
}
