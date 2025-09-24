import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SavedMealsPage.css";

const SavedMealsPage = () => {
  const [savedMeals, setSavedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch saved meals
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const res = await axios.get("http://localhost:5000/api/saved-meals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mark all as saved (optional)
        setSavedMeals(res.data.map(meal => ({ ...meal, saved: true })));
      } catch (err) {
        console.error("Error fetching saved meals:", err);
        setError(err.response?.data?.message || err.message || "Failed to load saved meals");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  // Unsave a meal
  const handleUnsave = async (mealId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/saved-meals/${mealId}/unsave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedMeals(prev => prev.filter(meal => meal.id !== mealId));
    } catch (err) {
      console.error("Error unsaving meal:", err);
      alert(err.response?.data?.message || "Failed to remove saved meal");
    }
  };

  const handleViewRecipe = (mealId) => {
    navigate(`/recipes/${mealId}`);
  };

  if (loading) return <p className="loading-text">Loading saved meals...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="saved-meals-page">
      <h1>My Saved Meals</h1>
      {savedMeals.length === 0 ? (
        <p className="no-saved">You haven’t saved any meals yet.</p>
      ) : (
        <div className="saved-grid">
          {savedMeals.map(meal => (
            <div className="saved-card" key={meal.id}>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
              <div className="saved-actions">
                <button className="recipe-btn" onClick={() => handleViewRecipe(meal.id)}>
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
    </div>
  );
};

export default SavedMealsPage;
