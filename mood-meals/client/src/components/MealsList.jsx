import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MealsList.css";

const MealsList = ({ role, fetchMealsTrigger }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data)) throw new Error("Unexpected API response");

      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err.response || err.message || err);
      setError(err.response?.data?.message || err.message || "Failed to load meals");
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
      await axios.delete(`http://localhost:5000/api/meals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMeals(); // refresh list
    } catch (err) {
      console.error("Error deleting meal:", err.response || err.message || err);
      alert(err.response?.data?.message || err.message || "Failed to delete meal");
    }
  };

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p className="meal-error">{error}</p>;

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
