#!/usr/bin/env python3
"""
Simple Database Export Script
Exports all tables from the database to JSON format
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

import pandas as pd
from sqlalchemy import inspect, text

# Add the project root directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "."))
sys.path.insert(0, project_root)

# Import app modules
from app.db.session import SessionLocal, engine


def export_database(output_file="database_export.json"):
    """Export all tables from the database to a single JSON file"""

    print("Exporting database...")

    # Get all table names
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    if not tables:
        print("No tables found in the database!")
        return

    # Create the export data structure
    export_data = {
        "export_timestamp": datetime.now().isoformat(),
        "database_type": engine.dialect.name,
        "tables": {},
    }

    # Create database session
    db = SessionLocal()
    total_records = 0

    try:
        # Export each table
        for table_name in tables:
            try:
                print(f"Exporting table: {table_name}")

                # Read table data
                query = text(f"SELECT * FROM {table_name}")
                df = pd.read_sql_query(query, engine)

                # Convert to records and add to export data
                records = df.to_dict("records")
                export_data["tables"][table_name] = {
                    "record_count": len(records),
                    "columns": list(df.columns),
                    "data": records,
                }

                total_records += len(records)
                print(f"  Exported {len(records)} records")

            except Exception as e:
                print(f"  Error exporting table {table_name}: {e}")
                export_data["tables"][table_name] = {
                    "error": str(e),
                    "record_count": 0,
                    "columns": [],
                    "data": [],
                }

    finally:
        db.close()

    # Add summary info
    export_data["total_records"] = total_records
    export_data["total_tables"] = len(tables)

    # Save to JSON file
    output_path = Path(output_file)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, default=str, ensure_ascii=False)

    print(f"\nExport completed!")
    print(f"Total records: {total_records}")
    print(f"Total tables: {len(tables)}")
    print(f"Output file: {output_path.absolute()}")


if __name__ == "__main__":
    try:
        export_database()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
