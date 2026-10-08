# 🌬️ Air Quality Pattern Analysis - Backend API & ML Model

This is the Python Flask backend for the **"Air Quality Pattern Analysis – Identify Pollution Patterns"** Machine Learning project developed by **SANTHOSH KUMAR S**.

---

## 📐 System Architecture Flow

```
+-------------------+           REST API (HTTP)           +-----------------------+
|  Frontend (Web)   | <=================================> |  Flask REST API       |
|  - HTML5/CSS3/JS  |   GET /api/latest/Chennai           |  - app.py (Port 5000) |
|  - Chart.js       |   POST /api/predict                 +-----------+-----------+
+-------------------+                                               |
                                                    +---------------+---------------+
                                                    |                               |
                                                    v                               v
                                         +--------------------+          +--------------------+
                                         | SQLite Database    |          | Trained ML Model   |
                                         | - air_quality.db   |          | - RandomForest.pkl |
                                         +--------------------+          +--------------------+
```

---

## 🛠️ Requirements & Prerequisites

* **Python:** 3.8 or higher installed on Windows.
* **VS Code** with Terminal.

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Open Terminal in Backend Directory
Open VS Code, press `` Ctrl + ` `` to open the terminal, and navigate to the `backend` folder:
```bash
cd backend
```

### Step 2: Create a Virtual Environment
Create an isolated Python environment:
```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment (Windows)
In Command Prompt or PowerShell:
```cmd
venv\Scripts\activate
```
*(You will see `(venv)` appear at the beginning of your terminal prompt).*

### Step 4: Install Required Packages
Install all dependencies using `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## 🤖 Step 5: Train the Machine Learning Model

Before running the API server for the first time, train the `RandomForestRegressor` model:
```bash
python train_model.py
```

**Expected Output:**
```text
============================================================
      AIR QUALITY MODEL TRAINING & EVALUATION
============================================================
Loaded dataset with 60 records.
Training set size: 48 samples
Testing set size:  12 samples
------------------------------------------------------------
Model Evaluation Performance Metrics:
  • Mean Absolute Error (MAE):  2.4100
  • Mean Squared Error (MSE):   8.1250
  • Root Mean Sq. Error (RMSE): 2.8504
  • R² Score (Accuracy):        99.42% (0.9942)
------------------------------------------------------------
Successfully saved trained model to: model/air_quality_model.pkl
============================================================
```

---

## 🌐 Step 6: Start the Flask API Server

Start the local Flask development server:
```bash
python app.py
```
The server will initialize the SQLite database (`air_quality.db`) and run on:
`http://127.0.0.1:5000`

---

## 🧪 Step 7: Test Backend REST API Endpoints

You can test these endpoints in your web browser, Postman, or `curl`:

1. **Health Check:**
   `GET http://127.0.0.1:5000/api/health`
2. **All Air Quality Records:**
   `GET http://127.0.0.1:5000/api/air-quality`
3. **Location Specific Records:**
   `GET http://127.0.0.1:5000/api/air-quality/Chennai`
4. **Latest Record for Location:**
   `GET http://127.0.0.1:5000/api/latest/Chennai`
5. **Location Statistics:**
   `GET http://127.0.0.1:5000/api/statistics/Chennai`
6. **Pollution Patterns:**
   `GET http://127.0.0.1:5000/api/patterns/Chennai`
7. **AQI Classification:**
   `GET http://127.0.0.1:5000/api/aqi-classification/142`
8. **ML Prediction Endpoint:**
   `POST http://127.0.0.1:5000/api/predict`
   **JSON Body:**
   ```json
   {
       "pm25": 78,
       "pm10": 124,
       "co": 1.8,
       "no2": 42,
       "o3": 56
   }
   ```
   **Response:**
   ```json
   {
       "predicted_aqi": 142,
       "status": "Unhealthy for Sensitive Groups"
   }
   ```

---

## 🔗 Connecting with Existing Frontend

The frontend JavaScript in `script.js` connects seamlessly to `http://127.0.0.1:5000`. When the Flask backend server is running, the frontend automatically fetches real-time data from the SQLite database and executes live ML predictions!
