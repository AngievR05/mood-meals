import React from 'react';
import '../styles/MoodJar.css';

const moodColors = {
  Happy: '#f6cd61',
  Angry: '#f26c63',
  Sad: '#70c1b3',
  Sick: '#f7cac9',
  Anxiety: '#cbaacb',
};

const MoodJar = ({ moodEntries = [] }) => {
  if (!moodEntries.length) {
    return (
      <div className="mood-jar-wrapper">
        <h2 className="mood-jar-title">Mood Tracker</h2>
        <p>No moods logged yet.</p>
      </div>
    );
  }

  return (
    <div className="mood-jar-wrapper">
      <h2 className="mood-jar-title">Mood Tracker</h2>
      
      <div className="jar-container">
        <div className="jar-glass">
          {moodEntries.map((mood, index) => (
            <div
              key={index}
              className="jar-bubble"
              style={{ backgroundColor: moodColors[mood] || '#ddd' }}
              title={mood}
            ></div>
          ))}
        </div>
      </div>

      <div className="jar-legend">
        {Object.entries(moodColors).map(([mood, color]) => (
          <div key={mood} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: color }}></span>
            <span className="legend-label">{mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodJar;
