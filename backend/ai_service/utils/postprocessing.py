"""
Post-processing — Physiological clipping & feature names
=========================================================
Ensures regression outputs stay within clinically valid ranges.
"""

import numpy as np

FEATURE_NAMES = [
    "HR",
    "RR",
    "PR",
    "QRS",
    "QT",
    "QTc",
    "AXIS",
    "RV5",
    "SV1",
    "R_plus_S",
]

# (min, max) physiological bounds
CLIPPING_RANGES = {
    "HR":       (30.0,    220.0),
    "RR":       (0.3,     2.0),
    "PR":       (0.08,    0.30),
    "QRS":      (0.06,    0.20),
    "QT":       (0.20,    0.60),
    "QTc":      (0.30,    0.60),
    "AXIS":     (-180.0,  180.0),
    "RV5":      (0.0,     10.0),
    "SV1":      (0.0,     10.0),
    "R_plus_S": (0.0,     20.0),
}


def clip_features(
    values: np.ndarray,
) -> dict[str, float]:
    """
    Apply physiological clipping to raw regression outputs.

    Args:
        values: 1-D array of length 10 (same order as FEATURE_NAMES).

    Returns:
        Dict mapping feature name → clipped value (rounded to 2 dp).
    """
    result = {}
    for name, val in zip(FEATURE_NAMES, values):
        lo, hi = CLIPPING_RANGES[name]
        clipped = float(np.clip(val, lo, hi))
        result[name] = round(clipped, 2)
    return result
