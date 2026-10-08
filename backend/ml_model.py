"""
Machine Learning prediction module for Air Quality Pattern Analysis
Loads joblib trained model and performs AQI prediction & classification.
"""

import os
import joblib
import pandas as pd

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'air_quality_model.pkl')

_model_instance = None


def load_model():
    """Load and cache the trained ML model from disk."""
    global _model_instance
    if _model_instance is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. Run 'python train_model.py' first."
            )
        _model_instance = joblib.load(MODEL_PATH)
    return _model_instance


def classify_aqi(aqi_val):
    """
    Classify AQI value into standard health categories.
    0–50: Good
    51–100: Moderate
    101–150: Unhealthy for Sensitive Groups
    151–200: Unhealthy
    201–300: Very Unhealthy
    301–500: Hazardous
    """
    aqi = float(aqi_val)
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    elif aqi <= 300:
        return "Very Unhealthy"
    else:
        return "Hazardous"


def predict_aqi(pm25, pm10, co, no2, o3):
    """
    Predict AQI using pollutant values.
    Returns dictionary with predicted_aqi integer and status string.
    """
    model = load_model()

    # Input DataFrame with exact column names expected by scikit-learn model
    input_df = pd.DataFrame([{
        'pm25': float(pm25),
        'pm10': float(pm10),
        'co': float(co),
        'no2': float(no2),
        'o3': float(o3)
    }])

    raw_prediction = model.predict(input_df)[0]
    predicted_aqi = int(round(raw_prediction))
    status = classify_aqi(predicted_aqi)

    return {
        "predicted_aqi": predicted_aqi,
        "status": status
    }
