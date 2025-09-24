import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MealSuggestions.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MealSuggestions = ({ currentMood }) => {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealsByMood = async () => {
      if (!currentMood) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/meals/mood/${currentMood}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(res.data);
      } catch (err) {
        console.error("Error fetching meals by mood:", err);
      }
    };
    fetchMealsByMood();
  }, [currentMood]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const openRecipe = (meal) => {
    navigate(`/recipes/${encodeURIComponent(meal.name)}`);
  };

  if (!currentMood)
    return (
      <div className="meal-suggestions">
        <h2>🍽️ Meals for Mood</h2>
        <p>Select a mood to get meal ideas!</p>
      </div>
    );

  return (
    <div className="meal-suggestions">
      <h2>🍽️ Meals for "{currentMood}" Mood</h2>
      <Slider {...settings}>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <img
              src={meal.image_url}
              alt={meal.name}
              className="meal-image"
              loading="lazy"
            />
            <p className="meal-name">{meal.name}</p>
            <button
              className="view-recipe-btn"
              onClick={() => openRecipe(meal)}
            >
              View Recipe
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MealSuggestions;
