from flask import Flask, jsonify
import sqlite3
from pathlib import Path
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Point to the database in the "dara" folder
DB_PATH = Path("data/climate_data.db").resolve()

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
            WHERE timestamp >= datetime('now', '-7 days')
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp) ASC
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
        df = pd.read_sql_query("SELECT * FROM sensor_logs", conn)
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

if __name__ == "__main__":
    app.run(port=5000, debug=True)
