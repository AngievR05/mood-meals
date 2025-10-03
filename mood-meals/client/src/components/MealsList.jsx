import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipePage from "./RecipePage";
import "../styles/MealsList.css";

const MealsList = ({
  role = "user",
  filter = "all",
  searchQuery = "",
  sortOption = "name",
  currentMood = null,
  showViewAllButton = false,
  onToggleSave,
  backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
}) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch meals from backend
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(res.data);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [token, backendUrl]);

  // Filter & sort
  const filteredMeals = meals
    .filter((m) => {
      if (filter === "mood") return currentMood ? m.mood?.toLowerCase() === currentMood.name?.toLowerCase() : true;
      if (filter === "saved") return m.saved;
      return true;
    })
    .filter((m) => m.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "mood") return (a.mood || "").localeCompare(b.mood || "");
      if (sortOption === "recent") return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  // Toggle save
  const toggleSave = async (mealId) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      const newSaved = !meal.saved;
      setMeals((prev) =>
        prev.map((m) => (m.id === mealId ? { ...m, saved: newSaved } : m))
      );

      await axios.post(
        `${backendUrl}/api/saved-meals/${mealId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onToggleSave) onToggleSave(mealId, newSaved);
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
          const imageSrc = meal.image_url?.startsWith("http")
            ? meal.image_url
            : `${backendUrl}${meal.image_url}`;

          return (
            <div className="meal-card" key={meal.id}>
              {meal.image_url && (
                <div className="meal-image-wrapper">
                  <img src={imageSrc} alt={meal.name} className="meal-image" />
                </div>
              )}

              <div className="meal-header">
                <h3>{meal.name}</h3>
                {meal.mood && (
                  <span className={`mood-badge ${meal.mood.toLowerCase()}`}>
                    {meal.mood}
                  </span>
                )}
              </div>

              <p className="meal-description">{meal.description}</p>

              <div className="meal-card-actions">
                <button className="recipe-btn" onClick={() => setSelectedMealId(meal.id)}>
                  View Recipe
                </button>
                
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
    </section>
  );
};

export default MealsList;
