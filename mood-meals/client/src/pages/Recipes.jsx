// src/pages/Recipes.jsx
import React, { useEffect, useState } from "react";
import MealsList from "../components/MealsList";
import RecipePage from "../components/RecipePage";
import "../styles/RecipesPage.css";
import axios from "axios";

const Recipes = () => {
  const [allMeals, setAllMeals] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [moods, setMoods] = useState([]);
  const [moodFilter, setMoodFilter] = useState("all");

  const token = localStorage.getItem("token");

  // ✅ Safe backend URL config
  const BACKEND_URL =
    process.env.NODE_ENV === "production"
      ? "/api"
      : process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

  // ✅ Utility to normalize mood text
  const normalizeMood = (mood) =>
    typeof mood === "string" ? mood.trim().toLowerCase() : "uncategorized";

  // ✅ Fetch all meals once on mount
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const [mealsRes, savedRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/meals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BACKEND_URL}/saved-meals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const mealsData = Array.isArray(mealsRes.data) ? mealsRes.data : [];
        const savedIds = Array.isArray(savedRes.data)
          ? savedRes.data.map((m) => m.meal_id || m.id)
          : [];

        // Combine meal data + saved state
        const mealsWithSaved = mealsData.map((meal) => ({
          ...meal,
          saved: savedIds.includes(meal.id),
          mood: normalizeMood(meal.mood),
        }));

        setAllMeals(mealsWithSaved);
        setMeals(mealsWithSaved);

        // Extract unique moods for filter dropdown
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
  }, []); // ✅ empty dependency — no infinite loop

  // ✅ Filter meals when mood changes
  useEffect(() => {
    if (moodFilter === "all") {
      setMeals(allMeals);
    } else {
      setMeals(allMeals.filter((meal) => meal.mood === normalizeMood(moodFilter)));
    }
  }, [moodFilter, allMeals]);

  return (
    <div className="recipes-page">
      <h1>
        {`Recipes ${
          moodFilter !== "all" ? `for ${moodFilter.charAt(0).toUpperCase() + moodFilter.slice(1)}` : "for All Moods"
        }`}
      </h1>

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
          filter={moodFilter === "all" ? "all" : "mood"}
          currentMood={moodFilter === "all" ? null : moodFilter}
          onToggleSave={() => {}} // no parent-state bounce
          onViewRecipe={(id) => setSelectedMealId(id)}
          backendUrl={BACKEND_URL}
        />
      ) : (
        <p className="no-meals">No meals found for this mood.</p>
      )}

      {/* ✅ Modal opens once per meal, closes cleanly */}
      {selectedMealId && (
        <div className="modal-overlay" onClick={() => setSelectedMealId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RecipePage
              mealId={selectedMealId}
              onClose={() => setSelectedMealId(null)}
              backendUrl={BACKEND_URL}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
