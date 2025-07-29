import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MoodTracker.css';

const moodData = {
  '2025-07-01': 'happy',
  '2025-07-04': 'sad',
  '2025-07-05': 'angry',
  '2025-07-10': 'stressed',
  '2025-07-15': 'bored',
  '2025-07-20': 'energised',
  '2025-07-25': 'confused',
  '2025-07-30': 'grateful',
};

const MoodTracker = () => {
  const [date, setDate] = useState(new Date());

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().slice(0, 10);
      if (moodData[dateString]) {
        return <div className={`mood-dot ${moodData[dateString].toLowerCase()}`}></div>;
      }
    }
    return null;
  };

  return (
    <div className="mood-tracker-container">
      <h2>Mood Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
      />
    </div>
  );
};

export default MoodTracker;
