import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecipePage.css";

const RecipePage = ({ mealId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://moodmeals.site/api";

  // Utility: safely parse JSON, fallback to empty array
  const safeParseJSON = (data) => {
    try {
      return Array.isArray(data) ? data : JSON.parse(data || "[]");
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!mealId) return;
    if (!token) return setError("You must be logged in to view this recipe.");

    const fetchMeal = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/meals/${mealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If backend returns HTML (React fallback), throw error
        if (typeof res.data === "string" && res.data.startsWith("<!doctype html>")) {
          throw new Error("Backend returned HTML. Check BACKEND_URL or server routes.");
        }

        const meal = res.data;
        meal.ingredients = safeParseJSON(meal.ingredients);
        meal.steps = safeParseJSON(meal.steps);
        meal.mood = typeof meal.mood === "string" ? meal.mood : "Happy";

        setRecipe(meal);

        // Check if meal is saved
        const savedRes = await axios.get(`${BACKEND_URL}/saved-meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const isSaved = Array.isArray(savedRes.data)
          ? savedRes.data.some((m) => m.meal_id === meal.id || m.id === meal.id)
          : false;
        setSaved(isSaved);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        if (err.response?.status === 401) setError("Unauthorized. Please login.");
        else if (err.message.includes("HTML")) setError("Server misconfiguration: backend returned HTML.");
        else setError("Failed to fetch recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId, token, BACKEND_URL]);

  const toggleSave = async () => {
    if (!recipe || !token) return;
    try {
      const url = `${BACKEND_URL}/saved-meals/${recipe.id}/${saved ? "unsave" : "save"}`;
      await axios({ method: saved ? "DELETE" : "POST", url, headers: { Authorization: `Bearer ${token}` } });
      setSaved(!saved);
    } catch (err) {
      console.error("Error toggling save:", err);
      setError("Failed to toggle save status.");
    }
  };

  if (loading) return <p className="recipe-loading">Loading recipe...</p>;
  if (error) return <p className="no-meals">{error}</p>;
  if (!recipe) return <p className="no-meals">Recipe not found</p>;

  const imageSrc =
    recipe.image_url?.startsWith("http")
      ? recipe.image_url
      : `${BACKEND_URL}${recipe.image_url || "/uploads/meals/default-meal.png"}`;
  const moodName = recipe.mood.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="recipe-page">
      <button onClick={onClose} className="back-btn">← Close</button>

      <div className="recipe-header">
        <h1>{recipe.name || "Untitled Meal"}</h1>
        {recipe.mood && <span className={`mood-badge ${moodName}`}>{recipe.mood}</span>}
        <button className={`save-btn floating ${saved ? "saved" : ""}`} onClick={toggleSave}>
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>

      {recipe.image_url && <img src={imageSrc} alt={recipe.name} className="recipe-image" />}
      <p className="recipe-description">{recipe.description || "No description available."}</p>

      <h2>📝 Ingredients</h2>
      <ul className="recipe-list ingredients-list">
        {recipe.ingredients.length ? recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>) : <li>No ingredients provided.</li>}
      </ul>

      <h2>👨‍🍳 Steps</h2>
      {recipe.steps.length ? <ol className="recipe-list steps-list">{recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}</ol> : <p>No steps provided.</p>}
    </div>
  );
};

export default RecipePage;
