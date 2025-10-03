// src/pages/RecipesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealsList from "../components/MealsList";
import RecipePage from "../components/RecipePage";
import "../styles/RecipesPage.css";

const Recipes = () => {
  const [allMeals, setAllMeals] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [moods, setMoods] = useState([]);
  const [moodFilter, setMoodFilter] = useState("all");
  const [savedMeals, setSavedMeals] = useState([]);

  const token = localStorage.getItem("token");
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch saved meals
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/saved-meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedMeals(res.data.map((m) => m.meal_id || m.id));
      } catch (err) {
        console.error("Error fetching saved meals:", err);
      }
    };
    fetchSaved();
  }, [token, BACKEND_URL]);

  // Fetch all meals
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mealsWithSaved = res.data.map((meal) => ({
          ...meal,
          saved: savedMeals.includes(meal.id),
        }));

        setAllMeals(mealsWithSaved);

        // Build unique mood list
        const uniqueMoods = [
          ...new Set(
            res.data.map(
              (m) =>
                m.mood?.charAt(0).toUpperCase() +
                  m.mood?.slice(1).toLowerCase() || "Uncategorized"
            )
          ),
        ];
        setMoods(uniqueMoods);
      } catch (err) {
        console.error("Error fetching meals:", err);
        setAllMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [token, BACKEND_URL, savedMeals]);

  // Apply mood filter
  useEffect(() => {
    let filtered = [...allMeals];

    if (moodFilter !== "all") {
      filtered = filtered.filter(
        (meal) =>
          meal.mood &&
          meal.mood.toLowerCase() === moodFilter.toLowerCase()
      );
    }

    setMeals(filtered);
  }, [moodFilter, allMeals]);

  // Toggle saved state
  const handleToggleSave = (mealId, currentSaved) => {
    setAllMeals((prev) =>
      prev.map((m) =>
        m.id === mealId ? { ...m, saved: !currentSaved } : m
      )
    );
    setSavedMeals((prev) =>
      currentSaved ? prev.filter((id) => id !== mealId) : [...prev, mealId]
    );
  };

  return (
    <div className="recipes-page">
      <h1>
        Recipes{" "}
        {moodFilter !== "all" ? `for ${moodFilter}` : "for All Moods"}
      </h1>

      <div className="recipes-filter">
        <label htmlFor="mood">Filter by Mood: </label>
        <select
          id="mood"
          value={moodFilter}
          onChange={(e) => setMoodFilter(e.target.value)}
        >
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
      ) : meals.length > 0 ? (
        <MealsList
          meals={meals} // Pass filtered meals directly
          onToggleSave={handleToggleSave}
          onViewRecipe={(id) => setSelectedMealId(id)}
        />
      ) : (
        <p className="no-meals">No meals found for this mood.</p>
      )}

      {selectedMealId && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMealId(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <RecipePage
              mealId={selectedMealId}
              onClose={() => setSelectedMealId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
