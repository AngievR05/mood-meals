import React, { useState, useEffect } from 'react';
import '../styles/MoodTracker.css';
import JarSVG from '../components/JarSVG';
import spinner from '../assets/images/Group2.png'; // spinner image

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
  { name: 'Bored', color: '#CCD1D9', image: bored },
  { name: 'Energised', color: '#FFCE54', image: energised },
  { name: 'Confused', color: '#FC6E51', image: confused },
  { name: 'Grateful', color: '#AC92EC', image: grateful },
];

const landingPositions = [
  { cx: 90, cy: 270 },
  { cx: 120, cy: 260 },
  { cx: 150, cy: 275 },
  { cx: 105, cy: 250 },
  { cx: 135, cy: 260 },
  { cx: 170, cy: 270 },
  { cx: 80, cy: 240 },
  { cx: 145, cy: 240 },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [recentMoods, setRecentMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Fetch moods on mount
  useEffect(() => {
    const fetchMoods = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/moods', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch moods');
        const data = await res.json();
        setRecentMoods(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, [token]);

  const handleSave = async () => {
    if (!selectedMood) return setError('Please select a mood!');
    setLoading(true);
    setError('');

    const today = new Date().toISOString().split('T')[0];
    const newEntry = { mood: selectedMood, note: note || '' };

    try {
      const res = await fetch('http://localhost:5000/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      const savedMood = await res.json();
      if (!res.ok) throw new Error(savedMood.message || 'Failed to save mood');

      setRecentMoods([savedMood, ...recentMoods]);
      setSelectedMood('');
      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Map recent moods to bubbles for JarSVG
  const bubblesData = recentMoods.slice(0, 8).map((entry, i) => {
    const moodData = moods.find((m) => m.name === entry.mood);
    const pos = landingPositions[i % landingPositions.length];
    return {
      id: i,
      cx: pos.cx,
      cy: pos.cy,
      mood: entry.mood,
      color: moodData?.color || '#4a89dc',
      image: moodData?.image || '',
      note: entry.note,
    };
  });

  const today = new Date().toISOString().split('T')[0];
  const todaysMood = recentMoods.find((m) => m.date === today);

  return (
    <div className="tracker-container">
      <section className="tracker-header card">
        <h1>Your Mood History</h1>
        <p>Track your emotions, reflect, and watch your Mood Jar fill up.</p>
      </section>

      <section className="mood-entry card">
        <h2>Add Your Mood Entry</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="mood-grid">
          {moods.map((mood) => (
            <button
              key={mood.name}
              className={`mood-card ${selectedMood === mood.name ? 'selected' : ''} ${
                todaysMood?.mood === mood.name ? 'today' : ''
              }`}
              style={{ background: mood.color }}
              onClick={() => setSelectedMood(mood.name)}
              disabled={loading}
            >
              <div className="mood-icon">
                <img src={mood.image} alt={mood.name} />
              </div>
              <div className="mood-label">{mood.name}</div>
            </button>
          ))}
        </div>

        <textarea
          placeholder="Add an optional note about your mood..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="form-input"
          disabled={loading}
        />

        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? <img src={spinner} alt="Loading..." style={{ width: 24 }} /> : 'Save Mood Entry'}
        </button>
      </section>

      <section className="mood-jar-section card">
        <h2>Your Mood Jar</h2>
        <JarSVG width={240} height={340} bubblesData={bubblesData} />
      </section>

      <section className="recent-log card">
        <h2>Recent Mood Log</h2>
        {loading && <p>Loading moods...</p>}
        <ul className="log-list">
          {recentMoods.map(({ mood, note, date }, idx) => {
            const moodData = moods.find((m) => m.name === mood);
            return (
              <li key={idx} className="log-item">
                <div className="log-entry-left">
                  <img src={moodData?.image} alt={mood} className="log-mood-image" />
                  <div className="log-mood-text">
                    <div className="log-mood-name">{mood}</div>
                    <div className="log-mood-note">{note}</div>
                  </div>
                </div>
                <span className="log-date">{date}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default MoodTracker;
