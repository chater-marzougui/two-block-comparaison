# Energy Consumption Forecasting

This module provides forecasting models for predicting energy consumption in Tour A and Tour B buildings.

## Overview

The forecasting module implements 5 different AI/ML models to predict energy consumption:

1. **LSTM (Long Short-Term Memory)** - Deep learning model for sequential data
2. **Prophet** - Facebook's time series forecasting tool
3. **ElasticNet** - Linear model with L1 and L2 regularization
4. **Exponential Smoothing** - Statistical time series method
5. **Random Forest** - Ensemble learning method

## Features

- **Two Forecasting Scenarios**:
  - Predict 1 week consumption after 3 weeks of historical data
  - Predict 1 month consumption after 3 months of historical data

- **60-40 Train-Test Split**: Data is split 60% for training and 40% for testing

- **Test Percentage Parameter**: Control dataset size for testing
  - Set to `0.05` (5%) for quick testing/validation
  - Set to `1.0` (100%) to use full dataset

## Installation

Install required dependencies:

```bash
cd forecasting
pip install -r requirements.txt
```

## Usage

### Basic Usage

Run forecasting with default settings (5% of data for testing):

```bash
python forecast_energy.py
```

### Using Full Dataset

To use the full dataset, edit `forecast_energy.py` and change:

```python
TEST_PERCENTAGE = 0.05  # Change this to 1.0
```

to:

```python
TEST_PERCENTAGE = 1.0
```

Then run:

```bash
python forecast_energy.py
```

## Configuration

The main configuration parameters in `forecast_energy.py`:

- `TEST_PERCENTAGE`: Fraction of data to use (0.05 = 5%, 1.0 = 100%)
- `TRAIN_RATIO`: Train-test split ratio (default: 0.6 = 60% train, 40% test)
- `SCENARIOS`: List of forecasting scenarios

## Output

The script outputs:

1. **Data Loading Information**: Number of samples, date range, power statistics
2. **Model Performance Metrics** for each model:
   - MAE (Mean Absolute Error)
   - RMSE (Root Mean Squared Error)
   - R² (Coefficient of Determination)
   - MAPE (Mean Absolute Percentage Error)
3. **Summary Table**: Comparison of all models ranked by RMSE
4. **Best Model**: Identification of the best performing model for each scenario

## Module Structure

```
forecasting/
├── README.md              # This file
├── requirements.txt       # Python dependencies
├── data_loader.py        # Data loading and preprocessing
├── models.py             # Forecasting model implementations
└── forecast_energy.py    # Main script to run forecasting
```

## Data Loading

The module loads data from the `SINERT_DATA_CONCENTRATOR` directory, similar to the data visualization scripts. It:

1. Finds all CSV/XLSX files in the data directory
2. Loads and combines them into a single dataset
3. Extracts power consumption data for Tour A and Tour B
4. Cleans and preprocesses the data
5. Resamples to consistent 15-minute intervals

## Models Details

### 1. LSTM (Long Short-Term Memory)
- 2-layer LSTM neural network with dropout
- Uses TensorFlow/Keras
- Best for capturing complex temporal patterns

### 2. Prophet
- Developed by Facebook for time series forecasting
- Handles seasonality and trends automatically
- Good for business/operational forecasting

### 3. ElasticNet
- Linear regression with L1 and L2 penalties
- Fast and interpretable
- Works well with stable patterns

### 4. Exponential Smoothing
- Classical statistical method
- Captures trend and seasonality
- Reliable baseline model

### 5. Random Forest
- Ensemble of decision trees
- Handles non-linear relationships
- Robust to outliers

## Performance Tips

- For faster testing, use `TEST_PERCENTAGE = 0.05`
- For accurate results, use `TEST_PERCENTAGE = 1.0`
- LSTM training can be slow on CPU; consider using GPU if available
- Prophet may take longer for large datasets

## Example Output

```
======================================================================
ENERGY CONSUMPTION FORECASTING
======================================================================

Configuration:
  Test percentage: 5.0%
  Train-test split: 60.0%-40.0%
  Models: LSTM, Prophet, ElasticNet, Exponential Smoothing, Random Forest

Scenarios:
  1. 1 week after 3 weeks
  2. 1 month after 3 months

======================================================================
FORECASTING FOR TOUR A
======================================================================
...

======================================================================
SUMMARY OF RESULTS
======================================================================

**********************************************************************
TOUR A
**********************************************************************

  Scenario: 1 week after 3 weeks
  ------------------------------------------------------------------
    Random Forest             | MAE:  0.245 | RMSE:  0.312 | R2:  0.889 | MAPE:  5.23%
    ElasticNet                | MAE:  0.267 | RMSE:  0.334 | R2:  0.873 | MAPE:  5.67%
    LSTM                      | MAE:  0.289 | RMSE:  0.356 | R2:  0.856 | MAPE:  6.12%

    ✓ Best model: Random Forest (RMSE: 0.312)
```

## Troubleshooting

### Memory Issues
If you encounter memory errors with the full dataset:
- Reduce `TEST_PERCENTAGE` temporarily
- Reduce LSTM epochs in `forecast_energy.py`
- Reduce Random Forest `n_estimators`

### Installation Issues
- Make sure you have Python 3.8 or higher
- TensorFlow requires compatible NumPy version
- Prophet may require additional dependencies on some systems

## Notes

- The script automatically handles missing values through interpolation
- Outliers are removed (values > 50 kW or > 3 standard deviations)
- Data is resampled to 15-minute intervals for consistency
- Models are evaluated on the same test set for fair comparison
