import React, { useEffect, useState } from "react";
import axios from "axios";
import MealsList from "../components/MealsList";
import RecipePage from "../components/RecipePage";
import "../styles/RecipesPage.css";

const Recipes = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [moods, setMoods] = useState([]);
  const [moodFilter, setMoodFilter] = useState("all");
  const [savedMeals, setSavedMeals] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch saved meals
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/saved-meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedMeals(res.data.map((m) => m.meal_id || m.id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaved();
  }, [token, BACKEND_URL]);

  // Fetch meals with mood filter
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const url = moodFilter === "all" ? `${BACKEND_URL}/api/meals` : `${BACKEND_URL}/api/meals/mood/${moodFilter}`;
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const mealsWithSaved = res.data.map((meal) => ({ ...meal, saved: savedMeals.includes(meal.id) }));
        setMeals(mealsWithSaved);
        setMoods([...new Set(res.data.map((m) => m.mood || "Uncategorized"))]);
      } catch (err) {
        console.error(err);
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [moodFilter, token, savedMeals, BACKEND_URL]);

  const handleToggleSave = (mealId, currentSaved) => {
    setMeals((prev) => prev.map((m) => (m.id === mealId ? { ...m, saved: !currentSaved } : m)));
    setSavedMeals((prev) => currentSaved ? prev.filter((id) => id !== mealId) : [...prev, mealId]);
  };

  const displayedMeals = showSavedOnly ? meals.filter((m) => savedMeals.includes(m.id)) : meals;

  return (
    <div className="recipes-page">
      <h1>
        All Recipes {moodFilter !== "all" ? `for ${moodFilter}` : ""} {showSavedOnly ? "(Saved)" : ""}
      </h1>

      <div className="recipes-filter">
        <label htmlFor="mood">Filter by Mood: </label>
        <select id="mood" value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)}>
          <option value="all">All</option>
          {moods.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <label>
          <input type="checkbox" checked={showSavedOnly} onChange={() => setShowSavedOnly(!showSavedOnly)} />
          Show Saved Only
        </label>
      </div>

      {loading ? <p className="no-meals">Loading recipes...</p> : <MealsList meals={displayedMeals} onToggleSave={handleToggleSave} />}

      {selectedMealId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RecipePage mealId={selectedMealId} onClose={() => setSelectedMealId(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
