"""
Data Loading Module for Forecasting
This module loads and preprocesses energy consumption data for Tour A and Tour B
Similar to data_exploration.py but focused on preparing data for forecasting models
"""

import os
import re
import pandas as pd
import numpy as np
import warnings

warnings.filterwarnings('ignore')

# Constants for data cleaning
OUTLIER_STD_MULTIPLIER = 3  # Standard deviations for outlier detection
MAX_POWER_KW = 50  # Maximum expected power consumption in kW


def normalize_column_name(col_name):
    """
    Normalize column names by removing trailing numeric suffixes.
    """
    normalized = re.sub(r'\s*\d+$', '', str(col_name).strip())
    if not normalized.endswith(' ') and normalized not in ['Date', 'Time']:
        normalized = normalized + ' '
    return normalized


def get_csv_files(data_dir):
    """Find all CSV and XLSX files in the data directory structure."""
    csv_files = []
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith('.csv') or file.endswith('.xlsx'):
                csv_files.append(os.path.join(root, file))
    return sorted(csv_files)


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


def load_all_data(data_dir):
    """Load all data files and combine them."""
    csv_files = get_csv_files(data_dir)
    print(f"Found {len(csv_files)} files")
    
    all_data = []
    for file_path in csv_files:
        df = load_single_file(file_path)
        if df is not None:
            all_data.append(df)
    
    if all_data:
        combined_df = pd.concat(all_data, ignore_index=False)
        combined_df = combined_df[combined_df.index.notna()]
        combined_df = combined_df.sort_index()
        print(f"Total records loaded: {len(combined_df)}")
        return combined_df
    return None


def get_tour_columns(df, tour):
    """Extract columns related to a specific tour."""
    columns = df.columns.tolist()
    
    if tour.upper() == 'A':
        prefixes = ['TOUR_A_(TGBT_D14)', 'CLIM_TOUR_A_(TGBT_D6)']
    elif tour.upper() == 'B':
        prefixes = ['Tour_B_(TGBT_D5)', 'SALLE_B101', 'SALLE_B112', 'SALLE_B201']
    else:
        return []
    
    tour_cols = []
    for col in columns:
        for prefix in prefixes:
            if col.startswith(prefix):
                tour_cols.append(col)
                break
    return tour_cols


def get_power_column(df, tour):
    """Get the main power consumption column for a tour."""
    tour_cols = get_tour_columns(df, tour)
    for col in tour_cols:
        col_lower = col.lower()
        if 'kw sys' in col_lower and 'avg' in col_lower and 'kvar' not in col_lower:
            if (tour.upper() == 'A' and 'tgbt_d14' in col_lower) or \
               (tour.upper() == 'B' and 'tgbt_d5' in col_lower):
                return col
    return None


def clean_power_data(df, power_col):
    """Clean power data by removing outliers and handling missing values."""
    power = pd.to_numeric(df[power_col], errors='coerce')
    
    # Remove extreme outliers (> OUTLIER_STD_MULTIPLIER standard deviations or above MAX_POWER_KW)
    mean_power = power.mean()
    std_power = power.std()
    upper_limit = min(mean_power + OUTLIER_STD_MULTIPLIER * std_power, MAX_POWER_KW)
    power = power.where(power <= upper_limit, np.nan)
    
    # Interpolate missing values
    power = power.interpolate(method='time', limit=4)
    
    return power


def load_tour_data(data_dir, tour='A', test_percentage=1.0):
    """
    Load and prepare data for a specific tour.
    
    Args:
        data_dir: Path to the data directory
        tour: 'A' or 'B'
        test_percentage: Percentage of data to use (0.0-1.0). Use 0.05 for testing.
        
    Returns:
        DataFrame with datetime index and power consumption values
    """
    print(f"\nLoading Tour {tour} data...")
    
    # Load all data
    df = load_all_data(data_dir)
    
    if df is None or len(df) == 0:
        raise ValueError("No data could be loaded!")
    
    # Get power column
    power_col = get_power_column(df, tour)
    if not power_col:
        raise ValueError(f"Could not find power column for Tour {tour}")
    
    print(f"Tour {tour} power column: {power_col}")
    
    # Clean power data
    power = clean_power_data(df, power_col)
    
    # Create a clean dataframe
    result_df = pd.DataFrame({'power': power})
    result_df = result_df.dropna()
    
    # Apply test percentage
    if test_percentage < 1.0:
        n_samples = int(len(result_df) * test_percentage)
        result_df = result_df.iloc[:n_samples]
        print(f"Using {test_percentage*100}% of data: {len(result_df)} samples")
    else:
        print(f"Using full dataset: {len(result_df)} samples")
    
    print(f"Date range: {result_df.index.min()} to {result_df.index.max()}")
    print(f"Power stats - Mean: {result_df['power'].mean():.2f} kW, "
          f"Max: {result_df['power'].max():.2f} kW, "
          f"Min: {result_df['power'].min():.2f} kW")
    
    return result_df


def prepare_forecasting_data(data, freq='15min'):
    """
    Prepare data for forecasting by resampling to consistent frequency.
    
    Args:
        data: DataFrame with datetime index and power column
        freq: Frequency for resampling (default: '15min')
        
    Returns:
        Resampled DataFrame
    """
    # Resample to ensure consistent frequency
    data_resampled = data.resample(freq).mean()
    data_resampled = data_resampled.interpolate(method='time', limit=10)
    data_resampled = data_resampled.dropna()
    
    return data_resampled
