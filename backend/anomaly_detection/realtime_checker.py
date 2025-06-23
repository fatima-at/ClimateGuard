import sqlite3
import pandas as pd
from pathlib import Path
from datetime import datetime

# === DB Setup ===
DB_PATH = Path(__file__).resolve().parent.parent / "db" / "climate_data.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# === Step 1: Create alerts table if not exists ===
cursor.execute("""
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME NOT NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT 0
);
""")
conn.commit()

def check_sudden_drops():
    # === Step 2: Get latest 2 sensor logs ===
    query = """
    SELECT timestamp, temperature, dew_point, relative_humidity,
           pressure, wind_speed, wind_direction, solar_radiation
    FROM sensor_logs
    ORDER BY timestamp DESC
    LIMIT 2
    """
    df = pd.read_sql_query(query, conn, parse_dates=["timestamp"])

    if len(df) < 2:
        return []  # Not enough data yet

    latest = df.iloc[0]
    previous = df.iloc[1]

    alerts = []

    # === Step 3: Sudden temperature drop > 5°C
    temp_drop = previous["temperature"] - latest["temperature"]
    if temp_drop > 5:
        alerts.append(f"🌡️ Sudden temperature drop of {temp_drop:.1f}°C at {latest['timestamp']}")

    # === Sudden pressure drop > 3 hPa
    pressure_drop = previous["pressure"] - latest["pressure"]
    if pressure_drop > 3:
        alerts.append(f"🔻 Sudden pressure drop of {pressure_drop:.1f} hPa at {latest['timestamp']}")

    # === Wind speed spike > 8 m/s
    wind_spike = latest["wind_speed"] - previous["wind_speed"]
    if wind_spike > 8:
        alerts.append(f"💨 Wind speed spiked by {wind_spike:.1f} m/s at {latest['timestamp']}")

    return alerts


# === Step 4: Check and save alerts ===
new_alerts = check_sudden_drops()
if new_alerts:
    print("🚨 Real-time Alerts Detected:")
    for alert in new_alerts:
        print(" -", alert)
        # Insert into DB
        cursor.execute("""
        INSERT INTO alerts (timestamp, message, resolved)
        VALUES (?, ?, ?)
        """, (datetime.now(), alert, 0))
    conn.commit()
else:
    print("✅ No anomalies detected.")

conn.close()
