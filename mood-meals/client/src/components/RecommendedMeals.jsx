import React from "react";
import { Link } from "react-router-dom";
import "../styles/RecommendedMeals.css";

// This should match the keys in your RecipePage recipeMap
const recommended = [
  {
    title: "Fruit Salad",
    desc: "A vibrant, refreshing bowl of seasonal fruits.",
    img: "/images/fruit-salad.jpg", // Replace with actual asset path
  },
  {
    title: "Smoothie Bowl",
    desc: "A colorful smoothie bowl filled with vitamins.",
    img: "/images/smoothie-bowl.jpg",
  },
  {
    title: "Refreshing Salad",
    desc: "A light and refreshing salad perfect for warm days.",
    img: "/images/refreshing-salad.jpg",
  },
];

const RecommendedMeals = () => {
  return (
    <section className="recommended-section">
      <h2>Recommended Meals</h2>
      <div className="recommended-grid">
        {recommended.map((meal, i) => (
          <Link
            to={`/recipe/${encodeURIComponent(meal.title)}`}
            className="recommended-card"
            key={i}
          >
            <div className="recommended-img">
              <img src={meal.img} alt={meal.title} />
            </div>
            <h3>{meal.title}</h3>
            <p>{meal.desc}</p>
            <button className="secondary-btn">View Recipe</button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedMeals;
