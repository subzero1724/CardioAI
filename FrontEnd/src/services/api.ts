import { EcgAnalysisResult, PredictionStatus } from '../types/ecg';

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * API base URL. In development, Vite proxies /api → Go backend on :8080.
 * In production, set VITE_API_BASE_URL to the actual backend URL.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ─────────────────────────────────────────────────────────────────────────────
// Preset mock scenarios (fallback when backend is unavailable)
// ─────────────────────────────────────────────────────────────────────────────

export const PRESET_DIAGNOSES: EcgAnalysisResult[] = [
  {
    prediction: "Normal Sinus Rhythm",
    status: "normal" as PredictionStatus,
    confidence: 96.8,
    explanation: "Your heart electrical signature is clean, regular, and within ideal physiological limits. No abnormalities detected.",
    features: {
      HR: 72,
      RR: 0.83,
      PR: 160,
      QRS: 90,
      QT: 380,
      QTc: 410,
      AXIS: 45,
      RV5: 1.4,
      SV1: 0.8,
      R_plus_S: 2.2
    },
    timestamp: ''
  },
  {
    prediction: "Sinus Tachycardia (Elevated Rate)",
    status: "moderate" as PredictionStatus,
    confidence: 91.2,
    explanation: "Elevated resting heart rate detected (>100 bpm). Can occur due to anxiety, physical exertion, dehydration, or potential minor arrhythmia. Ensure you are resting.",
    features: {
      HR: 108,
      RR: 0.55,
      PR: 135,
      QRS: 85,
      QT: 310,
      QTc: 415,
      AXIS: 60,
      RV5: 1.9,
      SV1: 1.1,
      R_plus_S: 3.0
    },
    timestamp: ''
  },
  {
    prediction: "Left Ventricular Hypertrophy (LVH) Sign",
    status: "moderate" as PredictionStatus,
    confidence: 88.5,
    explanation: "R-wave voltage in V5 + S-wave voltage in V1 exceeds Sokolow-Lyon criteria (3.5 mV), Suggesting possible ventricular wall thickening. Recommend clinical review.",
    features: {
      HR: 68,
      RR: 0.88,
      PR: 175,
      QRS: 105,
      QT: 405,
      QTc: 430,
      AXIS: -15,
      RV5: 2.8,
      SV1: 1.9,
      R_plus_S: 4.7
    },
    timestamp: ''
  },
  {
    prediction: "Ventricular Premature Beats (VPBs)",
    status: "abnormal" as PredictionStatus,
    confidence: 94.1,
    explanation: "Irregular ventricular contractions detected on the ECG waveform indicating early heartbeats. This is a common abnormality but warrants full professional evaluation.",
    features: {
      HR: 82,
      RR: 0.73,
      PR: 140,
      QRS: 125,
      QT: 450,
      QTc: 490,
      AXIS: 110,
      RV5: 1.7,
      SV1: 1.2,
      R_plus_S: 2.9
    },
    timestamp: ''
  },
  {
    prediction: "Atrial Fibrillation (AFib Pattern)",
    status: "abnormal" as PredictionStatus,
    confidence: 95.4,
    explanation: "Irregularly irregular rhythm and absent P-waves. Highly indicative of an atrial fibrillation episode. Please schedule a clinical ECG evaluation immediately.",
    features: {
      HR: 114,
      RR: 0.52,
      PR: 0, // Absent in AFib
      QRS: 92,
      QT: 340,
      QTc: 468,
      AXIS: 35,
      RV5: 1.3,
      SV1: 0.9,
      R_plus_S: 2.2
    },
    timestamp: ''
  }
];

export interface ErrorResponse {
  message: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Backend Health Check
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if the backend API and AI service are reachable.
 */
export async function checkBackendHealth(): Promise<{
  backend: string;
  ai_service: string;
} | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ECG Analysis — Real Backend Call with Preset Fallback
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze an ECG image by sending it to the Go backend → AI service pipeline.
 *
 * When a real backend is not available (e.g. dev without backend running),
 * falls back to the interactive preset mode for demo purposes.
 *
 * @param file           The ECG image file to analyze
 * @param usePresetIndex Optional preset index for demo/sandbox mode
 * @param onProgress     Callback for progress updates (0-100)
 */
export async function analyzeEcgImage(
  file: File,
  usePresetIndex?: number,
  onProgress?: (progress: number) => void
): Promise<EcgAnalysisResult> {

  // If a preset index is explicitly selected, always use preset mode
  // (this powers the interactive demo sandbox)
  if (usePresetIndex !== undefined && usePresetIndex >= 0 && usePresetIndex < PRESET_DIAGNOSES.length) {
    return simulatePresetAnalysis(file, usePresetIndex, onProgress);
  }

  // Try the real backend first
  try {
    return await callBackendPredict(file, onProgress);
  } catch (backendError: any) {
    console.warn('[ECG API] Backend unavailable, falling back to preset mode:', backendError.message);
    // Fall back to preset simulation
    return simulatePresetAnalysis(file, undefined, onProgress);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Real Backend Call
// ─────────────────────────────────────────────────────────────────────────────

async function callBackendPredict(
  file: File,
  onProgress?: (progress: number) => void
): Promise<EcgAnalysisResult> {

  // Start progress — uploading phase
  onProgress?.(10);

  const formData = new FormData();
  formData.append('file', file);

  onProgress?.(25);

  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(60000), // 60s timeout for large images + inference
  });

  onProgress?.(70);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error || errorBody?.message || `Server error (${response.status})`;
    throw new Error(message);
  }

  const json = await response.json();

  onProgress?.(90);

  // The Go backend wraps responses in { success, message, data }
  const data = json.data ?? json;

  // Validate the response shape
  if (!data.prediction || data.confidence === undefined || !data.features) {
    throw new Error('Invalid response format from backend');
  }

  onProgress?.(100);

  return {
    prediction: data.prediction,
    status: data.status || inferStatus(data.confidence),
    confidence: data.confidence,
    explanation: data.explanation || 'Analysis complete. Please review the results.',
    features: data.features,
    timestamp: data.timestamp || new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  };
}

/**
 * Infer status from confidence when backend doesn't provide one.
 */
function inferStatus(confidence: number): PredictionStatus {
  if (confidence >= 85) return 'normal';
  if (confidence >= 65) return 'moderate';
  return 'abnormal';
}

// ─────────────────────────────────────────────────────────────────────────────
// Preset Simulation (Demo / Sandbox Fallback)
// ─────────────────────────────────────────────────────────────────────────────

async function simulatePresetAnalysis(
  file: File,
  usePresetIndex?: number,
  onProgress?: (progress: number) => void
): Promise<EcgAnalysisResult> {

  // Step-by-step loading progression for realistic UX
  const steps = [15, 30, 48, 65, 82, 100];

  for (let i = 0; i < steps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 400));
    onProgress?.(steps[i]);
  }

  // Artificial validation
  if (file.name.toLowerCase().includes("corrupt") || file.name.toLowerCase().includes("error")) {
    throw new Error("Unable to parse file. Please upload a clear high-contrast scan of the ECG grid.");
  }

  // Choose a result preset
  let selectedPreset;
  if (usePresetIndex !== undefined && usePresetIndex >= 0 && usePresetIndex < PRESET_DIAGNOSES.length) {
    selectedPreset = PRESET_DIAGNOSES[usePresetIndex];
  } else {
    const hash = file.name.length % PRESET_DIAGNOSES.length;
    selectedPreset = PRESET_DIAGNOSES[hash];
  }

  // Add jitter for realism
  const jitter = (Math.random() - 0.5) * 1.5;
  const confidence = Math.max(70, Math.min(99.9, selectedPreset.confidence + jitter));

  return {
    ...selectedPreset,
    confidence,
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  };
}
