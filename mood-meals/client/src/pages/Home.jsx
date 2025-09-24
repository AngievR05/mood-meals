import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/design-system.css";
import "../styles/utils.css";
import "../styles/MoodTracker.css"; // Needed for mood-entry card styling

import StreakTracker from "../components/StreakTracker";
import GrocerySection from "../components/GrocerySection";
import MealSuggestions from "../components/MealSuggestions";
import spinner from "../assets/images/Group2.png";

// Mood images
import happy from "../assets/emotions/Happy.png";
import sad from "../assets/emotions/Sad.png";
import angry from "../assets/emotions/Angry.png";
import stressed from "../assets/emotions/Stressed.png";
import bored from "../assets/emotions/Bored.png";
import energised from "../assets/emotions/Energised.png";
import confused from "../assets/emotions/Confused.png";
import grateful from "../assets/emotions/Grateful.png";

const moods = [
  { name: "Happy", color: "#A0D468", image: happy },
  { name: "Sad", color: "#5D9CEC", image: sad },
  { name: "Angry", color: "#ED5565", image: angry },
  { name: "Stressed", color: "#48CFAD", image: stressed },
  { name: "Bored", color: "#CCD1D9", image: bored },
  { name: "Energised", color: "#FFCE54", image: energised },
  { name: "Confused", color: "#FC6E51", image: confused },
  { name: "Grateful", color: "#AC92EC", image: grateful },
];

const Home = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchJSON = async (url, options) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }
    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }
    return data;
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return setError("Please select a mood!");
    setLoading(true);
    setError("");
    try {
      await fetchJSON("http://localhost:5000/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood: selectedMood, note }),
      });

      setSelectedMood("");
      setNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              src={moods.find((m) => m.name === selectedMood)?.image}
              alt={selectedMood}
              className="header-mood-image"
            />
          ) : (
            <p style={{ color: "#777" }}>Pick a mood ↓</p>
          )}
        </div>
      </header>

      {/* Mood Entry Card (replacing old mood section) */}
      <section className="mood-entry card">
        <h2>Add Your Mood Entry</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="mood-grid">
          {moods.map((mood) => (
            <button
              key={mood.name}
              className={`mood-card ${
                selectedMood === mood.name ? "selected" : ""
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

        <button
          className="btn btn-primary"
          onClick={handleSaveMood}
          disabled={loading}
        >
          {loading ? (
            <img src={spinner} alt="Loading..." style={{ width: 24 }} />
          ) : (
            "Save Mood Entry"
          )}
        </button>
      </section>

      {/* Mood Status */}
      <div className="mood-status-wrapper">
        <StreakTracker currentMood={selectedMood} />
      </div>

      {/* Grocery + Meals */}
      <GrocerySection />
      <MealSuggestions currentMood={selectedMood} />
    </div>
  );
};

export default Home;
