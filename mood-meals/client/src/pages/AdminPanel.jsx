import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const moods = ["Happy", "Sad", "Angry", "Stressed", "Bored", "Energised", "Confused", "Grateful"];

const AdminPanel = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMood, setFilterMood] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch meals from backend
  const fetchMeals = async () => {
    setLoading(true);
    try {
      const url = filterMood ? `http://localhost:5000/api/meals/mood/${filterMood}` : "http://localhost:5000/api/meals";
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      toast.error("Error fetching meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [filterMood]);

  const openEditMeal = (meal) => {
    navigate(`/admin/edit-meal/${meal.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/meals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting meal");
      toast.success("Meal deleted!");
      fetchMeals();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Meals</h1>

      <div className="admin-controls">
        <button className="primary-btn" onClick={() => navigate("/admin/add-meal")}>+ Add Meal</button>

        <select value={filterMood} onChange={e => setFilterMood(e.target.value)}>
          <option value="">All Moods</option>
          {moods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading meals...</p>
      ) : (
        <table className="meals-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mood</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal.id}>
                <td>{meal.name}</td>
                <td>{meal.mood}</td>
                <td>{meal.description.slice(0, 50)}...</td>
                <td>
                  <button className="edit-btn" onClick={() => openEditMeal(meal)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(meal.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
