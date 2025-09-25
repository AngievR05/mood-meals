import React, { useEffect, useState } from "react";
import RecipePage from "./RecipePage";
import "../styles/MealsList.css";

const MealsList = ({
  meals: parentMeals = [],
  onViewRecipe,
  onToggleSave,
  showViewAllButton = false,
}) => {
  const [meals, setMeals] = useState(parentMeals);
  const [selectedMealId, setSelectedMealId] = useState(null);

  useEffect(() => {
    setMeals(parentMeals);
  }, [parentMeals]);

  const handleViewRecipe = (mealId) => {
    if (onViewRecipe) onViewRecipe(mealId);
    else setSelectedMealId(mealId);
  };

  const handleCloseModal = () => setSelectedMealId(null);

  const toggleSave = (mealId) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId ? { ...m, saved: !m.saved } : m
      )
    );
    if (onToggleSave) onToggleSave(mealId);
  };

  return (
    <section className="meals-section">
      {meals.length === 0 ? (
        <p className="no-meals">No meals available.</p>
      ) : (
        <div className="meals-grid">
          {meals.map((meal) => (
            <div className="meal-card" key={meal.id}>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>

              <div className="meal-card-actions">
                <button
                  className="recipe-btn"
                  onClick={() => handleViewRecipe(meal.id)}
                >
                  View Recipe
                </button>

                <button
                  className={`save-btn ${meal.saved ? "saved" : ""}`}
                  onClick={() => toggleSave(meal.id)}
                  title={meal.saved ? "Unsave Meal" : "Save Meal"}
                >
                  {meal.saved ? "★" : "☆"}
                </button>
              </div>
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
