import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecipesPage.css";

const RecipesPage = () => {
  const [mealsByMood, setMealsByMood] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/meals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const grouped = res.data.reduce((acc, meal) => {
          const mood = meal.mood || "Uncategorized";
          if (!acc[mood]) acc[mood] = [];
          acc[mood].push(meal);
          return acc;
        }, {});

        setMealsByMood(grouped);
      } catch (err) {
        console.error("Error fetching meals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  if (loading) return <p>Loading recipes...</p>;

  return (
    <div className="recipes-page">
      <h1>All Recipes by Mood</h1>
      {Object.entries(mealsByMood).map(([mood, meals]) => (
        <section key={mood} className="recipes-section">
          <h2>{mood}</h2>
          <div className="recipes-grid">
            {meals.map((meal) => (
              <div className="recipe-card" key={meal.id}>
                <h3>{meal.name}</h3>
                <p>{meal.description}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default RecipesPage;
