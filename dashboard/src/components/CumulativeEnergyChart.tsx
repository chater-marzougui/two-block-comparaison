import React, { useState, useEffect } from 'react';
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
import { fetchCumulativeEnergy } from '../services/api';

interface CumulativeEnergyData {
  date: string;
  tourA: number;
  tourB: number;
}

const CumulativeEnergyChart: React.FC = () => {
  const [data, setData] = useState<CumulativeEnergyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [aggregation, setAggregation] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [tourATotal, setTourATotal] = useState<number>(0);
  const [tourBTotal, setTourBTotal] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, [startDate, endDate, aggregation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchCumulativeEnergy({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        aggregation,
      });
      setData(response.data);
      setTourATotal(response.summary.tourATotal);
      setTourBTotal(response.summary.tourBTotal);
      setError(null);
    } catch (err) {
      setError('Failed to load cumulative energy data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chart-container full-width">
        <div className="loading-spinner">⏳</div>
        <p>Loading cumulative energy data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container full-width">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="chart-container full-width"
    >
      <div className="chart-header">
        <div>
          <h2 className="chart-title">⚡ Cumulative Energy Consumption</h2>
          <p className="chart-subtitle">
            Total: Tour A = {tourATotal.toFixed(2)} kWh | Tour B = {tourBTotal.toFixed(2)} kWh
          </p>
        </div>
        <div className="chart-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div>
            <label htmlFor="start-date" style={{ marginRight: '5px', fontSize: '12px' }}>Start:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '12px',
              }}
            />
          </div>
          <div>
            <label htmlFor="end-date" style={{ marginRight: '5px', fontSize: '12px' }}>End:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '12px',
              }}
            />
          </div>
          <div>
            <label htmlFor="aggregation" style={{ marginRight: '5px', fontSize: '12px' }}>View:</label>
            <select
              id="aggregation"
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value as 'hourly' | 'daily' | 'weekly')}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#666', fontSize: 11 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              if (aggregation === 'hourly') {
                return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
              }
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#666' }}
            label={{ value: 'Cumulative Energy (kWh)', angle: -90, position: 'insideLeft', fill: '#666' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [`${value.toFixed(2)} kWh`, '']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="tourA"
            name="Tour A"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#ef4444' }}
            animationDuration={2000}
          />
          <Line
            type="monotone"
            dataKey="tourB"
            name="Tour B"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#10b981' }}
            animationDuration={2000}
            animationBegin={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CumulativeEnergyChart;
