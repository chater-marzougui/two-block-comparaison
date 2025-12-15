"""
Flask Backend API for Power Consumption Dashboard

Main application entry point that initializes Flask and registers routes.
"""

import os
from flask import Flask
from flask_cors import CORS

from data_loader import load_all_data
from routes import api

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Register API blueprint
app.register_blueprint(api, url_prefix='/api')


if __name__ == '__main__':
    # Preload data on startup
    print("Loading data...")
    load_all_data()
    print("Starting Flask server...")
    # Only enable debug mode if explicitly set via environment variable
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
