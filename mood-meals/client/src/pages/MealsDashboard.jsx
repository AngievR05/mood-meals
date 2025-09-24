import React, { useState } from "react";
import "../styles/MealsDashboard.css";
import MealsList from "../components/MealsList";
import MealSuggestions from "../components/MealSuggestions";
import GrocerySection from "../components/GrocerySection";
import MoodBanner from "../components/MoodBanner";

const MealsDashboard = () => {
  const [role] = useState(localStorage.getItem("role") || "user");
  const [currentMood, setCurrentMood] = useState("Happy"); // Example
  const [fetchTrigger, setFetchTrigger] = useState(0); // trigger MealsList refresh

  const handleAddMealClick = () => {
    // open modal or navigate to admin meal creation page
    alert("Open meal creation modal (admin only)");
  };

  return (
    <div className="meals-dashboard">
      <section className="dashboard-header">
        <h1>My Meals Dashboard</h1>
        <p>Manage your groceries and find meals that match your mood.</p>
        {role === "admin" && (
          <button className="primary-btn" onClick={handleAddMealClick}>
            + Add Meal
          </button>
        )}
        <div className="filter-buttons">
          <button>By Mood</button>
          <button>By Ingredient</button>
          <button>Saved Meals</button>
        </div>
      </section>

      <MoodBanner mood={currentMood} emoji="😊" />

      <section className="grocery-section">
        <h2>My Grocery List</h2>
        <GrocerySection />
      </section>

      <MealsList role={role} fetchMealsTrigger={fetchTrigger} />

      <MealSuggestions currentMood={currentMood} />
    </div>
  );
};

export default MealsDashboard;
