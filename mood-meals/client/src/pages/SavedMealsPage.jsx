// src/pages/SavedMealsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SavedMealsPage.css";
import { toast } from "react-toastify";
import RecipePage from "../components/RecipePage";

const SavedMealsPage = () => {
  const [savedMeals, setSavedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [selectedMealId, setSelectedMealId] = useState(null);

  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://moodmeals.site/api";

  useEffect(() => {
    const fetchSavedMeals = async () => {
      if (!token) return setError("No authentication token found.");
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/saved-meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : [];
        const meals = data.map((meal) => ({
          id: meal.id ?? meal.meal_id,
          name: meal.name || "Untitled Meal",
          description: meal.description || "",
          mood: meal.mood || "Uncategorized",
          image_url: meal.image_url || "",
          saved: true,
        }));

        setSavedMeals(meals);
      } catch (err) {
        console.error("Error fetching saved meals:", err);
        setError(err.response?.data?.message || "Failed to load saved meals");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedMeals();
  }, [token, BACKEND_URL]);

  const toggleSave = async (mealId, currentSaved) => {
    if (!token) return;
    try {
      const url = `${BACKEND_URL}/saved-meals/${mealId}/${currentSaved ? "unsave" : "save"}`;
      await axios({ method: currentSaved ? "DELETE" : "POST", url, headers: { Authorization: `Bearer ${token}` } });
      setSavedMeals((prev) =>
        prev.map((m) => (m.id === mealId ? { ...m, saved: !currentSaved } : m))
      );
      toast.success(currentSaved ? "Meal removed from saved!" : "Meal saved!");
    } catch (err) {
      console.error("Error toggling saved meal:", err);
      toast.error(err.response?.data?.message || "Failed to toggle save");
    }
  };

  const moods = ["all", ...new Set(savedMeals.map((m) => m.mood))];
  const filteredMeals = savedMeals.filter((m) => (moodFilter === "all" ? true : m.mood === moodFilter));

  if (loading) return <p className="loading-text">Loading saved meals...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="saved-meals-page">
      <h1>My Saved Meals</h1>

      {savedMeals.length > 0 && (
        <div className="filter-container">
          <label htmlFor="mood-filter">Filter by Mood:</label>
          <select id="mood-filter" value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)}>
            {moods.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}

      {filteredMeals.length === 0 ? (
        <p className="no-saved">You haven’t saved any meals yet or no meals match this filter.</p>
      ) : (
        <div className="saved-grid">
          {filteredMeals.map((meal) => (
            <div className="saved-card" key={meal.id}>
              <h3>{meal.name}</h3>
              {meal.mood && <span className={`mood-badge ${meal.mood.toLowerCase()}`}>{meal.mood}</span>}
              <p>{meal.description}</p>
              <div className="saved-actions">
                <button className="recipe-btn" onClick={() => setSelectedMealId(meal.id)}>View Recipe</button>
                <button className={`save-btn ${meal.saved ? "saved" : ""}`} onClick={() => toggleSave(meal.id, meal.saved)}>
                  {meal.saved ? "★" : "☆"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default SavedMealsPage;
