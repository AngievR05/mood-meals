import React, { useState, useEffect } from "react";
import "../styles/StreakTracker.css";
import axios from "axios";

// Helper to darken/lighten a hex color
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, R + (R * percent) / 100));
  G = Math.min(255, Math.max(0, G + (G * percent) / 100));
  B = Math.min(255, Math.max(0, B + (B * percent) / 100));

  return `rgb(${R},${G},${B})`;
};

// Mood definitions with colors
const moods = [
  { name: "Happy", color: "#A0D468" },
  { name: "Sad", color: "#5D9CEC" },
  { name: "Angry", color: "#ED5565" },
  { name: "Stressed", color: "#48CFAD" },
  { name: "Bored", color: "#CCD1D9" },
  { name: "Energised", color: "#FFCE54" },
  { name: "Confused", color: "#FC6E51" },
  { name: "Grateful", color: "#AC92EC" },
];

const StreakTracker = ({ currentMood }) => {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gradient, setGradient] = useState("linear-gradient(90deg, #ffce54, #f6bb42)");

  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://moodmeals.site/api";

  // ✅ Fetch streak once on mount
  useEffect(() => {
    const fetchStreak = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/user/streak`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("streak", res.data); // Debug only once
        setStreak(res.data?.streak || 0);
      } catch (err) {
        console.error("Failed to fetch streak:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [token, BACKEND_URL]); // ✅ no dependency on `streak` to prevent infinite loop

  // ✅ Update gradient when mood changes
  useEffect(() => {
    const moodObj = moods.find((m) => m.name.toLowerCase() === currentMood?.toLowerCase());
    const baseColor = moodObj?.color || "#ff9900";
    const darkerColor = shadeColor(baseColor, -20);
    setGradient(`linear-gradient(90deg, ${baseColor}, ${darkerColor})`);
  }, [currentMood]);

  if (loading) return <p className="loading">Loading streak...</p>;

  return (
    <div
      className="streak-container"
      style={{
        background: gradient,
        transition: "background 0.8s ease-in-out",
      }}
    >
      <h3>Mood Streak</h3>
      <p>You’ve tracked your mood for</p>
      <div className="streak-days">
        {streak} day{streak !== 1 ? "s" : ""} in a row!
      </div>
    </div>
  );
};

export default StreakTracker;
