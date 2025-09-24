import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MealsList.css";

const MealsList = ({ role, fetchMealsTrigger, filter, currentMood }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data)) throw new Error("Unexpected API response");

      // Map meals with "saved" property if available
      setMeals(
        res.data.map((meal) => ({
          ...meal,
          saved: meal.saved || false,
        }))
      );
    } catch (err) {
      console.error("Error fetching meals:", err.response || err.message || err);
      setError(err.response?.data?.message || err.message || "Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [fetchMealsTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/meals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMeals(); // refresh list
    } catch (err) {
      console.error("Error deleting meal:", err.response || err.message || err);
      alert(err.response?.data?.message || err.message || "Failed to delete meal");
    }
  };

  const handleToggleSave = async (mealId, isSaved) => {
    try {
      const token = localStorage.getItem("token");
      if (isSaved) {
        await axios.delete(`http://localhost:5000/api/saved-meals/${mealId}/unsave`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/saved-meals/${mealId}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMeals((prev) =>
        prev.map((meal) =>
          meal.id === mealId ? { ...meal, saved: !meal.saved } : meal
        )
      );
    } catch (err) {
      console.error("Error toggling save:", err.response || err.message || err);
      alert(err.response?.data?.message || "Failed to update saved meal");
    }
  };

  const handleViewRecipe = (mealId) => {
    navigate(`/recipes/${mealId}`);
  };

  // Filtering logic
  const filteredMeals = meals.filter((meal) => {
    if (filter === "all") return true;
    if (filter === "mood" && currentMood) {
      return meal.mood?.toLowerCase() === currentMood.name.toLowerCase();
    }
    if (filter === "saved") return meal.saved === true;
    return true;
  });

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p className="meal-error">{error}</p>;

  return (
    <section className="meals-section">
      <h2>Meals You Can Make</h2>
      <p>Discover delicious meals to cook based on your groceries and mood.</p>

      {filteredMeals.length === 0 ? (
        <p className="no-meals">No meals match this filter.</p>
      ) : (
        <div className="meals-grid">
          {filteredMeals.map((meal) => (
            <div className="meal-card" key={meal.id}>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>

              {/* Actions */}
              <div className="meal-actions">
                <button
                  className="recipe-btn"
                  onClick={() => handleViewRecipe(meal.id)}
                >
                  View Recipe
                </button>
                <button
                  className={`save-btn ${meal.saved ? "saved" : ""}`}
                  onClick={() => handleToggleSave(meal.id, meal.saved)}
                  title={meal.saved ? "Unsave Meal" : "Save Meal"}
                >
                  {meal.saved ? "★" : "☆"}
                </button>
              </div>

              {/* Admin controls */}
              {role === "admin" && (
                <div className="admin-buttons">
                  <button>Edit</button>
                  <button onClick={() => handleDelete(meal.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MealsList;
