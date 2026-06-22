package main

import (
	"log"
	"os"

	"ecg-backend/configs"
	"ecg-backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// ─── Load .env (ignore error in production — use real env vars) ───
	if err := godotenv.Load(); err != nil {
		log.Println("[WARN] No .env file found — using system environment variables")
	}

	// ─── Load config ─────────────────────────────────────────────────
	cfg := configs.Load()

	// ─── Gin mode ────────────────────────────────────────────────────
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// ─── Build router ────────────────────────────────────────────────
	r := routes.Setup(cfg)

	// ─── Start ───────────────────────────────────────────────────────
	addr := ":" + cfg.Port
	log.Printf("═══════════════════════════════════════════════")
	log.Printf("  ECG BACKEND SERVICE — %s", cfg.Environment)
	log.Printf("  Listening on %s", addr)
	log.Printf("  AI Service  → %s", cfg.AIServiceURL)
	log.Printf("═══════════════════════════════════════════════")

	if err := r.Run(addr); err != nil {
		log.Fatalf("Server failed to start: %v", err)
		os.Exit(1)
	}
}
