import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import MoodSelector from '../components/MoodSelector';
import MoodNoteModal from '../components/MoodNoteModal';
import GrocerySection from '../components/GrocerySection';
import MealSuggestions from '../components/MealSuggestions';
import StreakTracker from '../components/StreakTracker';
import MoodIndicator from '../components/MoodIndicator';
import Footer from '../components/Footer';

import happy from '../assets/emotions/Happy.png';
import sad from '../assets/emotions/Sad.png';
import angry from '../assets/emotions/Angry.png';
import stressed from '../assets/emotions/Stressed.png';
import bored from '../assets/emotions/Bored.png';
import energised from '../assets/emotions/Energised.png';
import confused from '../assets/emotions/Confused.png';
import grateful from '../assets/emotions/Grateful.png';

import '../styles/Home.css';

const moodImages = {
  Happy: happy,
  Sad: sad,
  Angry: angry,
  Stressed: stressed,
  Bored: bored,
  Energised: energised,
  Confused: confused,
  Grateful: grateful,
};

const Home = () => {
  const [moodNote, setMoodNote] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Pull username from localStorage to greet user
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-left">
          <h1>Mood Meals</h1>
          <p>
            {username ? (
              <>Hi {username} 👋 <br /> How are you feeling today?</>
            ) : (
              <>How are you feeling today?</>
            )}
          </p>
        </div>
        {currentMood && (
          <div className="header-right">
            <img
              key={currentMood}
              src={moodImages[currentMood]}
              alt={currentMood}
              className="header-mood-image pulse"
            />
          </div>
        )}
      </header>

      <section className="mood-section" data-aos="fade-up">
        <h2>Select Your Mood</h2>
        <MoodSelector onSelect={setCurrentMood} />
        <MoodNoteModal onSave={setMoodNote} />
        <div className="mood-status-wrapper">
          <MoodIndicator mood={currentMood} />
          <StreakTracker streak={3} />
        </div>
      </section>

      <section className="grocery-section" data-aos="fade-up" data-aos-delay="100">
        <GrocerySection />
      </section>

      <section className="meals-section" data-aos="fade-up" data-aos-delay="200">
        <MealSuggestions currentMood={currentMood} />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
