import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/RecipePage.css';

const RecipePage = () => {
  const { mealName } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    setError('');
    setRecipe(null);

    const fetchMeal = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/meals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch meals');
        const meals = await res.json();
        const meal = meals.find(m => m.name.toLowerCase() === mealName.toLowerCase());

        if (!meal) {
          setError(`Recipe for "${mealName}" not found`);
        } else {
          setRecipe(meal);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mealName, token]);

  if (loading) return <p className="recipe-loading">Loading recipe...</p>;
  if (error)
    return (
      <div className="recipe-page">
        <h1 style={{ color: '#d32f2f', textAlign: 'center' }}>Recipe not found</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>{error}</p>
      </div>
    );

  return (
    <div className="recipe-page">
      <h1>{recipe.name}</h1>
      <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
      <p className="recipe-description">{recipe.description}</p>

      <h2>📝 Ingredients</h2>
      <ul className="recipe-list">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2>👨‍🍳 Steps</h2>
      {recipe.steps && recipe.steps.length > 0 ? (
        <ol className="recipe-list">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      ) : (
        <p>No steps provided for this recipe.</p>
      )}
    </div>
  );
};

export default RecipePage;
