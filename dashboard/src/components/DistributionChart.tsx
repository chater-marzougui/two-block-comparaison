import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDistributionData, DistributionData } from '../services/api';
import { useData } from '../context/DataContext';

const DistributionChart: React.FC = () => {
  const { filters } = useData();
  const [tourA, setTourA] = useState<DistributionData | null>(null);
  const [tourB, setTourB] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDistributionData({
          month: filters.month || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          bins: 30
        });
        setTourA(data.tourA);
        setTourB(data.tourB);
      } catch (error) {
        console.error('Failed to fetch distribution data:', error);
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
        <h2 className="chart-title">📊 Power Distribution Analysis</h2>
        <div className="loading-spinner">Loading...</div>
      </motion.div>
    );
  }

  const chartData = tourA.histogram.map((bin, idx) => ({
    binCenter: bin.binCenter.toFixed(1),
    tourA: bin.count,
    tourB: tourB.histogram[idx]?.count || 0,
  }));

  return (
    <motion.div 
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="chart-title">📊 Power Distribution Analysis</h2>
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.3)" />
            <XAxis 
              dataKey="binCenter" 
              stroke="#9ca3af"
              label={{ value: 'Power (kW)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af"
              label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Legend wrapperStyle={{ color: '#e5e7eb' }} />
            <Bar dataKey="tourA" name="Tour A" fill="#ef4444" opacity={0.8} />
            <Bar dataKey="tourB" name="Tour B" fill="#10b981" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="stats-summary" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div className="tour-stats">
          <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Tour A Statistics</h3>
          <div className="stat-row">
            <span>Mean:</span>
            <strong>{tourA.statistics.mean.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Median:</span>
            <strong>{tourA.statistics.median.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Std Dev:</span>
            <strong>{tourA.statistics.std.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Range:</span>
            <strong>{tourA.statistics.min.toFixed(2)} - {tourA.statistics.max.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Skewness:</span>
            <strong>{tourA.statistics.skewness.toFixed(2)}</strong>
          </div>
        </div>
        
        <div className="tour-stats">
          <h3 style={{ color: '#10b981', marginBottom: '10px' }}>Tour B Statistics</h3>
          <div className="stat-row">
            <span>Mean:</span>
            <strong>{tourB.statistics.mean.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Median:</span>
            <strong>{tourB.statistics.median.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Std Dev:</span>
            <strong>{tourB.statistics.std.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Range:</span>
            <strong>{tourB.statistics.min.toFixed(2)} - {tourB.statistics.max.toFixed(2)} kW</strong>
          </div>
          <div className="stat-row">
            <span>Skewness:</span>
            <strong>{tourB.statistics.skewness.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DistributionChart;
