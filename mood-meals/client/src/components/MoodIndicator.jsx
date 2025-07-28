import React from 'react';
import '../styles/MoodIndicator.css';

const affirmations = {
  Happy: "Your joy is radiant—let it shine into your food choices.",
  Sad: "It’s okay to feel down. Choose something that comforts you kindly.",
  Angry: "Breathe deep. Fuel yourself with calm, grounding meals.",
  Stressed: "You’re doing your best. A warm bite can be your pause.",
  Bored: "New flavors = new sparks. Let curiosity guide your plate.",
  Energised: "Power up! Keep your energy flowing with something fresh.",
  Confused: "Simple meals bring clarity. Start with what you love.",
  Grateful: "Gratitude nourishes. Celebrate with something soul-feeding.",
};

const MoodIndicator = ({ mood }) => {
  return (
    <div className="mood-indicator">
      <h3>🌡️ Current Mood</h3>
      {mood ? (
        <>
          <p>You’re currently feeling <strong>{mood}</strong>.</p>
          <blockquote className="mood-quote">"{affirmations[mood]}"</blockquote>
        </>
      ) : (
        <p>No mood selected yet.</p>
      )}
    </div>
  );
};

export default MoodIndicator;
