import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
      className="stat-card"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <motion.p 
          className="stat-value"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        >
          {value}
        </motion.p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
