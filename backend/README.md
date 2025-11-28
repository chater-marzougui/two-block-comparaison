# Flask Backend API

This Flask application provides a REST API for the Power Consumption Dashboard.

## Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Data Information
- `GET /api/data-info` - Get information about available data (date range, months, coverage)

### Summary Statistics
- `GET /api/summary` - Get summary statistics for Tour A and Tour B
  - Query params: `month` (YYYY-MM), `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD)

### Hourly Data
- `GET /api/hourly` - Get hourly consumption patterns
  - Query params: `month` (YYYY-MM), `day_of_week` (0-6, Monday-Sunday)

### Weekly Data
- `GET /api/weekly` - Get weekly consumption patterns
  - Query params: `month` (YYYY-MM)

### Monthly Data
- `GET /api/monthly` - Get monthly consumption trends
  - Query params: `year` (YYYY)

### Time Series
- `GET /api/timeseries` - Get time series data
  - Query params: `month`, `start_date`, `end_date`, `aggregation` (daily/hourly/weekly)

### Insights
- `GET /api/insights` - Get key insights
  - Query params: `month` (YYYY-MM)

### Heatmap
- `GET /api/heatmap` - Get heatmap data (hour vs day of week)
  - Query params: `month` (YYYY-MM)

## Example Usage

```bash
# Get summary for all data
curl http://localhost:5000/api/summary

# Get summary for February 2025
curl "http://localhost:5000/api/summary?month=2025-02"

# Get hourly data for weekdays only (Monday)
curl "http://localhost:5000/api/hourly?day_of_week=0"

# Get time series with weekly aggregation
curl "http://localhost:5000/api/timeseries?aggregation=weekly"
```
