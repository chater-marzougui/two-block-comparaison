import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPeakAnalysis, PeakAnalysisData } from '../services/api';
import { useData } from '../context/DataContext';

const PeakAnalysisChart: React.FC = () => {
  const { filters } = useData();
  const [tourA, setTourA] = useState<PeakAnalysisData | null>(null);
  const [tourB, setTourB] = useState<PeakAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPeakAnalysis({
          month: filters.month || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          topN: 10
        });
        setTourA(data.tourA);
        setTourB(data.tourB);
      } catch (error) {
        console.error('Failed to fetch peak analysis data:', error);
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
        <h2 className="chart-title">📈 Peak Hours Analysis</h2>
        <div className="loading-spinner">Loading...</div>
      </motion.div>
    );
  }

  const chartData = tourA.peakHours.map((hour, idx) => ({
    timeLabel: hour.timeLabel,
    tourA: hour.avgPower,
    tourB: tourB.peakHours[idx]?.avgPower || 0,
  }));

  return (
    <motion.div 
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="chart-title">📈 Top 10 Peak Consumption Hours</h2>
      <div style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.3)" />
            <XAxis 
              dataKey="timeLabel" 
              stroke="#9ca3af"
              label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              label={{ value: 'Average Power (kW)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#e5e7eb' }}
              formatter={(value: any) => `${value.toFixed(2)} kW`}
            />
            <Legend wrapperStyle={{ color: '#e5e7eb' }} />
            <Bar dataKey="tourA" name="Tour A" fill="#ef4444" opacity={0.8} />
            <Bar dataKey="tourB" name="Tour B" fill="#10b981" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="stats-summary" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div className="tour-stats">
          <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Tour A Peak Analysis</h3>
          <div className="stat-row">
            <span>Highest Peak Hour:</span>
            <strong>{tourA.peakHours[0]?.timeLabel} ({tourA.peakHours[0]?.avgPower.toFixed(2)} kW)</strong>
          </div>
          <div className="stat-row">
            <span>Daily Peak Avg:</span>
            <strong>{tourA.dailyPeaks.mean.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Daily Peak Max:</span>
            <strong>{tourA.dailyPeaks.max.toFixed(2)} kW</strong>
          </div>
        </div>
        
        <div className="tour-stats">
          <h3 style={{ color: '#10b981', marginBottom: '10px' }}>Tour B Peak Analysis</h3>
          <div className="stat-row">
            <span>Highest Peak Hour:</span>
            <strong>{tourB.peakHours[0]?.timeLabel} ({tourB.peakHours[0]?.avgPower.toFixed(2)} kW)</strong>
          </div>
          <div className="stat-row">
            <span>Daily Peak Avg:</span>
            <strong>{tourB.dailyPeaks.mean.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Daily Peak Max:</span>
            <strong>{tourB.dailyPeaks.max.toFixed(2)} kW</strong>
          </div>
        </div>
      </div>

      <div className="off-peak-section" style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#9ca3af', marginBottom: '15px' }}>🌙 Off-Peak Hours (Lowest Consumption)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#ef4444', fontSize: '14px', marginBottom: '8px' }}>Tour A</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tourA.offPeakHours.map((hour, idx) => (
                <li key={idx} style={{ padding: '4px 0', fontSize: '13px' }}>
                  {hour.timeLabel}: <strong>{hour.avgPower.toFixed(2)} kW</strong>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#10b981', fontSize: '14px', marginBottom: '8px' }}>Tour B</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tourB.offPeakHours.map((hour, idx) => (
                <li key={idx} style={{ padding: '4px 0', fontSize: '13px' }}>
                  {hour.timeLabel}: <strong>{hour.avgPower.toFixed(2)} kW</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PeakAnalysisChart;
