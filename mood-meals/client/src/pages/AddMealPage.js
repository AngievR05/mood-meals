// src/pages/AddMealPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";
import { toast } from "react-toastify";

const moods = ["Happy", "Sad", "Angry", "Stressed", "Bored", "Energised", "Confused", "Grateful"];

const AddMealPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "/api";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: "",
    mood: "Happy",
    image_url: "",
    steps: [""],
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };
  const addStep = () => setFormData(prev => ({ ...prev, steps: [...prev.steps, ""] }));
  const removeStep = (index) => setFormData(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url || "";
    setUploading(true);

    const data = new FormData();
    data.append("image", imageFile);

    try {
      const res = await fetch(`${BACKEND_URL}/meals/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Upload failed");
      setPreview(result.url);
      return result.url;
    } catch (err) {
      toast.error(err.message);
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedUrl = await uploadImage();

    const body = {
      name: formData.name,
      description: formData.description,
      ingredients: formData.ingredients.split(",").map(i => i.trim()),
      mood: formData.mood,
      image_url: uploadedUrl || formData.image_url,
      steps: formData.steps.map(s => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving meal");

      toast.success("Meal added successfully!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Add New Meal</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Meal Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" value={formData.ingredients} onChange={handleChange} required />
        <select name="mood" value={formData.mood} onChange={handleChange}>
          {moods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="image-preview" />}

        <h3>Steps</h3>
        {formData.steps.map((step, idx) => (
          <div key={idx} className="step-input">
            <input type="text" value={step} onChange={e => handleStepChange(idx, e.target.value)} placeholder={`Step ${idx + 1}`} required />
            <button type="button" className="delete-step-btn" onClick={() => removeStep(idx)}>x</button>
          </div>
        ))}
        <button type="button" className="add-step-btn" onClick={addStep}>+ Add Step</button>

        <div className="modal-buttons">
          <button type="submit" className="primary-btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Meal"}
          </button>
          <button type="button" className="secondary-btn" onClick={() => navigate("/admin")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddMealPage;
