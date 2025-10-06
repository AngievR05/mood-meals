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

  const normalizeMood = (mood) =>
    typeof mood === "string" ? mood.trim().toLowerCase() : "uncategorized";

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const [mealsRes, savedRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/meals`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BACKEND_URL}/api/saved-meals`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const mealsData = Array.isArray(mealsRes.data) ? mealsRes.data : [];
        const savedIds = Array.isArray(savedRes.data) ? savedRes.data.map((m) => m.meal_id || m.id) : [];

        const mealsWithSaved = mealsData.map((meal) => ({
          ...meal,
          saved: savedIds.includes(meal.id),
          mood: normalizeMood(meal.mood),
        }));

        setAllMeals(mealsWithSaved);
        setMeals(mealsWithSaved);

        const uniqueMoods = [...new Set(mealsWithSaved.map((m) => m.mood))].sort();
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

    fetchMeals();
  }, [token, BACKEND_URL]);

  useEffect(() => {
    if (moodFilter === "all") {
      setMeals(allMeals);
    } else {
      const filtered = allMeals.filter((meal) => meal.mood === normalizeMood(moodFilter));
      setMeals(filtered);
    }
  }, [moodFilter, allMeals]);

  const handleToggleSave = (mealId, currentSaved) => {
    const toggle = (list) => list.map((m) => (m.id === mealId ? { ...m, saved: !currentSaved } : m));
    setAllMeals((prev) => toggle(prev));
    setMeals((prev) => toggle(prev));
  };

  return (
    <div className="recipes-page">
      <h1>{`Recipes ${moodFilter !== "all" ? `for ${moodFilter}` : "for All Moods"}`}</h1>

      <div className="recipes-filter">
        <label htmlFor="mood">Filter by Mood: </label>
        <select id="mood" value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)}>
          <option value="all">All</option>
          {moods.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="no-meals">Loading recipes...</p>
      ) : meals.length > 0 ? (
        <MealsList
          meals={meals}
          filter={moodFilter === "all" ? "all" : "mood"} // Only filter by mood if a specific mood is selected
          currentMood={moodFilter === "all" ? null : moodFilter}
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
