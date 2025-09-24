import React, { useState, useEffect } from 'react';
import '../styles/StreakTracker.css';

const StreakTracker = () => {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStreak = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/user/streak', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStreak(data.streak || 0);
      } catch (err) {
        console.error('Failed to fetch streak:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, [token]);

  if (loading) return <p>Loading streak...</p>;

  return (
    <div className="streak-container">
      <h3>Mood Streak</h3>
      <p>You’ve tracked your mood for</p>
      <div className="streak-days">{streak} day{streak !== 1 ? 's' : ''} in a row!</div>
      {/* <p>Keep it going 💪</p> */}
    </div>
  );
};

export default StreakTracker;
