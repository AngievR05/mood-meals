import React from "react";
import "../styles/MealsDashboard.css";
import GroceryList from "../components/GroceryList";
import MealsList from "../components/MealsList";
import RecommendedMeals from "../components/RecommendedMeals";
import MoodBanner from "../components/MoodBanner";

const MealsDashboard = () => {
  return (
    <div className="meals-dashboard">
      {/* Top Section */}
      <section className="dashboard-header">
        <h1>My Meals Dashboard</h1>
        <p>Manage your groceries and find meals that match your mood.</p>
        <button className="primary-btn">+ Add Grocery</button>
        <div className="filter-buttons">
          <button>By Mood</button>
          <button>By Ingredient</button>
          <button>Saved Meals</button>
        </div>
      </section>

      {/* Mood Section */}
      <MoodBanner mood="Happy" emoji="😊" />

      {/* Grocery Section */}
      <section className="grocery-section">
        <h2>My Grocery List</h2>
        <GroceryList />
      </section>

      {/* Meals You Can Make */}
      <MealsList />

      {/* Recommended Meals */}
      <RecommendedMeals />
    </div>
  );
};

export default MealsDashboard;
