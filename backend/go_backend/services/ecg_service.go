package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"ecg-backend/configs"
	"ecg-backend/models"
)

// ECGService handles the ECG prediction flow by proxying to the AI service.
type ECGService struct {
	cfg    *configs.Config
	client *http.Client
}

// NewECGService creates a new ECGService with a configured HTTP client.
func NewECGService(cfg *configs.Config) *ECGService {
	return &ECGService{
		cfg: cfg,
		client: &http.Client{
			Timeout: cfg.AIServiceTimeout,
		},
	}
}

// Predict sends an ECG image to the Python AI service and returns the result.
func (s *ECGService) Predict(fileHeader *multipart.FileHeader) (*models.ECGPredictionResult, error) {
	// ── Open the uploaded file ───────────────────────────────────────
	src, err := fileHeader.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	// ── Build multipart request body ────────────────────────────────
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		return nil, fmt.Errorf("failed to create form file: %w", err)
	}

	if _, err := io.Copy(part, src); err != nil {
		return nil, fmt.Errorf("failed to copy file data: %w", err)
	}

	if err := writer.Close(); err != nil {
		return nil, fmt.Errorf("failed to close multipart writer: %w", err)
	}

	// ── Send to AI service ──────────────────────────────────────────
	aiURL := fmt.Sprintf("%s/predict", s.cfg.AIServiceURL)

	req, err := http.NewRequest(http.MethodPost, aiURL, body)
	if err != nil {
		return nil, fmt.Errorf("failed to create AI request: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	start := time.Now()

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("AI service request failed: %w", err)
	}
	defer resp.Body.Close()

	elapsed := time.Since(start)
	log.Printf("[AI] Response status=%d  latency=%dms", resp.StatusCode, elapsed.Milliseconds())

	// ── Parse response ──────────────────────────────────────────────
	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("AI service returned %d: %s", resp.StatusCode, string(respBody))
	}

	var aiResp models.AIPredictionResponse
	if err := json.NewDecoder(resp.Body).Decode(&aiResp); err != nil {
		return nil, fmt.Errorf("failed to decode AI response: %w", err)
	}

	// ── Map to frontend-facing result with status & explanation ─────
	result := models.MapPredictionToResult(&aiResp)

	return result, nil
}

// HealthCheck pings the AI service health endpoint.
func (s *ECGService) HealthCheck() (bool, error) {
	aiURL := fmt.Sprintf("%s/health", s.cfg.AIServiceURL)

	resp, err := s.client.Get(aiURL)
	if err != nil {
		return false, fmt.Errorf("AI service unreachable: %w", err)
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK, nil
}
