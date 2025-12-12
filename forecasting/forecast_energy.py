"""
Energy Consumption Forecasting Script
Main script to run all forecasting models on Tour A and Tour B data
"""

import os
import sys
import pandas as pd
import numpy as np
import warnings
from datetime import timedelta

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_loader import load_tour_data, prepare_forecasting_data
from models import (
    LSTMForecaster, ProphetForecaster, ElasticNetForecaster,
    ExponentialSmoothingForecaster, RandomForestForecaster,
    prepare_sequences, calculate_metrics
)

warnings.filterwarnings('ignore')


# ============================================================================
# CONFIGURATION
# ============================================================================

# Test percentage: 0.05 for testing (5% of data), 1.0 for full dataset
TEST_PERCENTAGE = 0.05

# Train-test split ratio
TRAIN_RATIO = 0.6

# Forecasting scenarios
# Note: When TEST_PERCENTAGE is small (e.g., 0.05), use smaller scenarios
# When TEST_PERCENTAGE is 1.0, these will use the full lookback/forecast periods
def get_scenarios(test_percentage):
    """Get scenarios adjusted for test percentage."""
    if test_percentage < 0.1:
        # For testing with small dataset, use much smaller windows
        # 96 intervals per day (15-min intervals)
        return [
            {
                'name': '1 week after 3 weeks (test mode)',
                'lookback_weeks': 0.14,  # ~1 day for testing
                'forecast_weeks': 0.07,  # ~12 hours for testing
                'lookback_steps': 96,  # 1 day
                'forecast_steps': 48   # 12 hours
            },
            {
                'name': '1 month after 3 months (test mode)',
                'lookback_weeks': 0.29,  # ~2 days for testing
                'forecast_weeks': 0.14,  # ~1 day for testing
                'lookback_steps': 192,  # 2 days
                'forecast_steps': 96    # 1 day
            }
        ]
    else:
        # For full dataset, use actual time periods
        return [
            {
                'name': '1 week after 3 weeks',
                'lookback_weeks': 3,
                'forecast_weeks': 1,
                'lookback_steps': 3 * 7 * 96,  # 3 weeks * 7 days * 96 (15-min intervals per day)
                'forecast_steps': 1 * 7 * 96   # 1 week
            },
            {
                'name': '1 month after 3 months',
                'lookback_weeks': 12,  # ~3 months
                'forecast_weeks': 4,   # ~1 month
                'lookback_steps': 12 * 7 * 96,  # 12 weeks
                'forecast_steps': 4 * 7 * 96    # 4 weeks
            }
        ]

SCENARIOS = get_scenarios(TEST_PERCENTAGE)


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def split_train_test(data, train_ratio=0.6):
    """Split data into train and test sets."""
    split_idx = int(len(data) * train_ratio)
    train = data[:split_idx]
    test = data[split_idx:]
    return train, test


def run_lstm_forecast(X_train, y_train, X_test, y_test, scenario_name):
    """Run LSTM forecasting."""
    print(f"\n  Running LSTM...")
    
    try:
        model = LSTMForecaster(
            lookback_steps=X_train.shape[1],
            forecast_steps=y_train.shape[1]
        )
        
        model.fit(X_train, y_train, epochs=30, batch_size=32, verbose=0)
        predictions = model.predict(X_test)
        
        # Calculate metrics
        metrics = calculate_metrics(y_test.flatten(), predictions.flatten())
        
        print(f"    MAE: {metrics['MAE']:.3f}, RMSE: {metrics['RMSE']:.3f}, "
              f"R2: {metrics['R2']:.3f}, MAPE: {metrics['MAPE']:.2f}%")
        
        return {
            'model': 'LSTM',
            'scenario': scenario_name,
            'predictions': predictions,
            'metrics': metrics
        }
    except Exception as e:
        print(f"    Error: {e}")
        return None


def run_prophet_forecast(train_data, test_data, train_dates, test_dates, forecast_steps, scenario_name):
    """Run Prophet forecasting."""
    print(f"\n  Running Prophet...")
    
    try:
        model = ProphetForecaster(
            lookback_steps=len(train_data),
            forecast_steps=forecast_steps
        )
        
        model.fit(train_data, train_dates)
        predictions = model.predict(test_dates[:forecast_steps])
        
        # Calculate metrics (only for the forecast period)
        y_test = test_data[:forecast_steps]
        metrics = calculate_metrics(y_test, predictions)
        
        print(f"    MAE: {metrics['MAE']:.3f}, RMSE: {metrics['RMSE']:.3f}, "
              f"R2: {metrics['R2']:.3f}, MAPE: {metrics['MAPE']:.2f}%")
        
        return {
            'model': 'Prophet',
            'scenario': scenario_name,
            'predictions': predictions,
            'metrics': metrics
        }
    except Exception as e:
        print(f"    Error: {e}")
        return None


def run_elasticnet_forecast(X_train, y_train, X_test, y_test, scenario_name):
    """Run ElasticNet forecasting."""
    print(f"\n  Running ElasticNet...")
    
    try:
        model = ElasticNetForecaster(
            lookback_steps=X_train.shape[1],
            forecast_steps=y_train.shape[1]
        )
        
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        
        # Calculate metrics
        metrics = calculate_metrics(y_test.flatten(), predictions.flatten())
        
        print(f"    MAE: {metrics['MAE']:.3f}, RMSE: {metrics['RMSE']:.3f}, "
              f"R2: {metrics['R2']:.3f}, MAPE: {metrics['MAPE']:.2f}%")
        
        return {
            'model': 'ElasticNet',
            'scenario': scenario_name,
            'predictions': predictions,
            'metrics': metrics
        }
    except Exception as e:
        print(f"    Error: {e}")
        return None


def run_exponential_smoothing_forecast(train_data, test_data, forecast_steps, scenario_name):
    """Run Exponential Smoothing forecasting."""
    print(f"\n  Running Exponential Smoothing...")
    
    try:
        model = ExponentialSmoothingForecaster(
            lookback_steps=len(train_data),
            forecast_steps=forecast_steps
        )
        
        model.fit(train_data)
        predictions = model.predict(forecast_steps)
        
        # Calculate metrics
        y_test = test_data[:forecast_steps]
        metrics = calculate_metrics(y_test, predictions)
        
        print(f"    MAE: {metrics['MAE']:.3f}, RMSE: {metrics['RMSE']:.3f}, "
              f"R2: {metrics['R2']:.3f}, MAPE: {metrics['MAPE']:.2f}%")
        
        return {
            'model': 'Exponential Smoothing',
            'scenario': scenario_name,
            'predictions': predictions,
            'metrics': metrics
        }
    except Exception as e:
        print(f"    Error: {e}")
        return None


def run_random_forest_forecast(X_train, y_train, X_test, y_test, scenario_name):
    """Run Random Forest forecasting."""
    print(f"\n  Running Random Forest...")
    
    try:
        model = RandomForestForecaster(
            lookback_steps=X_train.shape[1],
            forecast_steps=y_train.shape[1]
        )
        
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        
        # Calculate metrics
        metrics = calculate_metrics(y_test.flatten(), predictions.flatten())
        
        print(f"    MAE: {metrics['MAE']:.3f}, RMSE: {metrics['RMSE']:.3f}, "
              f"R2: {metrics['R2']:.3f}, MAPE: {metrics['MAPE']:.2f}%")
        
        return {
            'model': 'Random Forest',
            'scenario': scenario_name,
            'predictions': predictions,
            'metrics': metrics
        }
    except Exception as e:
        print(f"    Error: {e}")
        return None


def forecast_tour(tour, data_dir, test_percentage, scenarios):
    """Run all forecasting models for a specific tour."""
    print(f"\n{'='*70}")
    print(f"FORECASTING FOR TOUR {tour}")
    print(f"{'='*70}")
    
    # Load data
    data = load_tour_data(data_dir, tour=tour, test_percentage=test_percentage)
    
    # Prepare data
    data = prepare_forecasting_data(data, freq='15min')
    
    # Extract power values
    power_values = data['power'].values
    dates = data.index
    
    # Split into train and test
    train_data, test_data = split_train_test(power_values, TRAIN_RATIO)
    train_dates, test_dates = split_train_test(dates, TRAIN_RATIO)
    
    print(f"\nTrain set: {len(train_data)} samples")
    print(f"Test set: {len(test_data)} samples")
    
    results = []
    
    # Run forecasting for each scenario
    for scenario in scenarios:
        print(f"\n{'-'*70}")
        print(f"SCENARIO: {scenario['name']}")
        print(f"Lookback: {scenario['lookback_weeks']} weeks, "
              f"Forecast: {scenario['forecast_weeks']} weeks")
        print(f"{'-'*70}")
        
        lookback_steps = scenario['lookback_steps']
        forecast_steps = scenario['forecast_steps']
        
        # Check if we have enough data
        if len(train_data) < lookback_steps + forecast_steps:
            print(f"\n  ⚠️  Not enough data for this scenario. Skipping...")
            continue
        
        # Prepare sequences
        X_train, y_train = prepare_sequences(train_data, lookback_steps, forecast_steps)
        X_test, y_test = prepare_sequences(test_data, lookback_steps, forecast_steps)
        
        print(f"\nSequences prepared:")
        print(f"  X_train shape: {X_train.shape}, y_train shape: {y_train.shape}")
        print(f"  X_test shape: {X_test.shape}, y_test shape: {y_test.shape}")
        
        # Run each model
        
        # 1. LSTM
        result = run_lstm_forecast(X_train, y_train, X_test, y_test, scenario['name'])
        if result:
            results.append(result)
        
        # 2. Prophet
        result = run_prophet_forecast(
            train_data, test_data, train_dates, test_dates,
            forecast_steps, scenario['name']
        )
        if result:
            results.append(result)
        
        # 3. ElasticNet
        result = run_elasticnet_forecast(X_train, y_train, X_test, y_test, scenario['name'])
        if result:
            results.append(result)
        
        # 4. Exponential Smoothing
        result = run_exponential_smoothing_forecast(
            train_data, test_data, forecast_steps, scenario['name']
        )
        if result:
            results.append(result)
        
        # 5. Random Forest
        result = run_random_forest_forecast(X_train, y_train, X_test, y_test, scenario['name'])
        if result:
            results.append(result)
    
    return results


def print_summary(results_a, results_b):
    """Print summary of all results."""
    print(f"\n{'='*70}")
    print("SUMMARY OF RESULTS")
    print(f"{'='*70}")
    
    for tour, results in [('A', results_a), ('B', results_b)]:
        print(f"\n{'*'*70}")
        print(f"TOUR {tour}")
        print(f"{'*'*70}")
        
        if not results:
            print("  No results available.")
            continue
        
        # Group by scenario
        scenarios = {}
        for result in results:
            scenario = result['scenario']
            if scenario not in scenarios:
                scenarios[scenario] = []
            scenarios[scenario].append(result)
        
        # Print results for each scenario
        for scenario, scenario_results in scenarios.items():
            print(f"\n  Scenario: {scenario}")
            print(f"  {'-'*66}")
            
            # Sort by RMSE
            scenario_results = sorted(scenario_results, key=lambda x: x['metrics']['RMSE'])
            
            for result in scenario_results:
                metrics = result['metrics']
                print(f"    {result['model']:25s} | "
                      f"MAE: {metrics['MAE']:6.3f} | "
                      f"RMSE: {metrics['RMSE']:6.3f} | "
                      f"R2: {metrics['R2']:6.3f} | "
                      f"MAPE: {metrics['MAPE']:6.2f}%")
            
            # Identify best model
            best = scenario_results[0]
            print(f"\n    ✓ Best model: {best['model']} (RMSE: {best['metrics']['RMSE']:.3f})")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main function to run energy consumption forecasting."""
    print("="*70)
    print("ENERGY CONSUMPTION FORECASTING")
    print("="*70)
    print(f"\nConfiguration:")
    print(f"  Test percentage: {TEST_PERCENTAGE*100}%")
    print(f"  Train-test split: {TRAIN_RATIO*100}%-{(1-TRAIN_RATIO)*100}%")
    print(f"  Models: LSTM, Prophet, ElasticNet, Exponential Smoothing, Random Forest")
    
    # Get scenarios based on test percentage
    scenarios = get_scenarios(TEST_PERCENTAGE)
    
    print(f"\nScenarios:")
    for i, scenario in enumerate(scenarios, 1):
        print(f"  {i}. {scenario['name']}")
        if TEST_PERCENTAGE < 0.1:
            print(f"      (Scaled for testing: {scenario['lookback_weeks']} weeks lookback, "
                  f"{scenario['forecast_weeks']} weeks forecast)")
    
    # Define paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "SINERT_DATA_CONCENTRATOR")
    
    # Check if data directory exists
    if not os.path.exists(data_dir):
        print(f"\nError: Data directory not found: {data_dir}")
        return
    
    # Forecast for Tour A
    results_a = forecast_tour('A', data_dir, TEST_PERCENTAGE, scenarios)
    
    # Forecast for Tour B
    results_b = forecast_tour('B', data_dir, TEST_PERCENTAGE, scenarios)
    
    # Print summary
    print_summary(results_a, results_b)
    
    print(f"\n{'='*70}")
    print("FORECASTING COMPLETE!")
    print(f"{'='*70}")
    print(f"\nTo use full dataset, change TEST_PERCENTAGE to 1.0 in the script.")


if __name__ == "__main__":
    main()
