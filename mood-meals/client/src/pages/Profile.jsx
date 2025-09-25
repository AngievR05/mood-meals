import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MoodRadialChart from '../components/MoodRadialChart';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({ oldPassword:'', newPassword:'', confirmPassword:'' });

  // Axios config with Bearer token
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Profile
        const userRes = await axios.get('http://localhost:5000/api/profile', authConfig);
        setUser(userRes.data);
        setEditData({ username: userRes.data.username, email: userRes.data.email, avatar: userRes.data.avatar || 'Happy' });

        // Mood Stats
        const moodRes = await axios.get('http://localhost:5000/api/profile/mood-stats', authConfig);
        setMoodStats(moodRes.data);

        // Streak
        const streakRes = await axios.get('http://localhost:5000/api/profile/streak', authConfig);
        setStreak(streakRes.data.streak);

        // Saved Meals
        const mealsRes = await axios.get('http://localhost:5000/api/profile/saved-meals', authConfig);
        setSavedMeals(mealsRes.data);

      } catch (err) {
        console.error(err);
        if(err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/');
        }
      }
    };

    fetchProfileData();
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
    } catch(err){
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const changePassword = async () => {
    if(passwordData.newPassword !== passwordData.confirmPassword){
      alert('Passwords do not match');
      return;
    }
    try{
      await axios.put('http://localhost:5000/api/profile/change-password', passwordData, authConfig);
      alert('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordData({ oldPassword:'', newPassword:'', confirmPassword:'' });
    } catch(err){
      console.error(err);
      alert(err.response?.data?.error || 'Failed to change password');
    }
  };

  if(!user) return <div>Loading...</div>;

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
        </div>
        <div className="profile-actions">
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
          <button className="btn edit-btn" onClick={()=>setShowEditModal(true)}>Edit Profile</button>
          <button className="btn edit-btn" onClick={()=>setShowPasswordModal(true)}>Change Password</button>
        </div>
      </div>

      {/* Mood Stats */}
      <section className="section">
        <h2>Mood Stats</h2>
        <p>Current Streak: {streak} days</p>
        <MoodRadialChart data={moodStats} />
      </section>

      {/* Saved Meals */}
      <section className="section saved-meals">
        <h2>Saved Meals</h2>
        <div className="meal-list">
          {savedMeals.map(meal => (
            <div className="meal-card" key={meal.id}>
              <div className="meal-img">
                <img src={meal.image_url || '/placeholder.png'} alt={meal.name} />
              </div>
              <div>
                <h4>{meal.name}</h4>
                <p>{meal.description}</p>
                {(meal.moods || []).map(m => <span className="tag" key={m}>{m}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <input type="text" value={editData.username} onChange={e=>setEditData({...editData, username:e.target.value})} />
            <input type="email" value={editData.email} onChange={e=>setEditData({...editData, email:e.target.value})} />
            <div className="modal-buttons">
              <button className="btn save-btn" onClick={saveProfile}>Save</button>
              <button className="btn cancel-btn" onClick={()=>setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Password</h3>
            <input type="password" placeholder="Old Password" value={passwordData.oldPassword} onChange={e=>setPasswordData({...passwordData, oldPassword:e.target.value})} />
            <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e=>setPasswordData({...passwordData, newPassword:e.target.value})} />
            <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={e=>setPasswordData({...passwordData, confirmPassword:e.target.value})} />
            <div className="modal-buttons">
              <button className="btn save-btn" onClick={changePassword}>Save</button>
              <button className="btn cancel-btn" onClick={()=>setShowPasswordModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
