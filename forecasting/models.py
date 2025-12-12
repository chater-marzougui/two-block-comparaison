"""
Forecasting Models Module
Implements various forecasting models for energy consumption prediction
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import ElasticNet
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings

warnings.filterwarnings('ignore')

# Constants
EPSILON = 1e-10  # Small value to prevent division by zero


def prepare_sequences(data, lookback_steps, forecast_steps):
    """
    Prepare sequences for time series forecasting.
    
    Args:
        data: Array of values
        lookback_steps: Number of past steps to use
        forecast_steps: Number of future steps to predict
        
    Returns:
        X (input sequences), y (target sequences)
    """
    X, y = [], []
    for i in range(len(data) - lookback_steps - forecast_steps + 1):
        X.append(data[i:i+lookback_steps])
        y.append(data[i+lookback_steps:i+lookback_steps+forecast_steps])
    return np.array(X), np.array(y)


def calculate_metrics(y_true, y_pred):
    """Calculate evaluation metrics."""
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    mape = np.mean(np.abs((y_true - y_pred) / (y_true + EPSILON))) * 100
    
    return {
        'MAE': mae,
        'RMSE': rmse,
        'R2': r2,
        'MAPE': mape
    }


class LSTMForecaster:
    """LSTM model for time series forecasting."""
    
    def __init__(self, lookback_steps, forecast_steps):
        self.lookback_steps = lookback_steps
        self.forecast_steps = forecast_steps
        self.model = None
        self.scaler = StandardScaler()
        
    def build_model(self, input_shape):
        """Build LSTM model."""
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense, Dropout
        
        model = Sequential([
            LSTM(64, activation='relu', return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(32, activation='relu'),
            Dropout(0.2),
            Dense(self.forecast_steps)
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def fit(self, X_train, y_train, epochs=50, batch_size=32, verbose=0):
        """Train the model."""
        # Scale data
        X_train_scaled = self.scaler.fit_transform(X_train.reshape(-1, 1)).reshape(X_train.shape)
        
        # Build model
        self.model = self.build_model((X_train.shape[1], 1))
        
        # Reshape for LSTM (samples, timesteps, features)
        X_train_reshaped = X_train_scaled.reshape(X_train_scaled.shape[0], X_train_scaled.shape[1], 1)
        
        # Train
        self.model.fit(X_train_reshaped, y_train, 
                      epochs=epochs, batch_size=batch_size, 
                      verbose=verbose, validation_split=0.1)
        
    def predict(self, X_test):
        """Make predictions."""
        # Scale test data
        X_test_scaled = self.scaler.transform(X_test.reshape(-1, 1)).reshape(X_test.shape)
        
        # Reshape for LSTM
        X_test_reshaped = X_test_scaled.reshape(X_test_scaled.shape[0], X_test_scaled.shape[1], 1)
        
        # Predict
        predictions = self.model.predict(X_test_reshaped, verbose=0)
        
        return predictions


class ProphetForecaster:
    """Prophet model for time series forecasting."""
    
    def __init__(self, lookback_steps, forecast_steps):
        self.lookback_steps = lookback_steps
        self.forecast_steps = forecast_steps
        self.model = None
        
    def fit(self, data, dates):
        """Train the model."""
        from prophet import Prophet
        
        # Prepare data for Prophet
        df = pd.DataFrame({
            'ds': dates,
            'y': data
        })
        
        # Initialize and fit Prophet
        self.model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=False,
            changepoint_prior_scale=0.05
        )
        self.model.fit(df)
        
    def predict(self, future_dates):
        """Make predictions."""
        # Create future dataframe
        future = pd.DataFrame({'ds': future_dates})
        
        # Predict
        forecast = self.model.predict(future)
        
        return forecast['yhat'].values


class ElasticNetForecaster:
    """ElasticNet model for time series forecasting."""
    
    def __init__(self, lookback_steps, forecast_steps):
        self.lookback_steps = lookback_steps
        self.forecast_steps = forecast_steps
        self.models = []
        self.scaler = StandardScaler()
        
    def fit(self, X_train, y_train):
        """Train the model."""
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train a separate model for each forecast step
        self.models = []
        for i in range(self.forecast_steps):
            model = ElasticNet(alpha=0.1, l1_ratio=0.5, max_iter=5000)
            model.fit(X_train_scaled, y_train[:, i])
            self.models.append(model)
        
    def predict(self, X_test):
        """Make predictions."""
        # Scale test data
        X_test_scaled = self.scaler.transform(X_test)
        
        # Predict for each step
        predictions = []
        for model in self.models:
            pred = model.predict(X_test_scaled)
            predictions.append(pred)
        
        return np.array(predictions).T


class ExponentialSmoothingForecaster:
    """Exponential Smoothing model for time series forecasting."""
    
    def __init__(self, lookback_steps, forecast_steps):
        self.lookback_steps = lookback_steps
        self.forecast_steps = forecast_steps
        self.model = None
        
    def fit(self, data):
        """Train the model."""
        from statsmodels.tsa.holtwinters import ExponentialSmoothing
        
        # Convert to pandas Series
        series = pd.Series(data)
        
        # Fit Exponential Smoothing
        try:
            self.model = ExponentialSmoothing(
                series,
                seasonal_periods=96,  # 96 * 15min = 24 hours
                trend='add',
                seasonal='add',
                use_boxcox=False
            ).fit()
        except Exception:
            # Fallback to simpler model if seasonal doesn't work
            self.model = ExponentialSmoothing(
                series,
                trend='add',
                seasonal=None
            ).fit()
        
    def predict(self, steps):
        """Make predictions."""
        forecast = self.model.forecast(steps=steps)
        return forecast.values


class RandomForestForecaster:
    """Random Forest model for time series forecasting."""
    
    def __init__(self, lookback_steps, forecast_steps):
        self.lookback_steps = lookback_steps
        self.forecast_steps = forecast_steps
        self.models = []
        self.scaler = StandardScaler()
        
    def fit(self, X_train, y_train):
        """Train the model."""
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train a separate model for each forecast step
        self.models = []
        for i in range(self.forecast_steps):
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=20,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            )
            model.fit(X_train_scaled, y_train[:, i])
            self.models.append(model)
        
    def predict(self, X_test):
        """Make predictions."""
        # Scale test data
        X_test_scaled = self.scaler.transform(X_test)
        
        # Predict for each step
        predictions = []
        for model in self.models:
            pred = model.predict(X_test_scaled)
            predictions.append(pred)
        
        return np.array(predictions).T
