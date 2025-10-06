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

  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch meals and saved meals together
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mealsRes, savedRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/meals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BACKEND_URL}/api/saved-meals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const mealsData = Array.isArray(mealsRes.data) ? mealsRes.data : [];
        const savedIds = Array.isArray(savedRes.data)
          ? savedRes.data.map((m) => m.meal_id || m.id)
          : [];

        // Add saved flag safely
        const mealsWithSaved = mealsData.map((meal) => ({
          ...meal,
          saved: savedIds.includes(meal.id),
          mood: typeof meal.mood === "string" ? meal.mood : "Uncategorized",
        }));

        setAllMeals(mealsWithSaved);
        setMeals(mealsWithSaved);

        // Build unique moods
        const uniqueMoods = [
          ...new Set(mealsWithSaved.map((m) =>
            m.mood.charAt(0).toUpperCase() + m.mood.slice(1).toLowerCase()
          )),
        ];
        setMoods(uniqueMoods);
      } catch (err) {
        console.error("Error fetching meals:", err);
        setAllMeals([]);
        setMeals([]);
        setMoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, BACKEND_URL]);

  // Apply mood filter
  useEffect(() => {
    if (moodFilter.toLowerCase() === "all") {
      setMeals(allMeals);
    } else {
      const filtered = allMeals.filter(
        (meal) => meal.mood.toLowerCase() === moodFilter.toLowerCase()
      );
      setMeals(filtered);
    }
  }, [moodFilter, allMeals]);

  // Toggle saved state
  const handleToggleSave = (mealId, currentSaved) => {
    setAllMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, saved: !currentSaved } : m))
    );
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, saved: !currentSaved } : m))
    );
  };

  return (
    <div className="recipes-page">
      <h1>
        Recipes {moodFilter !== "all" ? `for ${moodFilter}` : "for All Moods"}
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
          meals={meals}
          onToggleSave={handleToggleSave}
          onViewRecipe={(id) => setSelectedMealId(id)}
        />
      ) : (
        <p className="no-meals">No meals found for this mood.</p>
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

export default Recipes;
