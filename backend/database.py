"""
Database module for Air Quality Pattern Analysis
Handles SQLite initialization, table creation, and sample data population.
"""

import os
import sqlite3
import pandas as pd

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'air_quality.db')
CSV_PATH = os.path.join(BASE_DIR, 'data', 'air_quality_sample.csv')


def get_db_connection():
    """Establish and return a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Return dict-like row objects
    return conn


def init_db():
    """
    Initialize SQLite database schema and populate with sample data if empty.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS air_quality_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            aqi INTEGER NOT NULL,
            pm25 REAL NOT NULL,
            pm10 REAL NOT NULL,
            co REAL NOT NULL,
            no2 REAL NOT NULL,
            o3 REAL NOT NULL,
            status TEXT NOT NULL
        )
    ''')
    conn.commit()

    # Check if table already has data
    cursor.execute("SELECT COUNT(*) FROM air_quality_data")
    count = cursor.fetchone()[0]

    # Populate table from CSV if empty
    if count == 0 and os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        for _, row in df.iterrows():
            cursor.execute('''
                INSERT INTO air_quality_data 
                (date, location, aqi, pm25, pm10, co, no2, o3, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                row['date'],
                row['location'],
                int(row['aqi']),
                float(row['pm25']),
                float(row['pm10']),
                float(row['co']),
                float(row['no2']),
                float(row['o3']),
                row['status']
            ))
        conn.commit()

    conn.close()


def get_all_records():
    """Retrieve all air quality records from database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM air_quality_data ORDER BY date DESC, id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_records_by_location(location):
    """Retrieve air quality records filtered by city location (case-insensitive)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM air_quality_data WHERE LOWER(location) = LOWER(?) ORDER BY date DESC",
        (location,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_latest_record(location):
    """Retrieve the single most recent record for a specific location."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM air_quality_data WHERE LOWER(location) = LOWER(?) ORDER BY date DESC, id DESC LIMIT 1",
        (location,)
    )
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_location_statistics(location):
    """Calculate statistical summaries (avg, min, max) for a specific location."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            COUNT(*) as record_count,
            ROUND(AVG(aqi), 1) as avg_aqi,
            MAX(aqi) as max_aqi,
            MIN(aqi) as min_aqi,
            ROUND(AVG(pm25), 1) as avg_pm25,
            ROUND(AVG(pm10), 1) as avg_pm10,
            ROUND(AVG(co), 2) as avg_co,
            ROUND(AVG(no2), 1) as avg_no2,
            ROUND(AVG(o3), 1) as avg_o3
        FROM air_quality_data
        WHERE LOWER(location) = LOWER(?)
    ''', (location,))
    row = cursor.fetchone()
    conn.close()

    if not row or row['record_count'] == 0:
        return None

    return dict(row)


if __name__ == '__main__':
    # When run directly, initialize database
    init_db()
    print("Database initialized successfully.")
