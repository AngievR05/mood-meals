import React, { useState, useEffect } from 'react';
import '../styles/StreakTracker.css';

// Helper to darken/lighten a hex color
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = Math.min(255, Math.max(0, R + (R * percent)/100));
  G = Math.min(255, Math.max(0, G + (G * percent)/100));
  B = Math.min(255, Math.max(0, B + (B * percent)/100));

  return `rgb(${R},${G},${B})`;
};

const StreakTracker = ({ currentMood }) => {
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

  // Use mood color if available, fallback to default orange
  const baseColor = currentMood?.color || '#ff9900';
  const darkerColor = shadeColor(baseColor, -20);

  return (
    <div
      className="streak-container"
      style={{ background: `linear-gradient(90deg, ${baseColor}, ${darkerColor})` }}
    >
      <h3>Mood Streak</h3>
      <p>You’ve tracked your mood for</p>
      <div className="streak-days">
        {streak} day{streak !== 1 ? 's' : ''} in a row!
      </div>
    </div>
  );
};

export default StreakTracker;
