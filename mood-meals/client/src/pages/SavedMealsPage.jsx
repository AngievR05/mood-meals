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
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch saved meals from the backend
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) throw new Error("No authentication token found.");

        const res = await axios.get(`${BACKEND_URL}/api/saved-meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map the response to ensure all fields exist
        const meals = res.data.map(meal => ({
          id: meal.id || meal.meal_id,
          name: meal.name,
          description: meal.description,
          mood: meal.mood || "Uncategorized",
          image_url: meal.image_url || "",
          saved: true,
        }));

        setSavedMeals(meals);
      } catch (err) {
        console.error("Error fetching saved meals:", err);
        setError(err.response?.data?.message || err.message || "Failed to load saved meals");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [token, BACKEND_URL]);

  // Remove saved meal
  const handleUnsave = async (mealId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/saved-meals/${mealId}/unsave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedMeals(prev => prev.filter(meal => meal.id !== mealId));
      toast.success("Meal removed from saved!");
    } catch (err) {
      console.error("Error unsaving meal:", err);
      toast.error(err.response?.data?.message || "Failed to remove saved meal");
    }
  };

  // Filter
  const moods = ["all", ...new Set(savedMeals.map(m => m.mood))];
  const filteredMeals = savedMeals.filter(m =>
    moodFilter === "all" ? true : m.mood === moodFilter
  );

  if (loading) return <p className="loading-text">Loading saved meals...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="saved-meals-page">
      <h1>My Saved Meals</h1>

      {savedMeals.length > 0 && (
        <div className="filter-container">
          <label htmlFor="mood-filter">Filter by Mood:</label>
          <select
            id="mood-filter"
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
          >
            {moods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      {filteredMeals.length === 0 ? (
        <p className="no-saved">You haven’t saved any meals yet or no meals match this filter.</p>
      ) : (
        <div className="saved-grid">
          {filteredMeals.map(meal => (
            <div className="saved-card" key={meal.id}>
              <h3>{meal.name}</h3>
              {meal.mood && <span className={`mood-badge ${meal.mood.toLowerCase()}`}>{meal.mood}</span>}
              <p>{meal.description}</p>
              <div className="saved-actions">
                <button 
                  className="recipe-btn" 
                  onClick={() => setSelectedMealId(meal.id)}
                >
                  View Recipe
                </button>
                <button 
                  className="save-btn saved" 
                  onClick={() => handleUnsave(meal.id)}
                  title="Remove from Saved Meals"
                >
                  ★
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for RecipePage */}
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
