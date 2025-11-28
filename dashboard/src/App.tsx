import React from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { DataProvider, useData } from './context/DataContext';
import FilterPanel from './components/FilterPanel';
import StatCard from './components/StatCard';
import HourlyChart from './components/HourlyChart';
import TimeSeriesChart from './components/TimeSeriesChart';
import WeeklyChart from './components/WeeklyChart';
import ComparisonRadar from './components/ComparisonRadar';
import InsightCards from './components/InsightCards';
import TourComparison from './components/TourComparison';
import MonthlyChart from './components/MonthlyChart';
import EfficiencyMetrics from './components/EfficiencyMetrics';

function Dashboard() {
  const { tourA, tourB, dataInfo, error, loading } = useData();

  // If there's an error or still loading, show appropriate state
  if (loading) {
    return (
      <div className="App">
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="main-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ⚡ Power Consumption Dashboard
          </motion.h1>
        </motion.header>
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading data from server...</p>
        </div>
      </div>
    );
  }

  // If there's an error (backend not available), show error state
  if (error || !tourA || !tourB) {
    return (
      <div className="App">
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="main-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ⚡ Power Consumption Dashboard
          </motion.h1>
        </motion.header>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Connect to Server</h2>
          <p>{error || 'No data available'}</p>
          <p className="error-note">Please make sure the Flask backend is running on port 5000.</p>
          <code>cd backend && python app.py</code>
        </div>
      </div>
    );
  }

  // Calculate efficiency difference
  const efficiencyDiff = tourA.avgPower > 0 
    ? Math.abs(((tourA.avgPower - tourB.avgPower) / tourA.avgPower) * 100)
    : 0;
  const moreEfficient = tourA.avgPower < tourB.avgPower ? 'Tour A' : 'Tour B';

  // Get date range
  const dateRange = dataInfo?.dateRange 
    ? `${new Date(dataInfo.dateRange.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(dataInfo.dateRange.end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : '';

  return (
    <div className="App">
      {/* Header */}
      <motion.header 
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="main-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          ⚡ Power Consumption Dashboard
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Tour A vs Tour B Comparative Analysis{dateRange && ` | ${dateRange}`}
        </motion.p>
      </motion.header>

      {/* Filter Panel */}
      <section className="filter-section">
        <FilterPanel />
      </section>

      {/* Main Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <StatCard
            title="Tour A Average"
            value={`${tourA.avgPower} kW`}
            subtitle="Power consumption"
            icon="🏢"
            color="#FF6B6B"
            delay={0.1}
          />
          <StatCard
            title="Tour B Average"
            value={`${tourB.avgPower} kW`}
            subtitle="Power consumption"
            icon="🏬"
            color="#4ECDC4"
            delay={0.2}
          />
          <StatCard
            title="Efficiency Comparison"
            value={`${efficiencyDiff.toFixed(1)}%`}
            subtitle={`${moreEfficient} more efficient`}
            icon="📉"
            color="#45B7D1"
            delay={0.3}
          />
          <StatCard
            title="Peak Power"
            value={`~${Math.max(tourA.maxPower, tourB.maxPower).toFixed(1)} kW`}
            subtitle="Maximum recorded"
            icon="⚡"
            color="#96CEB4"
            delay={0.4}
          />
          <StatCard
            title="Load Factor A"
            value={tourA.loadFactor?.toFixed(3) || '0.000'}
            subtitle="Capacity utilization"
            icon="📊"
            color="#9B59B6"
            delay={0.5}
          />
          <StatCard
            title="Load Factor B"
            value={tourB.loadFactor?.toFixed(3) || '0.000'}
            subtitle="Capacity utilization"
            icon="📊"
            color="#3498DB"
            delay={0.6}
          />
        </div>
      </section>

      {/* Key Insights */}
      <section className="insights-section">
        <InsightCards />
      </section>

      {/* Charts Grid */}
      <section className="charts-section">
        <div className="charts-grid">
          <HourlyChart />
          <WeeklyChart />
        </div>
      </section>

      {/* Monthly Trends */}
      <section className="monthly-section">
        <MonthlyChart />
      </section>

      {/* Time Series */}
      <section className="timeseries-section">
        <TimeSeriesChart />
      </section>

      {/* Efficiency Metrics */}
      <section className="efficiency-section">
        <EfficiencyMetrics />
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="comparison-grid">
          <ComparisonRadar />
          <TourComparison />
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <p>SInERT Project - Power Consumption Analysis Dashboard</p>
        <p className="footer-note">Data from {dateRange}</p>
      </motion.footer>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}

export default App;
