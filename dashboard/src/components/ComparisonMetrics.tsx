import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getComparisonMetrics, ComparisonMetrics as ComparisonMetricsType } from '../services/api';
import { useData } from '../context/DataContext';

const ComparisonMetrics: React.FC = () => {
  const { filters } = useData();
  const [metrics, setMetrics] = useState<ComparisonMetricsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getComparisonMetrics({
          month: filters.month || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        });
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch comparison metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading || !metrics) {
    return (
      <motion.div 
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="chart-title">⚖️ Detailed Comparison Metrics</h2>
        <div className="loading-spinner">Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="chart-title">⚖️ Detailed Comparison Metrics</h2>
      
      <div className="comparison-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '20px' }}>
        {/* Average Comparison */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📊</span>
            <h3>Average Power</h3>
          </div>
          <div className="metric-body">
            <div className="comparison-row">
              <span className="tour-label" style={{ color: '#ef4444' }}>Tour A:</span>
              <span className="tour-value">{metrics.averages.tourA} kW</span>
            </div>
            <div className="comparison-row">
              <span className="tour-label" style={{ color: '#10b981' }}>Tour B:</span>
              <span className="tour-value">{metrics.averages.tourB} kW</span>
            </div>
            <div className="comparison-row highlight">
              <span className="tour-label">Difference:</span>
              <span className="tour-value">
                {metrics.averages.difference > 0 ? '+' : ''}{metrics.averages.difference} kW 
                ({metrics.averages.differencePercent > 0 ? '+' : ''}{metrics.averages.differencePercent.toFixed(1)}%)
              </span>
            </div>
            <div className="comparison-conclusion">
              ✓ <strong>{metrics.averages.moreEfficient}</strong> is more efficient
            </div>
          </div>
        </div>

        {/* Peak Comparison */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">⚡</span>
            <h3>Peak Power</h3>
          </div>
          <div className="metric-body">
            <div className="comparison-row">
              <span className="tour-label" style={{ color: '#ef4444' }}>Tour A:</span>
              <span className="tour-value">{metrics.peaks.tourA} kW</span>
            </div>
            <div className="comparison-row">
              <span className="tour-label" style={{ color: '#10b981' }}>Tour B:</span>
              <span className="tour-value">{metrics.peaks.tourB} kW</span>
            </div>
            <div className="comparison-row highlight">
              <span className="tour-label">Difference:</span>
              <span className="tour-value">
                {metrics.peaks.difference > 0 ? '+' : ''}{metrics.peaks.difference} kW 
                ({metrics.peaks.differencePercent > 0 ? '+' : ''}{metrics.peaks.differencePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Load Factor Comparison */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📉</span>
            <h3>Load Factor</h3>
          </div>
          <div className="metric-body">
            <div className="comparison-row">
              <span className="tour-label" style={{ color: '#ef4444' }}>Tour A:</span>
              <span className="tour-value">{metrics.loadFactors.tourA.toFixed(3)}</span>
            </div>
            <div className="comparison-row">
              <span className="tour-label" style={{ color: '#10b981' }}>Tour B:</span>
              <span className="tour-value">{metrics.loadFactors.tourB.toFixed(3)}</span>
            </div>
            <div className="comparison-conclusion">
              ✓ <strong>{metrics.loadFactors.winner}</strong> has better capacity utilization
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
              Higher load factor indicates more consistent power usage
            </p>
          </div>
        </div>

        {/* Correlation Analysis */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔗</span>
            <h3>Correlation</h3>
          </div>
          <div className="metric-body">
            <div className="correlation-value" style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              textAlign: 'center',
              color: Math.abs(metrics.correlation.value) > 0.7 ? '#10b981' : 
                     Math.abs(metrics.correlation.value) > 0.4 ? '#f59e0b' : '#ef4444'
            }}>
              {metrics.correlation.value.toFixed(3)}
            </div>
            <div className="comparison-conclusion" style={{ textAlign: 'center' }}>
              {metrics.correlation.strength.toUpperCase()} correlation
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px', textAlign: 'center' }}>
              {metrics.correlation.description}
            </p>
          </div>
        </div>

        {/* Time Comparison */}
        <div className="metric-card full-width" style={{ gridColumn: '1 / -1' }}>
          <div className="metric-header">
            <span className="metric-icon">⏱️</span>
            <h3>Time-based Comparison</h3>
          </div>
          <div className="metric-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <div className="comparison-row">
                  <span className="tour-label">Tour A Higher:</span>
                  <span className="tour-value">
                    {metrics.timeComparison.tourAHigherPercent.toFixed(1)}% 
                    ({metrics.timeComparison.tourAHigherCount} readings)
                  </span>
                </div>
                <div className="comparison-row">
                  <span className="tour-label">Tour B Higher:</span>
                  <span className="tour-value">
                    {metrics.timeComparison.tourBHigherPercent.toFixed(1)}% 
                    ({metrics.timeComparison.tourBHigherCount} readings)
                  </span>
                </div>
              </div>
              <div>
                <div className="comparison-row">
                  <span className="tour-label">Max Difference at:</span>
                  <span className="tour-value">{metrics.hourlyComparison.maxDifferenceLabel}</span>
                </div>
                <div className="comparison-row">
                  <span className="tour-label">Max Difference:</span>
                  <span className="tour-value">
                    {metrics.hourlyComparison.maxDifferenceValue > 0 ? '+' : ''}
                    {metrics.hourlyComparison.maxDifferenceValue.toFixed(2)} kW
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
              <small style={{ color: '#9ca3af' }}>
                📌 Analysis based on {metrics.dataPoints.commonTimePoints.toLocaleString()} common time points
              </small>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonMetrics;
