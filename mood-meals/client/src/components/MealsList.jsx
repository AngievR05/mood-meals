import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MealsList.css";

const MealsList = ({ role, fetchMealsTrigger }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [fetchMealsTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/meals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMeals(); // refresh list
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  if (loading) return <p>Loading meals...</p>;

  return (
    <section className="meals-section">
      <h2>Meals You Can Make</h2>
      <p>Discover delicious meals to cook based on your groceries and mood.</p>
      <div className="meals-grid">
        {meals.map((meal) => (
          <div className="meal-card" key={meal.id}>
            <h3>{meal.name}</h3>
            <p>{meal.description}</p>
            {role === "admin" && (
              <div className="admin-buttons">
                <button>Edit</button>
                <button onClick={() => handleDelete(meal.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MealsList;
