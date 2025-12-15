"""
Data loading and processing utilities for power consumption data
"""

import os
import re
import pandas as pd
import numpy as np
from config import MAX_POWER_CAP


# ============================================================================
# DATA LOADING UTILITIES
# ============================================================================

def normalize_column_name(col_name):
    """Normalize column names by removing trailing numeric suffixes."""
    normalized = re.sub(r'\s*\d+$', '', str(col_name).strip())
    if not normalized.endswith(' ') and normalized not in ['Date', 'Time']:
        normalized = normalized + ' '
    return normalized


def get_data_files(data_dir):
    """Find all CSV and XLSX files in the data directory."""
    data_files = []
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith('.csv') or file.endswith('.xlsx'):
                data_files.append(os.path.join(root, file))
    return sorted(data_files)


def load_single_file(file_path):
    """Load a single CSV/XLSX file with proper parsing."""
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path, sep=';', low_memory=False)
        elif file_path.endswith('.xlsx'):
            df = pd.read_excel(file_path)
            if 'Date' in df.columns:
                df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%d-%m-%Y')
            df.columns = [normalize_column_name(col) for col in df.columns]
        else:
            return None

        if 'Date' in df.columns and 'Time' in df.columns:
            mask = ~(df['Time'] == '24:00:00')
            df = df[mask]
            df['Datetime'] = pd.to_datetime(
                df['Date'] + ' ' + df['Time'],
                format='%d-%m-%Y %H:%M:%S',
                errors='coerce'
            )
            df.set_index('Datetime', inplace=True)
            df.drop(['Date', 'Time'], axis=1, inplace=True)
        return df
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None


def get_power_column(df, tour):
    """Get the main power consumption column for a tour."""
    if tour.upper() == 'A':
        prefixes = ['TOUR_A_(TGBT_D14)']
    else:
        prefixes = ['Tour_B_(TGBT_D5)']

    for col in df.columns:
        col_lower = col.lower()
        for prefix in prefixes:
            if prefix.lower() in col_lower and 'kw sys' in col_lower and 'avg' in col_lower and 'kvar' not in col_lower:
                return col
    return None


def clean_power_data(series):
    """Clean power data by removing outliers."""
    power = pd.to_numeric(series, errors='coerce')
    mean_power = power.mean()
    std_power = power.std()
    upper_limit = min(mean_power + 3 * std_power, MAX_POWER_CAP)
    power = power.where(power <= upper_limit, np.nan)
    return power


# Global data cache
_data_cache = None
_power_a_cache = None
_power_b_cache = None


def load_all_data():
    """Load all data files and cache them."""
    global _data_cache, _power_a_cache, _power_b_cache

    if _data_cache is not None:
        return _data_cache, _power_a_cache, _power_b_cache

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cache_folder = os.path.join(base_dir, 'cache')
    tour_a_file = os.path.join(cache_folder, 'tour_a_processed.csv')
    tour_b_file = os.path.join(cache_folder, 'tour_b_processed.csv')
    if os.path.exists(cache_folder) and os.path.exists(tour_a_file) and os.path.exists(tour_b_file):
        print("Loading cached processed data...")
        power_a = pd.read_csv(tour_a_file, index_col=0, parse_dates=True)
        power_b = pd.read_csv(tour_b_file, index_col=0, parse_dates=True)
        _power_a_cache = power_a['power']
        _power_b_cache = power_b['power']
        combined_df = pd.concat([_power_a_cache, _power_b_cache], axis=1)
        combined_df.columns = ['Tour_A_Power', 'Tour_B_Power']
        _data_cache = combined_df
        return _data_cache, _power_a_cache, _power_b_cache
    
    data_dir = os.path.join(base_dir, "SINERT_DATA_CONCENTRATOR")

    data_files = get_data_files(data_dir)
    print(f"Found {len(data_files)} data files")

    all_data = []
    for file_path in data_files:
        df = load_single_file(file_path)
        if df is not None:
            all_data.append(df)

    if all_data:
        combined_df = pd.concat(all_data, ignore_index=False)
        combined_df = combined_df[combined_df.index.notna()]
        combined_df = combined_df.sort_index()
        _data_cache = combined_df

        # Get power columns
        power_col_a = get_power_column(combined_df, 'A')
        power_col_b = get_power_column(combined_df, 'B')

        if power_col_a:
            _power_a_cache = clean_power_data(combined_df[power_col_a])
        if power_col_b:
            _power_b_cache = clean_power_data(combined_df[power_col_b])

        print(f"Data loaded: {len(combined_df)} records")
        return _data_cache, _power_a_cache, _power_b_cache

    return None, None, None
