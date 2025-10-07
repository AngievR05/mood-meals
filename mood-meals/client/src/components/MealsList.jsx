// src/components/MealsList.jsx
import React, { useState, useEffect } from "react";
import RecipePage from "./RecipePage";
import "../styles/MealsList.css";

const MealsList = ({
  meals: parentMeals = [],
  role = "user",
  filter = "all",
  currentMood = null,
  searchQuery = "",
  sortOption = "name",
  showViewAllButton = false,
  onToggleSave,
  backendUrl = process.env.REACT_APP_BACKEND_URL || "/api", // uses relative path if env not set
}) => {
  const [meals, setMeals] = useState(parentMeals);
  const [loading, setLoading] = useState(!parentMeals.length);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const token = localStorage.getItem("token");

  const normalizeMood = (mood) => (typeof mood === "string" ? mood.trim().toLowerCase() : "uncategorized");

  // Fetch meals only if parentMeals is empty
  useEffect(() => {
    if (parentMeals.length) return; // skip if meals passed from parent

    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const mealsData = Array.isArray(data)
          ? data.map((m) => ({ ...m, mood: normalizeMood(m.mood) }))
          : [];
        setMeals(mealsData);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [parentMeals, token, backendUrl]);

  // Apply filters and sorting
  const filteredMeals = meals
    .filter((m) => {
      if (filter === "mood" && currentMood) {
        return normalizeMood(m.mood) === normalizeMood(currentMood);
      }
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

  const toggleSave = async (mealId) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      const newSaved = !meal.saved;
      setMeals((prev) => prev.map((m) => (m.id === mealId ? { ...m, saved: newSaved } : m)));
      if (onToggleSave) onToggleSave(mealId, newSaved);

      await fetch(`${backendUrl}/saved-meals/${mealId}/toggle`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  if (loading) return <p className="loading">Loading meals...</p>;
  if (!filteredMeals.length) return <p className="no-meals">No meals available.</p>;

  return (
    <section className="meals-section">
      <div className="meals-grid">
        {filteredMeals.map((meal) => {
          const imageSrc =
            meal.image_url?.startsWith("http")
              ? meal.image_url
              : `${backendUrl}${meal.image_url || "/default-meal.png"}`;
          const mealMood = typeof meal.mood === "string" ? meal.mood : "Uncategorized";

          return (
            <div className="meal-card" key={meal.id}>
              <div className="meal-image-wrapper">
                <img src={imageSrc} alt={meal.name || "Meal"} className="meal-image" />
              </div>

              <div className="meal-header">
                <h3>{meal.name}</h3>
                {mealMood && (
                  <span className={`mood-badge ${mealMood.toLowerCase().replace(/\s+/g, "-")}`}>
                    {mealMood}
                  </span>
                )}
              </div>

              <p className="meal-description">{meal.description}</p>

              <div className="meal-card-actions">
                <button className="recipe-btn" onClick={() => setSelectedMealId(meal.id)}>
                  View Recipe
                </button>
                {onToggleSave && (
                  <button className={`save-btn ${meal.saved ? "saved" : ""}`} onClick={() => toggleSave(meal.id)}>
                    {meal.saved ? "★" : "☆"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
          <button
            className="view-all-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            View All Meals
          </button>
        </div>
      )}
    </section>
  );
};

export default MealsList;
