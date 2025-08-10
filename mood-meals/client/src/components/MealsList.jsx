import React from "react";
import "../styles/MealsList.css";

const meals = [
  {
    title: "Vegetable Stir-fry",
    desc: "Great for relaxation.",
  },
  {
    title: "Chicken Curry",
    desc: "Perfect for a mood uplift!",
  },
  {
    title: "Tomato Pasta",
    desc: "Comfort food for a cozy evening.",
  },
  {
    title: "Salmon Salad",
    desc: "Light and refreshing.",
  },
];

const MealsList = () => {
  return (
    <section className="meals-section">
      <h2>Meals You Can Make</h2>
      <p>Discover delicious meals to cook based on your groceries and mood.</p>
      <div className="meals-grid">
        {meals.map((meal, i) => (
          <div className="meal-card" key={i}>
            <h3>{meal.title}</h3>
            <p>{meal.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MealsList;
