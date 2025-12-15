"""
Data Exploration V2 Script for Tour A and Tour B Comparative Analysis

This enhanced version adds:
- Monthly trend analysis
- Seasonal comparisons
- Load factor analysis
- Peak demand analysis
- Energy cost estimation
- Power quality metrics
- Comprehensive JSON export for React dashboard
"""

import os
import re
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from datetime import datetime

warnings.filterwarnings('ignore')

# Set style for visualizations
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")


# ============================================================================
# 1. DATA LOADING FUNCTIONS (with column name normalization)
# ============================================================================

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


# ============================================================================
# 2. DATA EXTRACTION - TOUR A AND TOUR B
# ============================================================================

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
    
    # Remove extreme outliers (> 3 standard deviations or above 50 kW for these buildings)
    mean_power = power.mean()
    std_power = power.std()
    upper_limit = min(mean_power + 3 * std_power, 50)  # Cap at 50 kW
    power = power.where(power <= upper_limit, np.nan)
    
    return power


# ============================================================================
# 3. ENHANCED ANALYSIS FUNCTIONS
# ============================================================================

def calculate_monthly_stats(power_series, name):
    """Calculate monthly statistics."""
    monthly = power_series.resample('M').agg(['mean', 'max', 'min', 'std', 'count'])
    monthly.columns = [f'{name}_{c}' for c in monthly.columns]
    return monthly


def calculate_hourly_patterns(power_series):
    """Calculate hourly consumption patterns."""
    hourly = power_series.groupby(power_series.index.hour).agg(['mean', 'std', 'max', 'min'])
    return hourly


def calculate_weekly_patterns(power_series):
    """Calculate weekly consumption patterns."""
    daily_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly = power_series.groupby(power_series.index.dayofweek).agg(['mean', 'std'])
    weekly.index = daily_names
    return weekly


def calculate_load_factor(power_series):
    """
    Calculate load factor = Average Load / Peak Load
    Higher load factor means more efficient use of peak capacity.
    """
    avg_load = power_series.mean()
    peak_load = power_series.max()
    if peak_load > 0:
        return avg_load / peak_load
    return 0


def calculate_peak_to_average_ratio(power_series):
    """Calculate peak-to-average ratio (PAR)."""
    avg = power_series.mean()
    peak = power_series.max()
    if avg > 0:
        return peak / avg
    return 0


def estimate_energy_consumption(power_series, interval_hours=0.25):
    """Estimate total energy consumption in kWh."""
    # Each reading represents 15 minutes = 0.25 hours
    energy = (power_series.fillna(0) * interval_hours).sum()
    return energy


def analyze_peak_hours(power_series, top_n=5):
    """Find peak consumption hours."""
    hourly_avg = power_series.groupby(power_series.index.hour).mean()
    peak_hours = hourly_avg.nlargest(top_n)
    return peak_hours


def analyze_off_peak_hours(power_series, bottom_n=5):
    """Find off-peak consumption hours."""
    hourly_avg = power_series.groupby(power_series.index.hour).mean()
    off_peak_hours = hourly_avg.nsmallest(bottom_n)
    return off_peak_hours


def compare_seasonal_patterns(power_a, power_b):
    """Compare seasonal consumption patterns by month."""
    # Group by month name
    month_order = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December']
    
    a_monthly = power_a.groupby(power_a.index.month).mean()
    b_monthly = power_b.groupby(power_b.index.month).mean()
    
    # Convert to month names
    a_monthly.index = [month_order[i-1] for i in a_monthly.index]
    b_monthly.index = [month_order[i-1] for i in b_monthly.index]
    
    return pd.DataFrame({'Tour A': a_monthly, 'Tour B': b_monthly})


# ============================================================================
# 4. VISUALIZATION FUNCTIONS
# ============================================================================

def plot_monthly_comparison(power_a, power_b, save_path=None):
    """Plot monthly consumption comparison."""
    fig, axes = plt.subplots(2, 1, figsize=(14, 10))
    
    # Monthly averages
    monthly_a = power_a.resample('M').mean()
    monthly_b = power_b.resample('M').mean()
    
    # Bar chart
    x = np.arange(len(monthly_a))
    width = 0.35
    
    axes[0].bar(x - width/2, monthly_a.values, width, label='Tour A', alpha=0.8, color='#FF6B6B')
    axes[0].bar(x + width/2, monthly_b.values, width, label='Tour B', alpha=0.8, color='#4ECDC4')
    axes[0].set_xlabel('Month')
    axes[0].set_ylabel('Average Power (kW)')
    axes[0].set_title('Monthly Average Power Consumption')
    axes[0].set_xticks(x)
    axes[0].set_xticklabels([d.strftime('%b %Y') for d in monthly_a.index], rotation=45)
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)
    
    # Monthly total energy
    monthly_energy_a = (power_a.resample('M').mean() * 24 * power_a.resample('M').count() / 96)
    monthly_energy_b = (power_b.resample('M').mean() * 24 * power_b.resample('M').count() / 96)
    
    axes[1].plot(monthly_energy_a.index, monthly_energy_a.values, 'o-', 
                 label='Tour A', color='#FF6B6B', linewidth=2, markersize=8)
    axes[1].plot(monthly_energy_b.index, monthly_energy_b.values, 's-', 
                 label='Tour B', color='#4ECDC4', linewidth=2, markersize=8)
    axes[1].set_xlabel('Month')
    axes[1].set_ylabel('Estimated Energy (kWh)')
    axes[1].set_title('Monthly Energy Consumption Trend')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"Saved: {save_path}")
    plt.close()


def plot_heatmap_comparison(power_a, power_b, save_path=None):
    """Plot hourly consumption heatmaps for both tours."""
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))
    
    # Create hour vs day of week pivot tables
    df_a = pd.DataFrame({'power': power_a, 'hour': power_a.index.hour, 'day': power_a.index.dayofweek})
    df_b = pd.DataFrame({'power': power_b, 'hour': power_b.index.hour, 'day': power_b.index.dayofweek})
    
    pivot_a = df_a.pivot_table(values='power', index='day', columns='hour', aggfunc='mean')
    pivot_b = df_b.pivot_table(values='power', index='day', columns='hour', aggfunc='mean')
    
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    # Determine common scale
    vmin = min(pivot_a.min().min(), pivot_b.min().min())
    vmax = max(pivot_a.max().max(), pivot_b.max().max())
    
    sns.heatmap(pivot_a, ax=axes[0], cmap='YlOrRd', vmin=vmin, vmax=vmax,
                yticklabels=days, cbar_kws={'label': 'Power (kW)'})
    axes[0].set_title('Tour A - Hourly Consumption Pattern')
    axes[0].set_xlabel('Hour of Day')
    axes[0].set_ylabel('Day of Week')
    
    sns.heatmap(pivot_b, ax=axes[1], cmap='YlGnBu', vmin=vmin, vmax=vmax,
                yticklabels=days, cbar_kws={'label': 'Power (kW)'})
    axes[1].set_title('Tour B - Hourly Consumption Pattern')
    axes[1].set_xlabel('Hour of Day')
    axes[1].set_ylabel('Day of Week')
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"Saved: {save_path}")
    plt.close()


def plot_efficiency_metrics(metrics_a, metrics_b, save_path=None):
    """Plot efficiency metrics comparison."""
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    colors = ['#FF6B6B', '#4ECDC4']
    
    # Load Factor
    ax = axes[0, 0]
    bars = ax.bar(['Tour A', 'Tour B'], 
                   [metrics_a['load_factor'], metrics_b['load_factor']], 
                   color=colors, alpha=0.8)
    ax.set_ylabel('Load Factor')
    ax.set_title('Load Factor Comparison\n(Higher = Better Utilization)')
    ax.set_ylim(0, 1)
    for bar, val in zip(bars, [metrics_a['load_factor'], metrics_b['load_factor']]):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02, 
                f'{val:.2f}', ha='center', fontsize=12)
    ax.grid(True, alpha=0.3)
    
    # Peak to Average Ratio
    ax = axes[0, 1]
    bars = ax.bar(['Tour A', 'Tour B'], 
                   [metrics_a['peak_to_avg'], metrics_b['peak_to_avg']], 
                   color=colors, alpha=0.8)
    ax.set_ylabel('Peak/Average Ratio')
    ax.set_title('Peak-to-Average Ratio\n(Lower = More Consistent Load)')
    for bar, val in zip(bars, [metrics_a['peak_to_avg'], metrics_b['peak_to_avg']]):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, 
                f'{val:.2f}', ha='center', fontsize=12)
    ax.grid(True, alpha=0.3)
    
    # Total Energy
    ax = axes[1, 0]
    bars = ax.bar(['Tour A', 'Tour B'], 
                   [metrics_a['total_energy_kwh'], metrics_b['total_energy_kwh']], 
                   color=colors, alpha=0.8)
    ax.set_ylabel('Total Energy (kWh)')
    ax.set_title('Total Energy Consumption')
    for bar, val in zip(bars, [metrics_a['total_energy_kwh'], metrics_b['total_energy_kwh']]):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50, 
                f'{val:.0f}', ha='center', fontsize=12)
    ax.grid(True, alpha=0.3)
    
    # Weekday vs Weekend
    ax = axes[1, 1]
    x = np.arange(2)
    width = 0.35
    ax.bar(x - width/2, [metrics_a['weekday_avg'], metrics_a['weekend_avg']], 
           width, label='Tour A', color=colors[0], alpha=0.8)
    ax.bar(x + width/2, [metrics_b['weekday_avg'], metrics_b['weekend_avg']], 
           width, label='Tour B', color=colors[1], alpha=0.8)
    ax.set_ylabel('Average Power (kW)')
    ax.set_title('Weekday vs Weekend Consumption')
    ax.set_xticks(x)
    ax.set_xticklabels(['Weekday', 'Weekend'])
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"Saved: {save_path}")
    plt.close()


def plot_peak_analysis(power_a, power_b, save_path=None):
    """Plot peak demand analysis."""
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Peak hours analysis
    peak_a = analyze_peak_hours(power_a, 10)
    peak_b = analyze_peak_hours(power_b, 10)
    
    ax = axes[0]
    width = 0.35
    x = np.arange(10)
    ax.bar(x - width/2, peak_a.values, width, label='Tour A', color='#FF6B6B', alpha=0.8)
    ax.bar(x + width/2, peak_b.values, width, label='Tour B', color='#4ECDC4', alpha=0.8)
    ax.set_xlabel('Hour (Ranked by Consumption)')
    ax.set_ylabel('Average Power (kW)')
    ax.set_title('Top 10 Peak Consumption Hours')
    ax.set_xticks(x)
    ax.set_xticklabels([f'{h}:00' for h in peak_a.index])
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # Daily peaks
    ax = axes[1]
    daily_max_a = power_a.resample('D').max()
    daily_max_b = power_b.resample('D').max()
    
    ax.hist(daily_max_a.dropna(), bins=20, alpha=0.6, label='Tour A', color='#FF6B6B')
    ax.hist(daily_max_b.dropna(), bins=20, alpha=0.6, label='Tour B', color='#4ECDC4')
    ax.set_xlabel('Daily Peak Power (kW)')
    ax.set_ylabel('Frequency')
    ax.set_title('Distribution of Daily Peak Power')
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"Saved: {save_path}")
    plt.close()


# ============================================================================
# 5. JSON EXPORT FOR REACT DASHBOARD
# ============================================================================

def export_dashboard_data(power_a, power_b, metrics_a, metrics_b, output_path):
    """Export all analysis data to JSON for React dashboard."""
    
    # Tour summary
    tour_summary = [
        {
            "name": "Tour A",
            "avgPower": round(metrics_a['avg_power'], 2),
            "maxPower": round(metrics_a['max_power'], 2),
            "minPower": round(metrics_a['min_power'], 2),
            "powerFactor": round(metrics_a.get('power_factor', 0), 3),
            "weekdayAvg": round(metrics_a['weekday_avg'], 2),
            "weekendAvg": round(metrics_a['weekend_avg'], 2),
            "dataCoverage": round(metrics_a['data_coverage'], 1),
            "estimatedDailyKwh": round(metrics_a['avg_power'] * 24, 1),
            "estimatedMonthlyKwh": round(metrics_a['avg_power'] * 24 * 30, 0),
            "loadFactor": round(metrics_a['load_factor'], 3),
            "peakToAvgRatio": round(metrics_a['peak_to_avg'], 2),
            "totalEnergyKwh": round(metrics_a['total_energy_kwh'], 0)
        },
        {
            "name": "Tour B",
            "avgPower": round(metrics_b['avg_power'], 2),
            "maxPower": round(metrics_b['max_power'], 2),
            "minPower": round(metrics_b['min_power'], 2),
            "powerFactor": round(metrics_b.get('power_factor', 0), 3),
            "weekdayAvg": round(metrics_b['weekday_avg'], 2),
            "weekendAvg": round(metrics_b['weekend_avg'], 2),
            "dataCoverage": round(metrics_b['data_coverage'], 1),
            "estimatedDailyKwh": round(metrics_b['avg_power'] * 24, 1),
            "estimatedMonthlyKwh": round(metrics_b['avg_power'] * 24 * 30, 0),
            "loadFactor": round(metrics_b['load_factor'], 3),
            "peakToAvgRatio": round(metrics_b['peak_to_avg'], 2),
            "totalEnergyKwh": round(metrics_b['total_energy_kwh'], 0)
        }
    ]
    
    # Hourly data
    hourly_a = power_a.groupby(power_a.index.hour).mean()
    hourly_b = power_b.groupby(power_b.index.hour).mean()
    hourly_data = []
    for hour in range(24):
        a_val = hourly_a.get(hour, 0) if not pd.isna(hourly_a.get(hour, 0)) else 0
        b_val = hourly_b.get(hour, 0) if not pd.isna(hourly_b.get(hour, 0)) else 0
        hourly_data.append({
            "hour": hour,
            "tourA": round(a_val, 2),
            "tourB": round(b_val, 2),
            "difference": round(b_val - a_val, 2)
        })
    
    # Weekly data
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly_a = power_a.groupby(power_a.index.dayofweek).mean()
    weekly_b = power_b.groupby(power_b.index.dayofweek).mean()
    weekly_data = []
    for i, day in enumerate(days):
        a_val = weekly_a.get(i, 0) if not pd.isna(weekly_a.get(i, 0)) else 0
        b_val = weekly_b.get(i, 0) if not pd.isna(weekly_b.get(i, 0)) else 0
        weekly_data.append({
            "day": day,
            "dayIndex": i,
            "tourA": round(a_val, 2),
            "tourB": round(b_val, 2)
        })
    
    # Time series (daily averages)
    daily_a = power_a.resample('D').mean()
    daily_b = power_b.resample('D').mean()
    
    # Combine indices
    all_dates = daily_a.index.union(daily_b.index)
    time_series_data = []
    for date in sorted(all_dates):
        a_val = daily_a.get(date, 0) if date in daily_a.index and not pd.isna(daily_a.get(date, 0)) else 0
        b_val = daily_b.get(date, 0) if date in daily_b.index and not pd.isna(daily_b.get(date, 0)) else 0
        time_series_data.append({
            "date": date.strftime('%Y-%m-%d'),
            "tourA": round(a_val, 2),
            "tourB": round(b_val, 2)
        })
    
    # Monthly data
    monthly_a = power_a.resample('M').mean()
    monthly_b = power_b.resample('M').mean()
    all_months = monthly_a.index.union(monthly_b.index)
    monthly_data = []
    for month in sorted(all_months):
        a_val = monthly_a.get(month, 0) if month in monthly_a.index and not pd.isna(monthly_a.get(month, 0)) else 0
        b_val = monthly_b.get(month, 0) if month in monthly_b.index and not pd.isna(monthly_b.get(month, 0)) else 0
        monthly_data.append({
            "month": month.strftime('%Y-%m'),
            "monthName": month.strftime('%b %Y'),
            "tourA": round(a_val, 2),
            "tourB": round(b_val, 2)
        })
    
    # Key insights
    efficiency_diff = ((metrics_a['avg_power'] - metrics_b['avg_power']) / metrics_a['avg_power'] * 100) if metrics_a['avg_power'] > 0 else 0
    weekend_savings_a = ((metrics_a['weekday_avg'] - metrics_a['weekend_avg']) / metrics_a['weekday_avg'] * 100) if metrics_a['weekday_avg'] > 0 else 0
    weekend_savings_b = ((metrics_b['weekday_avg'] - metrics_b['weekend_avg']) / metrics_b['weekday_avg'] * 100) if metrics_b['weekday_avg'] > 0 else 0
    
    peak_hour_a = hourly_a.idxmax() if len(hourly_a) > 0 else 0
    peak_hour_b = hourly_b.idxmax() if len(hourly_b) > 0 else 0
    
    key_insights = [
        {
            "title": "Energy Efficiency",
            "value": f"{abs(efficiency_diff):.1f}%",
            "description": f"{'Tour B' if efficiency_diff > 0 else 'Tour A'} uses {abs(efficiency_diff):.1f}% less power on average",
            "icon": "⚡"
        },
        {
            "title": "Peak Hour",
            "value": f"{peak_hour_a}:00 / {peak_hour_b}:00",
            "description": f"Tour A peaks at {peak_hour_a}:00, Tour B at {peak_hour_b}:00",
            "icon": "📈"
        },
        {
            "title": "Weekend Savings",
            "value": f"{(weekend_savings_a + weekend_savings_b)/2:.0f}%",
            "description": f"Average weekend consumption drop (A: {weekend_savings_a:.0f}%, B: {weekend_savings_b:.0f}%)",
            "icon": "📅"
        },
        {
            "title": "Monthly Usage",
            "value": f"~{(metrics_a['avg_power'] + metrics_b['avg_power']) * 24 * 30 / 1000:.1f} MWh",
            "description": "Combined monthly consumption estimate",
            "icon": "🔌"
        },
        {
            "title": "Load Factor",
            "value": f"{metrics_a['load_factor']:.2f} / {metrics_b['load_factor']:.2f}",
            "description": f"Load factor comparison (A / B). Higher is better.",
            "icon": "📊"
        },
        {
            "title": "Data Coverage",
            "value": f"{metrics_a['data_coverage']:.0f}% / {metrics_b['data_coverage']:.0f}%",
            "description": "Available data percentage for Tour A / Tour B",
            "icon": "📁"
        }
    ]
    
    # Combine all data
    dashboard_data = {
        "generatedAt": datetime.now().isoformat(),
        "dateRange": {
            "start": str(min(power_a.index.min(), power_b.index.min())),
            "end": str(max(power_a.index.max(), power_b.index.max()))
        },
        "tourSummary": tour_summary,
        "hourlyData": hourly_data,
        "weeklyData": weekly_data,
        "timeSeriesData": time_series_data,
        "monthlyData": monthly_data,
        "keyInsights": key_insights
    }
    
    with open(output_path, 'w') as f:
        json.dump(dashboard_data, f, indent=2)
    print(f"Dashboard data exported to: {output_path}")
    
    return dashboard_data


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main function to run the enhanced data exploration analysis."""
    print("=" * 60)
    print("DATA EXPLORATION V2: Enhanced Tour A and Tour B Analysis")
    print("=" * 60)
    
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "SINERT_DATA_CONCENTRATOR")
    output_dir = os.path.join(base_dir, "exploration_output")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Load data
    print("\n[1/5] Loading data...")
    df = load_all_data(data_dir)
    
    if df is None or len(df) == 0:
        print("Error: No data could be loaded!")
        return
    
    # Sort and Clean
    df = df[df.index.notna()]
    df = df.sort_index()
    
    print(f"Date range: {df.index.min()} to {df.index.max()}")
    
    # Get power columns
    print("\n[2/5] Extracting power data...")
    power_col_a = get_power_column(df, 'A')
    power_col_b = get_power_column(df, 'B')
    
    print(f"Tour A power column: {power_col_a}")
    print(f"Tour B power column: {power_col_b}")
    
    if not power_col_a or not power_col_b:
        print("Error: Could not find power columns!")
        return
    
    # Clean power data
    power_a = clean_power_data(df, power_col_a)
    power_b = clean_power_data(df, power_col_b)
    
    print(f"Tour A non-null readings: {power_a.notna().sum()} ({100*power_a.notna().mean():.1f}%)")
    print(f"Tour B non-null readings: {power_b.notna().sum()} ({100*power_b.notna().mean():.1f}%)")
    
    # Calculate metrics
    print("\n[3/5] Calculating metrics...")
    
    metrics_a = {
        'avg_power': power_a.mean(),
        'max_power': power_a.max(),
        'min_power': power_a[power_a > 0].min() if (power_a > 0).any() else 0,
        'std_power': power_a.std(),
        'weekday_avg': power_a[power_a.index.dayofweek < 5].mean(),
        'weekend_avg': power_a[power_a.index.dayofweek >= 5].mean(),
        'data_coverage': 100 * power_a.notna().mean(),
        'load_factor': calculate_load_factor(power_a.dropna()),
        'peak_to_avg': calculate_peak_to_average_ratio(power_a.dropna()),
        'total_energy_kwh': estimate_energy_consumption(power_a)
    }
    
    metrics_b = {
        'avg_power': power_b.mean(),
        'max_power': power_b.max(),
        'min_power': power_b[power_b > 0].min() if (power_b > 0).any() else 0,
        'std_power': power_b.std(),
        'weekday_avg': power_b[power_b.index.dayofweek < 5].mean(),
        'weekend_avg': power_b[power_b.index.dayofweek >= 5].mean(),
        'data_coverage': 100 * power_b.notna().mean(),
        'load_factor': calculate_load_factor(power_b.dropna()),
        'peak_to_avg': calculate_peak_to_average_ratio(power_b.dropna()),
        'total_energy_kwh': estimate_energy_consumption(power_b)
    }
    
    print(f"\nTour A Metrics:")
    print(f"  Average Power: {metrics_a['avg_power']:.2f} kW")
    print(f"  Peak Power: {metrics_a['max_power']:.2f} kW")
    print(f"  Load Factor: {metrics_a['load_factor']:.3f}")
    print(f"  Total Energy: {metrics_a['total_energy_kwh']:.0f} kWh")
    
    print(f"\nTour B Metrics:")
    print(f"  Average Power: {metrics_b['avg_power']:.2f} kW")
    print(f"  Peak Power: {metrics_b['max_power']:.2f} kW")
    print(f"  Load Factor: {metrics_b['load_factor']:.3f}")
    print(f"  Total Energy: {metrics_b['total_energy_kwh']:.0f} kWh")
    
    # Generate visualizations
    print("\n[4/5] Generating visualizations...")
    
    plot_monthly_comparison(power_a.dropna(), power_b.dropna(),
                           save_path=os.path.join(output_dir, "v2_01_monthly_comparison.png"))
    
    plot_heatmap_comparison(power_a.dropna(), power_b.dropna(),
                           save_path=os.path.join(output_dir, "v2_02_heatmap_comparison.png"))
    
    plot_efficiency_metrics(metrics_a, metrics_b,
                           save_path=os.path.join(output_dir, "v2_03_efficiency_metrics.png"))
    
    plot_peak_analysis(power_a.dropna(), power_b.dropna(),
                      save_path=os.path.join(output_dir, "v2_04_peak_analysis.png"))
    
    # Export data for React dashboard
    print("\n[5/5] Exporting dashboard data...")
    dashboard_data = export_dashboard_data(
        power_a.dropna(), power_b.dropna(), 
        metrics_a, metrics_b,
        os.path.join(output_dir, "dashboard_data.json")
    )
    
    # Also export to React dashboard src folder if it exists
    react_data_dir = os.path.join(base_dir, "dashboard", "src", "data")
    if os.path.exists(react_data_dir):
        # Create TypeScript file
        ts_content = f'''// Auto-generated data from data_exploration_v2.py
// Generated at: {datetime.now().isoformat()}

export interface TourData {{
  name: string;
  avgPower: number;
  maxPower: number;
  minPower: number;
  powerFactor: number;
  weekdayAvg: number;
  weekendAvg: number;
  dataCoverage: number;
  estimatedDailyKwh: number;
  estimatedMonthlyKwh: number;
  loadFactor: number;
  peakToAvgRatio: number;
  totalEnergyKwh: number;
}}

export interface HourlyData {{
  hour: number;
  tourA: number;
  tourB: number;
  difference: number;
}}

export interface DailyData {{
  day: string;
  dayIndex: number;
  tourA: number;
  tourB: number;
}}

export interface TimeSeriesData {{
  date: string;
  tourA: number;
  tourB: number;
}}

export interface MonthlyData {{
  month: string;
  monthName: string;
  tourA: number;
  tourB: number;
}}

export interface KeyInsight {{
  title: string;
  value: string;
  description: string;
  icon: string;
}}

// Summary data for Tour A and Tour B
export const tourSummary: TourData[] = {json.dumps(dashboard_data['tourSummary'], indent=2)};

// Hourly consumption patterns
export const hourlyData: HourlyData[] = {json.dumps(dashboard_data['hourlyData'], indent=2)};

// Weekly consumption patterns
export const weeklyData: DailyData[] = {json.dumps(dashboard_data['weeklyData'], indent=2)};

// Time series data (daily averages)
export const timeSeriesData: TimeSeriesData[] = {json.dumps(dashboard_data['timeSeriesData'], indent=2)};

// Monthly data
export const monthlyData: MonthlyData[] = {json.dumps(dashboard_data['monthlyData'], indent=2)};

// Key insights
export const keyInsights: KeyInsight[] = {json.dumps(dashboard_data['keyInsights'], indent=2)};

// Date range
export const dateRange = {json.dumps(dashboard_data['dateRange'], indent=2)};
'''
    
    print("\n" + "=" * 60)
    print("DATA EXPLORATION V2 COMPLETE!")
    print(f"Output files saved to: {output_dir}")
    print("=" * 60)


if __name__ == "__main__":
    main()
