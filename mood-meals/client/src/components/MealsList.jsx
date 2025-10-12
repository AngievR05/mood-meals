import React, { useEffect, useState } from "react";
import RecipePage from "./RecipePage";
import "../styles/MealsList.css";
import axios from "axios";

const MealsList = ({
  meals: parentMeals = [],
  filter = "all",
  currentMood = null,
  searchQuery = "",
  sortOption = "name",
  showViewAllButton = false,
  backendUrl,
}) => {
  const [meals, setMeals] = useState(parentMeals);
  const [loading, setLoading] = useState(!parentMeals.length);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const BACKEND_URL = backendUrl || process.env.REACT_APP_BACKEND_URL || "https://moodmeals.site/api";

  const normalizeMood = (mood) => (typeof mood === "string" ? mood.trim().toLowerCase() : "uncategorized");

  useEffect(() => {
    if (parentMeals.length) return;
    if (!token) return setError("You must be logged in to fetch meals.");

    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/meals`, { headers: { Authorization: `Bearer ${token}` } });
        const data = Array.isArray(res.data) ? res.data : [];
        setMeals(data.map((m) => ({ ...m, mood: normalizeMood(m.mood), saved: m.saved || false })));
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setError(err.message || "Failed to fetch meals");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [parentMeals, token, BACKEND_URL]);

  const toggleSave = async (mealId) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal || !token) return;

    const newSaved = !meal.saved;
    setMeals((prev) => prev.map((m) => (m.id === mealId ? { ...m, saved: newSaved } : m)));

    try {
      const url = `${BACKEND_URL}/saved-meals/${mealId}/${newSaved ? "save" : "unsave"}`;
      await axios({ method: newSaved ? "POST" : "DELETE", url, headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Error toggling save:", err);
      setMeals((prev) => prev.map((m) => (m.id === mealId ? { ...m, saved: meal.saved } : m)));
    }
  };

  if (loading) return <p className="loading">Loading meals...</p>;
  if (error) return <p className="no-meals">{error}</p>;
  if (!meals.length) return <p className="no-meals">No meals available.</p>;

  const filteredMeals = meals
    .filter((m) => {
      if (filter === "mood" && currentMood) return normalizeMood(m.mood) === normalizeMood(currentMood);
      if (filter === "saved") return !!m.saved;
      return true;
    })
    .filter((m) => m.name?.toLowerCase().includes(searchQuery?.toLowerCase() || ""))
    .sort((a, b) => {
      if (sortOption === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortOption === "mood") return (a.mood || "").localeCompare(b.mood || "");
      if (sortOption === "recent") return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  return (
    <section className="meals-section">
      <div className="meals-grid">
        {filteredMeals.map((meal) => (
          <div className="meal-card" key={meal.id}>
            <div className="meal-image-wrapper">
              <img src={meal.image_url || "/uploads/meals/default-meal.png"} alt={meal.name} />
            </div>
            <div className="meal-header">
              <h3>{meal.name}</h3>
              {meal.mood && <span className={`mood-badge ${meal.mood.toLowerCase().replace(/\s+/g, "-")}`}>{meal.mood}</span>}
            </div>
            <p className="meal-description">{meal.description}</p>
            <div className="meal-card-actions">
              <button className="recipe-btn" onClick={() => setSelectedMealId(meal.id)}>View Recipe</button>
              <button className={`save-btn ${meal.saved ? "saved" : ""}`} onClick={() => toggleSave(meal.id)}>
                {meal.saved ? "★" : "☆"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMealId && (
        <div className="modal-overlay" onClick={() => setSelectedMealId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RecipePage mealId={selectedMealId} onClose={() => setSelectedMealId(null)} />
          </div>
        </div>
      )}

      {showViewAllButton && (
        <div className="view-all-btn-wrapper">
          <button className="view-all-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            View All Meals
          </button>
        </div>
      )}
    </section>
  );
};

export default MealsList;
