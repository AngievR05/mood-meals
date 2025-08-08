import React from 'react';
import '../styles/Profile.css';

const Profile = () => {
  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar"></div>
        <div className="profile-info">
          <h2>User's Name</h2>
          <span className="username">@username</span>
          <p className="email">user@example.com</p>
        </div>
        <div className="profile-actions">
          <button className="btn logout-btn">Logout</button>
          <button className="btn edit-btn">Edit Profile</button>
        </div>
      </div>

      {/* Mood Statistics */}
      <section className="section">
        <h2>Mood Statistics</h2>
        <p className="section-subtitle">Your mood trends at a glance.</p>

        <div className="stats-cards">
          <div className="stat-card">
            <h4>Most Frequent Mood</h4>
            <p className="highlight">Happy</p>
            <span className="change">+5% from last month</span>
          </div>
          <div className="stat-card">
            <h4>Longest Streak</h4>
            <p className="highlight">10 Days</p>
          </div>
        </div>

        <div className="mood-chart">
          <p>Mood Over Time</p>
          <div className="chart-placeholder">[Graph Placeholder]</div>
        </div>
      </section>

      {/* Saved Meals */}
      <section className="section saved-meals">
        <h2>Saved Meals</h2>
        <p>Your favorite meals based on your moods.</p>
        <button className="btn add-btn">Add Meal</button>
        <div className="meal-list">
          <div className="meal-card">
            <div className="meal-img"></div>
            <div>
              <h4>Spaghetti Bolognese</h4>
              <p>Comfort food for a happy mood.</p>
              <span className="tag">Happy</span>
              <span className="tag">Comfort</span>
            </div>
          </div>
          <div className="meal-card">
            <div className="meal-img"></div>
            <div>
              <h4>Vegan Salad</h4>
              <p>Fresh and energizing for a productive mood.</p>
              <span className="tag">Energized</span>
              <span className="tag">Healthy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grocery Preferences */}
      <section className="section grocery-prefs">
        <h2>Grocery Preferences</h2>
        <p>Customize your grocery preferences for better meal planning.</p>
        <button className="btn edit-btn">Edit Preferences</button>
        <div className="pref-list">
          <div className="pref-card">
            <div className="pref-img"></div>
            <div>
              <h4>Vegetarian</h4>
              <p>I prefer plant-based meals.</p>
            </div>
          </div>
          <div className="pref-card">
            <div className="pref-img"></div>
            <div>
              <h4>Organic</h4>
              <p>I choose organic ingredients where possible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mood Theme Preview */}
      <section className="section mood-theme">
        <h2>Mood Theme Preview</h2>
        <p>Current theme based on your latest mood.</p>
        <div className="theme-card">
          <div className="theme-img"></div>
          <div>
            <h4>Theme Preview</h4>
            <p>You are currently using the theme based on your mood of Happy.</p>
          </div>
        </div>
      </section>

      {/* Theme Settings */}
      <section className="section theme-settings">
        <h2>Theme Settings</h2>
        <p>Choose your preferred theme.</p>
        <button className="btn save-btn">Save Changes</button>
        <div className="theme-options">
          <div className="theme-option">
            🌙 Dark Mode
          </div>
          <div className="theme-option">
            ☀️ Light Mode
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
