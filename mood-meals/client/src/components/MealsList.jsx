import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecipePage from "./RecipePage";
import "../styles/MealsList.css";

const MealsList = ({ role, currentMood, showViewAllButton = false }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMealId, setSelectedMealId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleViewRecipe = (mealId) => {
    setSelectedMealId(mealId);
  };

  const handleCloseModal = () => setSelectedMealId(null);

  const handleViewAllRecipes = () => navigate("/recipes");

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p className="meal-error">{error}</p>;

  return (
    <section className="meals-section">
      {showViewAllButton && (
        <div className="meals-header">
          <div>
            <h2>Meals You Can Make</h2>
            <p>Discover meals based on your groceries and mood.</p>
          </div>
          <button className="primary-btn" onClick={handleViewAllRecipes}>
            View All Recipes
          </button>
        </div>
      )}

      {meals.length === 0 ? (
        <p className="no-meals">No meals available.</p>
      ) : (
        <div className="meals-grid">
          {meals.map((meal) => (
            <div className="meal-card" key={meal.id}>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
              <button
                className="recipe-btn"
                onClick={() => handleViewRecipe(meal.id)}
              >
                View Recipe
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedMealId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RecipePage mealId={selectedMealId} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </section>
  );
};

export default MealsList;
