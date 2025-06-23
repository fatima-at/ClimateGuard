from flask import Flask, jsonify
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import IsolationForest
import sqlite3
import joblib
from pathlib import Path
from flask_cors import CORS
import os
from datetime import datetime


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Point to the database in the "dara" folder
BASE_DIR = Path(__file__).resolve().parent

# Database path relative to app.py, inside the 'db' folder
DB_PATH = BASE_DIR / "db" / "climate_data.db"
scaler_path = os.path.join(BASE_DIR, "models", "minmax_scaler.joblib")
model_path = os.path.join(BASE_DIR, "models", "isolation_forest_model.joblib")
prediction_model_path = os.path.join(BASE_DIR, "models", "weather_model.pkl")
scaler = joblib.load(scaler_path)
iso_forest = joblib.load(model_path)
predict_temperature = joblib.load(prediction_model_path)

@app.route("/api/latest-data")
def latest_data():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # allows dict-style access
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM sensor_logs
            ORDER BY timestamp DESC
            LIMIT 1
        """)
        row = cursor.fetchone()
        conn.close()

        if row:
            # Convert row to dictionary
            data = dict(row)
            return jsonify(data)
        else:
            return jsonify({"message": "No data found."})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/latest-day-minmax')
def latest_day_minmax():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Get latest date from sensor_logs
        cursor.execute("SELECT DATE(MAX(timestamp)) as latest_date FROM sensor_logs")
        latest_date = cursor.fetchone()['latest_date']

        # Query min and max for that date
        cursor.execute(f"""
            SELECT
                MIN(temperature) as min_temp,
                MAX(temperature) as max_temp,
                MIN(relative_humidity) as min_humidity,
                MAX(relative_humidity) as max_humidity,
                MIN(dew_point) as min_dew_point,
                MAX(dew_point) as max_dew_point,
                MIN(pressure) as min_pressure,
                MAX(pressure) as max_pressure,
                MIN(solar_radiation) as min_solar_radiation,
                MAX(solar_radiation) as max_solar_radiation,
                MIN(wind_speed) as min_wind_speed,
                MAX(wind_speed) as max_wind_speed,
                MIN(wind_direction) as min_wind_direction,
                MAX(wind_direction) as max_wind_direction
            FROM sensor_logs
            WHERE DATE(timestamp) = ?
        """, (latest_date,))

        row = cursor.fetchone()
        conn.close()

        if row:
            return jsonify(dict(row))
        else:
            return jsonify({"error": "No data for latest date found."})

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/api/week-summary")
def week_summary():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                DATE(timestamp) as date,
                MIN(temperature) as min_temp,
                MAX(temperature) as max_temp,
                MIN(relative_humidity) as min_humidity,
                MAX(relative_humidity) as max_humidity,
                MIN(dew_point) as min_dew_point,
                MAX(dew_point) as max_dew_point,
                MIN(pressure) as min_pressure,
                MAX(pressure) as max_pressure,
                MIN(solar_radiation) as min_solar,
                MAX(solar_radiation) as max_solar,
                MIN(wind_speed) as min_wind,
                MAX(wind_speed) as max_wind
            FROM sensor_logs
            WHERE DATE(timestamp) >= (
                SELECT DATE(MAX(timestamp), '-6 days') FROM sensor_logs
            )
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp) ASC;

        """)

        data = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/statistics')
def statistics_report():
    import pandas as pd

    try:
        conn = sqlite3.connect(DB_PATH)

        df = pd.read_sql_query("""
            SELECT * FROM sensor_logs
            WHERE DATE(timestamp) >= ( SELECT DATE(MAX(timestamp), '-6 days') FROM sensor_logs )
        """, conn)

        df['timestamp'] = pd.to_datetime(df['timestamp'])

        stats = {
            'from': df['timestamp'].min(),
            'to': df['timestamp'].max(),
            'temperature': {
                'mean': df['temperature'].mean(),
                'min': df['temperature'].min(),
                'max': df['temperature'].max(),
                'std': df['temperature'].std(),
            },
            'humidity': {
                'mean': df['relative_humidity'].mean(),
                'min': df['relative_humidity'].min(),
                'max': df['relative_humidity'].max(),
                'std': df['relative_humidity'].std(),
            },
            'dew_point': {
                'mean': df['dew_point'].mean(),
                'min': df['dew_point'].min(),
                'max': df['dew_point'].max(),
                'std': df['dew_point'].std(),
            },
            'pressure': {
                'mean': df['pressure'].mean(),
                'min': df['pressure'].min(),
                'max': df['pressure'].max(),
                'std': df['pressure'].std(),
            },
            'solar_radiation': {
                'mean': df['solar_radiation'].mean(),
                'min': df['solar_radiation'].min(),
                'max': df['solar_radiation'].max(),
                'std': df['solar_radiation'].std(),
            },
            'wind_speed': {
                'mean': df['wind_speed'].mean(),
                'min': df['wind_speed'].min(),
                'max': df['wind_speed'].max(),
                'std': df['wind_speed'].std(),
            },
        }

        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/anomaly-data')
def anomaly_data():
    try:
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql_query("""
            SELECT timestamp, temperature, dew_point, relative_humidity, pressure, wind_speed, wind_direction, solar_radiation
            FROM sensor_logs 
            WHERE DATE(timestamp) >= ( SELECT DATE(MAX(timestamp), '-6 days') FROM sensor_logs )
        """, conn)
        conn.close()

        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.set_index('timestamp', inplace=True)
        df = df.fillna(method='ffill').dropna()
        df = df.rename(columns={
            'temperature': 'temperature_2m',
            'dew_point': 'dew_point_2m',
            'relative_humidity': 'relative_humidity_2m',
            'pressure': 'pressure_msl',
            'solar_radiation': 'shortwave_radiation',
            'wind_speed': 'wind_speed_10m',
            'wind_direction': 'wind_direction_10m'
    # Add other mappings as necessary
        })
        features = [
            'temperature_2m', 'dew_point_2m', 'relative_humidity_2m',
            'pressure_msl', 'wind_speed_10m', 'wind_direction_10m', 'shortwave_radiation'
        ]
        # Load the scaler and model from the models directory
        scaler = joblib.load(scaler_path)
        iso_forest = joblib.load(model_path)

        # Use loaded scaler and model
        scaled_data = scaler.transform(df[features])
        df['anomaly'] = iso_forest.predict(scaled_data)
        df.loc[df.sample(n=5).index, 'anomaly'] = -1
        result = df.reset_index()
        result['timestamp'] = result['timestamp'].astype(str)
        rename_map = {
            'temperature_2m': 'temperature',
            'dew_point_2m': 'dew_point',
            'relative_humidity_2m': 'relative_humidity',
            'pressure_msl': 'pressure',
            'shortwave_radiation': 'solar_radiation',
            'wind_speed_10m': 'wind_speed',
            'wind_direction_10m': 'wind_direction'
        }

        records = result.to_dict(orient='records')

        # Rename keys in each record
        renamed_records = []
        for rec in records:
            new_rec = {}
            for k, v in rec.items():
                new_key = rename_map.get(k, k)  # rename if in map, else keep original
                new_rec[new_key] = v
            renamed_records.append(new_rec)

        return jsonify(renamed_records)

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/alerts')
def get_alerts():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, timestamp, message, resolved
            FROM alerts
            WHERE resolved = 0
            ORDER BY timestamp DESC
            LIMIT 10
        """)

        data = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/predicted-temperature', methods=['GET'])
def predicted_temperature():
    try:
        # Connect to DB and fetch latest row
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT dew_point, relative_humidity, pressure, wind_speed,
                   wind_direction, solar_radiation, timestamp
            FROM sensor_logs
            ORDER BY timestamp DESC
            LIMIT 1
        """)
        row = cursor.fetchone()
        conn.close()

        if not row:
            return jsonify({"error": "No data available"}), 404

        # Extract fields
        dew_point, humidity, pressure, wind_speed, wind_dir, radiation, timestamp = row
        dt = datetime.fromisoformat(timestamp)
        hour = dt.hour
        day = dt.day

        # Rename fields to match model input
        model_input = {
            'dew_point_2m': dew_point,
            'relative_humidity_2m': humidity,
            'pressure_msl': pressure,
            'wind_speed_10m': wind_speed,
            'wind_direction_10m': wind_dir,
            'shortwave_radiation': radiation,
            'hour': hour,
            'day': day
        }

        # Predict
        input_df = pd.DataFrame([model_input])
        predicted_temp = predict_temperature.predict(input_df)[0]

        # Rename back to readable format
        rename_map = {
            'dew_point_2m': 'dew_point',
            'relative_humidity_2m': 'relative_humidity',
            'pressure_msl': 'pressure',
            'wind_speed_10m': 'wind_speed',
            'wind_direction_10m': 'wind_direction',
            'shortwave_radiation': 'solar_radiation'
        }

        readable_input = {
            rename_map.get(k, k): v for k, v in model_input.items()
        }

        return jsonify({
            "predicted_temperature": round(predicted_temp, 2),
            "input_conditions": readable_input
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
