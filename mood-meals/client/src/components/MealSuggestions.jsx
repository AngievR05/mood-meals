import React from 'react';
import '../styles/MealSuggestions.css';

const mealMap = {
  Happy: ['Fruit Salad', 'Avocado Toast'],
  Sad: ['Mac & Cheese', 'Tomato Soup'],
  Angry: ['Spicy Noodles', 'Grilled Chicken'],
  Stressed: ['Chamomile Tea', 'Salmon & Rice'],
  Bored: ['Snack Platter', 'Mini Tacos'],
  Energised: ['Protein Smoothie', 'Egg Muffins'],
  Confused: ['Toast + Jam', 'Yogurt Bowl'],
  Grateful: ['Roast Veggie Wrap', 'Pasta Primavera'],
};

const MealSuggestions = ({ currentMood }) => {
  const meals = mealMap[currentMood] || [];

  return (
    <div className="meal-suggestions">
      <h2>🍽️ Meals for "{currentMood}" Mood</h2>
      {meals.length === 0 ? (
        <p>Select a mood to get meal ideas!</p>
      ) : (
        <ul>
          {meals.map((meal, idx) => (
            <li key={idx}>{meal}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealSuggestions;
