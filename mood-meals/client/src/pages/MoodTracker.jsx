import React, { useState, useEffect } from 'react';
import '../styles/MoodTracker.css';
import '../styles/StreakTracker.css';
import JarSVG from '../components/JarSVG';
import spinner from '../assets/images/Group2.png';
import MoodRadialChart from '../components/MoodRadialChart';

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
  const [todaysMood, setTodaysMood] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchJSON = async (url, options) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    }
    if (!res.ok) {
      throw new Error(data?.message || 'Request failed');
    }
    return data;
  };

  // Fetch moods, streak, and today's mood
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const moodsData = await fetchJSON('http://localhost:5000/api/moods', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentMoods(Array.isArray(moodsData) ? moodsData : []);

        const todayData = await fetchJSON('http://localhost:5000/api/moods/today', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodaysMood(todayData);

        const streakData = await fetchJSON('http://localhost:5000/api/user/streak', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStreak(streakData.streak || 0);
      } catch (err) {
        setError(err.message);
        setRecentMoods([]);
        setTodaysMood(null);
        setStreak(0);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleSave = async () => {
    if (!selectedMood) return setError('Please select a mood!');
    setLoading(true);
    setError('');
    try {
      const savedMood = await fetchJSON('http://localhost:5000/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood: selectedMood, note }),
      });

      // Update recent moods and today's mood
      setRecentMoods(prev => [savedMood, ...(prev || []).filter(m => m.id !== savedMood.id)]);
      setTodaysMood(savedMood);

      // Refresh streak
      const streakData = await fetchJSON('http://localhost:5000/api/user/streak', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreak(streakData.streak || 0);

      setSelectedMood('');
      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bubblesData = (recentMoods || []).slice(0, 8).map((entry, i) => {
    const moodData = moods.find(m => m.name === entry.mood);
    const pos = landingPositions[i % landingPositions.length];
    return {
      id: entry.id || i,
      cx: pos.cx,
      cy: pos.cy,
      mood: entry.mood || '',
      color: moodData?.color || '#ddd',
      image: moodData?.image || '',
      note: entry.note || '',
    };
  });

  return (
    <div className="tracker-container">
      <section className="tracker-header card">
        <h1>Your Mood Tracker</h1>
        <p>Track your emotions, reflect, and watch your Mood Jar fill up.</p>
        <div className="streak-inline">
          <h3>🔥 Current Streak:</h3>
          <span className="streak-days">{streak} {streak === 1 ? 'day' : 'days'}</span>
        </div>
      </section>

      <section className="mood-entry card">
        <h2>Add Your Mood Entry</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="mood-grid">
          {moods.map(mood => (
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
          placeholder="Add an optional note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="form-input"
          disabled={loading}
        />

        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? <img src={spinner} alt="Loading..." style={{ width: 24 }} /> : 'Save Mood Entry'}
        </button>
      </section>

      <section className="mood-jar-log-wrapper card">
        <div className="mood-jar-section">
          <h2>Your Mood Jar</h2>
          <JarSVG width={240} height={340} bubblesData={bubblesData} />
        </div>

        <div className="recent-log">
          <h2>Recent Mood Log</h2>
          {loading && <p>Loading moods...</p>}
          <ul className="log-list">
            {(!recentMoods || recentMoods.length === 0) && !loading && <p>No moods logged yet.</p>}
            {recentMoods.map(({ id, mood, note, created_at }, idx) => {
              const moodData = moods.find(m => m.name === mood);
              const date = created_at ? new Date(created_at).toLocaleDateString() : '';
              return (
                <li key={id || idx} className="log-item">
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
        </div>
      </section>
      <MoodRadialChart />
    </div>
  );
};

export default MoodTracker;
