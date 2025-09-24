import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MealSuggestions.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MealSuggestions = ({ currentMood }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealsByMood = async () => {
      if (!currentMood) return;
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const res = await axios.get(
          `http://localhost:5000/api/meals/mood/${encodeURIComponent(currentMood)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!Array.isArray(res.data)) throw new Error("Unexpected API response");

        setMeals(res.data);
      } catch (err) {
        console.error("Error fetching meals by mood:", err.response || err.message || err);
        setError(
          err.response?.data?.message || err.message || "Failed to load meals. Try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMealsByMood();
  }, [currentMood]);

  const openRecipe = (meal) => {
    navigate(`/recipes/${encodeURIComponent(meal.name)}`);
  };

  const settings = {
    dots: true,
    infinite: meals.length > 3,
    speed: 500,
    slidesToShow: Math.min(meals.length, 3),
    slidesToScroll: 1,
    arrows: true,
    centerMode: meals.length < 3,
    centerPadding: "0px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(meals.length, 2) } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (!currentMood)
    return (
      <div className="meal-suggestions">
        <h2>🍽️ Meals for Mood</h2>
        <p>Select a mood to get meal ideas!</p>
      </div>
    );

  if (loading) return <p className="meal-loading">Loading meals...</p>;
  if (error) return <p className="meal-error">{error}</p>;
  if (!meals.length) return <p className="meal-empty">No meals found for this mood.</p>;

  return (
    <div className="meal-suggestions">
      <h2>🍽️ Meals for "{currentMood}" Mood</h2>
      <Slider {...settings}>
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <img
              src={meal.image_url || "/default-meal.png"}
              alt={meal.name}
              className="meal-image"
              loading="lazy"
            />
            <p className="meal-name">{meal.name}</p>
            <button className="view-recipe-btn" onClick={() => openRecipe(meal)}>
              View Recipe
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MealSuggestions;
