"""
Model Training Script for Air Quality Pattern Analysis
Trains a RandomForestRegressor model on pollutant features to predict AQI.
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# Set file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, 'data', 'air_quality_sample.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'model')
MODEL_PATH = os.path.join(MODEL_DIR, 'air_quality_model.pkl')


def train_and_save_model():
    print("=" * 60)
    print("      AIR QUALITY MODEL TRAINING & EVALUATION")
    print("=" * 60)

    # 1. Load Data
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Sample dataset not found at {CSV_PATH}")

    df = pd.read_csv(CSV_PATH)
    print(f"Loaded dataset with {len(df)} records.")

    # 2. Select Features & Target
    # Features: PM2.5, PM10, CO, NO2, O3
    feature_cols = ['pm25', 'pm10', 'co', 'no2', 'o3']
    X = df[feature_cols]
    y = df['aqi']

    # 3. Train/Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    print(f"Training set size: {len(X_train)} samples")
    print(f"Testing set size:  {len(X_test)} samples")

    # 4. Train RandomForestRegressor Model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # 5. Evaluate Model
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)

    print("-" * 60)
    print("Model Evaluation Performance Metrics:")
    print(f"  • Mean Absolute Error (MAE):  {mae:.4f}")
    print(f"  • Mean Squared Error (MSE):   {mse:.4f}")
    print(f"  • Root Mean Sq. Error (RMSE): {rmse:.4f}")
    print(f"  • R² Score (Accuracy):        {r2 * 100:.2f}% ({r2:.4f})")
    print("-" * 60)

    # 6. Save Trained Model
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Successfully saved trained model to: {MODEL_PATH}")
    print("=" * 60)


if __name__ == '__main__':
    train_and_save_model()
