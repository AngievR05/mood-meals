import React, { useEffect, useState } from "react"; 
import "../styles/AdminPanel.css";
import { toast } from "react-toastify";

const moods = ["Happy", "Sad", "Angry", "Stressed", "Bored", "Energised", "Confused", "Grateful"];

const AdminPanel = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: "",
    mood: "Happy",
    image_url: "",
  });
  const [filterMood, setFilterMood] = useState("");
  const [feedback, setFeedback] = useState(""); // Live feedback message

  const token = localStorage.getItem("token");

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const url = filterMood 
        ? `http://localhost:5000/api/meals/mood/${filterMood}` 
        : "http://localhost:5000/api/meals";
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      toast.error("Error fetching meals");
      setFeedback("Error fetching meals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [filterMood]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddMeal = () => {
    setEditingMeal(null);
    setFormData({ name: "", description: "", ingredients: "", mood: "Happy", image_url: "" });
    setModalOpen(true);
  };

  const openEditMeal = (meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      description: meal.description,
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.join(", ") : meal.ingredients,
      mood: meal.mood,
      image_url: meal.image_url,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: formData.name,
      description: formData.description,
      ingredients: formData.ingredients.split(",").map(i => i.trim()),
      mood: formData.mood,
      image_url: formData.image_url,
    };

    try {
      let url = "http://localhost:5000/api/meals";
      let method = "POST";

      if (editingMeal) {
        url += `/${editingMeal.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving meal");

      // Live feedback
      const action = editingMeal ? "updated" : "added";
      setFeedback(`Meal "${body.name}" ${action} successfully!`);
      toast.success(`Meal ${action}!`);
      setModalOpen(false);

      if (editingMeal) {
        setMeals(prevMeals => prevMeals.map(m => m.id === editingMeal.id ? { ...m, ...body } : m));
      } else {
        setMeals(prevMeals => [...prevMeals, { ...body, id: data.id || Date.now() }]);
      }

    } catch (err) {
      toast.error(err.message);
      setFeedback(`Error: ${err.message}`);
    }
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
      setMeals(prevMeals => prevMeals.filter(m => m.id !== id));
      setFeedback("Meal deleted successfully!");

    } catch (err) {
      toast.error(err.message);
      setFeedback(`Error: ${err.message}`);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Meals</h1>

      {/* Admin Controls */}
      <div className="admin-controls">
        <button className="primary-btn" onClick={openAddMeal}>
          + Add Meal
        </button>

        <select value={filterMood} onChange={e => setFilterMood(e.target.value)}>
          <option value="">All Moods</option>
          {moods.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Live Feedback Panel */}
      {feedback && <div className="live-feedback">{feedback}</div>}

      {/* Meals Table */}
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
  {meals.map((meal) => (
    <tr key={meal.id}>
      <td>{meal.name}</td>
      <td>
        <span className={`mood-badge mood-${meal.mood}`}>
          {meal.mood}
        </span>
      </td>
      <td>{meal.description.slice(0, 50)}...</td>
      <td>
        <button
          className="edit-btn"
          onClick={() => openEditMeal(meal)}
        >
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={() => handleDelete(meal.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingMeal ? "Edit Meal" : "Add Meal"}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Meal Name" value={formData.name} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
              <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" value={formData.ingredients} onChange={handleChange} required />
              <select name="mood" value={formData.mood} onChange={handleChange}>
                {moods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input type="text" name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} />

              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="image-preview" />
              )}

              <div className="modal-buttons">
                <button type="submit" className="primary-btn">{editingMeal ? "Update Meal" : "Add Meal"}</button>
                <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
