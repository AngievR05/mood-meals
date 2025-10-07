// src/pages/MealsDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/MealsDashboard.css";
import MealSuggestions from "../components/MealSuggestions";
import GrocerySection from "../components/GrocerySection";

// Use env variable or fallback to local
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "/api";

const MealsDashboard = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role") || "user");
  const [searchQuery, setSearchQuery] = useState("");

  // Navigate admin to meal management
  const handleAddMealClick = () => {
    toast.info("Redirecting to admin meal management...");
    setTimeout(() => navigate("/admin/meals"), 800);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
    toast.success("Search cleared");
  };

  return (
    <div className="meals-dashboard">
      {/* ===== Header Section ===== */}
      <section className="dashboard-header">
        <div className="header-top">
          <h1 className="dashboard-title">🍽️ My Meals Dashboard</h1>
          {role === "admin" && (
            <button className="primary-btn" onClick={handleAddMealClick}>
              + Add Meal
            </button>
          )}
        </div>

        <div className="header-middle">
          <p className="header-subtext">
            Find meal ideas based on your groceries and preferences.
          </p>
          {/* Optional: Add search input if needed in future */}
        </div>
      </section>

      {/* ===== Grocery Section ===== */}
      <GrocerySection />

      {/* ===== Meal Suggestions ===== */}
      <MealSuggestions backendUrl={BACKEND_URL} searchQuery={searchQuery} />
    </div>
  );
};

export default MealsDashboard;
