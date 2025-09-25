import React, { useState, useEffect } from "react";
import "../styles/RecipePage.css";

const RecipePage = ({ mealId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!mealId) return;

    const fetchMeal = async () => {
      setLoading(true);
      setError("");
      setRecipe(null);
      try {
        const res = await fetch(`http://localhost:5000/api/meals/${mealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch meal");
        const meal = await res.json();

        meal.ingredients = Array.isArray(meal.ingredients)
          ? meal.ingredients
          : JSON.parse(meal.ingredients || "[]");
        meal.steps = Array.isArray(meal.steps)
          ? meal.steps
          : JSON.parse(meal.steps || "[]");

        setRecipe(meal);
      } catch (err) {
        setError(err.message || "Error fetching recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId, token]);

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
      <h1>{recipe.name}</h1>
      {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
      )}
      <p className="recipe-description">{recipe.description}</p>

      <h2>📝 Ingredients</h2>
      <ul className="recipe-list">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2>👨‍🍳 Steps</h2>
      {recipe.steps.length > 0 ? (
        <ol className="recipe-list">
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
