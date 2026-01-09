# Tour A vs Tour B - Power Consumption Comparative Analysis

This project provides comprehensive data exploration, analysis, and visualization tools for comparing power consumption between two building blocks (Tour A and Tour B).

## 📊 Project Overview

The project consists of four main components:

1. **Data Exploration Scripts** - Python scripts for loading, cleaning, and analyzing power consumption data
2. **Forecasting Module** - AI/ML models for predicting future energy consumption
3. **Flask Backend API** - REST API for serving data dynamically with filtering options
4. **React Dashboard** - Interactive web dashboard for visualizing comparisons

## 🗂️ Project Structure

```
├── backend/                    # Flask API server
│   ├── app.py                  # Main API application
│   ├── requirements.txt        # Python dependencies
│   └── README.md               # API documentation
├── dashboard/                  # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # React context for state management
│   │   ├── services/           # API service layer
│   │   └── data/               # Static fallback data
│   └── README.md               # Frontend documentation
├── forecasting/                # AI/ML forecasting module
│   ├── data_loader.py          # Data loading and preprocessing
│   ├── models.py               # Model implementations (LSTM, Prophet, etc.)
│   ├── forecast_energy.py      # Main forecasting script
│   ├── example.py              # Simple usage example
│   ├── requirements.txt        # Forecasting dependencies
│   ├── README.md               # Forecasting documentation
│   └── USAGE_GUIDE.md          # Detailed usage guide
├── exploration_output/         # Generated visualizations and analysis
├── SINERT_DATA_CONCENTRATOR/   # Source data files (CSV/XLSX)
├── data_exploration.py         # Basic data exploration script
├── data_exploration_v2.py      # Enhanced analysis with more metrics
├── data_cleaning.py            # Data cleaning utilities
├── Data_Tree.md                # Dataset structure documentation
└── Metadonnees_13compteurs.pdf # Metadata documentation
```

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.8+** - Required for data exploration, forecasting, and backend API
- **Node.js 16+** - Required for the React dashboard frontend
- **npm or yarn** - Package manager for frontend dependencies

---

### Step 1: Setup Python Virtual Environment (Recommended)

It's recommended to use a virtual environment to avoid dependency conflicts.

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Your prompt should now show (venv) prefix
```

---

### Step 2: Run Jupyter Notebook for Data Exploration

If you want to explore the data interactively using Jupyter:

```bash
# Install Jupyter and data analysis dependencies
pip install jupyter pandas numpy matplotlib seaborn openpyxl

# Start Jupyter Notebook
jupyter notebook

# Open data_exploration.ipynb in your browser
# Run the cells to explore the data
```

**Alternative: Run Python scripts directly**

If you prefer running scripts without Jupyter:

```bash
# Install Python dependencies (in your virtual environment)
pip install pandas numpy matplotlib seaborn openpyxl

# Run basic exploration
python data_exploration.py

# Run enhanced analysis (v2)
python data_exploration_v2.py
```

---

### Step 3: Start the Flask Backend API

The backend API serves data to the frontend dashboard.

```bash
# Navigate to backend directory
cd backend

# If you haven't activated venv yet, do it now:
# source venv/bin/activate  (Linux/Mac)
# venv\Scripts\activate      (Windows)

# Install backend dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py

# Server will start at http://localhost:5000
# Keep this terminal open and running
```

**Verify backend is running:**
```bash
# In a new terminal, test the API:
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"Flask API is running"}
```

---

### Step 4: Start the React Frontend Dashboard

Open a **new terminal** (keep the backend running in the previous terminal).

```bash
# Navigate to dashboard directory
cd dashboard

# Install frontend dependencies
npm install

# Start the React development server
npm start

# Dashboard will open automatically at http://localhost:3000
# If not, open your browser and go to http://localhost:3000
```

**Note:** The frontend expects the backend API to be running at `http://localhost:5000`. Make sure the backend is running before starting the frontend.

---

### Step 5: View the Dashboard

Once both servers are running:

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Explore the dashboard** features:
   - View hourly, weekly, and monthly power consumption patterns
   - Compare Tour A vs Tour B efficiency metrics
   - **Check the Forecasting Chart** showing predicted vs actual values:
     - **1 Week Forecast**: Uses last 3 weeks to predict the final week
     - **1 Month Forecast**: Uses last 3 months to predict the final month
3. Use filters to narrow down data by month, day of week, or time aggregation

---

### Quick Start Summary

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend (in a new terminal)
cd dashboard
npm install
npm start

# Browser - Open http://localhost:3000
```

---

### Optional: Run Energy Forecasting Training Scripts

The forecasting models are already integrated into the dashboard. However, if you want to train new models or explore different forecasting approaches:

```bash
cd forecasting

# Ensure virtual environment is activated
# source venv/bin/activate  (Linux/Mac)
# venv\Scripts\activate      (Windows)

# Install forecasting dependencies
pip install -r requirements.txt

# Run simple example (fast - uses Random Forest only)
python example.py

# Run all models (LSTM, Prophet, ElasticNet, Exponential Smoothing, Extra Trees)
python forecast_energy.py
```

**Note**: By default, forecasting uses 100% of data. The trained models are already saved in the `saved_models/` directory and are used by the dashboard's `/api/forecasting` endpoint.

---

## 📡 API Endpoints

| Endpoint | Description | Query Parameters |
|----------|-------------|------------------|
| `GET /api/health` | Health check | - |
| `GET /api/data-info` | Data availability info | - |
| `GET /api/summary` | Summary statistics | `month`, `start_date`, `end_date` |
| `GET /api/hourly` | Hourly patterns | `month`, `day_of_week` (0-6) |
| `GET /api/weekly` | Weekly patterns | `month` |
| `GET /api/monthly` | Monthly trends | `year` |
| `GET /api/timeseries` | Time series data | `month`, `start_date`, `end_date`, `aggregation` |
| `GET /api/insights` | Key insights | `month` |
| `GET /api/heatmap` | Heatmap data | `month` |

### Example API Usage

```bash
# Get summary for all data
curl http://localhost:5000/api/summary

# Get summary for February 2025
curl "http://localhost:5000/api/summary?month=2025-02"

# Get hourly patterns for weekdays only
curl "http://localhost:5000/api/hourly?day_of_week=0"

# Get weekly time series
curl "http://localhost:5000/api/timeseries?aggregation=weekly"
```

## 🤖 Forecasting Features

The forecasting module provides AI/ML-based energy consumption prediction using 5 different models:

1. **LSTM (Long Short-Term Memory)** - Deep learning model for sequential data
2. **Prophet** - Facebook's time series forecasting tool
3. **ElasticNet** - Linear model with L1 and L2 regularization
4. **Exponential Smoothing** - Statistical time series method
5. **Random Forest** - Ensemble learning method

### Prediction Scenarios (Available in Dashboard)

The dashboard includes an interactive **Energy Consumption Forecast** chart that demonstrates the model accuracy:

- **1 Week Forecast**: 
  - Uses available data **minus the last week** for training
  - Predicts the last week's consumption using the previous 3 weeks
  - Displays **predicted vs actual** values for validation
  - Model: **Exponential Smoothing**

- **1 Month Forecast**: 
  - Uses available data **minus the last month** for training
  - Predicts the last month's consumption using the previous 3 months
  - Displays **predicted vs actual** values for validation
  - Model: **ElasticNet**

This holdout validation approach allows you to see how accurately the models predict real data they haven't seen during training.

### Key Features

- **Holdout Validation**: Models predict on held-out test data to validate accuracy
- **Test Percentage Control**: Use 5% of data for quick testing or 100% for full analysis
- **Automatic Scaling**: Scenarios adjust based on available data
- **Comprehensive Metrics**: MAE, RMSE, R², and MAPE for each model
- **Comparative Analysis**: Side-by-side comparison of all models

See [forecasting/README.md](forecasting/README.md) and [forecasting/USAGE_GUIDE.md](forecasting/USAGE_GUIDE.md) for detailed documentation.

## 📈 Dashboard Features

- **Dynamic Filters**: Filter data by month, day of week, and time aggregation
- **Interactive Charts**: Hourly patterns, weekly trends, monthly comparisons
- **Key Insights**: Automatically calculated efficiency metrics
- **Efficiency Metrics**: Load factor, peak-to-average ratio, energy consumption
- **Comparison Views**: Side-by-side Tour A vs Tour B analysis
- **🔮 Energy Consumption Forecast**: Interactive chart showing predicted vs actual values with two scenarios (1 week and 1 month)

## 📊 Available Data

The dataset covers power consumption data from November 2023 to February 2025:

- **November 2023**: 15 data files (mostly XLSX)
- **February 2024**: 15 data files (CSV)
- **August 2024**: 16 data files (CSV)
- **January 2025**: 16 data files (CSV)
- **February 2025**: 14 data files (CSV)

Each file contains 15-minute interval readings with metrics including:
- Power (kW)
- Energy (kWh)
- Voltage (V)
- Current (A)
- Power Factor
- Reactive Power (kvar)

## 🔧 Key Metrics Explained

| Metric | Description |
|--------|-------------|
| **Average Power** | Mean power consumption (kW) |
| **Peak Power** | Maximum power consumption (kW) |
| **Load Factor** | Average/Peak ratio (higher = better utilization) |
| **Peak-to-Average Ratio** | Peak/Average (lower = more consistent load) |
| **Data Coverage** | Percentage of non-null readings |
| **Weekend Savings** | Reduction in weekend consumption vs weekdays |

## 🛠️ Technical Notes

### Column Name Normalization

XLSX files from the data concentrator have numeric suffixes in column names (e.g., `TOUR_A_(TGBT_D14) kW sys (kW) [AVG] 877`), while CSV files don't. The scripts normalize these column names to ensure consistent data handling.

### Data Quality

- Some readings may have missing values (indicated in data coverage %)
- Outliers above 50 kW are automatically filtered
- Time entries with `24:00:00` are excluded (invalid format)

## 🤝 Contributing

Feel free to submit issues and pull requests for improvements.
