// src/pages/Recipes.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealsList from "../components/MealsList";
import RecipePage from "../components/RecipePage";
import "../styles/RecipesPage.css";

const Recipes = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealId, setSelectedMealId] = useState(null); // modal
  const [moods, setMoods] = useState([]);
  const [moodFilter, setMoodFilter] = useState("all");

  const token = localStorage.getItem("token");

  // Fetch meals whenever the moodFilter changes
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        let res;
        if (moodFilter === "all") {
          res = await axios.get("http://localhost:5000/api/meals", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          res = await axios.get(
            `http://localhost:5000/api/meals/mood/${moodFilter}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        setMeals(res.data);

        // Extract unique moods for the filter dropdown
        const uniqueMoods = [
          ...new Set(res.data.map((m) => m.mood || "Uncategorized")),
        ];
        setMoods(uniqueMoods);
      } catch (err) {
        console.error(err);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [moodFilter, token]);

  const handleMoodChange = (e) => {
    setMoodFilter(e.target.value);
  };

  const handleViewRecipe = (mealId) => {
    setSelectedMealId(mealId); // open modal
  };

  const handleCloseModal = () => {
    setSelectedMealId(null);
  };

  return (
    <div className="recipes-page">
      <h1>All Recipes {moodFilter !== "all" ? `for ${moodFilter}` : ""}</h1>

      <div className="recipes-filter">
        <label htmlFor="mood">Filter by Mood: </label>
        <select id="mood" value={moodFilter} onChange={handleMoodChange}>
          <option value="all">All</option>
          {moods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="no-meals">Loading recipes...</p>
      ) : (
        <MealsList meals={meals} onViewRecipe={handleViewRecipe} />
      )}

      {/* Recipe Modal */}
      {selectedMealId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RecipePage mealId={selectedMealId} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
