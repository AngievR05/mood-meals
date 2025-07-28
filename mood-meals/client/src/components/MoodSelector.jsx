import React from 'react';
import '../styles/Home.css';

const moods = [
  { name: 'Happy', color: '#FFE066' },
  { name: 'Sad', color: '#85C1E9' },
  { name: 'Angry', color: '#F25C54' },
  { name: 'Stressed', color: '#B37BA4' },
  { name: 'Bored', color: '#A0AAB2' },
  { name: 'Energised', color: '#55DDE0' },
  { name: 'Confused', color: '#A29BFE' },
  { name: 'Grateful', color: '#81C784' },
];

const MoodSelector = () => {
  return (
    <div className="mood-grid">
      {moods.map((mood) => (
        <button
          key={mood.name}
          className="mood-card"
          style={{ backgroundColor: mood.color }}
        >
          <span className="mood-icon">{mood.name.charAt(0)}</span>
          <span className="mood-label">{mood.name}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
