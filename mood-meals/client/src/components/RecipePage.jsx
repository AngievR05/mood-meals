import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/RecipePage.css";

const RecipePage = ({ mealId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!mealId) return;

    const fetchMeal = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:5000/api/meals/${mealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meal = res.data;

        meal.ingredients = Array.isArray(meal.ingredients)
          ? meal.ingredients
          : JSON.parse(meal.ingredients || "[]");
        meal.steps = Array.isArray(meal.steps)
          ? meal.steps
          : JSON.parse(meal.steps || "[]");

        setRecipe(meal);
        setSaved(meal.saved || false);
        setCheckedIngredients([]);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId, token]);

  const toggleSave = async () => {
    try {
      if (!saved) {
        await axios.post(`/api/userMeals/save/${mealId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.delete(`/api/userMeals/remove/${mealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSaved(!saved);
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const handleCheckIngredient = (idx) => {
    setCheckedIngredients((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (!mealId) return null;
  if (loading) return <p className="recipe-loading">Loading recipe...</p>;
  if (error)
    return (
      <div className="recipe-page">
        <h1 className="error-title">Recipe not found</h1>
        <p className="error-msg">{error}</p>
        <button onClick={onClose} className="back-btn">
          ← Close
        </button>
      </div>
    );

  return (
    <div className="recipe-page">
      <button onClick={onClose} className="back-btn">
        ← Close
      </button>

      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        {recipe.mood && <span className={`mood-badge ${recipe.mood.toLowerCase()}`}>{recipe.mood}</span>}
        <button className={`save-btn floating ${saved ? "saved" : ""}`} onClick={toggleSave}>
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>

      {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
      )}

      <p className="recipe-description">{recipe.description}</p>

      <h2>📝 Ingredients</h2>
      <ul className="recipe-list ingredients-list">
        {recipe.ingredients.map((item, idx) => (
          <li
            key={idx}
            onClick={() => handleCheckIngredient(idx)}
            className={checkedIngredients.includes(idx) ? "checked" : ""}
          >
            {item}
          </li>
        ))}
      </ul>

      <h2>👨‍🍳 Steps</h2>
      {recipe.steps.length > 0 ? (
        <ol className="recipe-list steps-list">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      ) : (
        <p>No steps provided for this recipe.</p>
      )}
    </div>
  );
};

export default RecipePage;
