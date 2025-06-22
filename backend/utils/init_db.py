import sqlite3
from pathlib import Path

# Go up to project root and into 'dara' folder
DB_PATH = Path(__file__).resolve().parent.parent / "data" / "climate_data.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)  # Create 'dara/' if it doesn't exist

# Connect to the database file (will be created if it doesn't exist)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Create the sensor_logs table
cursor.execute("""
CREATE TABLE IF NOT EXISTS sensor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME NOT NULL,
    temperature REAL,
    relative_humidity REAL,
    dew_point REAL,
    pressure REAL,
    solar_radiation REAL,
    wind_speed REAL,
    wind_direction REAL
);
""")

print(f"✅ sensor_logs table created at {DB_PATH}")
conn.commit()
conn.close()
