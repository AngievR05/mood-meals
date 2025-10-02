import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import RecipePage from "./RecipePage";
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

const tips = [
  "Don't forget your veggies! 🥦",
  "A balanced meal keeps the mood bright! 😄",
  "Spice it up for some fun! 🌶️",
  "Try a new recipe today! 🍳",
  "Hydration = happiness 💧",
];

const MealSuggestions = ({ currentMood, mealsList = [], boughtGroceries = [], onToggleSave }) => {
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [filterMode, setFilterMode] = useState("mood"); // mood | groceries | both
  const [chefTip, setChefTip] = useState(tips[0]);

  // Chef tips rotation slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setChefTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentMood) return;

    const moodName = typeof currentMood === "string" ? currentMood.trim() : currentMood.name.trim();
    const boughtNames = boughtGroceries.map((g) => g.item_name.toLowerCase());

    // Filter logic
    const mealsWithFallback = mealsList.map((meal) => {
      const mealMoods = Array.isArray(meal.mood)
        ? meal.mood.map((m) => m.toLowerCase())
        : [meal.mood?.toLowerCase() || ""];
      const moodMatch = mealMoods.includes(moodName.toLowerCase());

      const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
      const groceriesMatch = ingredients.some((ing) => boughtNames.includes(ing.toLowerCase()));

      let show = false;
      if (filterMode === "mood") show = moodMatch;
      else if (filterMode === "groceries") show = groceriesMatch;
      else if (filterMode === "both") show = moodMatch || groceriesMatch;

      return {
        ...meal,
        show,
        fallback: filterMode === "mood" && !moodMatch, // mark fallback if mood filter but no exact match
      };
    });

    // Always show at least 1 meal for mood
    const visibleMeals = mealsWithFallback.filter((m) => m.show || m.fallback);
    setFilteredMeals(visibleMeals.length ? visibleMeals : mealsList.slice(0, 3).map(m => ({ ...m, fallback: true })));
  }, [currentMood, mealsList, boughtGroceries, filterMode]);

  if (!currentMood)
    return (
      <div className="meal-suggestions">
        <h2>🍽️ Meals for Mood</h2>
        <p>Select a mood to get meal ideas!</p>
      </div>
    );

  const moodName = typeof currentMood === "string" ? currentMood : currentMood.name;

  const settings = {
    dots: true,
    infinite: filteredMeals.length > 3,
    speed: 500,
    slidesToShow: Math.min(filteredMeals.length, 3),
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
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

      {filteredMeals.length === 0 && <p className="meal-empty">No meals found for this filter.</p>}

      {filteredMeals.length > 0 && (
        <Slider {...settings}>
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className={`meal-card ${meal.fallback ? "fallback" : ""}`}
              style={{ borderColor: moodColors[moodName] }}
            >
              <img src={meal.image_url || "/default-meal.png"} alt={meal.name} className="meal-image" loading="lazy" />
              <p className="meal-name">{meal.name}</p>
              <div className="meal-card-actions">
                <button className="view-recipe-btn" onClick={() => setSelectedMealId(meal.id)}>
                  View Recipe
                </button>
                <button className={`save-btn ${meal.saved ? "saved" : ""}`} onClick={() => onToggleSave && onToggleSave(meal.id)}>
                  {meal.saved ? "★" : "☆"}
                </button>
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
