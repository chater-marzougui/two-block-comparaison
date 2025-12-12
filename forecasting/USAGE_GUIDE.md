# Forecasting Module - Usage Guide

## Quick Start

### 1. Install Dependencies

```bash
cd forecasting
pip install -r requirements.txt
```

### 2. Run Simple Example (5% of data)

```bash
python example.py
```

This will:
- Load 5% of Tour B data
- Train a Random Forest model
- Predict 12 hours ahead using 1 day of historical data
- Display accuracy metrics

### 3. Run All Models (5% of data)

```bash
python forecast_energy.py
```

This will:
- Run all 5 models (LSTM, Prophet, ElasticNet, Exponential Smoothing, Random Forest)
- For both Tour A and Tour B
- With two prediction scenarios
- Display comparative results

### 4. Run with Full Dataset

Edit `forecast_energy.py` and change:
```python
TEST_PERCENTAGE = 0.05  # Change to 1.0
```

Then run:
```bash
python forecast_energy.py
```

## Understanding the Output

### Metrics Explained

- **MAE (Mean Absolute Error)**: Average absolute difference between predicted and actual values (in kW)
  - Lower is better
  - Directly interpretable in power units (kW)

- **RMSE (Root Mean Squared Error)**: Square root of average squared differences (in kW)
  - Lower is better
  - Penalizes large errors more than MAE

- **R² (Coefficient of Determination)**: Proportion of variance explained by the model
  - Range: -∞ to 1.0
  - 1.0 = perfect predictions
  - 0.0 = model performs like average
  - < 0.0 = model performs worse than average

- **MAPE (Mean Absolute Percentage Error)**: Average percentage error
  - Lower is better
  - Expressed as percentage (%)

### Sample Output

```
Running Random Forest...
  MAE: 1.207, RMSE: 2.080, R2: 0.497, MAPE: 17.17%
```

This means:
- Average prediction error: 1.2 kW
- Model explains 49.7% of variance
- Average percentage error: 17%

## Configuration

### Test Percentage

Control how much data to use:

```python
TEST_PERCENTAGE = 0.05  # Use 5% of data (fast, for testing)
TEST_PERCENTAGE = 0.25  # Use 25% of data (moderate)
TEST_PERCENTAGE = 1.0   # Use 100% of data (full analysis)
```

**Recommendation**: Start with 0.05 to verify everything works, then use 1.0 for final results.

### Train-Test Split

```python
TRAIN_RATIO = 0.6  # 60% for training, 40% for testing
```

You can adjust this ratio, but 60-40 is a good balance.

### Prediction Scenarios

When using full dataset (`TEST_PERCENTAGE = 1.0`):

1. **Scenario 1**: Predict 1 week consumption after 3 weeks
   - Uses 3 weeks of historical data
   - Predicts next 1 week

2. **Scenario 2**: Predict 1 month consumption after 3 months
   - Uses 3 months of historical data
   - Predicts next 1 month

When testing (`TEST_PERCENTAGE < 0.1`):
- Scenarios are automatically scaled down to fit available data

## Model Selection Guide

### Best for Accuracy: Random Forest / ElasticNet
- Generally provides good balance of speed and accuracy
- Works well with small to medium datasets
- Good for most use cases

### Best for Long-term Patterns: Prophet
- Designed for business forecasting
- Handles seasonality well
- Good for monthly/yearly predictions

### Best for Complex Patterns: LSTM
- Deep learning approach
- Can capture complex temporal dependencies
- Requires more data and computation time
- May need GPU for large datasets

### Best for Speed: Exponential Smoothing / ElasticNet
- Fastest training time
- Good baseline model
- Works well with stable patterns

### Best for Interpretability: ElasticNet
- Linear model - easy to understand
- Feature importance readily available
- Good for explaining predictions

## Troubleshooting

### "Not enough data for this scenario"

**Problem**: Dataset too small for the prediction scenario.

**Solutions**:
1. Increase `TEST_PERCENTAGE` (e.g., from 0.05 to 0.25 or 1.0)
2. Use the automatic scaled scenarios (they activate when `TEST_PERCENTAGE < 0.1`)

### Memory Issues

**Problem**: System runs out of memory.

**Solutions**:
1. Reduce `TEST_PERCENTAGE`
2. Reduce LSTM epochs in `forecast_energy.py`
3. Reduce Random Forest `n_estimators` in `models.py`

### Slow Performance

**Problem**: Models take too long to train.

**Solutions**:
1. Use `example.py` instead of `forecast_energy.py` (runs only one model)
2. Reduce `TEST_PERCENTAGE`
3. For LSTM, reduce epochs (currently 30, can go down to 10)
4. Skip Prophet (it's usually the slowest)

### Poor Predictions (High MAPE/RMSE)

**Problem**: Model accuracy is low.

**Possible causes**:
1. Not enough training data - increase `TEST_PERCENTAGE`
2. Data quality issues - check the data has enough samples
3. Test dataset is too small - happens with very small `TEST_PERCENTAGE`

## Advanced Usage

### Using Individual Models

You can import and use models directly:

```python
from forecasting import RandomForestForecaster, prepare_sequences, calculate_metrics

# Prepare your data
X_train, y_train = prepare_sequences(train_data, lookback=96, forecast=48)

# Train model
model = RandomForestForecaster(lookback_steps=96, forecast_steps=48)
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)

# Evaluate
metrics = calculate_metrics(y_test.flatten(), predictions.flatten())
```

### Loading Data Programmatically

```python
from forecasting import load_tour_data, prepare_forecasting_data

# Load Tour A data
data_a = load_tour_data(data_dir, tour='A', test_percentage=1.0)
data_a = prepare_forecasting_data(data_a, freq='15min')

# Load Tour B data
data_b = load_tour_data(data_dir, tour='B', test_percentage=1.0)
data_b = prepare_forecasting_data(data_b, freq='15min')
```

## Tips for Best Results

1. **Start Small**: Always test with `TEST_PERCENTAGE = 0.05` first
2. **Compare Models**: Run all models and compare their performance
3. **Check R² Score**: Focus on models with positive R² scores
4. **Use Full Data**: For final analysis, use `TEST_PERCENTAGE = 1.0`
5. **Consider Context**: Different models work better for different scenarios
6. **Validate Results**: Check if predictions make sense given the power consumption patterns

## Expected Performance

With 5% test data:
- **ElasticNet/Random Forest**: R² around 0.4-0.6, MAPE 15-25%
- **LSTM**: R² around 0.0-0.5, MAPE 50-90% (needs more data)
- **Prophet**: Variable, may need more data
- **Exponential Smoothing**: R² often negative (needs more data)

With full data:
- **All models**: Should achieve R² > 0.7, MAPE < 15%
- **Best models**: R² > 0.85, MAPE < 10%

## Next Steps

1. Run `example.py` to verify setup ✓
2. Run `forecast_energy.py` with test data ✓
3. Analyze results and choose best model
4. Run with `TEST_PERCENTAGE = 1.0` for final analysis
5. Use results to optimize energy consumption

## Support

For issues or questions:
1. Check this guide
2. Review `README.md`
3. Check model implementations in `models.py`
4. Review data loading in `data_loader.py`
