export interface FeatureMetadata {
  name: string;
  label: string;
  unit: string;
  normalRange: string;
  description: string;
}

export const FEATURE_METADATA_MAP: Record<string, FeatureMetadata> = {
  HR: {
    name: "Heart Rate",
    label: "HR",
    unit: "bpm",
    normalRange: "60 - 100 bpm",
    description: "The speed of the heartbeat measured by the number of contractions per minute.",
  },
  RR: {
    name: "R-R Interval",
    label: "RR",
    unit: "s",
    normalRange: "0.60 - 1.00 s",
    description: "The time elapsed between two consecutive R-waves in the QRS complex.",
  },
  PR: {
    name: "P-R Interval",
    label: "PR",
    unit: "ms",
    normalRange: "120 - 200 ms",
    description: "The interval from the beginning of the P-wave to the beginning of the QRS complex.",
  },
  QRS: {
    name: "QRS Duration",
    label: "QRS",
    unit: "ms",
    normalRange: "70 - 110 ms",
    description: "The duration of the QRS complex, indicating ventricular depolarization time.",
  },
  QT: {
    name: "Q-T Interval",
    label: "QT",
    unit: "ms",
    normalRange: "350 - 440 ms",
    description: "The duration from the start of the Q-wave to the end of the T-wave.",
  },
  QTc: {
    name: "Corrected Q-T",
    label: "QTc",
    unit: "ms",
    normalRange: "< 450 ms",
    description: "The Q-T interval adjusted for heart rate, useful to detect long QT syndrome.",
  },
  AXIS: {
    name: "Electrical Axis",
    label: "AXIS",
    unit: "°",
    normalRange: "-30° to +100°",
    description: "The dominant direction of the heart's electrical wave during ventricular depolarization.",
  },
  RV5: {
    name: "RV5 Amplitude",
    label: "RV5",
    unit: "mV",
    normalRange: "< 2.5 mV",
    description: "The voltage amplitude of the R-wave in lead V5, helpful for mass assessments.",
  },
  SV1: {
    name: "SV1 Amplitude",
    label: "SV1",
    unit: "mV",
    normalRange: "< 1.5 mV",
    description: "The voltage amplitude of the S-wave in lead V1.",
  },
  R_plus_S: {
    name: "RV5 + SV1",
    label: "R+S",
    unit: "mV",
    normalRange: "< 3.5 mV",
    description: "Combined voltages from V5 and V1; clinical screening threshold for LVH (Sokolow-Lyon).",
  },
};

export function formatMetric(value: number | undefined, key: string): string {
  if (value === undefined || isNaN(value)) return "N/A";
  
  if (key === "RR") {
    return value.toFixed(2);
  }
  if (key === "HR" || key === "AXIS") {
    return Math.round(value).toString();
  }
  return value.toFixed(1);
}

export function formatPercent(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return "0%";
  return `${value.toFixed(1)}%`;
}
