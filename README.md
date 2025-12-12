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

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Run Data Exploration

```bash
# Install Python dependencies
pip install pandas numpy matplotlib seaborn openpyxl

# Run basic exploration
python data_exploration.py

# Run enhanced analysis (v2)
python data_exploration_v2.py
```

### 2. Run Energy Forecasting

```bash
cd forecasting

# Install forecasting dependencies
pip install -r requirements.txt

# Run simple example (fast - uses Random Forest only)
python example.py

# Run all models (LSTM, Prophet, ElasticNet, Exponential Smoothing, Random Forest)
python forecast_energy.py
```

**Note**: By default, forecasting uses 5% of data for quick testing. To use the full dataset, edit `forecast_energy.py` and change `TEST_PERCENTAGE = 0.05` to `TEST_PERCENTAGE = 1.0`. See [forecasting/USAGE_GUIDE.md](forecasting/USAGE_GUIDE.md) for detailed instructions.

### 3. Start Flask Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

The API will be available at `http://localhost:5000`

### 4. Start React Dashboard

```bash
cd dashboard

# Install dependencies
npm install

# Start development server
npm start
```

The dashboard will be available at `http://localhost:3000`

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

### Prediction Scenarios

- **Scenario 1**: Predict 1 week consumption after 3 weeks of historical data
- **Scenario 2**: Predict 1 month consumption after 3 months of historical data

### Key Features

- **60-40 Train-Test Split**: Optimal balance for training and validation
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
