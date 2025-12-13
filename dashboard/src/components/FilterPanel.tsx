import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import './FilterPanel.css';

const FilterPanel: React.FC = () => {
  const {
    dataInfo,
    filters,
    setMonth,
    setAggregation,
    setDayOfWeek,
    clearFilters,
    loading,
  } = useData();

  const days = [
    { value: null, label: 'All Days' },
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' },
  ];

  return (
    <motion.div
      className="filter-panel"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="filter-header">
        <h3>🎛️ Filters</h3>
        <button
          className="clear-btn"
          onClick={clearFilters}
          disabled={loading}
        >
          Clear All
        </button>
      </div>

      <div className="filter-grid">
        {/* Month Filter */}
        <div className="filter-group">
          <label>Month</label>
          <select
            value={filters.month || ''}
            onChange={(e) => setMonth(e.target.value || null)}
            disabled={loading}
          >
            <option value="">All Months</option>
            {dataInfo?.availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(month + '-01').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Day of Week Filter */}
        <div className="filter-group">
          <label>Day of Week</label>
          <select
            value={filters.dayOfWeek ?? ''}
            onChange={(e) => setDayOfWeek(e.target.value === '' ? null : parseInt(e.target.value))}
            disabled={loading}
          >
            {days.map((day) => (
              <option key={day.label} value={day.value ?? ''}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        {/* Aggregation Filter */}
        <div className="filter-group">
          <label>Time Aggregation</label>
          <select
            value={filters.aggregation}
            onChange={(e) => setAggregation(e.target.value as 'daily' | 'hourly' | 'weekly' | 'monthly')}
            disabled={loading}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.month || filters.dayOfWeek !== null) && (
        <div className="active-filters">
          <span>Active: </span>
          {filters.month && (
            <span className="filter-tag">
              {new Date(filters.month + '-01').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
              <button onClick={() => setMonth(null)}>×</button>
            </span>
          )}
          {filters.dayOfWeek !== null && (
            <span className="filter-tag">
              {days.find((d) => d.value === filters.dayOfWeek)?.label}
              <button onClick={() => setDayOfWeek(null)}>×</button>
            </span>
          )}
        </div>
      )}

      {loading && <div className="loading-indicator">Loading...</div>}
    </motion.div>
  );
};

export default FilterPanel;
