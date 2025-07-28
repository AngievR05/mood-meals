import React from 'react';
import MoodSelector from '../components/MoodSelector';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Mood Meals</h1>
        <p>Hi Angie 👋 — How are you feeling today?</p>
      </header>

      <section className="mood-section">
        <h2>Select Your Mood</h2>
        <MoodSelector />
      </section>

      {/* You can add Grocery, Meals, and Streak Tracker sections below here */}
    </div>
  );
};

export default Home;
