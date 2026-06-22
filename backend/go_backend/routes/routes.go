package routes

import (
	"ecg-backend/configs"
	"ecg-backend/controllers"
	"ecg-backend/middleware"
	"ecg-backend/repositories"
	"ecg-backend/services"

	"github.com/gin-gonic/gin"
)

// Setup creates and configures the Gin router with all routes.
func Setup(cfg *configs.Config) *gin.Engine {
	r := gin.New()

	// ─── Global Middleware ───────────────────────────────────────────
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS(cfg.AllowedOrigins))

	// ─── Max upload size ─────────────────────────────────────────────
	r.MaxMultipartMemory = cfg.MaxUploadSizeMB << 20 // MB → bytes

	// ─── Dependency Injection ────────────────────────────────────────
	userRepo := repositories.NewInMemoryUserRepo()
	authService := services.NewAuthService(userRepo, cfg)
	ecgService := services.NewECGService(cfg)

	authController := controllers.NewAuthController(authService)
	ecgController := controllers.NewECGController(ecgService, cfg)
	healthController := controllers.NewHealthController(ecgService)

	// ─── Public Routes ──────────────────────────────────────────────
	api := r.Group("/api")
	{
		// Health
		api.GET("/health", healthController.Health)

		// Auth
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
		}

		// Public ECG predict — accessible from frontend without JWT
		api.POST("/predict", ecgController.Predict)
	}

	// ─── Protected Routes ───────────────────────────────────────────
	protected := api.Group("")
	protected.Use(middleware.AuthRequired(cfg.JWTSecret))
	{
		// Protected ECG endpoints (for future authenticated features)
		ecg := protected.Group("/ecg")
		{
			ecg.POST("/predict", ecgController.Predict)
		}
	}

	return r
}
