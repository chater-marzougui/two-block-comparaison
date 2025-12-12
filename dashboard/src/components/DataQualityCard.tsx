import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDataQuality, DataQualityData } from '../services/api';
import { useData } from '../context/DataContext';

const DataQualityCard: React.FC = () => {
  const { filters } = useData();
  const [tourA, setTourA] = useState<DataQualityData | null>(null);
  const [tourB, setTourB] = useState<DataQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDataQuality({
          month: filters.month || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        });
        setTourA(data.tourA);
        setTourB(data.tourB);
      } catch (error) {
        console.error('Failed to fetch data quality:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading || !tourA || !tourB) {
    return (
      <motion.div 
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="chart-title">📁 Data Quality Report</h2>
        <div className="loading-spinner">Loading...</div>
      </motion.div>
    );
  }

  const renderQualityBadge = (percentage: number) => {
    if (percentage >= 90) return <span className="badge badge-success">Excellent</span>;
    if (percentage >= 75) return <span className="badge badge-good">Good</span>;
    if (percentage >= 50) return <span className="badge badge-warning">Fair</span>;
    return <span className="badge badge-error">Poor</span>;
  };

  return (
    <motion.div 
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="chart-title">📁 Data Quality Report</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '20px' }}>
        {/* Tour A Quality */}
        <div className="quality-card">
          <h3 style={{ color: '#ef4444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Tour A
            {renderQualityBadge(tourA.completeness)}
          </h3>
          
          <div className="quality-metrics">
            <div className="quality-metric">
              <div className="metric-label">Completeness</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${tourA.completeness}%`,
                      backgroundColor: tourA.completeness >= 75 ? '#10b981' : tourA.completeness >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className="percentage">{tourA.completeness.toFixed(1)}%</span>
              </div>
            </div>

            <div className="quality-metric">
              <div className="metric-label">Validity (Non-zero)</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${tourA.validity}%`,
                      backgroundColor: tourA.validity >= 75 ? '#10b981' : tourA.validity >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className="percentage">{tourA.validity.toFixed(1)}%</span>
              </div>
            </div>

            <div className="quality-stats">
              <div className="stat-item">
                <span>Total Points:</span>
                <strong>{tourA.totalPoints.toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <span>Valid Points:</span>
                <strong>{tourA.validPoints.toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <span>Missing Points:</span>
                <strong style={{ color: tourA.missingPoints > 0 ? '#f59e0b' : '#10b981' }}>
                  {tourA.missingPoints.toLocaleString()}
                </strong>
              </div>
              <div className="stat-item">
                <span>Zero Readings:</span>
                <strong>{tourA.zeroPoints.toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <span>Non-zero Readings:</span>
                <strong>{tourA.nonZeroPoints.toLocaleString()}</strong>
              </div>
            </div>

            {tourA.issues.length > 0 && (
              <div className="quality-issues">
                <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#f59e0b' }}>⚠️ Issues:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {tourA.issues.map((issue, idx) => (
                    <li key={idx} style={{ fontSize: '13px', color: '#9ca3af' }}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tour B Quality */}
        <div className="quality-card">
          <h3 style={{ color: '#10b981', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Tour B
            {renderQualityBadge(tourB.completeness)}
          </h3>
          
          <div className="quality-metrics">
            <div className="quality-metric">
              <div className="metric-label">Completeness</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${tourB.completeness}%`,
                      backgroundColor: tourB.completeness >= 75 ? '#10b981' : tourB.completeness >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className="percentage">{tourB.completeness.toFixed(1)}%</span>
              </div>
            </div>

            <div className="quality-metric">
              <div className="metric-label">Validity (Non-zero)</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${tourB.validity}%`,
                      backgroundColor: tourB.validity >= 75 ? '#10b981' : tourB.validity >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className="percentage">{tourB.validity.toFixed(1)}%</span>
              </div>
            </div>

            <div className="quality-stats">
              <div className="stat-item">
                <span>Total Points:</span>
                <strong>{tourB.totalPoints.toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <span>Valid Points:</span>
                <strong>{tourB.validPoints.toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <span>Missing Points:</span>
                <strong style={{ color: tourB.missingPoints > 0 ? '#f59e0b' : '#10b981' }}>
                  {tourB.missingPoints.toLocaleString()}
                </strong>
              </div>
              <div className="stat-item">
                <span>Zero Readings:</span>
                <strong>{tourB.zeroPoints.toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <span>Non-zero Readings:</span>
                <strong>{tourB.nonZeroPoints.toLocaleString()}</strong>
              </div>
            </div>

            {tourB.issues.length > 0 && (
              <div className="quality-issues">
                <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#f59e0b' }}>⚠️ Issues:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {tourB.issues.map((issue, idx) => (
                    <li key={idx} style={{ fontSize: '13px', color: '#9ca3af' }}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-success {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .badge-good {
          background-color: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }
        .badge-warning {
          background-color: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        .badge-error {
          background-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .quality-metric {
          margin-bottom: 20px;
        }
        .metric-label {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        .metric-value {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .progress-bar {
          flex: 1;
          height: 8px;
          background-color: rgba(75, 85, 99, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .percentage {
          font-weight: 600;
          min-width: 50px;
          text-align: right;
        }
        .quality-stats {
          margin-top: 20px;
          padding: 15px;
          background-color: rgba(31, 41, 55, 0.5);
          border-radius: 8px;
        }
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13px;
        }
        .stat-item span {
          color: #9ca3af;
        }
        .quality-issues {
          margin-top: 20px;
          padding: 12px;
          background-color: rgba(245, 158, 11, 0.1);
          border-radius: 8px;
          border-left: 3px solid #f59e0b;
        }
      `}</style>
    </motion.div>
  );
};

export default DataQualityCard;
