import React, { useState } from 'react';
import MoodSelector from '../components/MoodSelector';
import MoodNoteModal from '../components/MoodNoteModal';
import GrocerySection from '../components/GrocerySection';
import MealSuggestions from '../components/MealSuggestions';
import StreakTracker from '../components/StreakTracker';
import MoodIndicator from '../components/MoodIndicator';
import Footer from '../components/Footer';

import '../styles/Home.css';

const Home = () => {
  const [moodNote, setMoodNote] = useState('');
  const [currentMood, setCurrentMood] = useState('');

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Mood Meals</h1>
        <p>Hi Angie 👋 — How are you feeling today?</p>
      </header>

      <section className="mood-section">
        <h2>Select Your Mood</h2>
        <MoodSelector onSelect={(mood) => setCurrentMood(mood)} />
        <MoodNoteModal onSave={(note) => setMoodNote(note)} />
        <MoodIndicator mood={currentMood} />
        <StreakTracker streak={3} />
      </section>

      <section className="grocery-section">
        <GrocerySection />
      </section>

      <section className="meals-section">
        <MealSuggestions currentMood={currentMood} />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
