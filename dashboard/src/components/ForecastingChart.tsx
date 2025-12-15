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
import { fetchForecasting } from '../services/api';

interface ForecastingData {
  date: string;
  tourAPredicted: number | null;
  tourBPredicted: number | null;
  tourAActual: number | null;
  tourBActual: number | null;
}

const ForecastingChart: React.FC = () => {
  const [data, setData] = useState<ForecastingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scenario, setScenario] = useState<'1_week' | '1_month'>('1_week');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchForecasting({
        scenario,
      });

      // Combine the data into a single array for the chart
      const combinedData: ForecastingData[] = [];
      const maxLength = Math.max(
        response.tourA.dates.length,
        response.tourB.dates.length
      );

      for (let i = 0; i < maxLength; i++) {
        combinedData.push({
          date: response.tourA.dates[i] || response.tourB.dates[i],
          tourAPredicted: response.tourA.predicted[i],
          tourBPredicted: response.tourB.predicted[i],
          tourAActual: response.tourA.actual[i],
          tourBActual: response.tourB.actual[i],
        });
      }

      setData(combinedData);
      setError(null);
    } catch (err) {
      setError('Failed to load forecasting data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chart-container full-width">
        <div className="loading-spinner">⏳</div>
        <p>Loading forecasting data...</p>
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

  const scenarioTitle =
    scenario === '1_week'
      ? '1 Week Forecast (after 3 weeks)'
      : '1 Month Forecast (after 3 months)';

  const modelName = scenario === '1_week' ? 'Exponential Smoothing' : 'ElasticNet';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="chart-container full-width"
    >
      <div className="chart-header">
        <div>
          <h2 className="chart-title">🔮 Energy Consumption Forecast</h2>
          <p className="chart-subtitle">
            {scenarioTitle} using {modelName}
          </p>
        </div>
        <div className="chart-controls">
          <label htmlFor="scenario" style={{ marginRight: '10px', fontSize: '12px' }}>
            Scenario:
          </label>
          <select
            id="scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value as '1_week' | '1_month')}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <option value="1_week">1 Week (Exponential Smoothing)</option>
            <option value="1_month">1 Month (ElasticNet)</option>
          </select>
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
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fill: '#666' }}
            label={{
              value: 'Power (kW)',
              angle: -90,
              position: 'insideLeft',
              fill: '#666',
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number | null) => [`${value !== null ? value.toFixed(2) : 'N/A'} kW`, '']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          {/* Tour A - Predicted */}
          <Line
            type="monotone"
            dataKey="tourAPredicted"
            name="Tour A Predicted"
            stroke="#ff6b6b"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#ff6b6b' }}
            animationDuration={2000}
          />
          {/* Tour B - Predicted */}
          <Line
            type="monotone"
            dataKey="tourBPredicted"
            name="Tour B Predicted"
            stroke="#4ecdc4"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#4ecdc4' }}
            animationDuration={2000}
            animationBegin={300}
          />
          {/* Tour A - Actual (if available) */}
          <Line
            type="monotone"
            dataKey="tourAActual"
            name="Tour A Actual"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: '#ef4444' }}
            animationDuration={2000}
            animationBegin={600}
            connectNulls={false}
          />
          {/* Tour B - Actual (if available) */}
          <Line
            type="monotone"
            dataKey="tourBActual"
            name="Tour B Actual"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6, fill: '#10b981' }}
            animationDuration={2000}
            animationBegin={900}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
          <strong>Legend:</strong> Dashed lines represent predicted values using the trained model.
          Solid lines show actual measured values (when available from test data).
        </p>
        <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
          <strong>Model:</strong> {modelName} is used for this forecast scenario.
        </p>
      </div>
    </motion.div>
  );
};

export default ForecastingChart;
