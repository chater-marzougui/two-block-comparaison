"""
Energy Consumption Forecasting Script
Main script to run all forecasting models on Tour A and Tour B data
"""

import os
import sys
import warnings
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import numpy as np
import pandas as pd
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_loader import load_tour_data, prepare_forecasting_data
from models import (
    LSTMForecaster, ProphetForecaster, ElasticNetForecaster,
    ExponentialSmoothingForecaster, ExtraTreesForecaster,
    prepare_sequences, calculate_metrics
)

warnings.filterwarnings('ignore')


# ============================================================================
# CONFIGURATION
# ============================================================================

# Test percentage: 0.05 for testing (5% of data), 1.0 for full dataset
TEST_PERCENTAGE = 1

# Train-test split ratio
TRAIN_RATIO = 0.6

# Forecasting scenarios
# Note: When TEST_PERCENTAGE is small (e.g., 0.05), use smaller scenarios
# When TEST_PERCENTAGE is 1.0, these will use the full lookback/forecast periods
def get_scenarios(test_percentage):
    """Get scenarios adjusted for test percentage."""
    if test_percentage < 0.1:
        # For testing with small dataset, use much smaller windows
        # Daily time steps (1 value per day)
        return [
            {
                'name': '3 days after 7 days (test mode)',
                'lookback_weeks': 1,
                'forecast_weeks': 0.43,  # ~3 days
                'lookback_steps': 7,  # 7 days
                'forecast_steps': 3   # 3 days
            },
            {
                'name': '1 week after 2 weeks (test mode)',
                'lookback_weeks': 2,
                'forecast_weeks': 1,
                'lookback_steps': 14,  # 2 weeks = 14 days
                'forecast_steps': 7    # 1 week = 7 days
            }
        ]
    else:
        # For full dataset, use actual time periods with daily aggregation
        return [
            {
                'name': '1 week after 3 weeks',
                'lookback_weeks': 3,
                'forecast_weeks': 1,
                'lookback_steps': 21,  # 3 weeks = 21 days
                'forecast_steps': 7    # 1 week = 7 days
            },
            {
                'name': '1 month after 3 months',
                'lookback_weeks': 12,  # ~3 months
                'forecast_weeks': 4,   # ~1 month
                'lookback_steps': 90,  # ~3 months = 90 days
                'forecast_steps': 30   # ~1 month = 30 days
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


def run_lstm_forecast(X_train, y_train, X_test, y_test, scenario_name, model_path=None):
    """Run LSTM forecasting."""
    print(f"\n  Running LSTM...")
    
    try:
        # Try to load existing model
        if model_path and os.path.exists(model_path):
            print(f"    Loading saved model...")
            model = LSTMForecaster.load(model_path)
        else:
            model = LSTMForecaster(
                lookback_steps=X_train.shape[1],
                forecast_steps=y_train.shape[1]
            )
            
            model.fit(X_train, y_train, epochs=30, batch_size=32, verbose=0)
            
            # Save model
            if model_path:
                model.save(model_path)
                print(f"    Model saved to {model_path}")
        
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


def run_elasticnet_forecast(X_train, y_train, X_test, y_test, scenario_name, model_path=None):
    """Run ElasticNet forecasting."""
    print(f"\n  Running ElasticNet...")
    
    try:
        # Try to load existing model
        if model_path and os.path.exists(model_path):
            print(f"    Loading saved model...")
            model = ElasticNetForecaster.load(model_path)
        else:
            model = ElasticNetForecaster(
                lookback_steps=X_train.shape[1],
                forecast_steps=y_train.shape[1]
            )
            
            model.fit(X_train, y_train)
            
            # Save model
            if model_path:
                model.save(model_path)
                print(f"    Model saved to {model_path}")
        
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


def run_extra_trees_forecast(X_train, y_train, X_test, y_test, scenario_name, model_path=None):
    """Run Extra Trees forecasting."""
    print(f"\n  Running Extra Trees...")
    
    try:
        # Try to load existing model
        if model_path and os.path.exists(model_path):
            print(f"    Loading saved model...")
            model = ExtraTreesForecaster.load(model_path)
        else:
            model = ExtraTreesForecaster(
                lookback_steps=X_train.shape[1],
                forecast_steps=y_train.shape[1]
            )
            
            model.fit(X_train, y_train)
            
            # Save model
            if model_path:
                model.save(model_path)
                print(f"    Model saved to {model_path}")
        
        predictions = model.predict(X_test)
        
        # Calculate metrics
        metrics = calculate_metrics(y_test.flatten(), predictions.flatten())
        
        print(f"    MAE: {metrics['MAE']:.3f}, RMSE: {metrics['RMSE']:.3f}, "
              f"R2: {metrics['R2']:.3f}, MAPE: {metrics['MAPE']:.2f}%")
        
        return {
            'model': 'Extra Trees',
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
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_dir = os.path.join(base_dir, 'saved_models', f'tour_{tour}', scenario['name'].replace(' ', '_'))
        
        # 1. LSTM
        lstm_path = os.path.join(model_dir, 'lstm.pkl')
        result = run_lstm_forecast(X_train, y_train, X_test, y_test, scenario['name'], lstm_path)
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
        elasticnet_path = os.path.join(model_dir, 'elasticnet.pkl')
        result = run_elasticnet_forecast(X_train, y_train, X_test, y_test, scenario['name'], elasticnet_path)
        if result:
            results.append(result)
        
        # 4. Exponential Smoothing
        result = run_exponential_smoothing_forecast(
            train_data, test_data, forecast_steps, scenario['name']
        )
        if result:
            results.append(result)
        
        # 5. Extra Trees
        et_path = os.path.join(model_dir, 'extra_trees.pkl')
        result = run_extra_trees_forecast(X_train, y_train, X_test, y_test, scenario['name'], et_path)
        if result:
            results.append(result)
    
    return results


def save_metrics_images(results, tour, output_dir='saved_models'):
    """Save model metrics as images."""
    if not results:
        print(f"  No results to save for Tour {tour}")
        return
    
    # Create output directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    img_dir = os.path.join(base_dir, output_dir, f'tour_{tour}', 'metrics_images')
    os.makedirs(img_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Group by scenario
    scenarios = {}
    for result in results:
        scenario = result['scenario']
        if scenario not in scenarios:
            scenarios[scenario] = []
        scenarios[scenario].append(result)
    
    # Create visualizations for each scenario
    for scenario, scenario_results in scenarios.items():
        scenario_name = scenario.replace(' ', '_').replace('/', '_')
        
        # Extract data
        models = [r['model'] for r in scenario_results]
        mae_values = [r['metrics']['MAE'] for r in scenario_results]
        rmse_values = [r['metrics']['RMSE'] for r in scenario_results]
        r2_values = [r['metrics']['R2'] for r in scenario_results]
        mape_values = [r['metrics']['MAPE'] if not np.isnan(r['metrics']['MAPE']) else 0 for r in scenario_results]
        
        # 1. Metrics Comparison Bar Chart
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle(f'Tour {tour} - {scenario}\nModel Performance Comparison', fontsize=16, fontweight='bold')
        
        # MAE
        axes[0, 0].bar(models, mae_values, color='steelblue')
        axes[0, 0].set_title('Mean Absolute Error (MAE)', fontweight='bold')
        axes[0, 0].set_ylabel('MAE')
        axes[0, 0].tick_params(axis='x', rotation=45)
        for i, v in enumerate(mae_values):
            axes[0, 0].text(i, v, f'{v:.2f}', ha='center', va='bottom')
        
        # RMSE
        axes[0, 1].bar(models, rmse_values, color='coral')
        axes[0, 1].set_title('Root Mean Squared Error (RMSE)', fontweight='bold')
        axes[0, 1].set_ylabel('RMSE')
        axes[0, 1].tick_params(axis='x', rotation=45)
        for i, v in enumerate(rmse_values):
            axes[0, 1].text(i, v, f'{v:.2f}', ha='center', va='bottom')
        
        # R2 Score
        axes[1, 0].bar(models, r2_values, color='mediumseagreen')
        axes[1, 0].set_title('R² Score', fontweight='bold')
        axes[1, 0].set_ylabel('R²')
        axes[1, 0].tick_params(axis='x', rotation=45)
        axes[1, 0].axhline(y=0, color='gray', linestyle='--', linewidth=0.5)
        for i, v in enumerate(r2_values):
            axes[1, 0].text(i, v, f'{v:.3f}', ha='center', va='bottom' if v > 0 else 'top')
        
        # MAPE
        axes[1, 1].bar(models, mape_values, color='mediumpurple')
        axes[1, 1].set_title('Mean Absolute Percentage Error (MAPE)', fontweight='bold')
        axes[1, 1].set_ylabel('MAPE (%)')
        axes[1, 1].tick_params(axis='x', rotation=45)
        for i, v in enumerate(mape_values):
            axes[1, 1].text(i, v, f'{v:.2f}%', ha='center', va='bottom')
        
        plt.tight_layout()
        img_path = os.path.join(img_dir, f'{scenario_name}_metrics_comparison_{timestamp}.png')
        plt.savefig(img_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"  ✓ Saved: {img_path}")
        
        # 2. Ranked Performance Chart
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Sort by RMSE (lower is better)
        sorted_results = sorted(scenario_results, key=lambda x: x['metrics']['RMSE'])
        sorted_models = [r['model'] for r in sorted_results]
        sorted_rmse = [r['metrics']['RMSE'] for r in sorted_results]
        
        colors = plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, len(sorted_models)))
        bars = ax.barh(sorted_models, sorted_rmse, color=colors)
        
        ax.set_xlabel('RMSE', fontweight='bold')
        ax.set_title(f'Tour {tour} - {scenario}\nModel Ranking by RMSE (Lower is Better)', 
                     fontsize=14, fontweight='bold')
        ax.invert_yaxis()
        
        for i, (model, rmse) in enumerate(zip(sorted_models, sorted_rmse)):
            ax.text(rmse, i, f'  {rmse:.2f}', va='center', fontweight='bold')
        
        plt.tight_layout()
        img_path = os.path.join(img_dir, f'{scenario_name}_ranking_{timestamp}.png')
        plt.savefig(img_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"  ✓ Saved: {img_path}")
        
        # 3. Metrics Table Image
        fig, ax = plt.subplots(figsize=(14, len(scenario_results) * 0.6 + 2))
        ax.axis('tight')
        ax.axis('off')
        
        # Prepare table data
        table_data = []
        for r in sorted(scenario_results, key=lambda x: x['metrics']['RMSE']):
            table_data.append([
                r['model'],
                f"{r['metrics']['MAE']:.3f}",
                f"{r['metrics']['RMSE']:.3f}",
                f"{r['metrics']['R2']:.3f}",
                f"{r['metrics']['MAPE']:.2f}%" if not np.isnan(r['metrics']['MAPE']) else 'N/A'
            ])
        
        # Add header
        col_labels = ['Model', 'MAE', 'RMSE', 'R²', 'MAPE']
        table = ax.table(cellText=table_data, colLabels=col_labels,
                        cellLoc='center', loc='center',
                        colWidths=[0.25, 0.15, 0.15, 0.15, 0.15])
        
        table.auto_set_font_size(False)
        table.set_fontsize(10)
        table.scale(1, 2)
        
        # Style header
        for i in range(len(col_labels)):
            table[(0, i)].set_facecolor('#4472C4')
            table[(0, i)].set_text_props(weight='bold', color='white')
        
        # Style rows (alternate colors)
        for i in range(len(table_data)):
            color = '#E7E6E6' if i % 2 == 0 else 'white'
            for j in range(len(col_labels)):
                table[(i + 1, j)].set_facecolor(color)
        
        # Highlight best model (first row)
        if len(table_data) > 0:
            for j in range(len(col_labels)):
                table[(1, j)].set_facecolor('#C6E0B4')
                table[(1, j)].set_text_props(weight='bold')
        
        plt.title(f'Tour {tour} - {scenario}\nModel Performance Metrics (Sorted by RMSE)',
                 fontsize=14, fontweight='bold', pad=20)
        
        img_path = os.path.join(img_dir, f'{scenario_name}_metrics_table_{timestamp}.png')
        plt.savefig(img_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"  ✓ Saved: {img_path}")


def save_comparison_image(results_a, results_b, output_dir='saved_models'):
    """Save tour comparison as image."""
    if not results_a and not results_b:
        return
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    img_dir = os.path.join(base_dir, output_dir, 'comparison_images')
    os.makedirs(img_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Group by model and scenario
    all_results = []
    for tour, results in [('A', results_a), ('B', results_b)]:
        for r in results:
            all_results.append({
                'Tour': f'Tour {tour}',
                'Model': r['model'],
                'Scenario': r['scenario'],
                'MAE': r['metrics']['MAE'],
                'RMSE': r['metrics']['RMSE'],
                'R2': r['metrics']['R2'],
                'MAPE': r['metrics']['MAPE'] if not np.isnan(r['metrics']['MAPE']) else 0
            })
    
    if not all_results:
        return
    
    df = pd.DataFrame(all_results)
    
    # Get unique scenarios
    scenarios = df['Scenario'].unique()
    
    for scenario in scenarios:
        scenario_df = df[df['Scenario'] == scenario]
        scenario_name = scenario.replace(' ', '_').replace('/', '_')
        
        # Create comparison chart
        fig, axes = plt.subplots(2, 2, figsize=(16, 10))
        fig.suptitle(f'Tour A vs Tour B - {scenario}\nModel Performance Comparison', 
                    fontsize=16, fontweight='bold')
        
        metrics = ['MAE', 'RMSE', 'R2', 'MAPE']
        metric_titles = ['Mean Absolute Error', 'Root Mean Squared Error', 'R² Score', 'MAPE (%)']
        colors = ['steelblue', 'coral', 'mediumseagreen', 'mediumpurple']
        
        for idx, (metric, title, color) in enumerate(zip(metrics, metric_titles, colors)):
            ax = axes[idx // 2, idx % 2]
            
            # Pivot for grouped bar chart
            pivot = scenario_df.pivot(index='Model', columns='Tour', values=metric)
            
            if not pivot.empty:
                pivot.plot(kind='bar', ax=ax, color=['#1f77b4', '#ff7f0e'], width=0.7)
                ax.set_title(title, fontweight='bold')
                ax.set_ylabel(metric)
                ax.set_xlabel('')
                ax.legend(title='', loc='best')
                ax.tick_params(axis='x', rotation=45)
                
                if metric == 'R2':
                    ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.5)
        
        plt.tight_layout()
        img_path = os.path.join(img_dir, f'tour_comparison_{scenario_name}_{timestamp}.png')
        plt.savefig(img_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"  ✓ Saved comparison: {img_path}")


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
    print(f"  Models: LSTM, Prophet, ElasticNet, Exponential Smoothing, Extra Trees")
    
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
    
    # Save metrics as images
    print(f"\n{'='*70}")
    print("SAVING METRICS IMAGES")
    print(f"{'='*70}")
    
    print("\nTour A:")
    save_metrics_images(results_a, 'A')
    
    print("\nTour B:")
    save_metrics_images(results_b, 'B')
    
    print("\nTour Comparison:")
    save_comparison_image(results_a, results_b)
    
    print(f"\n{'='*70}")
    print("FORECASTING COMPLETE!")
    print(f"{'='*70}")
    print(f"\nTo use full dataset, change TEST_PERCENTAGE to 1.0 in the script.")


if __name__ == "__main__":
    main()
