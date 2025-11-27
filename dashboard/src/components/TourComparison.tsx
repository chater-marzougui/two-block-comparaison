import React from 'react';
import { motion } from 'framer-motion';
import { tourSummary } from '../data/powerData';

const TourComparison: React.FC = () => {
  const tourA = tourSummary[0];
  const tourB = tourSummary[1];

  const comparisonItems = [
    { label: 'Average Power', valueA: `${tourA.avgPower} kW`, valueB: `${tourB.avgPower} kW`, winner: tourB.avgPower < tourA.avgPower ? 'B' : 'A' },
    { label: 'Peak Power', valueA: `${tourA.maxPower} kW`, valueB: `${tourB.maxPower} kW`, winner: tourB.maxPower < tourA.maxPower ? 'B' : 'A' },
    { label: 'Weekday Avg', valueA: `${tourA.weekdayAvg} kW`, valueB: `${tourB.weekdayAvg} kW`, winner: tourB.weekdayAvg < tourA.weekdayAvg ? 'B' : 'A' },
    { label: 'Weekend Avg', valueA: `${tourA.weekendAvg} kW`, valueB: `${tourB.weekendAvg} kW`, winner: tourB.weekendAvg < tourA.weekendAvg ? 'B' : 'A' },
    { label: 'Monthly Usage', valueA: `${tourA.estimatedMonthlyKwh} kWh`, valueB: `${tourB.estimatedMonthlyKwh} kWh`, winner: tourB.estimatedMonthlyKwh < tourA.estimatedMonthlyKwh ? 'B' : 'A' },
    { label: 'Data Coverage', valueA: `${tourA.dataCoverage}%`, valueB: `${tourB.dataCoverage}%`, winner: tourB.dataCoverage > tourA.dataCoverage ? 'B' : 'A' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="comparison-table-container"
    >
      <h2 className="section-title">⚔️ Head-to-Head Comparison</h2>
      <div className="comparison-table">
        <div className="comparison-header">
          <div className="header-cell metric">Metric</div>
          <motion.div 
            className="header-cell tour-a"
            whileHover={{ scale: 1.05 }}
          >
            <span className="tour-badge tour-a-badge">Tour A</span>
          </motion.div>
          <motion.div 
            className="header-cell tour-b"
            whileHover={{ scale: 1.05 }}
          >
            <span className="tour-badge tour-b-badge">Tour B</span>
          </motion.div>
        </div>
        {comparisonItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="comparison-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            whileHover={{ backgroundColor: '#f8f9fa' }}
          >
            <div className="row-cell metric">{item.label}</div>
            <div className={`row-cell value ${item.winner === 'A' ? 'winner' : ''}`}>
              {item.valueA}
              {item.winner === 'A' && <span className="crown">👑</span>}
            </div>
            <div className={`row-cell value ${item.winner === 'B' ? 'winner' : ''}`}>
              {item.valueB}
              {item.winner === 'B' && <span className="crown">👑</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TourComparison;
