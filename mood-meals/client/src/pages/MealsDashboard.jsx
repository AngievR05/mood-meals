import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MealsDashboard.css";
import MealsList from "../components/MealsList";
import MealSuggestions from "../components/MealSuggestions";
import GrocerySection from "../components/GrocerySection";
import MoodBanner from "../components/MoodBanner";

const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = Math.min(255, Math.max(0, R + (R * percent) / 100));
  G = Math.min(255, Math.max(0, G + (G * percent) / 100));
  B = Math.min(255, Math.max(0, B + (B * percent) / 100));
  return `rgb(${R},${G},${B})`;
};

const moodColors = {
  Happy: "#f7c948",
  Sad: "#5d9cec",
  Angry: "#e74c3c",
  Stressed: "#8e44ad",
  Bored: "#95a5a6",
  Energised: "#2ecc71",
  Confused: "#f39c12",
  Grateful: "#4a89dc",
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const MealsDashboard = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role") || "user");
  const [currentMood, setCurrentMood] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [headerGradient, setHeaderGradient] = useState(
    "linear-gradient(90deg, var(--primary-blue), var(--secondary-blue))"
  );

  // Fetch current mood async
  useEffect(() => {
    const fetchMood = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/moods/current`, { headers: { "Content-Type": "application/json" } });
        if (!res.ok) throw new Error("Mood not found");
        const data = await res.json();
        const moodObj = typeof data.mood === "string"
          ? { name: data.mood, emoji: data.emoji || "", color: moodColors[data.mood] }
          : data.mood;

        if (moodObj?.name) {
          setCurrentMood(moodObj);
          localStorage.setItem("currentMood", JSON.stringify(moodObj));
          const baseColor = moodObj.color || moodColors[moodObj.name] || "#ff9900";
          const darker = shadeColor(baseColor, -20);
          setHeaderGradient(`linear-gradient(90deg, ${baseColor}, ${darker})`);
        }
      } catch (err) {
        console.error("Error fetching current mood:", err);
      }
    };
    fetchMood();
  }, []);

  const handleChangeMood = () => navigate("/mood-tracker");
  const handleAddMealClick = () => navigate("/admin/meals");
  const clearFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="meals-dashboard">
      <section className="dashboard-header" style={{ background: headerGradient }}>
        <div className="header-top">
          <h1>My Meals Dashboard</h1>
          {role === "admin" && (
            <button className="primary-btn" onClick={handleAddMealClick}>+ Add Meal</button>
          )}
        </div>

        {/* Current mood & search */}
        <div className="header-middle">
          {currentMood ? (
            <div className="current-mood">
              <strong>{currentMood.name}</strong> {currentMood.emoji && <span>{currentMood.emoji}</span>}
              <button className="refresh-btn" onClick={handleChangeMood} title="Change Mood">🔄</button>
            </div>
          ) : (
            <p>Manage your groceries and find meals that match your mood.</p>
          )}
          <input
            type="text"
            placeholder="Search meals by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filters */}
        <div className="header-filters">
          <button
            className={activeFilter === "all" ? "active" : ""}
            onClick={() => setActiveFilter("all")}
          >
            All Meals
          </button>
          <button
            className={activeFilter === "mood" ? "active" : ""}
            onClick={() => setActiveFilter("mood")}
          >
            By Mood
          </button>
          <button
            className={activeFilter === "saved" ? "active" : ""}
            onClick={() => setActiveFilter("saved")}
          >
            Saved Meals
          </button>
          <button className="clear-btn" onClick={clearFilters}>Clear</button>
        </div>
      </section>

      <GrocerySection />

      <MealsList
        role={role}
        filter={activeFilter}
        searchQuery={searchQuery}
        currentMood={currentMood}
        showViewAllButton={true}
        backendUrl={BACKEND_URL}
      />

      {currentMood && (
        <section className="suggestions-section">
          <MealSuggestions currentMood={currentMood.name} />
        </section>
      )}
    </div>
  );
};

export default MealsDashboard;
