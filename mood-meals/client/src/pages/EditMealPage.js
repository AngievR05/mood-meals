// src/pages/EditMealPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AdminPanel.css";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

const moods = ["Happy", "Sad", "Angry", "Stressed", "Bored", "Energised", "Confused", "Grateful"];

const EditMealPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

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
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch meal data
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/meals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch meal");
        const meal = await res.json();

        setFormData({
          name: meal.name,
          description: meal.description,
          ingredients: meal.ingredients.join(", "),
          mood: meal.mood,
          image_url: meal.image_url,
          steps: meal.steps || [""],
        });
        setPreview(meal.image_url);
      } catch (err) {
        toast.error(err.message);
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id, token, navigate, BACKEND_URL]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () =>
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, ""] }));

  const removeStep = (index) =>
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));

const handleImageChange = async (e) => {
  let file = e.target.files[0];
  if (file) {
    try {
      const options = { maxSizeMB: 2, maxWidthOrHeight: 1024 };
      file = await imageCompression(file, options);
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      toast.error("Image compression failed");
      console.error(err);
    }
  }
};

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url || "";

    setUploading(true);
    const data = new FormData();
    data.append("image", imageFile);

    try {
      const res = await fetch(`${BACKEND_URL}/api/meals/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Upload failed");

      const FULL_URL = `${result.url.startsWith("http") ? "" : BACKEND_URL}${result.url}`;
      setPreview(FULL_URL);
      return FULL_URL;
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
      ...formData,
      ingredients: formData.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      steps: formData.steps.map((s) => s.trim()).filter(Boolean),
      image_url: uploadedUrl,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/meals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating meal");

      toast.success("Meal updated successfully!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <p>Loading meal data...</p>;

  return (
    <div className="admin-panel">
      <h1>Edit Meal</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Meal Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={formData.ingredients}
          onChange={handleChange}
        />
        <select name="mood" value={formData.mood} onChange={handleChange}>
          {moods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="image-preview" />}

        <h3>Steps</h3>
        {formData.steps.map((step, idx) => (
          <div key={idx} className="step-input">
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(idx, e.target.value)}
              placeholder={`Step ${idx + 1}`}
            />
            <button
              type="button"
              className="delete-step-btn"
              onClick={() => removeStep(idx)}
            >
              x
            </button>
          </div>
        ))}
        <button type="button" className="add-step-btn" onClick={addStep}>
          + Add Step
        </button>

        <div className="modal-buttons">
          <button type="submit" className="primary-btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Update Meal"}
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMealPage;

