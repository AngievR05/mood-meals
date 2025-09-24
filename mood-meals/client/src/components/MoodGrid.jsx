import React from 'react';
import { motion } from 'framer-motion';
import '../styles/MoodGrid.css';

const MoodGrid = ({ moods, selectedMood, onSelect, disabled = false, highlightToday }) => {
  return (
    <div className="mood-grid">
      {moods.map((mood) => (
        <motion.button
          key={mood.name}
          className={`mood-card 
            ${selectedMood === mood.name ? 'selected' : ''} 
            ${highlightToday === mood.name ? 'today' : ''}`}
          style={{ backgroundColor: mood.color }}
          onClick={() => onSelect(mood.name)}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="mood-icon">
            <img src={mood.image} alt={mood.name} />
          </span>
          <span className="mood-label">{mood.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default MoodGrid;
