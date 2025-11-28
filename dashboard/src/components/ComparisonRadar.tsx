import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useData } from '../context/DataContext';

const ComparisonRadar: React.FC = () => {
  const { tourA, tourB, loading, error } = useData();

  if (loading || error || !tourA || !tourB) {
    return null;
  }

  // Comparison data for grouped bar chart
  const comparisonData = [
    { 
      metric: 'Avg Power', 
      'Tour A': tourA.avgPower, 
      'Tour B': tourB.avgPower,
    },
    { 
      metric: 'Peak/2', 
      'Tour A': tourA.maxPower / 2, 
      'Tour B': tourB.maxPower / 2,
    },
    { 
      metric: 'Weekday', 
      'Tour A': tourA.weekdayAvg, 
      'Tour B': tourB.weekdayAvg,
    },
    { 
      metric: 'Weekend', 
      'Tour A': tourA.weekendAvg, 
      'Tour B': tourB.weekendAvg,
    },
    { 
      metric: 'Daily kWh/10', 
      'Tour A': tourA.estimatedDailyKwh / 10, 
      'Tour B': tourB.estimatedDailyKwh / 10,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="chart-container"
    >
      <h2 className="chart-title">🎯 Performance Comparison</h2>
      <p className="chart-subtitle">Multi-dimensional metrics analysis</p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={comparisonData} 
          layout="vertical"
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" tick={{ fill: '#666' }} />
          <YAxis 
            dataKey="metric" 
            type="category" 
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => [`${value.toFixed(2)}`, '']}
          />
          <Legend />
          <Bar 
            dataKey="Tour A" 
            fill="#FF6B6B" 
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          />
          <Bar 
            dataKey="Tour B" 
            fill="#4ECDC4" 
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
            animationBegin={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ComparisonRadar;
