import React from 'react';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
} from 'recharts';
import { useData } from '../context/DataContext';

// Constants for energy calculation
const HOURS_PER_DAY = 24;
const DAYS_PER_MONTH = 30;

const MonthlyChart: React.FC = () => {
  const { monthlyData, loading, error } = useData();

  if (loading || error || monthlyData.length === 0) {
    return null;
  }

  // Calculate cumulative energy for each month (power * hours/day * days/month)
  const dataWithEnergy = monthlyData.map(item => ({
    ...item,
    tourAEnergy: item.tourAEnergy || Math.round(item.tourA * HOURS_PER_DAY * DAYS_PER_MONTH),
    tourBEnergy: item.tourBEnergy || Math.round(item.tourB * HOURS_PER_DAY * DAYS_PER_MONTH),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="chart-container monthly-chart"
    >
      <h2 className="chart-title">📅 Monthly Power Consumption Trends</h2>
      <p className="chart-subtitle">Average power consumption by month with estimated energy usage</p>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={dataWithEnergy} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="monthName" 
            tick={{ fill: '#666', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="power"
            tick={{ fill: '#666' }}
            label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fill: '#666' }}
          />
          <YAxis 
            yAxisId="energy"
            orientation="right"
            tick={{ fill: '#666' }}
            label={{ value: 'Est. Energy (kWh/month)', angle: 90, position: 'insideRight', fill: '#666' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number, name: string) => {
              if (name.includes('Energy')) {
                return [`${value.toLocaleString()} kWh`, name];
              }
              return [`${value.toFixed(2)} kW`, name];
            }}
          />
          <Legend />
          <Bar 
            yAxisId="power"
            dataKey="tourA" 
            name="Tour A (Avg Power)" 
            fill="#FF6B6B" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar 
            yAxisId="power"
            dataKey="tourB" 
            name="Tour B (Avg Power)" 
            fill="#4ECDC4" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
          />
          <Line 
            yAxisId="energy"
            type="monotone" 
            dataKey="tourAEnergy" 
            name="Tour A Energy" 
            stroke="#c44" 
            strokeWidth={2}
            dot={{ fill: '#c44', strokeWidth: 2 }}
            animationDuration={2000}
          />
          <Line 
            yAxisId="energy"
            type="monotone" 
            dataKey="tourBEnergy" 
            name="Tour B Energy" 
            stroke="#2a9d8f" 
            strokeWidth={2}
            dot={{ fill: '#2a9d8f', strokeWidth: 2 }}
            animationDuration={2000}
            animationBegin={500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default MonthlyChart;
