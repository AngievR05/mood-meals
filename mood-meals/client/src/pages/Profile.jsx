import React, { useState, useEffect } from 'react';   
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MoodRadialChart from '../components/MoodRadialChart';
import StreakTracker from '../components/StreakTracker';
import '../styles/Profile.css';

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
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ username:'', email:'', avatar:'Happy' });
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://moodmeals.site/api";

  const getTopEmotions = (entries) => {
    if (!Array.isArray(entries)) return [];
    const counts = {};
    entries.forEach(e => { if(!e.mood) return; counts[e.mood] = (counts[e.mood]||0)+1; });
    return Object.entries(counts)
      .sort((a,b)=>b[1]-a[1])
      .map(([m,count])=>({ mood:m, count }));
  };

  useEffect(() => {
    if(!token){ navigate('/'); return; }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [userRes, moodRes, streakRes, mealsRes, currentMoodRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/profile`, authConfig),
          axios.get(`${BACKEND_URL}/profile/mood-entries?range=90`, authConfig),
          axios.get(`${BACKEND_URL}/profile/streak`, authConfig),
          axios.get(`${BACKEND_URL}/saved-meals`, authConfig),
          axios.get(`${BACKEND_URL}/profile/current-mood`, authConfig),
        ]);

        setUser(userRes.data || {});
        setEditData({
          username: userRes.data?.username || '',
          email: userRes.data?.email || '',
          avatar: userRes.data?.avatar || 'Happy'
        });

        setMoodStats(Array.isArray(moodRes.data) ? moodRes.data : []);
        setStreak(streakRes.data?.streak || 0);
        setSavedMeals(Array.isArray(mealsRes.data) ? mealsRes.data.map(m => ({ ...m, saved: true })) : []);
        setCurrentMood(currentMoodRes.data || null);

      } catch(err){
        console.error('Profile fetch error', err);
        if(err.response?.status === 401){
          localStorage.removeItem('token'); 
          navigate('/');
        } else {
          alert('Failed to fetch profile data.');
        }
      } finally {
        setLoading(false);
      }
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
      await axios.put(`${BACKEND_URL}/profile`, editData, authConfig);
      setUser(prev => ({ ...prev, ...editData }));
      setShowEditModal(false); 
    } catch(err){ 
      console.error(err); 
      alert('Failed to update profile'); 
    }
  };

  const toggleSaveMeal = async (mealId, currentlySaved) => {
    try {
      const url = `${BACKEND_URL}/saved-meals/${mealId}/${currentlySaved ? "unsave" : "save"}`;
      await axios({ method: currentlySaved ? "DELETE" : "POST", url, headers: authConfig.headers });
      setSavedMeals(prev => prev.map(m => m.id === mealId ? { ...m, saved: !currentlySaved } : m).filter(m => !currentlySaved || m.id !== mealId));
    } catch(err){
      console.error("Failed to toggle saved meal:", err);
      alert(err.response?.data?.message || "Failed to toggle saved meal");
    }
  };

  if(!user || loading) return <div className="loading">Loading profile…</div>;

  const topEmotions = getTopEmotions(moodStats).slice(0,4);
  const monthDates = Array.from({length:30},(_,i)=>{
    const d=new Date(); 
    d.setDate(d.getDate()-i); 
    const dateStr=d.toISOString().slice(0,10); 
    const moodEntry = moodStats.find(m=>(m.date||m.created_at||'').slice(0,10)===dateStr); 
    return {date:dateStr, mood:moodEntry?.mood||null}; 
  }).reverse();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={avatars.find(a=>a.name===user.avatar)?.image||happy} alt="avatar" />
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <span className="username">@{user.username}</span>
          <p className="email">{user.email}</p>
        </div>
        <div className="profile-actions">
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
          <button className="btn edit-btn" onClick={()=>setShowEditModal(true)}>Edit Profile</button>
        </div>
      </div>

      <section className="streak-calendar-section top-row">
        <div className="streak-wrapper"><StreakTracker currentMood={currentMood?.mood} /></div>
        <div className="calendar-column">
          <h4>Last 30 Days</h4>
          <div className="mood-calendar">
            {monthDates.map(d=>(
              <div key={d.date} className={`mood-day ${d.mood?'has-mood':'empty'}`} title={`${d.date} ${d.mood||''}`} onClick={()=>{if(d.mood) navigate(`/mood/${d.date}`);}}>
                {d.mood ? <img src={avatars.find(a=>a.name===d.mood)?.image} alt={d.mood}/> : <div className="dot"/>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section saved-meals-section">
        <h2>Saved Meals</h2>
        <div className="saved-meals-buttons">
          <Link to="/saved-meals" className="btn primary">Saved Meals</Link>
          <Link to="/recipes" className="btn secondary">Browse Meals</Link>
        </div>
        <div className="saved-meals-list">
          {savedMeals.length ? savedMeals.map(m=>(
            <div key={m.id} className="saved-meal-card">
              <img src={m.image_url||'/placeholder-meal.png'} alt={m.name}/>
              <div className="meal-info">
                <h4>{m.name}</h4>
                <p className="meal-mood">Matched moods: {m.mood||'—'}</p>
                <div className="meal-actions">
                  <button className="btn small" onClick={()=>navigate(`/meals/${m.id}`)}>View</button>
                  <button className={`btn small ${m.saved?'danger':'primary'}`} onClick={()=>toggleSaveMeal(m.id, m.saved)}>
                    {m.saved ? 'Remove' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )) : <div className="empty">No saved meals yet</div>}
        </div>
      </section>

      <section className="section mood-stats-section">
        <h2>Mood Overview</h2>
        <div className="mood-stats-wrapper chart-top-emotions">
          <MoodRadialChart data={moodStats} />
          <div className="top-emotions">
            <h4>Top Emotions</h4>
            <ul>
              {topEmotions.length ? topEmotions.map(t=>(
                <li key={t.mood}>
                  <img src={avatars.find(a=>a.name===t.mood)?.image||happy} alt={t.mood}/>
                  <span className="emotion-name">{t.mood}</span>
                  <span className="emotion-count">{t.count}x</span>
                </li>
              )) : <li>No moods logged yet</li>}
            </ul>
          </div>
        </div>
      </section>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <label>Username</label>
            <input type="text" value={editData.username} onChange={e=>setEditData({...editData, username:e.target.value})} />
            <label>Email</label>
            <input type="email" value={editData.email} onChange={e=>setEditData({...editData, email:e.target.value})} />
            <label>Avatar</label>
            <select value={editData.avatar} onChange={e=>setEditData({...editData, avatar:e.target.value})}>
              {avatars.map(a=><option key={a.name} value={a.name}>{a.name}</option>)}
            </select>
            <div className="modal-actions">
              <button className="btn primary" onClick={saveProfile}>Save</button>
              <button className="btn secondary" onClick={()=>setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
