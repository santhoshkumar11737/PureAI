"""
Flask REST API for Air Quality Pattern Analysis
Main server application connecting database, ML model, and frontend.
Includes Swagger UI API Documentation.
"""

from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
from flasgger import Swagger

import database as db
import ml_model

app = Flask(__name__)
# Enable CORS for all routes so frontend (e.g., localhost:3000 / Live Server) can fetch data
CORS(app)

# ------------------------------------------------------------------------------
# SWAGGER UI CONFIGURATION
# ------------------------------------------------------------------------------
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Air Quality Pattern Analysis API",
        "description": "Interactive REST API & Machine Learning Prediction Endpoints for Air Quality Data Analysis",
        "contact": {
            "name": "SANTHOSH KUMAR S",
            "email": "developer@airquality.project"
        },
        "version": "1.0.0"
    },
    "host": "127.0.0.1:5000",
    "basePath": "/",
    "schemes": ["http"]
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

# Initialize Database on Startup
with app.app_context():
    db.init_db()


# ------------------------------------------------------------------------------
# SWAGGER ALIAS ROUTE (/docs & /swagger)
# ------------------------------------------------------------------------------
SWAGGER_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Air Quality API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "/apispec_1.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
"""

@app.route('/docs')
@app.route('/swagger')
def swagger_ui_redirect():
    """Alternative route serving Swagger UI."""
    return render_template_string(SWAGGER_HTML)


# ------------------------------------------------------------------------------
# API ENDPOINTS
# ------------------------------------------------------------------------------

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    ---
    tags:
      - System
    responses:
      200:
        description: API health status
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            message:
              type: string
              example: Air Quality Backend is running
    """
    return jsonify({
        "status": "success",
        "message": "Air Quality Backend is running"
    }), 200


@app.route('/api/air-quality', methods=['GET'])
def get_all_air_quality():
    """
    Get all historical air quality records
    ---
    tags:
      - Air Quality Data
    responses:
      200:
        description: Array of air quality records
      500:
        description: Database error
    """
    try:
        records = db.get_all_records()
        return jsonify(records), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve data: {str(e)}"}), 500


@app.route('/api/air-quality/<location>', methods=['GET'])
def get_air_quality_by_location(location):
    """
    Get air quality records by city location
    ---
    tags:
      - Air Quality Data
    parameters:
      - name: location
        in: path
        type: string
        required: true
        description: City name (e.g. Chennai, Coimbatore, Madurai, Salem, Tiruchirappalli)
    responses:
      200:
        description: Filtered air quality records
      404:
        description: Location not found
    """
    try:
        records = db.get_records_by_location(location)
        if not records:
            return jsonify({"error": f"No data found for location '{location}'"}), 404
        return jsonify(records), 200
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500


@app.route('/api/latest/<location>', methods=['GET'])
def get_latest_air_quality(location):
    """
    Get latest air quality reading for a city
    ---
    tags:
      - Air Quality Data
    parameters:
      - name: location
        in: path
        type: string
        required: true
        description: City name
    responses:
      200:
        description: Latest air quality record
      404:
        description: Location not found
    """
    try:
        record = db.get_latest_record(location)
        if not record:
            return jsonify({"error": f"No record found for location '{location}'"}), 404
        return jsonify(record), 200
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500


@app.route('/api/statistics/<location>', methods=['GET'])
def get_location_statistics(location):
    """
    Get statistical metrics (avg, min, max) for a city
    ---
    tags:
      - Analytics & Insights
    parameters:
      - name: location
        in: path
        type: string
        required: true
        description: City name
    responses:
      200:
        description: Aggregated statistical summary
      404:
        description: Location not found
    """
    try:
        stats = db.get_location_statistics(location)
        if not stats:
            return jsonify({"error": f"No statistical data for location '{location}'"}), 404
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500


@app.route('/api/patterns/<location>', methods=['GET'])
def get_location_patterns(location):
    """
    Get identified pollution patterns for a city
    ---
    tags:
      - Analytics & Insights
    parameters:
      - name: location
        in: path
        type: string
        required: true
        description: City name
    responses:
      200:
        description: List of pollution patterns
      404:
        description: Location not found
    """
    try:
        stats = db.get_location_statistics(location)
        if not stats:
            return jsonify({"error": f"Location '{location}' not found"}), 404

        patterns = [
            "PM2.5 levels are higher during peak traffic hours.",
            "Air quality is poorer during morning and evening commute hours.",
            "Weekend pollution levels are slightly lower compared to weekdays.",
            "Industrial and commercial zones show higher PM10 concentration."
        ]

        avg_aqi = stats.get('avg_aqi', 0)
        if avg_aqi > 150:
            patterns.append(f"High risk area: {location} shows persistent Unhealthy AQI levels.")
        elif avg_aqi > 100:
            patterns.append(f"Moderate concern: {location} frequently exceeds sensitive limits.")
        else:
            patterns.append(f"Satisfactory trend: {location} maintains generally moderate/good air quality.")

        return jsonify({
            "location": location,
            "patterns": patterns
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error generating patterns: {str(e)}"}), 500


@app.route('/api/aqi-classification/<aqi>', methods=['GET'])
def get_aqi_classification(aqi):
    """
    Classify AQI numeric value into category
    ---
    tags:
      - Analytics & Insights
    parameters:
      - name: aqi
        in: path
        type: number
        required: true
        description: Numeric AQI value (0 to 500)
    responses:
      200:
        description: AQI status classification
      400:
        description: Invalid AQI range or non-numeric input
    """
    try:
        aqi_val = float(aqi)
        if aqi_val < 0 or aqi_val > 500:
            return jsonify({"error": "AQI value must be between 0 and 500"}), 400
        
        category = ml_model.classify_aqi(aqi_val)
        return jsonify({
            "aqi": aqi_val,
            "category": category
        }), 200
    except ValueError:
        return jsonify({"error": "Invalid numeric AQI value"}), 400


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict AQI using Machine Learning Random Forest Model
    ---
    tags:
      - Machine Learning
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - pm25
            - pm10
            - co
            - no2
            - o3
          properties:
            pm25:
              type: number
              example: 78
            pm10:
              type: number
              example: 124
            co:
              type: number
              example: 1.8
            no2:
              type: number
              example: 42
            o3:
              type: number
              example: 56
    responses:
      200:
        description: Predicted AQI and status category
        schema:
          type: object
          properties:
            predicted_aqi:
              type: integer
              example: 143
            status:
              type: string
              example: Unhealthy for Sensitive Groups
      400:
        description: Missing or invalid pollutant parameters
      500:
        description: Model error or missing model file
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON body provided"}), 400

    required_fields = ['pm25', 'pm10', 'co', 'no2', 'o3']
    missing_fields = [f for f in required_fields if f not in data]

    if missing_fields:
        return jsonify({
            "error": "Required pollutant values are missing",
            "missing_fields": missing_fields
        }), 400

    try:
        pm25 = float(data['pm25'])
        pm10 = float(data['pm10'])
        co = float(data['co'])
        no2 = float(data['no2'])
        o3 = float(data['o3'])

        if pm25 < 0 or pm10 < 0 or co < 0 or no2 < 0 or o3 < 0:
            return jsonify({"error": "Pollutant values cannot be negative"}), 400

    except (ValueError, TypeError):
        return jsonify({"error": "Pollutant values must be valid numbers"}), 400

    try:
        result = ml_model.predict_aqi(pm25, pm10, co, no2, o3)
        return jsonify(result), 200
    except FileNotFoundError as fnf_err:
        return jsonify({"error": str(fnf_err)}), 500
    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500


# ------------------------------------------------------------------------------
# GLOBAL ERROR HANDLERS
# ------------------------------------------------------------------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource or endpoint not found"}), 404


@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask Air Quality API on http://0.0.0.0:{port} ...")
    print(f"Swagger UI Documentation available at http://0.0.0.0:{port}/apidocs/")
    app.run(host='0.0.0.0', port=port, debug=False)
