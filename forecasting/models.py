"""
Forecasting Models Module
Implements various forecasting models for energy consumption prediction
"""

import numpy as np
import pandas as pd
import pickle
import os
from sklearn.ensemble import ExtraTreesRegressor
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
    for i in range(0, len(data) - lookback_steps - forecast_steps + 1, 5):
        X.append(data[i:i+lookback_steps])
        y.append(data[i+lookback_steps:i+lookback_steps+forecast_steps])
    return np.array(X), np.array(y)


def calculate_metrics(y_true, y_pred):
    """Calculate evaluation metrics."""
    # Remove NaN values from both arrays
    mask_valid = ~(np.isnan(y_true) | np.isnan(y_pred))
    y_true_clean = y_true[mask_valid]
    y_pred_clean = y_pred[mask_valid]
    
    if len(y_true_clean) == 0:
        return {
            'MAE': np.nan,
            'RMSE': np.nan,
            'R2': np.nan,
            'MAPE': np.nan
        }
    
    mae = mean_absolute_error(y_true_clean, y_pred_clean)
    rmse = np.sqrt(mean_squared_error(y_true_clean, y_pred_clean))
    r2 = r2_score(y_true_clean, y_pred_clean)
    
    # Calculate MAPE only for non-zero values to avoid division issues
    # Filter out values where y_true is very small (< 1.0)
    mask = np.abs(y_true_clean) > 1.0
    if mask.sum() > 0:
        mape = np.mean(np.abs((y_true_clean[mask] - y_pred_clean[mask]) / y_true_clean[mask])) * 100
    else:
        mape = np.nan
    
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
        # Check for NaN in input
        if np.isnan(X_test).any():
            # Replace NaN with mean of non-NaN values
            X_test = np.where(np.isnan(X_test), np.nanmean(X_test), X_test)
        
        # Scale test data
        X_test_scaled = self.scaler.transform(X_test.reshape(-1, 1)).reshape(X_test.shape)
        
        # Reshape for LSTM
        X_test_reshaped = X_test_scaled.reshape(X_test_scaled.shape[0], X_test_scaled.shape[1], 1)
        
        # Predict
        predictions = self.model.predict(X_test_reshaped, verbose=0)
        
        # Handle NaN in predictions
        if np.isnan(predictions).any():
            predictions = np.where(np.isnan(predictions), 0, predictions)
        
        return predictions
    
    def save(self, filepath):
        """Save model to file."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        self.model.save(filepath.replace('.pkl', '.keras'))
        with open(filepath, 'wb') as f:
            pickle.dump({'scaler': self.scaler, 'lookback': self.lookback_steps, 'forecast': self.forecast_steps}, f)
    
    @classmethod
    def load(cls, filepath):
        """Load model from file."""
        from tensorflow.keras.models import load_model as keras_load
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        instance = cls(data['lookback'], data['forecast'])
        instance.scaler = data['scaler']
        
        # Try loading .keras format first, fall back to .h5
        keras_path = filepath.replace('.pkl', '.keras')
        h5_path = filepath.replace('.pkl', '.h5')
        
        try:
            if os.path.exists(keras_path):
                instance.model = keras_load(keras_path, compile=False)
            elif os.path.exists(h5_path):
                instance.model = keras_load(h5_path, compile=False)
            else:
                raise FileNotFoundError(f"No model file found at {keras_path} or {h5_path}")
            
            # Recompile with current Keras version
            instance.model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        except Exception as e:
            raise Exception(f"Failed to load LSTM model: {e}")
        
        return instance


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
    
    def save(self, filepath):
        """Save model to file."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump({'model': self.model, 'lookback': self.lookback_steps, 'forecast': self.forecast_steps}, f)
    
    @classmethod
    def load(cls, filepath):
        """Load model from file."""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        instance = cls(data['lookback'], data['forecast'])
        instance.model = data['model']
        return instance


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
    
    def save(self, filepath):
        """Save model to file."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump({'models': self.models, 'scaler': self.scaler, 'lookback': self.lookback_steps, 'forecast': self.forecast_steps}, f)
    
    @classmethod
    def load(cls, filepath):
        """Load model from file."""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        instance = cls(data['lookback'], data['forecast'])
        instance.models = data['models']
        instance.scaler = data['scaler']
        return instance


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
                seasonal_periods=7,  # 7 days = 1 week seasonality
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
    
    def save(self, filepath):
        """Save model to file."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump({'model': self.model, 'lookback': self.lookback_steps, 'forecast': self.forecast_steps}, f)
    
    @classmethod
    def load(cls, filepath):
        """Load model from file."""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        instance = cls(data['lookback'], data['forecast'])
        instance.model = data['model']
        return instance


class ExtraTreesForecaster:
    """Extra Trees model for time series forecasting."""
    
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
            model = ExtraTreesRegressor(
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
    
    def save(self, filepath):
        """Save model to file."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump({'models': self.models, 'scaler': self.scaler, 'lookback': self.lookback_steps, 'forecast': self.forecast_steps}, f)
    
    @classmethod
    def load(cls, filepath):
        """Load model from file."""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        instance = cls(data['lookback'], data['forecast'])
        instance.models = data['models']
        instance.scaler = data['scaler']
        return instance
