import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SavedMealsPage.css";

const SavedMealsPage = () => {
  const [savedMeals, setSavedMeals] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/saved-meals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedMeals(res.data);
      } catch (err) {
        console.error("Error fetching saved meals:", err);
      }
    };
    fetchSaved();
  }, []);

  return (
    <div className="saved-meals-page">
      <h1>My Saved Meals</h1>
      <div className="saved-grid">
        {savedMeals.length > 0 ? (
          savedMeals.map((meal) => (
            <div className="saved-card" key={meal.id}>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
            </div>
          ))
        ) : (
          <p>You haven’t saved any meals yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedMealsPage;
