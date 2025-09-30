import React, { useState } from "react";
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

const MealSuggestions = ({ currentMood, mealsList = [], onToggleSave }) => {
  const [selectedMealId, setSelectedMealId] = useState(null);
  const chefTip = tips[Math.floor(Math.random() * tips.length)];

  if (!currentMood)
    return (
      <div className="meal-suggestions">
        <h2>🍽️ Meals for Mood</h2>
        <p>Select a mood to get meal ideas!</p>
      </div>
    );

  // Filter meals by current mood
  const meals = mealsList.filter(
    (meal) => meal.mood?.toLowerCase() === currentMood.name.toLowerCase()
  );

  const settings = {
    dots: true,
    infinite: meals.length > 3,
    speed: 500,
    slidesToShow: Math.min(meals.length, 3),
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(meals.length, 2) } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (!meals.length) return <p className="meal-empty">No meals found for this mood.</p>;

  return (
    <div className="meal-suggestions">
      <h2>🍽️ Meals for "{currentMood.name}" Mood</h2>
      {chefTip && <p className="chef-tip">{chefTip}</p>}

      <Slider {...settings}>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card" style={{ borderColor: moodColors[currentMood.name] }}>
            <img
              src={meal.image_url || "/default-meal.png"}
              alt={meal.name}
              className="meal-image"
              loading="lazy"
            />
            <p className="meal-name">{meal.name}</p>
            <div className="meal-card-actions">
              <button className="view-recipe-btn" onClick={() => setSelectedMealId(meal.id)}>
                View Recipe
              </button>
              <button
                className={`save-btn ${meal.saved ? "saved" : ""}`}
                onClick={() => onToggleSave && onToggleSave(meal.id)}
              >
                {meal.saved ? "★" : "☆"}
              </button>
            </div>
          </div>
        ))}
      </Slider>

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
