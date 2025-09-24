import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MealsDashboard.css";
import MealsList from "../components/MealsList";
import MealSuggestions from "../components/MealSuggestions";
import GrocerySection from "../components/GrocerySection";
import MoodBanner from "../components/MoodBanner";

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

const MealsDashboard = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role") || "user");
  const [currentMood, setCurrentMood] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  // Load current mood from backend
  useEffect(() => {
    const fetchMood = async () => {
      try {
        const res = await fetch("/api/moods/current", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          // Normalize mood data (string vs object)
          const moodObj =
            typeof data.mood === "string"
              ? { name: data.mood, emoji: data.emoji || "", color: data.color }
              : data.mood;

          if (moodObj?.name) {
            setCurrentMood(moodObj);
            localStorage.setItem("currentMood", JSON.stringify(moodObj));
          }
        } else {
          console.warn("No current mood found");
        }
      } catch (err) {
        console.error("Error fetching current mood:", err);
      }
    };

    fetchMood();
  }, []);

  const handleChangeMood = () => {
    navigate("/mood-tracker");
  };

  const handleAddMealClick = () => {
    navigate("/admin/meals");
  };

  const clearFilters = () => {
    setActiveFilter("all");
  };

  return (
    <div className="meals-dashboard">
      {/* Header */}
      <section
        className="dashboard-header"
        style={{
          background: currentMood
            ? moodColors[currentMood.name] || "var(--primary-blue)"
            : "linear-gradient(90deg, var(--primary-blue), var(--secondary-blue))",
        }}
      >
        <h1>My Meals Dashboard</h1>
        {currentMood ? (
          <p>
            Current Mood: <strong>{currentMood.name}</strong>{" "}
            {currentMood.emoji && <span>{currentMood.emoji}</span>}
          </p>
        ) : (
          <p>Manage your groceries and find meals that match your mood.</p>
        )}

        {role === "admin" && (
          <button className="primary-btn" onClick={handleAddMealClick}>
            + Add Meal
          </button>
        )}

        {/* Filters */}
        <div className="filter-buttons">
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
          <button className="clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      {/* Mood Banner */}
      {currentMood && (
        <MoodBanner
          mood={currentMood.name}
          emoji={currentMood.emoji}
          color={currentMood.color || moodColors[currentMood.name]}
        >
          <button className="secondary-btn" onClick={handleChangeMood}>
            Change Mood
          </button>
        </MoodBanner>
      )}

      {/* Grocery Section */}
      <GrocerySection />

      {/* Meals List */}
      <MealsList
        role={role}
        fetchMealsTrigger={fetchTrigger}
        filter={activeFilter}
        currentMood={currentMood}
      />

      <section className="suggestions-section">
        <MealSuggestions mood={currentMood} />
      </section>
    </div>
  );
};

export default MealsDashboard;
