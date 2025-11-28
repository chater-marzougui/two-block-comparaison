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

const WeeklyChart: React.FC = () => {
  const { weeklyData, loading, error } = useData();

  if (loading || error || weeklyData.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="chart-container"
    >
      <h2 className="chart-title">📅 Weekly Consumption Pattern</h2>
      <p className="chart-subtitle">Average power by day of week</p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#666', fontSize: 12 }}
            tickFormatter={(value) => value.substring(0, 3)}
          />
          <YAxis 
            tick={{ fill: '#666' }}
            label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fill: '#666' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => [`${value.toFixed(2)} kW`, '']}
          />
          <Legend />
          <Bar 
            dataKey="tourA" 
            name="Tour A" 
            fill="#ef4444" 
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
          />
          <Bar 
            dataKey="tourB" 
            name="Tour B" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default WeeklyChart;
