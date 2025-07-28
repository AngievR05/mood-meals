import React from 'react';
import Slider from 'react-slick';
import '../styles/MealSuggestions.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const mealMap = {
  Happy: [
    { name: 'Fruit Salad', image: '/images/meals/fruit-salad.jpg' },
    { name: 'Avocado Toast', image: '/images/meals/avocado-toast.jpg' },
    { name: 'Berry Smoothie', image: '/images/meals/berry-smoothie.jpg' },
    { name: 'Grilled Cheese', image: '/images/meals/grilled-cheese.jpg' },
    { name: 'Caprese Salad', image: '/images/meals/caprese-salad.jpg' },
    { name: 'Banana Pancakes', image: '/images/meals/banana-pancakes.jpg' },
    { name: 'Mango Salsa', image: '/images/meals/mango-salsa.jpg' },
    { name: 'Yogurt Parfait', image: '/images/meals/yogurt-parfait.jpg' },
    { name: 'Cucumber Sandwiches', image: '/images/meals/cucumber-sandwiches.jpg' },
    { name: 'Lemonade', image: '/images/meals/lemonade.jpg' },
  ],
  Sad: [
    { name: 'Mac & Cheese', image: '/images/meals/mac-cheese.jpg' },
    { name: 'Tomato Soup', image: '/images/meals/tomato-soup.jpg' },
    { name: 'Mashed Potatoes', image: '/images/meals/mashed-potatoes.jpg' },
    { name: 'Chicken Noodle Soup', image: '/images/meals/chicken-noodle-soup.jpg' },
    { name: 'Rice Pudding', image: '/images/meals/rice-pudding.jpg' },
    { name: 'Hot Chocolate', image: '/images/meals/hot-chocolate.jpg' },
    { name: 'Grilled Cheese Sandwich', image: '/images/meals/grilled-cheese-sandwich.jpg' },
    { name: 'Oatmeal', image: '/images/meals/oatmeal.jpg' },
    { name: 'Banana Bread', image: '/images/meals/banana-bread.jpg' },
    { name: 'Apple Crumble', image: '/images/meals/apple-crumble.jpg' },
  ],
  Angry: [
    { name: 'Spicy Noodles', image: '/images/meals/spicy-noodles.jpg' },
    { name: 'Grilled Chicken', image: '/images/meals/grilled-chicken.jpg' },
    { name: 'Buffalo Wings', image: '/images/meals/buffalo-wings.jpg' },
    { name: 'Chili Con Carne', image: '/images/meals/chili-con-carne.jpg' },
    { name: 'Sriracha Tacos', image: '/images/meals/sriracha-tacos.jpg' },
    { name: 'Jalapeño Poppers', image: '/images/meals/jalapeno-poppers.jpg' },
    { name: 'Spicy Curry', image: '/images/meals/spicy-curry.jpg' },
    { name: 'Kimchi Fried Rice', image: '/images/meals/kimchi-fried-rice.jpg' },
    { name: 'Pepper Steak', image: '/images/meals/pepper-steak.jpg' },
    { name: 'Hot Salsa & Chips', image: '/images/meals/hot-salsa-chips.jpg' },
  ],
  Stressed: [
    { name: 'Chamomile Tea', image: '/images/meals/chamomile-tea.jpg' },
    { name: 'Salmon & Rice', image: '/images/meals/salmon-rice.jpg' },
    { name: 'Quinoa Salad', image: '/images/meals/quinoa-salad.jpg' },
    { name: 'Steamed Veggies', image: '/images/meals/steamed-veggies.jpg' },
    { name: 'Avocado Smoothie', image: '/images/meals/avocado-smoothie.jpg' },
    { name: 'Grilled Fish', image: '/images/meals/grilled-fish.jpg' },
    { name: 'Sweet Potato Mash', image: '/images/meals/sweet-potato-mash.jpg' },
    { name: 'Herbal Tea', image: '/images/meals/herbal-tea.jpg' },
    { name: 'Greek Yogurt', image: '/images/meals/greek-yogurt.jpg' },
    { name: 'Berry Salad', image: '/images/meals/berry-salad.jpg' },
  ],
  Bored: [
    { name: 'Snack Platter', image: '/images/meals/snack-platter.jpg' },
    { name: 'Mini Tacos', image: '/images/meals/mini-tacos.jpg' },
    { name: 'Popcorn', image: '/images/meals/popcorn.jpg' },
    { name: 'Veggie Sticks', image: '/images/meals/veggie-sticks.jpg' },
    { name: 'Cheese Cubes', image: '/images/meals/cheese-cubes.jpg' },
    { name: 'Hummus & Pita', image: '/images/meals/hummus-pita.jpg' },
    { name: 'Fruit Skewers', image: '/images/meals/fruit-skewers.jpg' },
    { name: 'Pretzels', image: '/images/meals/pretzels.jpg' },
    { name: 'Trail Mix', image: '/images/meals/trail-mix.jpg' },
    { name: 'Rice Cakes', image: '/images/meals/rice-cakes.jpg' },
  ],
  Energised: [
    { name: 'Protein Smoothie', image: '/images/meals/protein-smoothie.jpg' },
    { name: 'Egg Muffins', image: '/images/meals/egg-muffins.jpg' },
    { name: 'Granola Bars', image: '/images/meals/granola-bars.jpg' },
    { name: 'Chicken Wrap', image: '/images/meals/chicken-wrap.jpg' },
    { name: 'Kale Salad', image: '/images/meals/kale-salad.jpg' },
    { name: 'Peanut Butter Toast', image: '/images/meals/peanut-butter-toast.jpg' },
    { name: 'Boiled Eggs', image: '/images/meals/boiled-eggs.jpg' },
    { name: 'Smoothie Bowl', image: '/images/meals/smoothie-bowl.jpg' },
    { name: 'Quinoa Bowl', image: '/images/meals/quinoa-bowl.jpg' },
    { name: 'Almonds', image: '/images/meals/almonds.jpg' },
  ],
  Confused: [
    { name: 'Toast + Jam', image: '/images/meals/toast-jam.jpg' },
    { name: 'Yogurt Bowl', image: '/images/meals/yogurt-bowl.jpg' },
    { name: 'Cereal', image: '/images/meals/cereal.jpg' },
    { name: 'Bagel & Cream Cheese', image: '/images/meals/bagel-cream-cheese.jpg' },
    { name: 'Fruit Cup', image: '/images/meals/fruit-cup.jpg' },
    { name: 'Muffin', image: '/images/meals/muffin.jpg' },
    { name: 'Porridge', image: '/images/meals/porridge.jpg' },
    { name: 'Cheese Toastie', image: '/images/meals/cheese-toastie.jpg' },
    { name: 'Rice Cakes', image: '/images/meals/rice-cakes.jpg' },
    { name: 'Peach Slices', image: '/images/meals/peach-slices.jpg' },
  ],
  Grateful: [
    { name: 'Roast Veggie Wrap', image: '/images/meals/roast-veggie-wrap.jpg' },
    { name: 'Pasta Primavera', image: '/images/meals/pasta-primavera.jpg' },
    { name: 'Stuffed Peppers', image: '/images/meals/stuffed-peppers.jpg' },
    { name: 'Caesar Salad', image: '/images/meals/caesar-salad.jpg' },
    { name: 'Grilled Salmon', image: '/images/meals/grilled-salmon.jpg' },
    { name: 'Bruschetta', image: '/images/meals/bruschetta.jpg' },
    { name: 'Fruit Tart', image: '/images/meals/fruit-tart.jpg' },
    { name: 'Lentil Soup', image: '/images/meals/lentil-soup.jpg' },
    { name: 'Caprese Skewers', image: '/images/meals/caprese-skewers.jpg' },
    { name: 'Chocolate Mousse', image: '/images/meals/chocolate-mousse.jpg' },
  ],
};

const MealSuggestions = ({ currentMood }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();
  const meals = mealMap[currentMood] || [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const openRecipe = (meal) => {
    setSelectedMeal(meal); // Set modal if you need it
    navigate(`/recipes/${encodeURIComponent(meal.name)}`);
  };

  if (!currentMood) {
    return (
      <div className="meal-suggestions">
        <h2>🍽️ Meals for Mood</h2>
        <p>Select a mood to get meal ideas!</p>
      </div>
    );
  }

  return (
    <div className="meal-suggestions">
      <h2>🍽️ Meals for "{currentMood}" Mood</h2>
      <Slider {...settings}>
        {meals.map(({ name, image }, idx) => (
          <div key={idx} className="meal-card">
            <img
              src={image}
              alt={name}
              className="meal-image"
              loading="lazy"
            />
            <p className="meal-name">{name}</p>
            <button
              className="view-recipe-btn"
              onClick={() => openRecipe({ name, image })}
            >
              View Recipe
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MealSuggestions;