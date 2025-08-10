import React from "react";
import "../styles/MoodBanner.css";

const MoodBanner = ({ mood, emoji }) => {
  return (
    <section className="mood-banner">
      <h2>Current Mood: {mood} {emoji}</h2>
      <p>Discover meals that uplift your spirit.</p>
      <button className="primary-btn">Change Mood</button>
    </section>
  );
};

export default MoodBanner;
