import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const moods = ["Happy", "Sad", "Angry", "Stressed", "Bored", "Energised", "Confused", "Grateful"];

const AdminPanel = () => {
  const [tab, setTab] = useState("meals"); // meals | feedback
  const [meals, setMeals] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [filterMood, setFilterMood] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch meals
  const fetchMeals = async () => {
    setLoadingMeals(true);
    try {
      const url = filterMood
        ? `http://localhost:5000/api/meals/mood/${filterMood}`
        : "http://localhost:5000/api/meals";
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      toast.error("Error fetching meals");
    } finally {
      setLoadingMeals(false);
    }
  };

  // Fetch feedback
  const fetchFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      toast.error("Error fetching feedback");
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    fetchMeals();
    fetchFeedback();
  }, [filterMood]);

  const openEditMeal = (meal) => navigate(`/admin/edit-meal/${meal.id}`);

  const handleDeleteMeal = async (id) => {
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

  const resolveFeedback = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}/resolve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resolve feedback");
      toast.success("Feedback marked as resolved!");
      fetchFeedback();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div className="admin-controls">
        <button
          className={`primary-btn ${tab === "meals" ? "active-tab" : ""}`}
          onClick={() => setTab("meals")}
        >
          Meals
        </button>
        <button
          className={`primary-btn ${tab === "feedback" ? "active-tab" : ""}`}
          onClick={() => setTab("feedback")}
        >
          Feedback
        </button>
      </div>

      {tab === "meals" && (
        <>
          <div className="admin-controls">
            <button className="primary-btn" onClick={() => navigate("/admin/add-meal")}>
              + Add Meal
            </button>
            <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)}>
              <option value="">All Moods</option>
              {moods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {loadingMeals ? (
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
                {meals.map((meal) => (
                  <tr key={meal.id}>
                    <td>{meal.name}</td>
                    <td>{meal.mood}</td>
                    <td>{meal.description.slice(0, 50)}...</td>
                    <td>
                      <button className="edit-btn" onClick={() => openEditMeal(meal)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteMeal(meal.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "feedback" && (
        <>
          {loadingFeedback ? (
            <p>Loading feedback...</p>
          ) : (
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((f) => (
                  <tr key={f.id}>
                    <td>{f.username || f.user_id}</td>
                    <td>{f.subject}</td>
                    <td>{f.message.slice(0, 50)}...</td>
                    <td>{f.status}</td>
                    <td>
                      {f.status !== "resolved" && (
                        <button className="resolve-btn" onClick={() => resolveFeedback(f.id)}>
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
