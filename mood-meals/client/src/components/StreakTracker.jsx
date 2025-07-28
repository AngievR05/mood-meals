import React from 'react';
import '../styles/StreakTracker.css';

const StreakTracker = ({ streak = 3 }) => {
  return (
    <div className="streak-container">
      <h3>🔥 Mood Streak</h3>
      <p>You’ve tracked your mood for</p>
      <div className="streak-days">{streak} days in a row!</div>
      <p>Keep it going 💪</p>
    </div>
  );
};

export default StreakTracker;
