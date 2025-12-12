import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getDistributionData, DistributionData } from '../services/api';
import { useData } from '../context/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  const chartData = {
    labels: tourA.histogram.map(bin => bin.binCenter.toFixed(1)),
    datasets: [
      {
        label: 'Tour A',
        data: tourA.histogram.map(bin => bin.count),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tour B',
        data: tourB.histogram.map(bin => bin.count),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value} readings`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Power (kW)',
          color: '#9ca3af',
        },
        ticks: {
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
          color: '#9ca3af',
        },
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
    },
  };

  return (
    <motion.div 
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="chart-title">📊 Power Distribution Analysis</h2>
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="stats-summary" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div className="tour-stats">
          <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Tour A Statistics</h3>
          <div className="stat-row">
            <span>Mean:</span>
            <strong>{tourA.statistics.mean} kW</strong>
          </div>
          <div className="stat-row">
            <span>Median:</span>
            <strong>{tourA.statistics.median} kW</strong>
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
            <strong>{tourB.statistics.mean} kW</strong>
          </div>
          <div className="stat-row">
            <span>Median:</span>
            <strong>{tourB.statistics.median} kW</strong>
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
