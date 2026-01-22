#!/usr/bin/env python3
"""
One-time Excel import script for AHU Opportunity Tracker
This script will:
1. Add new columns to the Supabase opportunities table
2. Import data from your Excel file
"""

import pandas as pd
import os
from supabase import create_client, Client
from datetime import datetime

# Supabase configuration
SUPABASE_URL = "https://db.yppyzmjpwrxjaxlsrpio.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")  # You'll need to set this

if not SUPABASE_KEY:
    print("❌ Error: SUPABASE_ANON_KEY environment variable not set")
    print("Please set it with: export SUPABASE_ANON_KEY='your-anon-key'")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def add_new_columns():
    """Add new columns to the opportunities table"""
    print("📊 Adding new columns to the database...")

    sql = """
    -- Add new columns to opportunities table
    ALTER TABLE public.opportunities
    ADD COLUMN IF NOT EXISTS bu TEXT,
    ADD COLUMN IF NOT EXISTS air_flow_m3h NUMERIC,
    ADD COLUMN IF NOT EXISTS number_of_units INTEGER,
    ADD COLUMN IF NOT EXISTS dss_dsp_design TEXT,
    ADD COLUMN IF NOT EXISTS transfer_cost_without_oh_profit_8_per_u NUMERIC,
    ADD COLUMN IF NOT EXISTS transfer_cost_complete_per_u NUMERIC,
    ADD COLUMN IF NOT EXISTS vortice_price NUMERIC,
    ADD COLUMN IF NOT EXISTS selling_price NUMERIC,
    ADD COLUMN IF NOT EXISTS comments TEXT;
    """

    try:
        supabase.rpc('exec_sql', {'sql': sql}).execute()
        print("✅ Columns added successfully!")
    except Exception as e:
        print(f"⚠️  Note: {e}")
        print("   This is OK if columns already exist. Continuing...")

def parse_currency(value):
    """Convert currency string to float"""
    if pd.isna(value) or value == '':
        return None
    if isinstance(value, (int, float)):
        return float(value)
    # Remove currency symbols and convert
    cleaned = str(value).replace('€', '').replace(',', '.').strip()
    try:
        return float(cleaned)
    except:
        return None

def parse_date(value):
    """Convert date to ISO format"""
    if pd.isna(value) or value == '':
        return None
    if isinstance(value, str):
        try:
            dt = pd.to_datetime(value, format='%d/%m/%Y')
            return dt.strftime('%Y-%m-%d')
        except:
            return None
    if isinstance(value, datetime):
        return value.strftime('%Y-%m-%d')
    return None

def import_excel(file_path):
    """Import data from Excel file"""
    print(f"📂 Reading Excel file: {file_path}")

    # Read Excel file
    df = pd.read_excel(file_path)

    print(f"✅ Found {len(df)} rows to import")
    print(f"📋 Columns in Excel: {list(df.columns)}")

    # Map Excel columns to database columns
    column_mapping = {
        'Project Name': 'title',
        'BU': 'bu',
        'Site': 'site',
        'Owner': 'owner_name',
        'Status': 'status',
        'Priority': 'priority',
        'Closing date': 'target_close_date',
        'Description': 'description',
        'Air flow (m3/h)': 'air_flow_m3h',
        'Number of Units': 'number_of_units',
        'DSS / DSP desing': 'dss_dsp_design',
        'Transfer cost without OH and profit 8% /u': 'transfer_cost_without_oh_profit_8_per_u',
        'Transfer cost complete /u': 'transfer_cost_complete_per_u',
        'Vortice price': 'vortice_price',
        'Selling Price': 'selling_price',
        'Comments': 'comments',
    }

    imported = 0
    failed = 0

    for idx, row in df.iterrows():
        try:
            # Skip empty rows
            if pd.isna(row.get('Project Name')) or row.get('Project Name') == '':
                print(f"⏭️  Skipping row {idx + 1}: No project name")
                continue

            # Build the opportunity data
            opportunity = {}

            # Text fields
            for excel_col, db_col in column_mapping.items():
                if excel_col in df.columns:
                    value = row.get(excel_col)

                    # Handle different field types
                    if db_col == 'target_close_date':
                        opportunity[db_col] = parse_date(value)
                    elif db_col in ['air_flow_m3h', 'transfer_cost_without_oh_profit_8_per_u',
                                    'transfer_cost_complete_per_u', 'vortice_price', 'selling_price']:
                        opportunity[db_col] = parse_currency(value)
                    elif db_col == 'number_of_units':
                        opportunity[db_col] = int(value) if pd.notna(value) and value != '' else None
                    else:
                        opportunity[db_col] = str(value) if pd.notna(value) and value != '' else None

            # Set price_eur to match selling_price
            if opportunity.get('selling_price'):
                opportunity['price_eur'] = opportunity['selling_price']

            # Set default status and priority if not provided
            if not opportunity.get('status'):
                opportunity['status'] = 'New'
            if not opportunity.get('priority'):
                opportunity['priority'] = 'Medium'

            # Insert into Supabase
            result = supabase.table('opportunities').insert(opportunity).execute()

            print(f"✅ Row {idx + 1}: Imported '{opportunity['title']}'")
            imported += 1

        except Exception as e:
            print(f"❌ Row {idx + 1}: Failed - {str(e)}")
            failed += 1

    print("\n" + "="*50)
    print(f"✨ Import complete!")
    print(f"   ✅ Successfully imported: {imported}")
    print(f"   ❌ Failed: {failed}")
    print("="*50)

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python import_excel.py <path-to-excel-file>")
        print("Example: python import_excel.py ~/Downloads/opportunities.xlsx")
        exit(1)

    excel_file = sys.argv[1]

    if not os.path.exists(excel_file):
        print(f"❌ Error: File not found: {excel_file}")
        exit(1)

    print("🚀 Starting import process...")
    print()

    # Step 1: Add new columns
    add_new_columns()
    print()

    # Step 2: Import data
    import_excel(excel_file)
