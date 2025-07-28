import React, { useState } from 'react'; 
import { motion } from 'framer-motion';
import '../styles/Home.css';

import happy from '../assets/emotions/Happy.png';
import sad from '../assets/emotions/Sad.png';
import angry from '../assets/emotions/Angry.png';
import stressed from '../assets/emotions/Stressed.png';
import bored from '../assets/emotions/Bored.png';
import energised from '../assets/emotions/Energised.png';
import confused from '../assets/emotions/Confused.png';
import grateful from '../assets/emotions/Grateful.png';

const moods = [
  { name: 'Happy', color: '#A0D468', image: happy },
  { name: 'Sad', color: '#5D9CEC', image: sad },
  { name: 'Angry', color: '#ED5565', image: angry },
  { name: 'Stressed', color: '#48CFAD', image: stressed },
  { name: 'Bored', color: '#ccd1d9', image: bored },
  { name: 'Energised', color: '#FFCE54', image: energised },
  { name: 'Confused', color: '#FC6E51', image: confused },
  { name: 'Grateful', color: '#AC92EC', image: grateful },
];

const MoodSelector = ({ onSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood.name);
    onSelect(mood.name);
  };

  return (
    <div className="mood-grid">
      {moods.map((mood) => (
        <motion.button
          key={mood.name}
          className={`mood-card ${selectedMood === mood.name ? 'selected' : ''}`}
          style={{ backgroundColor: mood.color }}
          onClick={() => handleMoodClick(mood)}
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

export default MoodSelector;