package configs

import (
	"os"
	"strconv"
	"time"
)

// Config holds all application configuration.
type Config struct {
	// Server
	Environment string
	Port        string

	// JWT
	JWTSecret     string
	JWTExpiration time.Duration

	// AI Service
	AIServiceURL     string
	AIServiceTimeout time.Duration

	// File Upload
	MaxUploadSizeMB int64
	UploadDir       string

	// CORS
	AllowedOrigins []string

	// Database (future)
	DatabaseURL string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *Config {
	return &Config{
		Environment: getEnv("APP_ENV", "development"),
		Port:        getEnv("APP_PORT", "8080"),

		JWTSecret:     getEnv("JWT_SECRET", "change-me-in-production"),
		JWTExpiration: getDurationEnv("JWT_EXPIRATION_HOURS", 24) * time.Hour,

		AIServiceURL:     getEnv("AI_SERVICE_URL", "http://localhost:8000"),
		AIServiceTimeout: getDurationEnv("AI_SERVICE_TIMEOUT_SECONDS", 30) * time.Second,

		MaxUploadSizeMB: getInt64Env("MAX_UPLOAD_SIZE_MB", 10),
		UploadDir:       getEnv("UPLOAD_DIR", "./storage/uploads"),

		AllowedOrigins: []string{
			getEnv("CORS_ORIGIN", "http://localhost:3000"),
		},

		DatabaseURL: getEnv("DATABASE_URL", ""),
	}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func getInt64Env(key string, fallback int64) int64 {
	if val := os.Getenv(key); val != "" {
		if n, err := strconv.ParseInt(val, 10, 64); err == nil {
			return n
		}
	}
	return fallback
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	if val := os.Getenv(key); val != "" {
		if n, err := strconv.Atoi(val); err == nil {
			return time.Duration(n)
		}
	}
	return fallback
}
