import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/RecipePage.css';

const recipeMap = {
  // Happy
  "Fruit Salad": {
    description: "A fresh and colorful mix of seasonal fruits.",
    ingredients: ["Strawberries", "Blueberries", "Banana", "Kiwi", "Mint"],
    steps: [
      "Chop all fruits into bite-sized pieces.",
      "Mix gently in a bowl.",
      "Chill before serving."
    ],
  },
  "Avocado Toast": {
    description: "Creamy avocado spread on crispy toast.",
    ingredients: ["2 slices sourdough bread", "1 ripe avocado", "Salt", "Chili flakes"],
    steps: [
      "Toast bread until golden.",
      "Mash avocado and season with salt.",
      "Spread on toast and sprinkle chili flakes."
    ],
  },
  "Berry Smoothie": {
    description: "A nutrient-packed berry blend.",
    ingredients: ["Mixed berries", "Greek yogurt", "Honey", "Ice cubes"],
    steps: [
      "Add all ingredients to a blender.",
      "Blend until smooth.",
      "Serve chilled."
    ],
  },
  "Grilled Cheese": {
    description: "Golden grilled cheese sandwich.",
    ingredients: ["Bread slices", "Cheddar cheese", "Butter"],
    steps: [
      "Butter the bread slices.",
      "Place cheese between bread.",
      "Grill until golden brown."
    ],
  },
  "Caprese Salad": {
    description: "Fresh mozzarella, tomatoes, and basil.",
    ingredients: ["Tomatoes", "Mozzarella", "Basil leaves", "Olive oil", "Salt"],
    steps: [
      "Slice tomatoes and mozzarella.",
      "Layer them on a plate with basil.",
      "Drizzle olive oil and sprinkle salt."
    ],
  },
  "Banana Pancakes": {
    description: "Fluffy pancakes with banana flavor.",
    ingredients: ["Flour", "Banana", "Eggs", "Milk", "Baking powder"],
    steps: [
      "Mash banana and mix with other ingredients.",
      "Pour batter on a hot griddle.",
      "Cook until bubbles form, flip, cook until done."
    ],
  },
  "Mango Salsa": {
    description: "Sweet and spicy mango salsa.",
    ingredients: ["Diced mango", "Red onion", "Jalapeño", "Lime juice", "Cilantro"],
    steps: [
      "Mix all ingredients in a bowl.",
      "Let chill for 30 minutes.",
      "Serve with chips or grilled meat."
    ],
  },
  "Yogurt Parfait": {
    description: "Layers of yogurt, granola, and fruits.",
    ingredients: ["Greek yogurt", "Granola", "Mixed berries", "Honey"],
    steps: [
      "Layer yogurt, granola, and berries in a glass.",
      "Drizzle honey on top.",
      "Serve immediately."
    ],
  },
  "Cucumber Sandwiches": {
    description: "Light and fresh cucumber tea sandwiches.",
    ingredients: ["White bread", "Cream cheese", "Cucumber slices", "Dill"],
    steps: [
      "Spread cream cheese on bread slices.",
      "Add cucumber slices and sprinkle dill.",
      "Cut into small squares and serve."
    ],
  },
  "Lemonade": {
    description: "Refreshing homemade lemonade.",
    ingredients: ["Lemon juice", "Sugar", "Water", "Ice cubes"],
    steps: [
      "Mix lemon juice and sugar until dissolved.",
      "Add water and stir.",
      "Serve over ice."
    ],
  },

  // Sad
  "Mac & Cheese": {
    description: "Classic creamy macaroni and cheese.",
    ingredients: ["Macaroni", "Cheddar cheese", "Butter", "Milk", "Flour"],
    steps: [
      "Cook macaroni and drain.",
      "Make cheese sauce with butter, flour, milk, and cheese.",
      "Combine macaroni with sauce and bake."
    ],
  },
  "Tomato Soup": {
    description: "Warm and comforting tomato soup.",
    ingredients: ["Tomatoes", "Onion", "Garlic", "Vegetable broth", "Cream"],
    steps: [
      "Sauté onion and garlic.",
      "Add tomatoes and broth, simmer.",
      "Blend until smooth and add cream."
    ],
  },
  "Mashed Potatoes": {
    description: "Smooth and buttery mashed potatoes.",
    ingredients: ["Potatoes", "Butter", "Milk", "Salt", "Pepper"],
    steps: [
      "Boil potatoes until tender.",
      "Mash with butter and milk.",
      "Season with salt and pepper."
    ],
  },
  "Chicken Noodle Soup": {
    description: "Classic comforting chicken noodle soup.",
    ingredients: ["Chicken", "Noodles", "Carrots", "Celery", "Broth"],
    steps: [
      "Cook chicken and shred.",
      "Boil vegetables in broth.",
      "Add noodles and chicken; simmer."
    ],
  },
  "Rice Pudding": {
    description: "Creamy sweet rice pudding dessert.",
    ingredients: ["Rice", "Milk", "Sugar", "Vanilla", "Cinnamon"],
    steps: [
      "Cook rice in milk and sugar.",
      "Stir frequently until thick.",
      "Add vanilla and cinnamon before serving."
    ],
  },
  "Hot Chocolate": {
    description: "Rich and creamy hot chocolate.",
    ingredients: ["Cocoa powder", "Milk", "Sugar", "Whipped cream"],
    steps: [
      "Heat milk and whisk in cocoa and sugar.",
      "Top with whipped cream.",
      "Serve hot."
    ],
  },
  "Grilled Cheese Sandwich": {
    description: "Melty grilled cheese sandwich.",
    ingredients: ["Bread", "Cheddar cheese", "Butter"],
    steps: [
      "Butter bread slices.",
      "Add cheese and grill until golden.",
      "Serve warm."
    ],
  },
  "Oatmeal": {
    description: "Warm and hearty oatmeal bowl.",
    ingredients: ["Oats", "Milk", "Honey", "Banana slices", "Cinnamon"],
    steps: [
      "Cook oats with milk.",
      "Top with banana, honey, and cinnamon.",
      "Serve warm."
    ],
  },
  "Banana Bread": {
    description: "Moist and sweet banana bread.",
    ingredients: ["Bananas", "Flour", "Sugar", "Eggs", "Butter"],
    steps: [
      "Mix mashed bananas with other ingredients.",
      "Bake in a loaf pan at 175°C for 60 mins.",
      "Cool and slice."
    ],
  },
  "Apple Crumble": {
    description: "Warm baked apple dessert with crumb topping.",
    ingredients: ["Apples", "Flour", "Sugar", "Butter", "Cinnamon"],
    steps: [
      "Slice apples and place in baking dish.",
      "Mix flour, sugar, butter for topping.",
      "Sprinkle over apples and bake."
    ],
  },

  // Angry
  "Spicy Noodles": {
    description: "Fiery noodles packed with spice.",
    ingredients: ["Noodles", "Chili sauce", "Garlic", "Soy sauce", "Scallions"],
    steps: [
      "Boil noodles and drain.",
      "Stir-fry garlic and chili sauce.",
      "Add noodles and soy sauce, toss well."
    ],
  },
  "Grilled Chicken": {
    description: "Juicy grilled chicken breasts.",
    ingredients: ["Chicken breasts", "Olive oil", "Salt", "Pepper", "Paprika"],
    steps: [
      "Marinate chicken with spices.",
      "Grill until cooked through.",
      "Rest and serve."
    ],
  },
  "Buffalo Wings": {
    description: "Spicy buffalo chicken wings.",
    ingredients: ["Chicken wings", "Hot sauce", "Butter", "Garlic powder"],
    steps: [
      "Bake or fry wings until crispy.",
      "Toss with melted butter and hot sauce.",
      "Serve with celery sticks."
    ],
  },
  "Chili Con Carne": {
    description: "Spicy beef chili with beans.",
    ingredients: ["Ground beef", "Kidney beans", "Tomato sauce", "Chili powder", "Onion"],
    steps: [
      "Brown beef with onions.",
      "Add beans, tomato sauce, and spices.",
      "Simmer until thick."
    ],
  },
  "Sriracha Tacos": {
    description: "Tacos with a spicy Sriracha kick.",
    ingredients: ["Taco shells", "Ground meat", "Sriracha sauce", "Lettuce", "Cheese"],
    steps: [
      "Cook meat with spices.",
      "Fill taco shells with meat, lettuce, cheese.",
      "Drizzle with Sriracha."
    ],
  },
  "Jalapeño Poppers": {
    description: "Spicy stuffed jalapeño bites.",
    ingredients: ["Jalapeños", "Cream cheese", "Bacon", "Breadcrumbs"],
    steps: [
      "Stuff jalapeños with cream cheese.",
      "Wrap with bacon and bake.",
      "Sprinkle breadcrumbs and bake until crisp."
    ],
  },
  "Spicy Curry": {
    description: "Bold and spicy curry dish.",
    ingredients: ["Chicken or veggies", "Curry paste", "Coconut milk", "Garlic", "Ginger"],
    steps: [
      "Sauté garlic and ginger.",
      "Add curry paste and coconut milk.",
      "Add protein and simmer until cooked."
    ],
  },
  "Kimchi Fried Rice": {
    description: "Savory fried rice with kimchi.",
    ingredients: ["Cooked rice", "Kimchi", "Eggs", "Soy sauce", "Green onions"],
    steps: [
      "Scramble eggs and set aside.",
      "Stir-fry kimchi and rice.",
      "Add eggs back, season with soy sauce."
    ],
  },
  "Pepper Steak": {
    description: "Tender steak with peppers.",
    ingredients: ["Steak strips", "Bell peppers", "Soy sauce", "Garlic", "Black pepper"],
    steps: [
      "Sauté garlic and peppers.",
      "Add steak strips and cook till done.",
      "Season with soy and black pepper."
    ],
  },
  "Hot Salsa & Chips": {
    description: "Fiery salsa served with crunchy chips.",
    ingredients: ["Tomatoes", "Onion", "Jalapeño", "Cilantro", "Tortilla chips"],
    steps: [
      "Chop veggies and mix.",
      "Add salt and lime juice.",
      "Serve with chips."
    ],
  },

  // Stressed
  "Chamomile Tea": {
    description: "Calming chamomile herbal tea.",
    ingredients: ["Chamomile flowers", "Hot water", "Honey (optional)"],
    steps: [
      "Steep chamomile flowers in hot water for 5 minutes.",
      "Strain and sweeten with honey if desired.",
      "Serve warm."
    ],
  },
  "Salmon & Rice": {
    description: "Light grilled salmon with rice.",
    ingredients: ["Salmon fillet", "Rice", "Lemon", "Salt", "Pepper"],
    steps: [
      "Cook rice according to package instructions.",
      "Season salmon and grill until flaky.",
      "Serve salmon over rice with lemon."
    ],
  },
  "Quinoa Salad": {
    description: "Healthy quinoa mixed with fresh veggies.",
    ingredients: ["Cooked quinoa", "Cucumber", "Tomato", "Olive oil", "Lemon juice"],
    steps: [
      "Chop vegetables.",
      "Mix with quinoa, olive oil, and lemon juice.",
      "Serve chilled."
    ],
  },
  "Steamed Veggies": {
    description: "Simple steamed seasonal vegetables.",
    ingredients: ["Broccoli", "Carrots", "Cauliflower", "Salt", "Butter"],
    steps: [
      "Steam veggies until tender.",
      "Season with salt and butter.",
      "Serve warm."
    ],
  },
  "Avocado Smoothie": {
    description: "Creamy and nutritious avocado smoothie.",
    ingredients: ["Avocado", "Milk", "Honey", "Ice cubes"],
    steps: [
      "Blend all ingredients until smooth.",
      "Serve chilled."
    ],
  },
  "Grilled Fish": {
    description: "Lightly seasoned grilled fish fillet.",
    ingredients: ["White fish fillet", "Lemon", "Garlic", "Salt", "Pepper"],
    steps: [
      "Marinate fish with lemon, garlic, salt, and pepper.",
      "Grill until cooked through.",
      "Serve hot."
    ],
  },
  "Sweet Potato Mash": {
    description: "Creamy mashed sweet potatoes.",
    ingredients: ["Sweet potatoes", "Butter", "Salt", "Pepper", "Cream"],
    steps: [
      "Boil sweet potatoes until soft.",
      "Mash with butter and cream.",
      "Season and serve."
    ],
  },
  "Herbal Tea": {
    description: "Relaxing blend of herbal teas.",
    ingredients: ["Assorted herbs (mint, chamomile)", "Hot water", "Honey"],
    steps: [
      "Steep herbs in hot water for 5 minutes.",
      "Sweeten with honey if desired.",
      "Enjoy warm."
    ],
  },
  "Greek Yogurt": {
    description: "Thick and creamy Greek yogurt.",
    ingredients: ["Greek yogurt", "Honey", "Nuts (optional)"],
    steps: [
      "Spoon yogurt into a bowl.",
      "Top with honey and nuts.",
      "Serve chilled."
    ],
  },
  "Berry Salad": {
    description: "Fresh mixed berries with a hint of mint.",
    ingredients: ["Strawberries", "Blueberries", "Raspberries", "Mint", "Lemon juice"],
    steps: [
      "Mix berries and mint leaves.",
      "Drizzle with lemon juice.",
      "Serve chilled."
    ],
  },

  // Bored
  "Snack Platter": {
    description: "Assorted snacks for any occasion.",
    ingredients: ["Cheese cubes", "Crackers", "Olives", "Nuts", "Fruit slices"],
    steps: [
      "Arrange snacks on a platter.",
      "Serve with dips if desired.",
      "Enjoy."
    ],
  },
  "Mini Tacos": {
    description: "Bite-sized tacos with fresh fillings.",
    ingredients: ["Mini taco shells", "Ground beef", "Lettuce", "Cheese", "Salsa"],
    steps: [
      "Cook beef with seasoning.",
      "Fill taco shells with beef and toppings.",
      "Serve immediately."
    ],
  },
  "Popcorn": {
    description: "Lightly salted popcorn.",
    ingredients: ["Popcorn kernels", "Butter", "Salt"],
    steps: [
      "Pop kernels in a pot or machine.",
      "Melt butter and drizzle over popcorn.",
      "Season with salt."
    ],
  },
  "Veggie Sticks": {
    description: "Fresh crunchy vegetable sticks.",
    ingredients: ["Carrots", "Celery", "Cucumber", "Ranch dip"],
    steps: [
      "Cut vegetables into sticks.",
      "Serve with ranch dip.",
      "Enjoy fresh."
    ],
  },
  "Cheese Cubes": {
    description: "Variety of cheese cubes.",
    ingredients: ["Cheddar", "Swiss", "Gouda", "Crackers"],
    steps: [
      "Cut cheeses into cubes.",
      "Arrange on plate with crackers.",
      "Serve."
    ],
  },
  "Hummus & Pita": {
    description: "Creamy hummus with warm pita bread.",
    ingredients: ["Hummus", "Pita bread", "Olive oil", "Paprika"],
    steps: [
      "Warm pita bread.",
      "Serve with hummus drizzled with olive oil and paprika.",
      "Enjoy."
    ],
  },
  "Fruit Skewers": {
    description: "Fresh fruit pieces on skewers.",
    ingredients: ["Pineapple", "Strawberries", "Grapes", "Melon"],
    steps: [
      "Cut fruit into bite-sized pieces.",
      "Thread onto skewers.",
      "Serve chilled."
    ],
  },
  "Pretzels": {
    description: "Soft salted pretzels.",
    ingredients: ["Flour", "Yeast", "Salt", "Water", "Baking soda"],
    steps: [
      "Make dough and let rise.",
      "Shape pretzels and boil in baking soda water.",
      "Bake until golden."
    ],
  },
  "Trail Mix": {
    description: "Mixed nuts, seeds, and dried fruits.",
    ingredients: ["Almonds", "Cashews", "Raisins", "Pumpkin seeds", "Chocolate chips"],
    steps: [
      "Mix all ingredients in a bowl.",
      "Store in airtight container.",
      "Enjoy as a snack."
    ],
  },
  "Rice Cakes": {
    description: "Light and crunchy rice cakes.",
    ingredients: ["Rice cakes", "Peanut butter", "Banana slices"],
    steps: [
      "Spread peanut butter on rice cakes.",
      "Top with banana slices.",
      "Serve immediately."
    ],
  },

  // Energised
  "Protein Smoothie": {
    description: "Boost your energy with this protein smoothie.",
    ingredients: ["Protein powder", "Banana", "Almond milk", "Peanut butter"],
    steps: [
      "Add all ingredients to blender.",
      "Blend until smooth.",
      "Serve chilled."
    ],
  },
  "Egg Muffins": {
    description: "Mini baked egg muffins packed with veggies.",
    ingredients: ["Eggs", "Spinach", "Bell peppers", "Cheese", "Salt"],
    steps: [
      "Whisk eggs and mix veggies and cheese.",
      "Pour into muffin tin and bake at 180°C for 15 minutes.",
      "Cool and serve."
    ],
  },
  "Granola Bars": {
    description: "Homemade crunchy granola bars.",
    ingredients: ["Oats", "Honey", "Nuts", "Dried fruit", "Peanut butter"],
    steps: [
      "Mix all ingredients.",
      "Press into a baking tray.",
      "Bake at 175°C for 20 minutes."
    ],
  },
  "Chicken Wrap": {
    description: "Healthy grilled chicken wrap.",
    ingredients: ["Grilled chicken", "Tortilla wrap", "Lettuce", "Tomato", "Hummus"],
    steps: [
      "Spread hummus on wrap.",
      "Add chicken and veggies.",
      "Roll and serve."
    ],
  },
  "Kale Salad": {
    description: "Fresh kale salad with lemon dressing.",
    ingredients: ["Kale", "Lemon juice", "Olive oil", "Parmesan", "Croutons"],
    steps: [
      "Massage kale with lemon and olive oil.",
      "Add parmesan and croutons.",
      "Toss and serve."
    ],
  },
  "Peanut Butter Toast": {
    description: "Crunchy toast with peanut butter.",
    ingredients: ["Whole grain bread", "Peanut butter", "Banana slices"],
    steps: [
      "Toast bread.",
      "Spread peanut butter and top with banana.",
      "Serve immediately."
    ],
  },
  "Boiled Eggs": {
    description: "Simple boiled eggs.",
    ingredients: ["Eggs", "Salt", "Pepper"],
    steps: [
      "Boil eggs to desired doneness.",
      "Peel and season.",
      "Serve."
    ],
  },
  "Smoothie Bowl": {
    description: "Thick smoothie served with toppings.",
    ingredients: ["Frozen berries", "Banana", "Yogurt", "Granola", "Seeds"],
    steps: [
      "Blend berries, banana, and yogurt until thick.",
      "Pour into a bowl.",
      "Top with granola and seeds."
    ],
  },
  "Quinoa Bowl": {
    description: "Protein-packed quinoa bowl with veggies.",
    ingredients: ["Cooked quinoa", "Roasted veggies", "Avocado", "Lemon dressing"],
    steps: [
      "Combine quinoa and veggies.",
      "Top with avocado and drizzle dressing.",
      "Serve fresh."
    ],
  },
  "Almonds": {
    description: "Roasted almonds for a quick snack.",
    ingredients: ["Raw almonds", "Salt", "Olive oil"],
    steps: [
      "Toss almonds with oil and salt.",
      "Roast at 180°C for 15 minutes.",
      "Cool and serve."
    ],
  },

  // Confused
  "Toast + Jam": {
    description: "Simple toast with your favorite jam.",
    ingredients: ["Bread", "Butter", "Jam"],
    steps: [
      "Toast the bread.",
      "Spread butter and jam.",
      "Serve immediately."
    ],
  },
  "Yogurt Bowl": {
    description: "Healthy yogurt with toppings.",
    ingredients: ["Greek yogurt", "Honey", "Granola", "Fresh fruit"],
    steps: [
      "Spoon yogurt into a bowl.",
      "Add toppings.",
      "Serve chilled."
    ],
  },
  "Cereal": {
    description: "Classic breakfast cereal with milk.",
    ingredients: ["Cereal", "Milk", "Fruit (optional)"],
    steps: [
      "Pour cereal into a bowl.",
      "Add milk.",
      "Add fruit if desired."
    ],
  },
  "Bagel & Cream Cheese": {
    description: "Toasted bagel with cream cheese.",
    ingredients: ["Bagel", "Cream cheese"],
    steps: [
      "Toast bagel halves.",
      "Spread cream cheese.",
      "Serve."
    ],
  },
  "Fruit Cup": {
    description: "Mixed fresh fruit cup.",
    ingredients: ["Assorted fresh fruits"],
    steps: [
      "Chop fruits.",
      "Mix in a bowl.",
      "Serve chilled."
    ],
  },
  "Muffin": {
    description: "Moist and sweet muffin.",
    ingredients: ["Flour", "Sugar", "Eggs", "Butter", "Milk"],
    steps: [
      "Mix ingredients.",
      "Bake at 180°C for 20 minutes.",
      "Cool before serving."
    ],
  },
  "Porridge": {
    description: "Warm oatmeal porridge.",
    ingredients: ["Oats", "Milk", "Honey", "Cinnamon"],
    steps: [
      "Cook oats in milk.",
      "Sweeten with honey.",
      "Sprinkle cinnamon and serve."
    ],
  },
  "Cheese Toastie": {
    description: "Melted cheese sandwich.",
    ingredients: ["Bread", "Cheese", "Butter"],
    steps: [
      "Butter bread.",
      "Add cheese.",
      "Grill until golden."
    ],
  },
  "Rice Cakes": {
    description: "Light crunchy rice cakes.",
    ingredients: ["Rice cakes", "Toppings (peanut butter, jam, etc.)"],
    steps: [
      "Add toppings to rice cakes.",
      "Serve immediately."
    ],
  },
  "Peach Slices": {
    description: "Fresh peach slices.",
    ingredients: ["Peaches"],
    steps: [
      "Slice peaches.",
      "Serve chilled."
    ],
  },

  // Grateful
  "Roast Veggie Wrap": {
    description: "Wrap filled with roasted veggies.",
    ingredients: ["Tortilla wrap", "Roasted vegetables", "Hummus", "Lettuce"],
    steps: [
      "Spread hummus on wrap.",
      "Add roasted veggies and lettuce.",
      "Roll up and serve."
    ],
  },
  "Pasta Primavera": {
    description: "Pasta with fresh vegetables.",
    ingredients: ["Pasta", "Zucchini", "Cherry tomatoes", "Garlic", "Parmesan"],
    steps: [
      "Cook pasta.",
      "Sauté veggies and garlic.",
      "Mix pasta with veggies and top with parmesan."
    ],
  },
  "Stuffed Peppers": {
    description: "Bell peppers stuffed with rice and veggies.",
    ingredients: ["Bell peppers", "Rice", "Tomato sauce", "Onion", "Cheese"],
    steps: [
      "Cook rice with tomato sauce and onion.",
      "Stuff mixture into peppers.",
      "Bake and top with cheese."
    ],
  },
  "Caesar Salad": {
    description: "Classic Caesar salad.",
    ingredients: ["Romaine lettuce", "Croutons", "Parmesan", "Caesar dressing"],
    steps: [
      "Toss lettuce with dressing.",
      "Add croutons and parmesan.",
      "Serve chilled."
    ],
  },
  "Grilled Salmon": {
    description: "Simple grilled salmon fillet.",
    ingredients: ["Salmon fillet", "Lemon", "Salt", "Pepper", "Olive oil"],
    steps: [
      "Season salmon.",
      "Grill until cooked.",
      "Serve with lemon."
    ],
  },
  "Bruschetta": {
    description: "Toasted bread topped with tomato and basil.",
    ingredients: ["Baguette", "Tomatoes", "Basil", "Garlic", "Olive oil"],
    steps: [
      "Toast baguette slices.",
      "Mix tomatoes, basil, and garlic.",
      "Top bread and drizzle olive oil."
    ],
  },
  "Fruit Tart": {
    description: "Sweet tart topped with fresh fruits.",
    ingredients: ["Tart shell", "Custard", "Fresh fruits", "Glaze"],
    steps: [
      "Fill tart shell with custard.",
      "Arrange fruits on top.",
      "Brush with glaze."
    ],
  },
  "Lentil Soup": {
    description: "Hearty lentil soup.",
    ingredients: ["Lentils", "Carrots", "Celery", "Onion", "Spices"],
    steps: [
      "Sauté veggies.",
      "Add lentils and broth.",
      "Simmer until lentils are soft."
    ],
  },
  "Caprese Skewers": {
    description: "Mini skewers with mozzarella, tomato, and basil.",
    ingredients: ["Cherry tomatoes", "Mozzarella balls", "Basil", "Balsamic glaze"],
    steps: [
      "Thread tomato, mozzarella, and basil onto skewers.",
      "Drizzle with balsamic glaze.",
      "Serve."
    ],
  },
  "Chocolate Mousse": {
    description: "Light and fluffy chocolate mousse.",
    ingredients: ["Dark chocolate", "Eggs", "Sugar", "Cream"],
    steps: [
      "Melt chocolate.",
      "Whip egg whites and cream.",
      "Fold together and chill."
    ],
  },
};


const RecipePage = () => {
  const { mealName } = useParams();
  const recipe = recipeMap[mealName];

  if (!recipe) {
    return (
      <div className="recipe-page">
        <h1>Recipe not found</h1>
        <p>Oops, we couldn’t find a recipe for "{mealName}"</p>
      </div>
    );
  }

  return (
    <div className="recipe-page">
      <h1>{mealName}</h1>
      <p className="recipe-description">{recipe.description}</p>

      <h2>📝 Ingredients</h2>
      <ul className="recipe-list">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2>👨‍🍳 Steps</h2>
      <ol className="recipe-list">
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipePage;
