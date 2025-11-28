import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useData } from '../context/DataContext';

const InsightCards: React.FC = () => {
  const { insights, loading, error } = useData();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  if (loading || error || insights.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="insights-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="section-title">🔍 Key Insights</h2>
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            className="insight-card"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 15px 40px rgba(0,0,0,0.15)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span 
              className="insight-icon"
              animate={{ 
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
            >
              {insight.icon}
            </motion.span>
            <h3 className="insight-title">{insight.title}</h3>
            <motion.p 
              className="insight-value"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            >
              {insight.value}
            </motion.p>
            <p className="insight-description">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InsightCards;
