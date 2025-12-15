"""
Example script showing how to use the forecasting module
This is a simplified example for quick testing
"""

import os
import sys

# Add forecasting module to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_loader import load_tour_data, prepare_forecasting_data
from models import ExtraTreesForecaster, prepare_sequences, calculate_metrics

def simple_forecast_example():
    """
    Simple example of using the forecasting module.
    This uses only Extra Trees for quick testing.
    """
    print("="*60)
    print("SIMPLE FORECASTING EXAMPLE")
    print("="*60)
    
    # Configuration
    TEST_PERCENTAGE = 0.05  # Use 5% of data for testing
    TOUR = 'B'  # Choose Tour A or B
    
    # Define paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "SINERT_DATA_CONCENTRATOR")
    
    print(f"\nLoading Tour {TOUR} data ({TEST_PERCENTAGE*100}% of dataset)...")
    
    # Load data
    try:
        data = load_tour_data(data_dir, tour=TOUR, test_percentage=TEST_PERCENTAGE)
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    # Prepare data
    data = prepare_forecasting_data(data, freq='15min')
    power_values = data['power'].values
    
    print(f"Loaded {len(power_values)} samples")
    print(f"Power range: {power_values.min():.2f} - {power_values.max():.2f} kW")
    
    # Split train/test (60-40)
    split_idx = int(len(power_values) * 0.6)
    train_data = power_values[:split_idx]
    test_data = power_values[split_idx:]
    
    print(f"\nTrain samples: {len(train_data)}")
    print(f"Test samples: {len(test_data)}")
    
    # Create sequences (1 day lookback, 12 hours forecast)
    lookback_steps = 96  # 1 day (96 * 15min = 24 hours)
    forecast_steps = 48  # 12 hours (48 * 15min = 12 hours)
    
    print(f"\nCreating sequences:")
    print(f"  Lookback: {lookback_steps} steps (1 day)")
    print(f"  Forecast: {forecast_steps} steps (12 hours)")
    
    X_train, y_train = prepare_sequences(train_data, lookback_steps, forecast_steps)
    X_test, y_test = prepare_sequences(test_data, lookback_steps, forecast_steps)
    
    print(f"\nSequence shapes:")
    print(f"  X_train: {X_train.shape}")
    print(f"  y_train: {y_train.shape}")
    print(f"  X_test: {X_test.shape}")
    print(f"  y_test: {y_test.shape}")
    
    if len(X_test) == 0:
        print("\n⚠️  Not enough test data. Try increasing TEST_PERCENTAGE.")
        return
    
    # Train Extra Trees model
    print("\nTraining Extra Trees model...")
    model = ExtraTreesForecaster(lookback_steps, forecast_steps)
    model.fit(X_train, y_train)
    
    # Make predictions
    print("Making predictions...")
    predictions = model.predict(X_test)
    
    # Calculate metrics
    metrics = calculate_metrics(y_test.flatten(), predictions.flatten())
    
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    print(f"Mean Absolute Error (MAE): {metrics['MAE']:.3f} kW")
    print(f"Root Mean Squared Error (RMSE): {metrics['RMSE']:.3f} kW")
    print(f"R² Score: {metrics['R2']:.3f}")
    print(f"Mean Absolute Percentage Error (MAPE): {metrics['MAPE']:.2f}%")
    
    print("\n" + "="*60)
    print("Example completed successfully!")
    print("="*60)
    print("\nTo run all models, use: python forecast_energy.py")
    print("To use full dataset, change TEST_PERCENTAGE to 1.0")


if __name__ == "__main__":
    simple_forecast_example()
