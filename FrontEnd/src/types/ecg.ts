export type PredictionStatus = 'normal' | 'moderate' | 'abnormal';

export interface EcgFeatures {
  HR: number;     // Heart Rate (bpm)
  RR: number;     // R-R interval (seconds)
  PR: number;     // P-R interval (ms)
  QRS: number;    // QRS duration (ms)
  QT: number;     // Q-T interval (ms)
  QTc: number;    // Corrected Q-T (ms)
  AXIS: number;   // Electrical Axial Angle (°)
  RV5: number;    // RV5 Amplitude (mV)
  SV1: number;    // SV1 Amplitude (mV)
  R_plus_S: number; // RV5 + SV1 (mV)
}

export interface EcgAnalysisResult {
  prediction: string;      // Diagnosis display name
  status: PredictionStatus; // Clean visual mapping (normal, moderate, abnormal)
  confidence: number;      // Confidence percentage (0-100)
  explanation: string;     // Friendly human-readable explanation
  features: EcgFeatures;   // Calculated feature metrics
  timestamp: string;       // Date and time of analysis
}
