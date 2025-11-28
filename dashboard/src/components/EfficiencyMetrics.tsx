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
  Cell,
} from 'recharts';
import { useData } from '../context/DataContext';

const EfficiencyMetrics: React.FC = () => {
  const { tourA, tourB, loading, error } = useData();

  if (loading || error || !tourA || !tourB) {
    return null;
  }

  const loadFactorData = [
    { name: 'Tour A', value: tourA.loadFactor, fill: '#ef4444' },
    { name: 'Tour B', value: tourB.loadFactor, fill: '#10b981' },
  ];

  const peakToAvgData = [
    { name: 'Tour A', value: tourA.peakToAvgRatio, fill: '#ef4444' },
    { name: 'Tour B', value: tourB.peakToAvgRatio, fill: '#10b981' },
  ];

  const energyData = [
    { name: 'Tour A', value: tourA.totalEnergyKwh, fill: '#ef4444' },
    { name: 'Tour B', value: tourB.totalEnergyKwh, fill: '#10b981' },
  ];

  const weekdayWeekendData = [
    { period: 'Weekday', tourA: tourA.weekdayAvg, tourB: tourB.weekdayAvg },
    { period: 'Weekend', tourA: tourA.weekendAvg, tourB: tourB.weekendAvg },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="efficiency-metrics-container"
    >
      <h2 className="section-title">📊 Efficiency Metrics Comparison</h2>
      <div className="metrics-grid">
        {/* Load Factor */}
        <motion.div 
          className="metric-card"
          whileHover={{ scale: 1.02 }}
        >
          <h3>Load Factor</h3>
          <p className="metric-subtitle">Higher = Better Utilization</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={loadFactorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" domain={[0, 1]} tick={{ fill: '#666' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(3), 'Load Factor']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1500}>
                {loadFactorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="metric-values">
            <span className="tour-a">A: {tourA.loadFactor.toFixed(3)}</span>
            <span className="tour-b">B: {tourB.loadFactor.toFixed(3)}</span>
          </div>
        </motion.div>

        {/* Peak to Average Ratio */}
        <motion.div 
          className="metric-card"
          whileHover={{ scale: 1.02 }}
        >
          <h3>Peak/Average Ratio</h3>
          <p className="metric-subtitle">Lower = More Consistent Load</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakToAvgData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fill: '#666' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(2), 'Ratio']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1500}>
                {peakToAvgData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="metric-values">
            <span className="tour-a">A: {tourA.peakToAvgRatio.toFixed(2)}</span>
            <span className="tour-b">B: {tourB.peakToAvgRatio.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Total Energy */}
        <motion.div 
          className="metric-card"
          whileHover={{ scale: 1.02 }}
        >
          <h3>Total Energy Consumption</h3>
          <p className="metric-subtitle">Cumulative energy usage (kWh)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={energyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tick={{ fill: '#666' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString() + ' kWh', 'Energy']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1500}>
                {energyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="metric-values">
            <span className="tour-a">A: {tourA.totalEnergyKwh.toLocaleString()} kWh</span>
            <span className="tour-b">B: {tourB.totalEnergyKwh.toLocaleString()} kWh</span>
          </div>
        </motion.div>

        {/* Weekday vs Weekend */}
        <motion.div 
          className="metric-card"
          whileHover={{ scale: 1.02 }}
        >
          <h3>Weekday vs Weekend</h3>
          <p className="metric-subtitle">Average power comparison (kW)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekdayWeekendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="period" tick={{ fill: '#666' }} />
              <YAxis tick={{ fill: '#666' }} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(2) + ' kW', '']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="tourA" name="Tour A" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tourB" name="Tour B" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EfficiencyMetrics;
