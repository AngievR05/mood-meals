import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecipePage.css";

const RecipePage = ({ mealId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (!mealId) return;

    const fetchMeal = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/meals/${mealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meal = res.data || {};

        // Ensure ingredients & steps are arrays
        meal.ingredients = Array.isArray(meal.ingredients)
          ? meal.ingredients
          : JSON.parse(meal.ingredients || "[]");
        meal.steps = Array.isArray(meal.steps)
          ? meal.steps
          : JSON.parse(meal.steps || "[]");

        setRecipe(meal);

        // Check if meal is saved by user
        const savedRes = await axios.get(`${BACKEND_URL}/api/saved-meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const isSaved = Array.isArray(savedRes.data)
          ? savedRes.data.some((m) => m.meal_id === meal.id || m.id === meal.id)
          : false;
        setSaved(isSaved);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId, token, BACKEND_URL]);

  const toggleSave = async () => {
    if (!recipe) return;

    try {
      if (!saved) {
        await axios.post(`${BACKEND_URL}/api/saved-meals/${recipe.id}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.delete(`${BACKEND_URL}/api/saved-meals/${recipe.id}/unsave`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSaved(!saved);
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  if (loading) return <p className="recipe-loading">Loading recipe...</p>;
  if (!recipe) return <p className="no-meals">Recipe not found</p>;

  const imageSrc = recipe.image_url?.startsWith("http")
    ? recipe.image_url
    : `${BACKEND_URL}${recipe.image_url || "/default-meal.png"}`;

  const moodName = typeof recipe.mood === "string" ? recipe.mood : "";

  return (
    <div className="recipe-page">
      <button onClick={onClose} className="back-btn">← Close</button>

      <div className="recipe-header">
        <h1>{recipe.name || "Untitled Meal"}</h1>
        {moodName && (
          <span className={`mood-badge ${moodName.toLowerCase()}`}>
            {moodName}
          </span>
        )}
        <button className={`save-btn floating ${saved ? "saved" : ""}`} onClick={toggleSave}>
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>

      {recipe.image_url && <img src={imageSrc} alt={recipe.name} className="recipe-image" />}
      <p className="recipe-description">{recipe.description || "No description available."}</p>

      <h2>📝 Ingredients</h2>
      <ul className="recipe-list ingredients-list">
        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)
        ) : (
          <li>No ingredients provided.</li>
        )}
      </ul>

      <h2>👨‍🍳 Steps</h2>
      {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
        <ol className="recipe-list steps-list">
          {recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
        </ol>
      ) : (
        <p>No steps provided.</p>
      )}
    </div>
  );
};

export default RecipePage;
