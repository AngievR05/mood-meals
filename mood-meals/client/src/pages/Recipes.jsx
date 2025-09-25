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
  const [savedMeals, setSavedMeals] = useState([]); // IDs of saved meals
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch saved meals for user
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user-meals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedMeals(res.data.map((m) => m.meal_id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaved();
  }, [token]);

  // Fetch all meals (with optional mood filter)
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const url =
          moodFilter === "all"
            ? "http://localhost:5000/api/meals"
            : `http://localhost:5000/api/meals/mood/${moodFilter}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mealsWithSaved = res.data.map((meal) => ({
          ...meal,
          saved: savedMeals.includes(meal.id),
        }));

        setMeals(mealsWithSaved);

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
  }, [moodFilter, token, savedMeals]);

  const handleMoodChange = (e) => setMoodFilter(e.target.value);
  const handleViewRecipe = (mealId) => setSelectedMealId(mealId);
  const handleCloseModal = () => setSelectedMealId(null);

  const toggleSaveMeal = async (mealId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/user-meals/${mealId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSavedMeals((prev) =>
        prev.includes(mealId)
          ? prev.filter((id) => id !== mealId)
          : [...prev, mealId]
      );
    } catch (err) {
      console.error(err);
    }
  };

  const displayedMeals = showSavedOnly
    ? meals.filter((m) => savedMeals.includes(m.id))
    : meals;

  return (
    <div className="recipes-page">
      <h1>
        All Recipes {moodFilter !== "all" ? `for ${moodFilter}` : ""}
        {showSavedOnly ? " (Saved)" : ""}
      </h1>

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

        <label>
          <input
            type="checkbox"
            checked={showSavedOnly}
            onChange={() => setShowSavedOnly(!showSavedOnly)}
          />{" "}
          Show Saved Only
        </label>
      </div>

      {loading ? (
        <p className="no-meals">Loading recipes...</p>
      ) : (
        <MealsList
          meals={displayedMeals}
          onViewRecipe={handleViewRecipe}
          onToggleSave={toggleSaveMeal}
        />
      )}

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
