import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { timeSeriesData } from '../data/powerData';

const TimeSeriesChart: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="chart-container full-width"
    >
      <h2 className="chart-title">📊 Daily Power Consumption Over Time</h2>
      <p className="chart-subtitle">January - February 2025</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#666', fontSize: 11 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            interval={4}
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
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="tourA" 
            name="Tour A" 
            stroke="#FF6B6B" 
            strokeWidth={2}
            dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: '#FF6B6B' }}
            animationDuration={2000}
          />
          <Line 
            type="monotone" 
            dataKey="tourB" 
            name="Tour B" 
            stroke="#4ECDC4" 
            strokeWidth={2}
            dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: '#4ECDC4' }}
            animationDuration={2000}
            animationBegin={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TimeSeriesChart;
