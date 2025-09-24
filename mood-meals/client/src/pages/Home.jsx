import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/design-system.css";
import "../styles/utils.css";

import MoodIndicator from "../components/MoodIndicator";
import StreakTracker from "../components/StreakTracker";
import GrocerySection from "../components/GrocerySection";
import MealSuggestions from "../components/MealSuggestions";
import MoodNoteModal from "../components/MoodNoteModal";

const moods = [
  { label: "Happy", img: "/assets/moods/happy.png" },
  { label: "Sad", img: "/assets/moods/sad.png" },
  { label: "Angry", img: "/assets/moods/angry.png" },
  { label: "Stressed", img: "/assets/moods/stressed.png" },
  { label: "Bored", img: "/assets/moods/bored.png" },
  { label: "Energised", img: "/assets/moods/energised.png" },
  { label: "Confused", img: "/assets/moods/confused.png" },
  { label: "Grateful", img: "/assets/moods/grateful.png" },
];

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Auto-persist mood to backend when selected
  useEffect(() => {
    if (selectedMood) {
      // TODO: connect to /api/moods POST
      console.log("Saving mood:", selectedMood);
    }
  }, [selectedMood]);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <h1>Welcome back 👋</h1>
          <p>How are you feeling today?</p>
        </div>
        <div className="header-right">
          {selectedMood ? (
            <img
              src={selectedMood.img}
              alt={selectedMood.label}
              className="header-mood-image"
            />
          ) : (
            <p style={{ color: "#777" }}>Pick a mood ↓</p>
          )}
        </div>
      </header>

      {/* Mood Section */}
      <section className="mood-section">
        <h2>Select Your Mood</h2>
        <div className="mood-grid">
          {moods.map((mood) => (
            <div
              key={mood.label}
              className={`mood-card ${
                selectedMood?.label === mood.label ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedMood(mood);
                setShowNoteModal(true);
              }}
            >
              <div className="mood-icon">
                <img src={mood.img} alt={mood.label} />
              </div>
              <span className="mood-label">{mood.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mood Status */}
      <div className="mood-status-wrapper">
        <MoodIndicator />
        <StreakTracker />
      </div>

      {/* Grocery + Meals */}
      <GrocerySection />
      <MealSuggestions />

      {/* Floating modal for mood notes */}
      {showNoteModal && (
        <MoodNoteModal
          mood={selectedMood}
          onClose={() => setShowNoteModal(false)}
        />
      )}

      <footer className="footer">
        <p>© 2025 Mood Meals</p>
      </footer>
    </div>
  );
};

export default Home;
