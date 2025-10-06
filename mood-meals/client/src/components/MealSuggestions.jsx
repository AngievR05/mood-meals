import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import RecipePage from "./RecipePage";
import axios from "axios";

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
  const [mealsList, setMealsList] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [filterMode, setFilterMode] = useState("mood"); // mood | groceries | both
  const [chefTip, setChefTip] = useState(chefTips[0]);
  const [boughtGroceries, setBoughtGroceries] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const token = localStorage.getItem("token");

  // Rotate chef tips
  useEffect(() => {
    const interval = setInterval(() => {
      setChefTip(chefTips[Math.floor(Math.random() * chefTips.length)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Fetch groceries
  useEffect(() => {
    const fetchGroceries = async () => {
      if (!token) return;
      try {
        const res = await axios.get("/api/groceries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoughtGroceries(res.data || []);
      } catch (err) {
        console.error("Failed to fetch groceries:", err);
      }
    };
    fetchGroceries();
  }, [token]);

  // Fetch meals whenever mood changes
  useEffect(() => {
    if (!currentMood) return;
    const fetchMeals = async () => {
      setLoadingMeals(true);
      try {
        const moodName = typeof currentMood === "string" ? currentMood : currentMood.name;
        const res = await axios.get(`/api/meals/mood/${encodeURIComponent(moodName)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMealsList(res.data || []);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setMealsList([]);
      } finally {
        setLoadingMeals(false);
      }
    };
    fetchMeals();
  }, [currentMood, token]);

  // Filter meals
  useEffect(() => {
    if (!mealsList.length) return setFilteredMeals([]);

    const boughtNames = boughtGroceries.map((g) => g.item_name.toLowerCase());

    const filtered = mealsList.filter((meal) => {
      const mealMood = typeof meal.mood === "string" ? meal.mood.toLowerCase() : "";
      const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
      const hasGroceries = ingredients.some((ing) => boughtNames.includes(ing.toLowerCase()));

      if (filterMode === "mood") return true; // already fetched by mood
      if (filterMode === "groceries") return hasGroceries;
      if (filterMode === "both") return hasGroceries || true;

      return true;
    });

    setFilteredMeals(filtered);
  }, [mealsList, boughtGroceries, filterMode]);

  if (!currentMood)
    return (
      <div className="meal-suggestions">
        <h2>🍽️ Meals for Mood</h2>
        <p>Select a mood to get meal ideas!</p>
      </div>
    );

  const moodName = typeof currentMood === "string" ? currentMood : currentMood.name;

  const sliderSettings = {
    dots: true,
    infinite: filteredMeals.length > 3,
    speed: 500,
    slidesToShow: Math.min(filteredMeals.length, 3),
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
      <h2>🍽️ Meals for "{moodName}" Mood</h2>
      {chefTip && <p className="chef-tip">{chefTip}</p>}

      <div className="filter-buttons">
        <button className={filterMode === "mood" ? "active" : ""} onClick={() => setFilterMode("mood")}>
          Mood Only
        </button>
        <button className={filterMode === "groceries" ? "active" : ""} onClick={() => setFilterMode("groceries")}>
          Groceries Only
        </button>
        <button className={filterMode === "both" ? "active" : ""} onClick={() => setFilterMode("both")}>
          Mood + Groceries
        </button>
      </div>

      {loadingMeals && <p>Loading meals...</p>}
      {!loadingMeals && !filteredMeals.length && <p className="meal-empty">No meals found for this filter.</p>}

      {!loadingMeals && filteredMeals.length > 0 && (
        <Slider {...sliderSettings}>
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="meal-card" style={{ borderColor: moodColors[moodName] }}>
              <img src={meal.image_url || "/default-meal.png"} alt={meal.name} className="meal-image" loading="lazy" />
              <p className="meal-name">{meal.name}</p>
              <div className="meal-card-actions">
                <button className="view-recipe-btn" onClick={() => setSelectedMealId(meal.id)}>View Recipe</button>
                {onToggleSave && (
                  <button className={`save-btn ${meal.saved ? "saved" : ""}`} onClick={() => onToggleSave(meal.id)}>
                    {meal.saved ? "★" : "☆"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </Slider>
      )}

      {selectedMealId && (
        <div className="modal-overlay" onClick={() => setSelectedMealId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RecipePage mealId={selectedMealId} onClose={() => setSelectedMealId(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSuggestions;
