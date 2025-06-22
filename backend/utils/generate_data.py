import sqlite3
import random
from datetime import datetime, timedelta
from pathlib import Path

# Path to database in dara/
DB_PATH = Path(__file__).resolve().parent.parent / "data" / "climate_data.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Start from 7 days ago, generate hourly data
now = datetime.utcnow()
start_time = now - timedelta(days=7)

wind_directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

data_points = []

for i in range(7 * 24):  # 7 days × 24 hours
    ts = start_time + timedelta(hours=i)
    hour = ts.hour

    # Simulate temp/day variation
    if 7 <= hour <= 18:
        temperature = round(random.uniform(26, 32), 1)
        solar_radiation = round(random.uniform(200, 800), 1)
    else:
        temperature = round(random.uniform(20, 25), 1)
        solar_radiation = 0.0

    relative_humidity = round(random.uniform(50, 70), 1)
    dew_point = round(temperature - random.uniform(5, 8), 1)
    pressure = round(random.uniform(1008, 1015), 1)
    wind_speed = round(random.uniform(5, 25), 1)
    wind_direction = round(random.uniform(0, 359), 1) 

    data_points.append((
        ts.strftime("%Y-%m-%d %H:%M:%S"),
        temperature,
        relative_humidity,
        dew_point,
        pressure,
        solar_radiation,
        wind_speed,
        wind_direction
    ))

# Insert into DB
cursor.executemany("""
    INSERT INTO sensor_logs (
        timestamp, temperature, relative_humidity, dew_point,
        pressure, solar_radiation, wind_speed, wind_direction
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", data_points)

conn.commit()
conn.close()
print(f"✅ Inserted {len(data_points)} records into {DB_PATH}")
