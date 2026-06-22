package models

import "time"

// ECGFeatures holds the 10 regression outputs from the AI service.
type ECGFeatures struct {
	HR      float64 `json:"HR"`
	RR      float64 `json:"RR"`
	PR      float64 `json:"PR"`
	QRS     float64 `json:"QRS"`
	QT      float64 `json:"QT"`
	QTc     float64 `json:"QTc"`
	AXIS    float64 `json:"AXIS"`
	RV5     float64 `json:"RV5"`
	SV1     float64 `json:"SV1"`
	RPlusS  float64 `json:"R_plus_S"`
}

// AIPredictionResponse is the JSON structure returned by the Python AI service.
type AIPredictionResponse struct {
	Prediction string      `json:"prediction"`
	Confidence float64     `json:"confidence"`
	Features   ECGFeatures `json:"features"`
}

// ECGPredictionResult is the cleaned-up response sent to the React frontend.
// It matches the EcgAnalysisResult TypeScript interface exactly.
type ECGPredictionResult struct {
	Prediction  string      `json:"prediction"`
	Status      string      `json:"status"`
	Confidence  float64     `json:"confidence"`
	Explanation string      `json:"explanation"`
	Features    ECGFeatures `json:"features"`
	Timestamp   string      `json:"timestamp"`
}

// ECGRecord represents a stored analysis result (for future DB integration).
type ECGRecord struct {
	ID         string              `json:"id"`
	UserID     string              `json:"user_id"`
	ImagePath  string              `json:"image_path"`
	Result     ECGPredictionResult `json:"result"`
	CreatedAt  time.Time           `json:"created_at"`
}

// ─── Status & Explanation Mapping ────────────────────────────────────────────
// Maps the AI service class name → frontend-friendly (status, display name, explanation).

// DiagnosisInfo holds the mapped metadata for a prediction class.
type DiagnosisInfo struct {
	DisplayName string
	Status      string // "normal" | "moderate" | "abnormal"
	Explanation string
}

// DiagnosisMap maps AI model class names to frontend-friendly display information.
var DiagnosisMap = map[string]DiagnosisInfo{
	"Normal": {
		DisplayName: "Normal Sinus Rhythm",
		Status:      "normal",
		Explanation: "Your heart electrical signature is clean, regular, and within ideal physiological limits. No abnormalities detected in the ECG waveform pattern.",
	},
	"Myocardial_Infarction": {
		DisplayName: "Myocardial Infarction Detected",
		Status:      "abnormal",
		Explanation: "The ECG pattern shows signs consistent with myocardial infarction (heart attack). ST-segment elevation or pathological Q-waves have been identified. Please seek immediate medical attention.",
	},
	"Other_Heart_Disease": {
		DisplayName: "Heart Disease Pattern Detected",
		Status:      "moderate",
		Explanation: "The ECG analysis has identified patterns that may indicate a cardiac abnormality. This could include arrhythmia, bundle branch block, or other conduction disorders. Please consult a cardiologist for further evaluation.",
	},
}

// MapPredictionToResult converts raw AI output into the frontend-ready result format.
func MapPredictionToResult(aiResp *AIPredictionResponse) *ECGPredictionResult {
	info, exists := DiagnosisMap[aiResp.Prediction]
	if !exists {
		// Fallback for unknown predictions
		info = DiagnosisInfo{
			DisplayName: aiResp.Prediction,
			Status:      "moderate",
			Explanation: "An ECG pattern was detected that requires clinical review. Please consult your healthcare provider.",
		}
	}

	return &ECGPredictionResult{
		Prediction:  info.DisplayName,
		Status:      info.Status,
		Confidence:  aiResp.Confidence,
		Explanation: info.Explanation,
		Features:    aiResp.Features,
		Timestamp: time.Now().Format("3:04:05 PM"),
	}
}
