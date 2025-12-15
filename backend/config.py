"""
Configuration constants for the Flask API
"""

# Data recording intervals
# Data is recorded at 15-minute intervals (4 readings per hour)
READINGS_PER_DAY = 24 * 4  # 96 readings per day (15-minute intervals)
INTERVAL_HOURS = 0.25  # Each reading represents 15 minutes = 0.25 hours

# Display colors
TOUR_A_COLOR = '#FF6B6B'
TOUR_B_COLOR = '#4ECDC4'

# Data processing
# Maximum expected power for these buildings (kW). Values above this are treated as outliers.
MAX_POWER_CAP = 50  # kW cap for outlier removal
