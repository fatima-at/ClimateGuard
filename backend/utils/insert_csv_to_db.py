import sqlite3
import pandas as pd
from pathlib import Path

# === Paths ===
CSV_PATH = Path(__file__).resolve().parent.parent / "data" / "beirut_weather_june2024.csv"
DB_PATH = Path(__file__).resolve().parent.parent / "db" / "climate_data.db"

# === Load CSV ===
df = pd.read_csv(CSV_PATH, parse_dates=["time"])

# === Rename columns to match DB schema ===
df.rename(columns={
    "time": "timestamp",
    "temperature_2m": "temperature",
    "relative_humidity_2m": "relative_humidity",
    "dew_point_2m": "dew_point",
    "pressure_msl": "pressure",
    "shortwave_radiation": "solar_radiation",
    "wind_speed_10m": "wind_speed",
    "wind_direction_10m": "wind_direction"
}, inplace=True)

# === Connect to DB ===
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
# Clear the table before inserting new data
cursor.execute("DELETE FROM sensor_logs;")
# Reset the AUTOINCREMENT ID (optional)
cursor.execute("DELETE FROM sqlite_sequence WHERE name='sensor_logs';")

# === Insert each row ===
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO sensor_logs (
            timestamp, temperature, relative_humidity, dew_point,
            pressure, solar_radiation, wind_speed, wind_direction
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        row["timestamp"].isoformat(), row["temperature"], row["relative_humidity"], row["dew_point"],
        row["pressure"], row["solar_radiation"], row["wind_speed"], row["wind_direction"]
    ))

conn.commit()
conn.close()

print(f"✅ Inserted {len(df)} rows into sensor_logs at {DB_PATH}")
