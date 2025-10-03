import React, { useState, useEffect } from 'react';   
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MoodRadialChart from '../components/MoodRadialChart';
import StreakTracker from '../components/StreakTracker';
import '../styles/Profile.css';
import '../styles/Home.css'; // For consistent streak card styling
import '../styles/design-system.css';
import '../styles/utils.css';

import happy from "../assets/emotions/Happy.png";
import sad from "../assets/emotions/Sad.png";
import angry from "../assets/emotions/Angry.png";
import stressed from "../assets/emotions/Stressed.png";
import bored from "../assets/emotions/Bored.png";
import energised from "../assets/emotions/Energised.png";
import confused from "../assets/emotions/Confused.png";
import grateful from "../assets/emotions/Grateful.png";

const avatars = [
  { name: "Happy", image: happy },
  { name: "Sad", image: sad },
  { name: "Angry", image: angry },
  { name: "Stressed", image: stressed },
  { name: "Bored", image: bored },
  { name: "Energised", image: energised },
  { name: "Confused", image: confused },
  { name: "Grateful", image: grateful },
];

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [user, setUser] = useState(null);
  const [moodStats, setMoodStats] = useState([]);
  const [streak, setStreak] = useState(0);
  const [savedMeals, setSavedMeals] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [preferences, setPreferences] = useState({ diet:'', moodGoal:'' });
  const [journal, setJournal] = useState([]);
  const [newJournalText, setNewJournalText] = useState('');
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword:'', newPassword:'', confirmPassword:'' });

  const [groceryCount, setGroceryCount] = useState(0);
  const [mealStats, setMealStats] = useState({ streak:0, variety:0 });

  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const getTopEmotions = (entries) => {
    const counts = {};
    entries.forEach(e => {
      if (!e.mood) return;
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a,b)=> b[1]-a[1])
      .map(([m,c]) => ({ mood: m, count: c }));
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [
          userRes, moodRes, streakRes, mealsRes, currentMoodRes,
          groceryRes, mealStatsRes, prefsRes, journalRes
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/profile', authConfig),
          axios.get('http://localhost:5000/api/profile/mood-entries?range=90', authConfig),
          axios.get('http://localhost:5000/api/profile/streak', authConfig),
          axios.get('http://localhost:5000/api/profile/saved-meals', authConfig),
          axios.get('http://localhost:5000/api/profile/current-mood', authConfig),
          axios.get('http://localhost:5000/api/profile/grocery-count', authConfig),
          axios.get('http://localhost:5000/api/profile/meal-stats', authConfig),
          axios.get('http://localhost:5000/api/profile/preferences', authConfig),
          axios.get('http://localhost:5000/api/profile/journal?limit=5', authConfig),
        ]);

        setUser(userRes.data || {});
        setEditData({
          username: userRes.data?.username || '',
          email: userRes.data?.email || '',
          avatar: userRes.data?.profile_picture || 'Happy'
        });
        setMoodStats(moodRes.data || []);
        setStreak(streakRes.data?.streak || 0);
        setSavedMeals(mealsRes.data || []);
        setCurrentMood(currentMoodRes.data || null);
        setGroceryCount(groceryRes.data?.count || 0);
        setMealStats(mealStatsRes.data || { streak:0, variety:0 });
        setPreferences(prefsRes.data || { diet:'', moodGoal:'' });
        setJournal(journalRes.data || []);
      } catch(err){
        console.error('Profile fetch error', err);
        if(err.response?.status === 401){
          localStorage.removeItem('token');
          navigate('/');
        } else alert('Failed to fetch profile data.');
      } finally { setLoading(false); }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const saveProfile = async () => {
    try {
      await axios.put('http://localhost:5000/api/profile', editData, authConfig);
      setUser(prev => ({ ...prev, ...editData }));
      setShowEditModal(false);
    } catch(err){ console.error(err); alert('Failed to update profile'); }
  };

  const changePassword = async () => {
    if(passwordData.newPassword !== passwordData.confirmPassword){
      alert('Passwords do not match');
      return;
    }
    try{
      await axios.put('http://localhost:5000/api/profile/change-password', passwordData, authConfig);
      alert('Password updated');
      setShowPasswordModal(false);
      setPasswordData({ oldPassword:'', newPassword:'', confirmPassword:'' });
    } catch(err){ console.error(err); alert(err.response?.data?.error || 'Failed to change password'); }
  };

  const handleRemoveSavedMeal = async (mealId) => {
    if(!window.confirm('Remove this saved meal?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/profile/saved-meals/${mealId}`, authConfig);
      setSavedMeals(prev => prev.filter(m => m.id !== mealId));
    } catch(err){ console.error(err); alert('Failed to remove saved meal'); }
  };

  const handleViewMeal = (mealId) => navigate(`/meals/${mealId}`);

  const savePreferences = async () => {
    try{
      await axios.put('http://localhost:5000/api/profile/preferences', preferences, authConfig);
      alert('Preferences saved');
    } catch(err){ console.error(err); alert('Failed to save preferences'); }
  };

  const addJournalEntry = async () => {
    if(!newJournalText.trim()) return;
    try{
      const res = await axios.post('http://localhost:5000/api/profile/journal', { text:newJournalText }, authConfig);
      setJournal(prev => [res.data, ...prev].slice(0,5));
      setNewJournalText('');
    } catch(err){ console.error(err); alert('Failed to add journal entry'); }
  };

  if(!user || loading) return <div className="loading">Loading profile…</div>;

  const topEmotions = getTopEmotions(moodStats).slice(0,4);

  const monthDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0,10);
    const moodEntry = moodStats.find(m => (m.date || m.created_at || '').slice(0,10) === dateStr);
    return { date: dateStr, mood: moodEntry?.mood || null };
  }).reverse();

  return (
    <div className="profile-container">

      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={avatars.find(a=>a.name===user.avatar)?.image || happy} alt="avatar" />
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <span className="username">@{user.username}</span>
          <p className="email">{user.email}</p>
          <p className="tagline">{user.tagline || 'Tracking vibes & good food'}</p>
        </div>
        <div className="profile-actions">
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
          <button className="btn edit-btn" onClick={()=>setShowEditModal(true)}>Edit Profile</button>
          <button className="btn edit-btn" onClick={()=>setShowPasswordModal(true)}>Change Password</button>
        </div>
      </div>

      {/* Top Row: Streak tracker aligned like Home page */}
      <section className="streak-grocery-wrapper">
        <div className="streak-wrapper">
          <StreakTracker currentMood={currentMood?.mood} />
        </div>
      </section>

      {/* Mood Overview + Calendar */}
      <section className="section mood-stats-section">
        <h2>Mood Overview</h2>
        <div className="mood-stats-wrapper">
          <div className="chart-column">
            <MoodRadialChart data={moodStats} />
            <div className="top-emotions">
              <h4>Top Emotions</h4>
              <ul>
                {topEmotions.length ? topEmotions.map(t => (
                  <li key={t.mood}>
                    <img src={avatars.find(a=>a.name===t.mood)?.image || happy} alt={t.mood} />
                    <span className="emotion-name">{t.mood}</span>
                    <span className="emotion-count">{t.count}x</span>
                  </li>
                )) : <li>No moods logged yet</li>}
              </ul>
            </div>
          </div>
          <div className="calendar-column">
            <h4>Last 30 Days</h4>
            <div className="mood-calendar">
              {monthDates.map(d => (
                <div key={d.date} className={`mood-day ${d.mood ? 'has-mood' : 'empty'}`} title={`${d.date} ${d.mood || ''}`} onClick={()=>{ if(d.mood) navigate(`/mood/${d.date}`); }}>
                  {d.mood ? <img src={avatars.find(a=>a.name===d.mood)?.image} alt={d.mood} /> : <div className="dot" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Saved Meals */}
      <section className="section saved-meals-section">
        <h2>Saved Meals</h2>
        <div className="saved-meals-list">
          {savedMeals.length ? savedMeals.map(m => (
            <div key={m.id} className="saved-meal-card">
              <img src={m.image_url || '/placeholder-meal.png'} alt={m.name} />
              <div className="meal-info">
                <h4>{m.name}</h4>
                <p className="meal-mood">Matched moods: {m.mood || '—'}</p>
                <div className="meal-actions">
                  <button className="btn small" onClick={()=>handleViewMeal(m.id)}>View</button>
                  <button className="btn small danger" onClick={()=>handleRemoveSavedMeal(m.id)}>Remove</button>
                </div>
              </div>
            </div>
          )) : <div className="empty">No saved meals yet</div>}
        </div>
      </section>

      {/* Preferences */}
      <section className="section prefs-section">
        <h2>Personalization & Goals</h2>
        <p>Set your diet and mood tracking goals to improve recommendations.</p>
        <div className="prefs-grid">
          <div className="pref-card">
            <h4>Dietary Preference</h4>
            <select value={preferences.diet || ''} onChange={e=>setPreferences({...preferences, diet:e.target.value})}>
              <option value="">None</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="low-sugar">Low sugar</option>
              <option value="keto">Keto</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="no-pref">No preference</option>
            </select>
          </div>

          <div className="pref-card">
            <h4>Mood Goal</h4>
            <input type="text" placeholder="e.g. feel Energised more often" value={preferences.moodGoal || ''} onChange={e=>setPreferences({...preferences, moodGoal:e.target.value})} />
            <small>Set a short weekly mood goal — used by suggestions.</small>
          </div>

          <div className="pref-card actions">
            <button className="btn save-btn" onClick={savePreferences}>Save Preferences</button>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="section journal-section">
        <h2>Journal</h2>
        <p>Write quick notes or reflections to track your mood journey.</p>
        <div className="journal-input">
          <textarea placeholder="Write a quick note…" value={newJournalText} onChange={e=>setNewJournalText(e.target.value)} rows={3} />
          <div className="journal-controls"><button className="btn save-btn" onClick={addJournalEntry}>Add</button></div>
        </div>

        <div className="journal-list">
          {journal.length ? journal.map(j => (
            <div key={j.id} className="journal-item">
              <div className="journal-date">{(j.date || j.created_at || '').slice(0,10)}</div>
              <div className="journal-text">{j.text}</div>
            </div>
          )) : <div className="empty">No journal notes yet.</div>}
        </div>
      </section>

    </div>
  );
};

export default Profile;
