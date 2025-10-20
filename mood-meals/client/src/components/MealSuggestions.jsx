import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import RecipePage from "./RecipePage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/MealSuggestions.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const chefTips = [
  "Don't forget your veggies! 🥦",
  "A balanced meal keeps the mood bright! 😄",
  "Spice it up for some fun! 🌶️",
  "Try a new recipe today! 🍳",
  "Hydration = happiness 💧",
];

const MealSuggestions = ({ currentMood, onToggleSave }) => {
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [allMeals, setAllMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [filterMode, setFilterMode] = useState("mood");
  const [chefTip, setChefTip] = useState(chefTips[0]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Use clean backend URL without double `/api`
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "https://moodmeals.site/api";

  // Rotate chef tips every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setChefTip(chefTips[Math.floor(Math.random() * chefTips.length)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch meals ONCE when component mounts
  useEffect(() => {
    const fetchMeals = async () => {
      setLoadingMeals(true);
      try {
        // ✅ Fixed URL (no /api/api)
        const res = await axios.get(`${BACKEND_URL}/meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mealsArray = Array.isArray(res.data) ? res.data : [];
        setAllMeals(mealsArray);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setAllMeals([]);
      } finally {
        setLoadingMeals(false);
      }
    };

    fetchMeals();
    // ✅ Only run once unless BACKEND_URL or token changes
  }, [BACKEND_URL, token]);

  // Filter meals based on mood or show all
  useEffect(() => {
    if (!allMeals.length) return setFilteredMeals([]);
    const moodName =
      typeof currentMood === "string"
        ? currentMood
        : currentMood?.name || "";

    const filtered =
      filterMode === "mood" && moodName
        ? allMeals.filter(
            (meal) =>
              (meal.mood || "").toLowerCase() === moodName.toLowerCase()
          )
        : [...allMeals];

    setFilteredMeals(filtered);
  }, [allMeals, filterMode, currentMood]);

  const moodName = currentMood
    ? typeof currentMood === "string"
      ? currentMood
      : currentMood.name
    : "All";

  const sliderSettings = {
    dots: true,
    infinite: filteredMeals.length > 4,
    speed: 500,
    slidesToShow: Math.min(filteredMeals.length, 4),
    slidesToScroll: 1,
    arrows: true,
    autoplay: filteredMeals.length > 1,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(filteredMeals.length, 2) } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="meal-suggestions">
      <h2>🍽️ Meals {currentMood ? `for "${moodName}" Mood` : "Suggestions"}</h2>
      {chefTip && <p className="chef-tip">{chefTip}</p>}

      <div className="filter-buttons">
        <button
          className={filterMode === "mood" ? "active" : ""}
          onClick={() => setFilterMode("mood")}
        >
          Mood Only
        </button>
        <button
          className={filterMode === "all" ? "active" : ""}
          onClick={() => setFilterMode("all")}
        >
          Show All
        </button>
      </div>

      {loadingMeals && <p>Loading meals...</p>}
      {!loadingMeals && !filteredMeals.length && (
        <p className="meal-empty">No meals found for this filter.</p>
      )}

      {!loadingMeals && filteredMeals.length > 0 && (
        <Slider {...sliderSettings}>
          {filteredMeals.map((meal) => {
            const imageSrc = meal.image_url?.startsWith("http")
              ? meal.image_url
              : `${BACKEND_URL}${meal.image_url || "/default-meal.png"}`;

            return (
              <div
                key={meal.id}
                className="meal-card"
                style={{ borderColor: moodColors[moodName] || "#ccc" }}
              >
                <img
                  src={imageSrc}
                  alt={meal.name}
                  className="meal-image"
                  loading="lazy"
                />
                <p className="meal-name">{meal.name}</p>
                <div className="meal-card-actions">
                  <button
                    className="view-recipe-btn"
                    onClick={() => setSelectedMealId(meal.id)}
                  >
                    View Recipe
                  </button>
                  {onToggleSave && (
                    <button
                      className={`save-btn ${meal.saved ? "saved" : ""}`}
                      onClick={() => onToggleSave(meal.id)}
                    >
                      {meal.saved ? "★" : "☆"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </Slider>
      )}

      <div className="view-all-btn-wrapper">
        <button className="view-all-btn" onClick={() => navigate("/recipes")}>
          View All Meals
        </button>
      </div>

      {selectedMealId && (
        <div className="modal-overlay" onClick={() => setSelectedMealId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RecipePage
              mealId={selectedMealId}
              onClose={() => setSelectedMealId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSuggestions;
