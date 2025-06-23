import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "db" / "climate_data.db"

def insert_test_alert():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO alerts (timestamp, message, resolved)
        VALUES (datetime('now'), 'This is a test alert!', 0)
    """)
    conn.commit()
    conn.close()
    print("Test alert inserted successfully.")

if __name__ == "__main__":
    insert_test_alert()
