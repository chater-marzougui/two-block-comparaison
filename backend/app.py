"""
Flask Backend API for Power Consumption Dashboard

This API provides endpoints to fetch power consumption data for Tour A and Tour B
with filtering options by date range, month, day of week, and hour.

Author: Data Analysis Script
Date: November 2024
"""

import os
import re
import json
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Constants
# Data is recorded at 15-minute intervals (4 readings per hour)
READINGS_PER_DAY = 24 * 4  # 96 readings per day (15-minute intervals)
INTERVAL_HOURS = 0.25  # Each reading represents 15 minutes = 0.25 hours
TOUR_A_COLOR = '#FF6B6B'
TOUR_B_COLOR = '#4ECDC4'
# Maximum expected power for these buildings (kW). Values above this are treated as outliers.
MAX_POWER_CAP = 50  # kW cap for outlier removal


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


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'message': 'Flask API is running'})


@app.route('/api/data-info', methods=['GET'])
def get_data_info():
    """Get information about available data."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Get available months
    months = df.index.to_period('M').unique().astype(str).tolist()

    return jsonify({
        'totalRecords': len(df),
        'dateRange': {
            'start': str(df.index.min()),
            'end': str(df.index.max())
        },
        'availableMonths': months,
        'tourACoverage': round(100 * power_a.notna().mean(), 1) if power_a is not None else 0,
        'tourBCoverage': round(100 * power_b.notna().mean(), 1) if power_b is not None else 0
    })


@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get summary statistics for Tour A and Tour B."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Parse filter parameters
    month = request.args.get('month')  # Format: YYYY-MM
    start_date = request.args.get('start_date')  # Format: YYYY-MM-DD
    end_date = request.args.get('end_date')  # Format: YYYY-MM-DD

    # Apply filters
    mask = pd.Series(True, index=df.index)
    if month:
        mask &= df.index.to_period('M').astype(str) == month
    if start_date:
        mask &= df.index >= pd.to_datetime(start_date)
    if end_date:
        mask &= df.index <= pd.to_datetime(end_date)

    filtered_a = power_a[mask].dropna()
    filtered_b = power_b[mask].dropna()

    def calc_metrics(power, name):
        if len(power) == 0:
            return {
                'name': name,
                'avgPower': 0,
                'maxPower': 0,
                'minPower': 0,
                'weekdayAvg': 0,
                'weekendAvg': 0,
                'dataCoverage': 0,
                'loadFactor': 0,
                'peakToAvgRatio': 0,
                'totalEnergyKwh': 0,
                'estimatedDailyKwh': 0,
                'estimatedMonthlyKwh': 0
            }

        avg = power.mean()
        max_val = power.max()
        min_val = power[power > 0].min() if (power > 0).any() else 0
        weekday_avg = power[power.index.dayofweek < 5].mean()
        weekend_avg = power[power.index.dayofweek >= 5].mean()
        load_factor = avg / max_val if max_val > 0 else 0
        peak_to_avg = max_val / avg if avg > 0 else 0
        total_energy = (power.fillna(0) * 0.25).sum()  # 15-min intervals

        return {
            'name': name,
            'avgPower': round(avg, 2),
            'maxPower': round(max_val, 2),
            'minPower': round(min_val, 2),
            'weekdayAvg': round(weekday_avg, 2) if not pd.isna(weekday_avg) else 0,
            'weekendAvg': round(weekend_avg, 2) if not pd.isna(weekend_avg) else 0,
            'dataCoverage': round(100 * len(power) / len(mask[mask]), 1) if mask.sum() > 0 else 0,
            'loadFactor': round(load_factor, 3),
            'peakToAvgRatio': round(peak_to_avg, 2),
            'totalEnergyKwh': round(total_energy, 0),
            'estimatedDailyKwh': round(avg * 24, 1),
            'estimatedMonthlyKwh': round(avg * 24 * 30, 0)
        }

    return jsonify({
        'tourA': calc_metrics(filtered_a, 'Tour A'),
        'tourB': calc_metrics(filtered_b, 'Tour B'),
        'filters': {
            'month': month,
            'startDate': start_date,
            'endDate': end_date
        }
    })


@app.route('/api/hourly', methods=['GET'])
def get_hourly_data():
    """Get hourly consumption patterns."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Parse filter parameters
    month = request.args.get('month')
    day_of_week = request.args.get('day_of_week')  # 0-6 (Monday-Sunday)

    # Apply filters
    mask = pd.Series(True, index=df.index)
    if month:
        mask &= df.index.to_period('M').astype(str) == month
    if day_of_week is not None:
        mask &= df.index.dayofweek == int(day_of_week)

    filtered_a = power_a[mask]
    filtered_b = power_b[mask]

    hourly_a = filtered_a.groupby(filtered_a.index.hour).mean()
    hourly_b = filtered_b.groupby(filtered_b.index.hour).mean()

    hourly_data = []
    for hour in range(24):
        a_val = hourly_a.get(hour, 0)
        b_val = hourly_b.get(hour, 0)
        a_val = 0 if pd.isna(a_val) else round(a_val, 2)
        b_val = 0 if pd.isna(b_val) else round(b_val, 2)
        hourly_data.append({
            'hour': hour,
            'tourA': a_val,
            'tourB': b_val,
            'difference': round(b_val - a_val, 2)
        })

    return jsonify({
        'data': hourly_data,
        'filters': {
            'month': month,
            'dayOfWeek': day_of_week
        }
    })


@app.route('/api/weekly', methods=['GET'])
def get_weekly_data():
    """Get weekly consumption patterns."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Parse filter parameters
    month = request.args.get('month')

    # Apply filters
    mask = pd.Series(True, index=df.index)
    if month:
        mask &= df.index.to_period('M').astype(str) == month

    filtered_a = power_a[mask]
    filtered_b = power_b[mask]

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly_a = filtered_a.groupby(filtered_a.index.dayofweek).mean()
    weekly_b = filtered_b.groupby(filtered_b.index.dayofweek).mean()

    weekly_data = []
    for i, day in enumerate(days):
        a_val = weekly_a.get(i, 0)
        b_val = weekly_b.get(i, 0)
        a_val = 0 if pd.isna(a_val) else round(a_val, 2)
        b_val = 0 if pd.isna(b_val) else round(b_val, 2)
        weekly_data.append({
            'day': day,
            'dayIndex': i,
            'tourA': a_val,
            'tourB': b_val
        })

    return jsonify({
        'data': weekly_data,
        'filters': {
            'month': month
        }
    })


@app.route('/api/monthly', methods=['GET'])
def get_monthly_data():
    """Get monthly consumption trends."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Parse filter parameters
    year = request.args.get('year')  # Filter by year

    # Apply filters
    mask = pd.Series(True, index=df.index)
    if year:
        mask &= df.index.year == int(year)

    filtered_a = power_a[mask]
    filtered_b = power_b[mask]

    monthly_a = filtered_a.resample('M').mean()
    monthly_b = filtered_b.resample('M').mean()

    all_months = monthly_a.index.union(monthly_b.index)
    monthly_data = []
    for month in sorted(all_months):
        a_val = monthly_a.get(month, 0)
        b_val = monthly_b.get(month, 0)
        a_val = 0 if pd.isna(a_val) else round(a_val, 2)
        b_val = 0 if pd.isna(b_val) else round(b_val, 2)
        monthly_data.append({
            'month': month.strftime('%Y-%m'),
            'monthName': month.strftime('%b %Y'),
            'tourA': a_val,
            'tourB': b_val,
            'tourAEnergy': round(a_val * 24 * 30, 0),
            'tourBEnergy': round(b_val * 24 * 30, 0)
        })

    return jsonify({
        'data': monthly_data,
        'filters': {
            'year': year
        }
    })


@app.route('/api/timeseries', methods=['GET'])
def get_timeseries_data():
    """Get time series data (daily averages)."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Parse filter parameters
    month = request.args.get('month')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    aggregation = request.args.get('aggregation', 'daily')  # daily, hourly, weekly

    # Apply filters
    mask = pd.Series(True, index=df.index)
    if month:
        mask &= df.index.to_period('M').astype(str) == month
    if start_date:
        mask &= df.index >= pd.to_datetime(start_date)
    if end_date:
        mask &= df.index <= pd.to_datetime(end_date)

    filtered_a = power_a[mask]
    filtered_b = power_b[mask]

    # Resample based on aggregation
    if aggregation == 'hourly':
        resampled_a = filtered_a.resample('H').mean()
        resampled_b = filtered_b.resample('H').mean()
        date_format = '%Y-%m-%d %H:00'
    elif aggregation == 'weekly':
        resampled_a = filtered_a.resample('W').mean()
        resampled_b = filtered_b.resample('W').mean()
        date_format = '%Y-%m-%d'
    else:  # daily
        resampled_a = filtered_a.resample('D').mean()
        resampled_b = filtered_b.resample('D').mean()
        date_format = '%Y-%m-%d'

    all_dates = resampled_a.index.union(resampled_b.index)
    timeseries_data = []
    for date in sorted(all_dates):
        a_val = resampled_a.get(date, 0)
        b_val = resampled_b.get(date, 0)
        a_val = 0 if pd.isna(a_val) else round(a_val, 2)
        b_val = 0 if pd.isna(b_val) else round(b_val, 2)
        timeseries_data.append({
            'date': date.strftime(date_format),
            'tourA': a_val,
            'tourB': b_val
        })

    return jsonify({
        'data': timeseries_data,
        'filters': {
            'month': month,
            'startDate': start_date,
            'endDate': end_date,
            'aggregation': aggregation
        }
    })


@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Get key insights based on the data."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Parse filter parameters
    month = request.args.get('month')

    # Apply filters
    mask = pd.Series(True, index=df.index)
    if month:
        mask &= df.index.to_period('M').astype(str) == month

    filtered_a = power_a[mask].dropna()
    filtered_b = power_b[mask].dropna()

    avg_a = filtered_a.mean() if len(filtered_a) > 0 else 0
    avg_b = filtered_b.mean() if len(filtered_b) > 0 else 0

    efficiency_diff = abs((avg_a - avg_b) / avg_a * 100) if avg_a > 0 else 0
    more_efficient = 'Tour A' if avg_a < avg_b else 'Tour B'

    weekday_a = filtered_a[filtered_a.index.dayofweek < 5].mean() if len(filtered_a) > 0 else 0
    weekend_a = filtered_a[filtered_a.index.dayofweek >= 5].mean() if len(filtered_a) > 0 else 0
    weekday_b = filtered_b[filtered_b.index.dayofweek < 5].mean() if len(filtered_b) > 0 else 0
    weekend_b = filtered_b[filtered_b.index.dayofweek >= 5].mean() if len(filtered_b) > 0 else 0

    weekend_savings_a = ((weekday_a - weekend_a) / weekday_a * 100) if weekday_a > 0 else 0
    weekend_savings_b = ((weekday_b - weekend_b) / weekday_b * 100) if weekday_b > 0 else 0

    hourly_a = filtered_a.groupby(filtered_a.index.hour).mean() if len(filtered_a) > 0 else pd.Series()
    hourly_b = filtered_b.groupby(filtered_b.index.hour).mean() if len(filtered_b) > 0 else pd.Series()

    peak_hour_a = int(hourly_a.idxmax()) if len(hourly_a) > 0 else 0
    peak_hour_b = int(hourly_b.idxmax()) if len(hourly_b) > 0 else 0

    load_factor_a = avg_a / filtered_a.max() if len(filtered_a) > 0 and filtered_a.max() > 0 else 0
    load_factor_b = avg_b / filtered_b.max() if len(filtered_b) > 0 and filtered_b.max() > 0 else 0

    insights = [
        {
            'title': 'Energy Efficiency',
            'value': f'{efficiency_diff:.1f}%',
            'description': f'{more_efficient} uses {efficiency_diff:.1f}% less power on average',
            'icon': '⚡'
        },
        {
            'title': 'Peak Hour',
            'value': f'{peak_hour_a}:00 / {peak_hour_b}:00',
            'description': f'Tour A peaks at {peak_hour_a}:00, Tour B at {peak_hour_b}:00',
            'icon': '📈'
        },
        {
            'title': 'Weekend Savings',
            'value': f'{(weekend_savings_a + weekend_savings_b)/2:.0f}%',
            'description': f'Average weekend consumption drop (A: {weekend_savings_a:.0f}%, B: {weekend_savings_b:.0f}%)',
            'icon': '📅'
        },
        {
            'title': 'Monthly Usage',
            'value': f'~{(avg_a + avg_b) * 24 * 30 / 1000:.1f} MWh',
            'description': 'Combined monthly consumption estimate',
            'icon': '🔌'
        },
        {
            'title': 'Load Factor',
            'value': f'{load_factor_a:.2f} / {load_factor_b:.2f}',
            'description': 'Load factor comparison (A / B). Higher is better.',
            'icon': '📊'
        },
        {
            'title': 'Data Coverage',
            'value': f'{100*len(filtered_a)/len(mask[mask]):.0f}% / {100*len(filtered_b)/len(mask[mask]):.0f}%' if mask.sum() > 0 else '0% / 0%',
            'description': 'Available data percentage for Tour A / Tour B',
            'icon': '📁'
        }
    ]

    return jsonify({
        'data': insights,
        'filters': {
            'month': month
        }
    })


@app.route('/api/heatmap', methods=['GET'])
def get_heatmap_data():
    """Get heatmap data (hour vs day of week)."""
    df, power_a, power_b = load_all_data()
    if df is None:
        return jsonify({'error': 'No data available'}), 500

    # Parse filter parameters
    month = request.args.get('month')

    # Apply filters
    mask = pd.Series(True, index=df.index)
    if month:
        mask &= df.index.to_period('M').astype(str) == month

    filtered_a = power_a[mask]
    filtered_b = power_b[mask]

    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    def create_heatmap(power_series):
        heatmap_data = []
        for day_idx in range(7):
            day_data = power_series[power_series.index.dayofweek == day_idx]
            for hour in range(24):
                hour_data = day_data[day_data.index.hour == hour]
                val = hour_data.mean() if len(hour_data) > 0 else 0
                val = 0 if pd.isna(val) else round(val, 2)
                heatmap_data.append({
                    'day': days[day_idx],
                    'dayIndex': day_idx,
                    'hour': hour,
                    'value': val
                })
        return heatmap_data

    return jsonify({
        'tourA': create_heatmap(filtered_a),
        'tourB': create_heatmap(filtered_b),
        'filters': {
            'month': month
        }
    })


if __name__ == '__main__':
    import os
    # Preload data on startup
    print("Loading data...")
    load_all_data()
    print("Starting Flask server...")
    # Only enable debug mode if explicitly set via environment variable
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
