import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/RecipePage.css';

const recipeMap = {
  // Happy
  "Fruit Salad": {
    description: "A vibrant, refreshing bowl of seasonal fruits that burst with natural sweetness and color — perfect for a sunny, feel-good day.",
ingredients: [
  "1 cup strawberries, hulled and sliced",
  "1/2 cup blueberries",
  "1 banana, sliced",
  "1 kiwi, peeled and chopped",
  "Fresh mint leaves, chopped",
  "1 tsp lime juice (optional)",
  "1 tsp honey (optional)"
],
steps: [
  "Wash all fruits thoroughly.",
  "Slice strawberries, banana, and kiwi into bite-sized pieces.",
  "Gently mix all fruits together in a large bowl.",
  "Add chopped mint for freshness.",
  "Optional: Drizzle with lime juice and honey for extra zing.",
  "Chill in the fridge for 10–15 minutes before serving."
],

  },
  "Avocado Toast": {
    description: "A creamy, crunchy, and savory toast that’s Instagram-worthy and loaded with healthy fats — a millennial classic with endless joy.",
ingredients: [
  "2 slices sourdough bread",
  "1 ripe avocado",
  "Salt to taste",
  "Chili flakes for heat",
  "Lemon juice (a squeeze)",
  "Olive oil (drizzle)",
  "Optional toppings: cherry tomatoes, feta, poached egg"
],
steps: [
  "Toast the bread slices until golden and crispy.",
  "Halve the avocado, remove the seed, and scoop into a bowl.",
  "Mash with a fork, adding salt, lemon juice, and olive oil.",
  "Spread evenly on the toast.",
  "Sprinkle chili flakes and any optional toppings.",
  "Serve warm with a smile. 😄"
],

  },
  "Berry Smoothie": {
    description: "A creamy, tangy, and naturally sweet smoothie packed with antioxidants — ideal for kickstarting your happy vibes.",
ingredients: [
  "1 cup frozen mixed berries",
  "1/2 cup Greek yogurt",
  "1 tbsp honey or maple syrup",
  "1/2 cup almond milk (or regular milk)",
  "1/2 banana (optional)",
  "Handful of ice cubes"
],
steps: [
  "Add berries, yogurt, honey, and milk into a blender.",
  "Optional: Add banana for extra creaminess.",
  "Toss in a few ice cubes.",
  "Blend until smooth and thick.",
  "Pour into a glass and top with a few whole berries or chia seeds.",
  "Serve immediately."
],

  },
  "Grilled Cheese": {
    description: "A golden, buttery grilled cheese with gooey melted cheddar — pure comfort with a crunch that sparks joy.",
ingredients: [
  "2 slices thick white or sourdough bread",
  "2–3 slices cheddar cheese (or a cheese blend)",
  "1 tbsp butter (softened)",
  "Optional: tomato slices, caramelized onion"
],
steps: [
  "Spread butter on the outside of both bread slices.",
  "Place cheese between the non-buttered sides of the bread.",
  "Optional: Add extras like tomato or onion inside the sandwich.",
  "Heat a pan over medium heat.",
  "Grill sandwich on both sides until golden brown and cheese is melted.",
  "Slice diagonally and serve hot."
],

  },
  "Caprese Salad": {
    description: "A simple yet elegant salad that layers happiness in every bite with creamy mozzarella, juicy tomatoes, and fresh basil.",
ingredients: [
  "2 ripe tomatoes, sliced",
  "1 ball fresh mozzarella, sliced",
  "Fresh basil leaves",
  "Extra virgin olive oil",
  "Salt and black pepper to taste",
  "Balsamic glaze (optional)"
],
steps: [
  "Arrange alternating slices of tomato and mozzarella on a plate.",
  "Tuck whole basil leaves between slices.",
  "Drizzle generously with olive oil.",
  "Season with salt and pepper.",
  "Optional: Add a swirl of balsamic glaze for extra flavor.",
  "Serve immediately or chill slightly before serving."
],

  },
  "Banana Pancakes": {
    description: "Soft, fluffy pancakes naturally sweetened with ripe bananas — ideal for joyful mornings or cozy brunches.",
ingredients: [
  "1 ripe banana, mashed",
  "1 cup all-purpose flour",
  "1 egg",
  "1/2 cup milk",
  "1 tsp baking powder",
  "1/2 tsp vanilla extract",
  "Butter or oil for cooking",
  "Optional toppings: maple syrup, berries, whipped cream"
],
steps: [
  "In a bowl, mash the banana until smooth.",
  "Whisk in the egg, milk, and vanilla extract.",
  "Add flour and baking powder, mixing until just combined (don't overmix).",
  "Heat a non-stick pan over medium heat and add a little butter or oil.",
  "Pour small rounds of batter and cook until bubbles form on the surface.",
  "Flip and cook the other side until golden brown.",
  "Serve warm with your favorite toppings."
],

  },
  "Mango Salsa": {
    description: "A tropical sweet-and-spicy salsa that dances on your taste buds — great for happy-hour vibes or taco nights.",
ingredients: [
  "1 ripe mango, diced",
  "1/4 red onion, finely chopped",
  "1 small jalapeño, minced (seeds removed)",
  "Juice of 1 lime",
  "Fresh cilantro, chopped",
  "Salt to taste"
],
steps: [
  "Dice all ingredients into small, even pieces.",
  "In a bowl, combine mango, onion, jalapeño, and cilantro.",
  "Squeeze fresh lime juice over the mixture.",
  "Add salt and mix well.",
  "Refrigerate for 30 minutes for best flavor.",
  "Serve chilled with chips, grilled chicken, or tacos."
],

  },
  "Yogurt Parfait": {
    description: "A layered beauty of creamy yogurt, crunchy granola, and sweet berries — joy in every spoonful.",
ingredients: [
  "1 cup Greek yogurt (vanilla or plain)",
  "1/2 cup granola",
  "1/2 cup mixed berries (strawberries, blueberries, raspberries)",
  "1 tbsp honey or maple syrup",
  "Optional: chia seeds or nuts"
],
steps: [
  "In a glass or jar, spoon a layer of yogurt.",
  "Add a layer of granola followed by berries.",
  "Repeat layers until the glass is full.",
  "Drizzle honey on top.",
  "Optional: Add chia seeds or crushed nuts for texture.",
  "Serve immediately or chill for later."
],

  },
  "Cucumber Sandwiches": {
    description: "Delicate, crisp cucumber tea sandwiches that make you feel fancy for no reason — perfect for a light and joyful snack.",
ingredients: [
  "4 slices white bread, crusts removed",
  "3 tbsp cream cheese, softened",
  "1/2 cucumber, thinly sliced",
  "Fresh dill or chives",
  "Salt and pepper"
],
steps: [
  "Spread cream cheese evenly on all bread slices.",
  "Arrange cucumber slices on two slices of bread.",
  "Sprinkle with salt, pepper, and fresh dill or chives.",
  "Top with the remaining slices, cream cheese side down.",
  "Gently press and cut into quarters or triangles.",
  "Serve chilled."
],

  },
  "Lemonade": {
    description: "A zesty, refreshing drink that brings instant summer happiness with every icy sip.",
ingredients: [
  "1/2 cup fresh lemon juice (about 2–3 lemons)",
  "1/2 cup sugar",
  "2.5 cups cold water",
  "Ice cubes",
  "Lemon slices and mint for garnish (optional)"
],
steps: [
  "In a pitcher, combine lemon juice and sugar.",
  "Stir until sugar is fully dissolved (or heat gently to make simple syrup first).",
  "Add cold water and mix well.",
  "Serve over ice and garnish with lemon slices or mint.",
  "Optional: Sparkle it up with soda water for fizz."
],

  },

  // Sad
  "Mac & Cheese": {
    description: "The ultimate comfort dish. Creamy, cheesy, and baked to golden perfection — this classic warms you up from the inside out.",
ingredients: [
  "2 cups elbow macaroni",
  "2 tbsp butter",
  "2 tbsp all-purpose flour",
  "2 cups milk (whole preferred)",
  "2 cups shredded cheddar cheese",
  "Salt and pepper to taste",
  "Optional: breadcrumbs and extra cheese for topping"
],
steps: [
  "Boil macaroni in salted water until al dente. Drain and set aside.",
  "In a saucepan, melt butter over medium heat.",
  "Whisk in flour to form a roux. Cook for 1–2 minutes to remove floury taste.",
  "Slowly add milk while whisking to avoid lumps. Simmer until thickened.",
  "Stir in cheddar cheese until melted and smooth.",
  "Mix cheese sauce with cooked macaroni. Transfer to a baking dish.",
  "Optional: Sprinkle breadcrumbs and extra cheese on top.",
  "Bake at 180°C (350°F) for 20 minutes or until bubbly and golden."
],

  },
  "Tomato Soup": {
    description: "Rich, tangy, and velvety smooth. This tomato soup is like a hug in a mug, perfect for cold nights or rainy moods.",
ingredients: [
  "1 tbsp olive oil",
  "1 onion, chopped",
  "2 garlic cloves, minced",
  "4 cups chopped ripe tomatoes (or 2 cans crushed tomatoes)",
  "2 cups vegetable broth",
  "1/4 cup heavy cream (optional)",
  "Salt, pepper, and sugar to taste",
  "Fresh basil or parsley for garnish"
],
steps: [
  "Heat olive oil in a pot and sauté onion until soft.",
  "Add garlic and cook for another 1–2 minutes.",
  "Stir in tomatoes and broth. Bring to a boil, then lower heat and simmer for 20 minutes.",
  "Use an immersion blender (or regular blender) to purée until smooth.",
  "Season with salt, pepper, and a pinch of sugar if too acidic.",
  "Optional: Stir in cream for a richer finish.",
  "Garnish with fresh herbs and serve hot, ideally with grilled cheese."
],

  },
  "Mashed Potatoes": {
    description: "Creamy, buttery mashed potatoes that feel like emotional support in food form — soft, warm, and deeply satisfying.",
ingredients: [
  "4 large potatoes (Yukon Gold or Russet)",
  "1/4 cup butter",
  "1/2 cup milk (warm)",
  "Salt and pepper to taste",
  "Optional: garlic, sour cream, or cream cheese for extra richness"
],
steps: [
  "Peel and cut potatoes into chunks.",
  "Boil in salted water for 15–20 minutes or until fork-tender.",
  "Drain and let steam dry for 2 minutes.",
  "Mash with butter and slowly mix in warm milk until creamy.",
  "Season with salt and pepper.",
  "Optional: Fold in extras like roasted garlic or sour cream.",
  "Serve warm — with gravy, or as-is for a soft landing."
],

  },
  "Chicken Noodle Soup": {
    description: "The OG sick-day soup. Hearty noodles, tender chicken, and soul-soothing broth that helps you breathe — emotionally and literally.",
ingredients: [
  "2 chicken breasts (boneless, skinless)",
  "6 cups chicken broth",
  "2 carrots, sliced",
  "2 celery stalks, chopped",
  "1 onion, diced",
  "2 cups egg noodles",
  "Salt, pepper, thyme",
  "Optional: garlic, parsley, bay leaf"
],
steps: [
  "In a pot, bring broth to a simmer and add chicken, carrots, celery, onion, and herbs.",
  "Simmer until chicken is cooked (15–20 minutes), then remove and shred.",
  "Return shredded chicken to the pot.",
  "Add egg noodles and cook for 7–8 minutes until tender.",
  "Taste and adjust seasoning.",
  "Serve warm, optionally with crackers or buttered toast."
],

  },
  "Rice Pudding": {
    description: "A creamy, old-school dessert that wraps you up in nostalgia and warmth — sweet, soft, and vanilla-kissed.",
ingredients: [
  "1/2 cup short-grain rice",
  "4 cups milk",
  "1/4 cup sugar",
  "1 tsp vanilla extract",
  "1/2 tsp cinnamon",
  "Pinch of salt",
  "Optional: raisins or nutmeg"
],
steps: [
  "Rinse rice briefly, then add to a pot with milk and salt.",
  "Bring to a gentle simmer, stirring frequently to prevent sticking.",
  "After 15 minutes, add sugar and continue cooking until thickened (total ~30–40 min).",
  "Stir in vanilla and cinnamon. Add raisins if using.",
  "Serve warm or chilled, with a sprinkle of cinnamon or nutmeg."
],

  },
  "Hot Chocolate": {
    description: "Thick, cozy, and a little decadent — this hot chocolate is the emotional equivalent of a fuzzy blanket.",
ingredients: [
  "2 tbsp cocoa powder",
  "2 tbsp sugar",
  "1.5 cups milk (any kind)",
  "1/4 tsp vanilla extract",
  "Whipped cream or marshmallows for topping"
],
steps: [
  "In a saucepan, whisk cocoa and sugar with a few spoonfuls of milk to make a smooth paste.",
  "Add the rest of the milk and heat gently, stirring constantly.",
  "Once hot (but not boiling), remove from heat and stir in vanilla.",
  "Pour into a mug and top with whipped cream or marshmallows.",
  "Sip slowly and feel feelings."
],

  },
  "Grilled Cheese Sandwich": {
    description: "A melty, toasty, buttery sandwich that never fails to hit the spot when you're emotionally fried.",
ingredients: [
  "2 slices sandwich bread",
  "2 slices cheddar cheese",
  "1 tbsp butter"
],
steps: [
  "Butter the outside of both bread slices.",
  "Place cheese between the unbuttered sides.",
  "Grill in a pan over medium heat until golden on both sides and cheese is fully melted.",
  "Serve with tomato soup or solo.",
  "Cut diagonally for maximum healing power."
],

  },
  "Oatmeal": {
    description: "Hearty and soothing, this bowl of oats is a slow-paced, grounding start to any melancholy morning.",
ingredients: [
  "1/2 cup rolled oats",
  "1 cup milk or water",
  "1 tbsp honey or brown sugar",
  "1/2 banana, sliced",
  "Pinch of cinnamon"
],
steps: [
  "In a pot, bring milk or water to a simmer.",
  "Stir in oats and cook on low for 5–7 minutes, stirring occasionally.",
  "Sweeten with honey or sugar.",
  "Top with banana slices and sprinkle of cinnamon.",
  "Serve warm, with a spoon and some self-compassion."
],

  },
  "Banana Bread": {
    description: "Soft, moist, and sweet — banana bread is the classic ‘it’s-okay-to-not-be-okay’ bake.",
ingredients: [
  "3 ripe bananas, mashed",
  "1.5 cups all-purpose flour",
  "1/2 cup sugar",
  "1/3 cup melted butter",
  "1 egg",
  "1 tsp baking soda",
  "1/4 tsp salt",
  "1/2 tsp cinnamon (optional)"
],
steps: [
  "Preheat oven to 175°C (350°F). Grease a loaf pan.",
  "Mash bananas in a bowl and mix with melted butter.",
  "Add egg and sugar, mix well.",
  "In a separate bowl, combine flour, baking soda, salt, and cinnamon.",
  "Add dry mix to wet and fold together until just combined.",
  "Pour into loaf pan and bake for 50–60 minutes.",
  "Cool slightly before slicing. Best eaten warm with butter or on its own in silence."
],

  },
  "Apple Crumble": {
    description: "Sweet and slightly tart apples under a crispy, buttery crumble topping. Best served warm with a scoop of vanilla sadness-healing ice cream.",
ingredients: [
  "4 apples, peeled and sliced",
  "1/2 cup brown sugar",
  "1 tsp cinnamon",
  "1/2 cup all-purpose flour",
  "1/3 cup butter (cold, cubed)",
  "1/4 cup oats (optional)"
],
steps: [
  "Preheat oven to 180°C (350°F).",
  "Toss apples with half the sugar and cinnamon. Place in baking dish.",
  "In a bowl, mix flour, remaining sugar, butter, and oats with fingers until crumbly.",
  "Sprinkle crumble over apples.",
  "Bake for 30–35 minutes or until top is golden and apples are bubbling.",
  "Serve warm with cream, custard, or ice cream."
],

  },

  // Angry
  "Spicy Noodles": {
    description: "Bold, fiery noodles that hit like a slap to the tastebuds — ideal when you're mad and need a quick flavor punch.",
ingredients: [
  "200g ramen or rice noodles",
  "2 tbsp chili garlic sauce",
  "2 cloves garlic, minced",
  "1 tbsp soy sauce",
  "1 tsp sesame oil",
  "Chopped scallions",
  "Optional: crushed peanuts, fried egg"
],
steps: [
  "Cook noodles according to package, drain and set aside.",
  "Heat sesame oil in a wok, add garlic and sauté until fragrant.",
  "Add chili garlic sauce and soy sauce, stir together.",
  "Toss in noodles and coat evenly with the spicy sauce.",
  "Top with scallions, crushed peanuts, or a fried egg if desired.",
  "Eat immediately — rage soothed."
],

  },
  "Grilled Chicken": {
    description: "Crispy-edged, smoky grilled chicken that gives your jaw something to chew through when you’re simmering with frustration.",
ingredients: [
  "2 boneless chicken breasts",
  "1 tbsp olive oil",
  "1 tsp salt",
  "1/2 tsp black pepper",
  "1 tsp smoked paprika",
  "1/2 tsp cayenne pepper"
],
steps: [
  "Pound the chicken slightly to even thickness.",
  "Rub with oil and season generously with spices.",
  "Grill over high heat for 5–7 mins each side or until done.",
  "Let rest for 5 mins, then slice.",
  "Serve with hot sauce or spicy dip to match your mood."
],

  },
  "Buffalo Wings": {
    description: "Crispy wings drowned in molten hot buffalo sauce — messy, primal, and 100% cathartic.",
ingredients: [
  "12 chicken wings",
  "1/4 cup hot sauce (e.g., Frank’s RedHot)",
  "2 tbsp melted butter",
  "1/2 tsp garlic powder",
  "Salt and pepper",
  "Celery sticks (for balance)"
],
steps: [
  "Preheat oven to 220°C (425°F) or air fry the wings.",
  "Season wings with salt and pepper, bake or fry until crispy.",
  "Mix hot sauce, butter, and garlic powder in a bowl.",
  "Toss hot wings in the sauce until coated.",
  "Serve with celery and optional blue cheese dip.",
  "Let your fingers and fury do the work."
],

  },
  "Chili Con Carne": {
    description: "Hearty, meaty chili that simmers with intensity — like your emotions, but edible.",
ingredients: [
  "500g ground beef",
  "1 onion, diced",
  "1 can kidney beans",
  "1 can crushed tomatoes",
  "2 tbsp chili powder",
  "1 tsp cumin",
  "Salt and black pepper"
],
steps: [
  "Brown beef in a large pot with onion.",
  "Stir in chili powder, cumin, salt, and pepper.",
  "Add beans and tomatoes, mix well.",
  "Simmer uncovered for 25–30 minutes until thick.",
  "Serve with rice, nachos, or just eat straight from the pot."
],

  },
  "Sriracha Tacos": {
    description: "Savage-level tacos with a face-slapping Sriracha blast — eat them fast, eat them furious.",
ingredients: [
  "8 taco shells",
  "300g ground beef or chicken",
  "1 tbsp taco seasoning",
  "2 tbsp Sriracha sauce",
  "Shredded lettuce",
  "Grated cheese",
  "Sour cream (to cool the burn)"
],
steps: [
  "Cook meat in a pan with taco seasoning until browned.",
  "Add Sriracha and stir it in aggressively.",
  "Fill taco shells with meat, lettuce, and cheese.",
  "Top with more Sriracha and a dollop of sour cream if you're soft.",
  "Eat like you mean it."
],

  },
  "Jalapeño Poppers": {
    description: "Small but deadly — these spicy, cheesy jalapeño bites will burn the bad vibes right out of you.",
ingredients: [
  "6 large jalapeños, halved and deseeded",
  "100g cream cheese",
  "6 slices of bacon",
  "2 tbsp breadcrumbs",
  "Salt and garlic powder"
],
steps: [
  "Preheat oven to 200°C (400°F).",
  "Mix cream cheese with garlic powder and a pinch of salt.",
  "Stuff jalapeños with the cheese mix.",
  "Wrap each with a half-slice of bacon.",
  "Top with breadcrumbs and bake for 20–25 mins until crispy.",
  "Crunch, burn, repeat."
],

  },
  "Spicy Curry": {
    description: "A lava-hot curry that doesn’t ask how you feel — it just helps you process it in flames.",
ingredients: [
  "300g chicken or tofu",
  "2 tbsp curry paste (red or green)",
  "1 can coconut milk",
  "2 cloves garlic, minced",
  "1 inch ginger, grated",
  "1 tbsp oil",
  "Fresh cilantro to garnish"
],
steps: [
  "Heat oil in a pot, sauté garlic and ginger.",
  "Stir in curry paste and fry for 2 mins.",
  "Add coconut milk and bring to simmer.",
  "Add protein of choice and cook through.",
  "Serve with rice and chopped cilantro.",
  "Optional: scream into a pillow while it simmers."
],

  },
  "Kimchi Fried Rice": {
    description: "Tangy, punchy, and slightly chaotic — this fried rice is the edible equivalent of yelling into a void.",
ingredients: [
  "2 cups cooked rice (cold)",
  "1/2 cup kimchi, chopped",
  "1 tbsp kimchi juice",
  "2 eggs",
  "1 tbsp soy sauce",
  "1 scallion, chopped",
  "Sesame oil for frying"
],
steps: [
  "Scramble eggs in sesame oil, then set aside.",
  "Stir-fry kimchi in a hot pan until slightly crisp.",
  "Add rice and kimchi juice, stir well.",
  "Toss eggs back in, add soy sauce and scallions.",
  "Fry until slightly crispy on the bottom.",
  "Eat straight from the pan if you're too mad to plate."
],

  },
  "Pepper Steak": {
    description: "Savory steak stir-fry with fire-roasted bell peppers and attitude.",
ingredients: [
  "300g steak, sliced thin",
  "1 red bell pepper, sliced",
  "1 green bell pepper, sliced",
  "2 cloves garlic, minced",
  "2 tbsp soy sauce",
  "1 tsp black pepper",
  "1 tbsp oil"
],
steps: [
  "Heat oil in a skillet, cook garlic and peppers for 2–3 minutes.",
  "Add steak and stir-fry until browned.",
  "Season with soy sauce and a ton of black pepper.",
  "Cook until sauce is sticky and meat is tender.",
  "Serve with steamed rice or noodles."
],

  },
  "Hot Salsa & Chips": {
    description: "Salsa that punches back. Dunk your anger into a bowl of fire and keep crunching.",
ingredients: [
  "4 ripe tomatoes",
  "1 jalapeño or serrano (more if you dare)",
  "1/2 onion",
  "2 cloves garlic",
  "Fresh cilantro",
  "Salt and lime juice",
  "Tortilla chips"
],
steps: [
  "Chop tomatoes, onion, garlic, and chili.",
  "Blend roughly or mix by hand for chunkier salsa.",
  "Stir in lime juice, cilantro, and salt.",
  "Serve with tortilla chips and maybe a warning label.",
  "Dip like you're mad at it."
],

  },

  // Stressed
  "Chamomile Tea": {
description: "Classic calming chamomile tea — perfect to slow your brain down when boredom is creeping in.",
ingredients: [
  "1-2 tsp dried chamomile flowers (or 1 chamomile tea bag)",
  "250 ml hot water (just off boiling)",
  "Honey or agave syrup (optional, for a touch of sweetness)"
],
steps: [
  "Heat water until just boiling (around 95°C).",
  "Place chamomile flowers or tea bag in your cup or teapot.",
  "Pour hot water over and cover to keep the heat in.",
  "Steep for 5 minutes — patience is key.",
  "Strain out flowers or remove tea bag.",
  "Add honey or sweetener if you want a mild sweet note.",
  "Sip slowly, let the floral notes calm your restless mind."
],

  },
  "Salmon & Rice": {
description: "Simple, light, and nourishing grilled salmon paired with fluffy rice — boredom doesn’t stand a chance.",
ingredients: [
  "1 salmon fillet (~150-200g)",
  "1 cup jasmine or basmati rice",
  "1 lemon, sliced and juiced",
  "Salt and freshly ground black pepper",
  "Olive oil"
],
steps: [
  "Cook rice according to package instructions (usually 1 cup rice to 2 cups water, simmer covered until fluffy).",
  "Pat salmon dry, season with salt and pepper on both sides.",
  "Heat a drizzle of olive oil in a pan over medium-high heat.",
  "Grill or pan-fry salmon skin-side down for 4-5 mins, then flip and cook 3-4 mins more until flaky but moist inside.",
  "Squeeze fresh lemon juice over the cooked salmon.",
  "Serve salmon atop rice with extra lemon slices on the side.",
  "A light, clean meal that’s more exciting than your boredom."
],

  },
  "Quinoa Salad": {
description: "Fresh, healthy quinoa tossed with crisp veggies and zesty lemon — boredom won’t linger with this colorful crunch.",
ingredients: [
  "1 cup cooked quinoa (cooled)",
  "1/2 cucumber, diced",
  "1 ripe tomato, diced",
  "2 tbsp extra virgin olive oil",
  "Juice of 1 lemon",
  "Salt and black pepper to taste",
  "Fresh parsley or mint (optional)"
],
steps: [
  "Cook quinoa following package instructions, rinse, and cool completely.",
  "Dice cucumber and tomato into bite-sized pieces.",
  "In a bowl, mix quinoa, cucumber, and tomato.",
  "Whisk olive oil, lemon juice, salt, and pepper in a small bowl.",
  "Pour dressing over salad, toss until evenly coated.",
  "Chop fresh herbs and sprinkle on top if you have them.",
  "Serve chilled or at room temp — crunchy, refreshing, and boredom-busting.",
],

  },
  "Steamed Veggies": {
description: "Super simple, no-fuss steamed vegetables — soothing to eat and easy to make when you can’t even with complicated meals.",
ingredients: [
  "1 cup broccoli florets",
  "1 cup carrot slices",
  "1 cup cauliflower florets",
  "Salt to taste",
  "1 tbsp butter or olive oil"
],
steps: [
  "Fill a pot with an inch or two of water and bring to a boil.",
  "Place veggies in a steamer basket, set over boiling water, cover.",
  "Steam for 6-8 minutes until veggies are tender but still have a bite.",
  "Transfer veggies to a serving bowl.",
  "Add butter or drizzle olive oil, season with salt, toss gently.",
  "Serve warm as a comforting, light side or snack.",
],

  },
  "Avocado Smoothie": {
description: "Creamy, smooth, and nourishing — this avocado smoothie is a low-key delight to perk you up from that bored slump.",
ingredients: [
  "1 ripe avocado",
  "1 cup milk (dairy or plant-based)",
  "1 tbsp honey or maple syrup",
  "1 cup ice cubes"
],
steps: [
  "Cut avocado in half, scoop flesh into blender.",
  "Add milk, honey, and ice cubes.",
  "Blend until completely smooth and creamy.",
  "Pour into a chilled glass.",
  "Sip slowly — healthy fats and cool texture make it oddly exciting.",
],

  },
  "Grilled Fish": {
description: "Lightly seasoned, flaky grilled fish — clean and simple flavors that won’t put you to sleep.",
ingredients: [
  "1 white fish fillet (like cod or tilapia)",
  "1 lemon (juice and zest)",
  "2 cloves garlic, minced",
  "Salt and black pepper",
  "Olive oil"
],
steps: [
  "In a small bowl, mix lemon juice, zest, garlic, salt, pepper, and a splash of olive oil.",
  "Marinate fish in the mixture for 10-15 minutes.",
  "Preheat grill or pan over medium-high heat.",
  "Grill fish 3-4 minutes each side until opaque and flaky.",
  "Serve immediately, drizzled with any leftover marinade.",
],

  },
  "Sweet Potato Mash": {
description: "Comfort in a bowl — creamy mashed sweet potatoes that warm you up and shake off the boredom blues.",
ingredients: [
  "2 large sweet potatoes, peeled and chopped",
  "2 tbsp butter",
  "1/4 cup cream or milk",
  "Salt and pepper to taste"
],
steps: [
  "Boil sweet potatoes in salted water for 15-20 minutes until very tender.",
  "Drain and return to pot or bowl.",
  "Add butter and cream, mash until smooth and creamy.",
  "Season generously with salt and pepper.",
  "Serve warm — easy, filling, and cozy.",
],

  },
  "Herbal Tea": {
description: "Gentle herbal blend of mint and chamomile — perfect for slow moments and calming down a restless brain.",
ingredients: [
  "1 tbsp mixed dried herbs (mint, chamomile)",
  "1 cup hot water",
  "Honey to taste"
],
steps: [
  "Steep herbs in hot water for 5 minutes with a lid on.",
  "Strain out herbs.",
  "Sweeten with honey if you want.",
  "Enjoy while reading or zoning out on purpose.",
],

  },
  "Greek Yogurt": {
description: "Thick, creamy, and slightly tangy — Greek yogurt with honey and nuts makes a quick snack that feels fancy enough to break boredom.",
ingredients: [
  "1 cup Greek yogurt",
  "1 tbsp honey",
  "Handful of nuts (walnuts, almonds, or pecans)"
],
steps: [
  "Spoon yogurt into a bowl.",
  "Drizzle honey over the top.",
  "Sprinkle nuts for crunch and texture.",
  "Eat chilled for a refreshing break.",
],

  },
  "Berry Salad": {
description: "Fresh, juicy berries tossed with mint and lemon juice — simple, bright, and an instant mood-lifter.",
ingredients: [
  "1/2 cup strawberries, hulled and sliced",
  "1/2 cup blueberries",
  "1/2 cup raspberries",
  "A few fresh mint leaves, chopped",
  "1 tbsp fresh lemon juice"
],
steps: [
  "Gently toss all berries and mint in a bowl.",
  "Drizzle lemon juice over and mix lightly.",
  "Serve chilled for a fresh pop of flavor and color.",
],

  },

  // Bored
  "Snack Platter": {
description: "A colorful, mix-and-match snack board to keep things interesting when you just wanna chill and snack.",
ingredients: [
  "Assorted cheese cubes (cheddar, gouda, swiss)",
  "Crunchy crackers",
  "Briny olives",
  "Mixed nuts (almonds, cashews, walnuts)",
  "Fresh fruit slices (apple, grapes, or berries)"
],
steps: [
  "Arrange cheese cubes, crackers, olives, nuts, and fruit slices neatly on a large platter or wooden board.",
  "Add a couple of small bowls with dips like honey mustard or spicy salsa for extra flavor.",
  "Serve immediately and let everyone snack freely — perfect for casual hangouts or solo chill sessions.",
],

  },
  "Mini Tacos": {
description: "Tiny but mighty tacos packed with juicy, seasoned beef and fresh toppings — snack-sized but satisfying.",
ingredients: [
  "Mini taco shells or small tortillas",
  "200g ground beef",
  "1 tsp taco seasoning or chili powder",
  "Shredded lettuce",
  "Grated cheese (cheddar or monterey jack)",
  "Fresh salsa or pico de gallo"
],
steps: [
  "Cook ground beef in a pan over medium heat, sprinkle taco seasoning and stir till fully cooked and flavorful.",
  "Warm taco shells in oven or microwave for a minute.",
  "Fill each shell with beef, a bit of lettuce, cheese, and salsa.",
  "Serve immediately while shells stay crisp — addictive little bites for when you’re bored but hungry.",
],

  },
  "Popcorn": {
description: "Classic, lightly salted popcorn with melted butter — an easy snack that keeps your hands busy and your brain entertained.",
ingredients: [
  "1/4 cup popcorn kernels",
  "2 tbsp butter",
  "Salt to taste"
],
steps: [
  "Heat a large pot with a lid over medium heat and add popcorn kernels with a drizzle of oil (optional).",
  "Cover and shake pot gently to pop kernels without burning.",
  "Once popping slows, remove from heat and pour popcorn into a bowl.",
  "Melt butter and drizzle evenly over popcorn.",
  "Sprinkle salt, toss to coat, then dive in for that crunchy, buttery goodness.",
],

  },
  "Veggie Sticks": {
description: "Crunchy, fresh veggie sticks served with creamy ranch — the perfect guilt-free snack for beating boredom.",
ingredients: [
  "2 large carrots, peeled",
  "2 celery stalks",
  "1 cucumber",
  "Ranch dressing or dip"
],
steps: [
  "Cut carrots, celery, and cucumber into uniform sticks (think finger food size).",
  "Arrange sticks on a plate around a bowl of ranch dip.",
  "Serve immediately for a refreshing, crunchy snack that feels fresh and alive when you’re stuck in a rut.",
],

  },
  "Cheese Cubes": {
description: "A simple plate of assorted cheese cubes with crunchy crackers — perfect for casual snacking or pairing with wine.",
ingredients: [
  "Cheddar cheese block",
  "Swiss cheese block",
  "Gouda cheese block",
  "A handful of crackers"
],
steps: [
  "Cut each cheese into bite-sized cubes or small chunks.",
  "Arrange cheese cubes on a serving plate alongside crackers.",
  "Optional: add some fresh grapes or nuts for texture variety.",
  "Serve immediately — simple but classy.",
],

  },
  "Hummus & Pita": {
description: "Creamy, garlicky hummus paired with warm, soft pita bread — a snack that’s both comforting and a bit fancy.",
ingredients: [
  "1 cup store-bought or homemade hummus",
  "2 pita breads",
  "Olive oil",
  "Paprika or smoked paprika"
],
steps: [
  "Warm pita bread in oven or toaster until soft and slightly toasted.",
  "Spoon hummus into a serving bowl, drizzle olive oil generously on top.",
  "Sprinkle paprika for a pop of color and mild heat.",
  "Cut pita into wedges and serve with hummus for dipping.",
],

  },
  "Fruit Skewers": {
description: "Fresh, juicy fruit chunks threaded onto skewers — a sweet, colorful, and playful snack to brighten a boring day.",
ingredients: [
  "Pineapple chunks",
  "Strawberries, hulled",
  "Seedless grapes",
  "Melon cubes (cantaloupe or honeydew)"
],
steps: [
  "Cut all fruit into uniform bite-sized pieces.",
  "Thread pieces alternately onto wooden or metal skewers for a fun, rainbow effect.",
  "Chill skewers in the fridge for 15 minutes before serving.",
  "Serve cool and fresh — visually and flavorfully exciting.",
],

  },
  "Pretzels": {
description: "Soft, chewy homemade pretzels with that perfect salty crust — a satisfying project and snack.",
ingredients: [
  "2 1/4 tsp active dry yeast",
  "4 cups flour",
  "1 tbsp sugar",
  "1 1/2 tsp salt",
  "1 1/2 cups warm water",
  "Baking soda bath (1/4 cup baking soda in 3 cups water)"
],
steps: [
  "Activate yeast in warm water with sugar until foamy.",
  "Mix flour and salt, then add yeast mixture to form a dough.",
  "Knead dough for 8-10 minutes until smooth and elastic.",
  "Let dough rise until doubled (~1 hour).",
  "Divide dough, shape into pretzels.",
  "Boil pretzels for 30 seconds each in baking soda bath, then transfer to baking sheet.",
  "Brush with egg wash, sprinkle coarse salt.",
  "Bake at 220°C (425°F) for 12-15 minutes until golden brown.",
],

  },
  "Trail Mix": {
description: "A crunchy, sweet, salty combo of nuts, seeds, dried fruits, and chocolate chips — perfect for mindless munching.",
ingredients: [
  "1 cup almonds",
  "1 cup cashews",
  "1/2 cup raisins",
  "1/2 cup pumpkin seeds",
  "1/4 cup chocolate chips"
],
steps: [
  "Mix all ingredients thoroughly in a large bowl.",
  "Store in an airtight container for freshness.",
  "Grab a handful whenever boredom hits — easy energy boost with texture variety.",
],

  },
  "Rice Cakes": {
description: "Light, crunchy rice cakes topped with creamy peanut butter and fresh banana slices — sweet, salty, and crunchy in every bite.",
ingredients: [
  "Rice cakes (plain or lightly salted)",
  "Peanut butter (creamy or crunchy)",
  "1 ripe banana, sliced"
],
steps: [
  "Spread a generous layer of peanut butter on each rice cake.",
  "Top with banana slices evenly.",
  "Serve immediately for a snack that’s both satisfying and easy to make.",
],

  },

  // Energised
  "Protein Smoothie": {
description: "Kickstart your day or power through a slump with this creamy, protein-packed smoothie that tastes like a treat but works like a champ.",
ingredients: [
  "1 scoop protein powder (vanilla or chocolate)",
  "1 ripe banana",
  "1 cup unsweetened almond milk",
  "1 tbsp peanut butter"
],
steps: [
  "Add protein powder, banana, almond milk, and peanut butter to your blender.",
  "Blend on high until super smooth and creamy with no lumps.",
  "Pour into a chilled glass and enjoy immediately for max energy boost."
],

  },
  "Egg Muffins": {
description: "Mini egg muffins loaded with fresh spinach, colorful bell peppers, and melty cheese — perfect protein bites on the go.",
ingredients: [
  "4 large eggs",
  "1/2 cup chopped spinach",
  "1/2 cup diced bell peppers (red, yellow, or green)",
  "1/4 cup shredded cheese (cheddar or mozzarella)",
  "Pinch of salt"
],
steps: [
  "Preheat oven to 180°C (350°F).",
  "Whisk eggs in a bowl, then fold in spinach, bell peppers, cheese, and salt.",
  "Pour mixture evenly into a greased muffin tin.",
  "Bake for 15 minutes until set and golden on top.",
  "Cool a bit, then pop out and snack whenever you need that protein kick."
],

  },
  "Granola Bars": {
description: "Crunchy, chewy homemade granola bars packed with oats, nuts, dried fruit, and peanut butter — a perfect grab-and-go energy boost.",
ingredients: [
  "2 cups rolled oats",
  "1/2 cup honey",
  "1 cup mixed nuts (chopped almonds, walnuts)",
  "1/2 cup dried fruit (raisins, cranberries)",
  "1/2 cup peanut butter"
],
steps: [
  "Preheat oven to 175°C (350°F).",
  "Mix oats, nuts, dried fruit, honey, and peanut butter in a big bowl until well combined.",
  "Press mixture firmly into a lined baking tray (8x8 inch).",
  "Bake for 20 minutes until golden and set.",
  "Cool completely before slicing into bars — perfect for on-the-go snacking."
],

  },
  "Chicken Wrap": {
description: "A fresh, healthy grilled chicken wrap loaded with crunchy lettuce, juicy tomato, and creamy hummus — snack or lunch done right.",
ingredients: [
  "1 grilled chicken breast, sliced",
  "1 large tortilla wrap",
  "Handful of shredded lettuce",
  "Sliced tomato",
  "2 tbsp hummus"
],
steps: [
  "Lay tortilla flat and spread hummus evenly over the surface.",
  "Add grilled chicken slices, lettuce, and tomato.",
  "Roll tightly, slice in half, and serve immediately — fresh, filling, and packed with energy."
],

  },
  "Kale Salad": {
description: "Bright, zesty kale salad tossed in lemon and olive oil, topped with parmesan and crunchy croutons — energizing and fresh AF.",
ingredients: [
  "2 cups kale leaves, chopped",
  "Juice of 1 lemon",
  "2 tbsp olive oil",
  "1/4 cup grated parmesan",
  "1/2 cup crunchy croutons"
],
steps: [
  "Massage kale leaves with lemon juice and olive oil for 2-3 minutes until tender and glossy.",
  "Add parmesan and croutons, then toss well to combine.",
  "Serve fresh for a salad that’s as powerful as it is tasty."
],

  },
  "Peanut Butter Toast": {
description: "Crunchy whole grain toast slathered with creamy peanut butter and topped with sweet banana slices — simple but packed with good vibes and fuel.",
ingredients: [
  "1 slice whole grain bread",
  "2 tbsp peanut butter",
  "1/2 banana, sliced"
],
steps: [
  "Toast the bread until golden and crunchy.",
  "Spread peanut butter evenly over the warm toast.",
  "Top with banana slices for a sweet, creamy finish.",
  "Serve immediately and enjoy the combo of crunchy, creamy, and sweet."
],

  },
  "Boiled Eggs": {
description: "Classic boiled eggs cooked to your liking — simple, protein-packed fuel for when you need quick energy.",
ingredients: [
  "2 large eggs",
  "Salt and pepper to taste"
],
steps: [
  "Place eggs in a pot, cover with cold water.",
  "Bring to a boil, then reduce heat and simmer: 6 minutes for soft-boiled, 9 minutes for hard-boiled.",
  "Cool eggs in ice water, peel carefully.",
  "Season with salt and pepper and serve immediately."
],

  },
  "Smoothie Bowl": {
description: "Thick, creamy smoothie bowl topped with crunchy granola and nutrient-rich seeds — snack and breakfast goals in one bowl.",
ingredients: [
  "1 cup frozen mixed berries",
  "1 banana",
  "1/2 cup plain yogurt",
  "1/4 cup granola",
  "1 tbsp mixed seeds (chia, pumpkin, sunflower)"
],
steps: [
  "Blend frozen berries, banana, and yogurt until thick and creamy.",
  "Pour into a bowl and smooth the surface.",
  "Top with granola and seeds for crunch and extra nutrients.",
  "Serve immediately with a spoon — visually vibrant and energizing."
],

  },
  "Quinoa Bowl": {
description: "Protein-packed quinoa bowl loaded with roasted veggies, creamy avocado, and tangy lemon dressing — wholesome and energizing.",
ingredients: [
  "1 cup cooked quinoa",
  "1 cup assorted roasted vegetables (zucchini, bell peppers, carrots)",
  "1/2 avocado, sliced",
  "2 tbsp lemon juice",
  "1 tbsp olive oil"
],
steps: [
  "Combine warm quinoa and roasted veggies in a bowl.",
  "Top with avocado slices.",
  "Drizzle lemon juice and olive oil over the top.",
  "Toss lightly and serve fresh for a balanced, energy-boosting meal."
],

  },
  "Almonds": {
description: "Simple roasted almonds tossed with a bit of olive oil and salt — crunchy, salty, and the perfect quick snack for a fast energy spike.",
ingredients: [
  "1 cup raw almonds",
  "1 tsp olive oil",
  "1/2 tsp salt"
],
steps: [
  "Preheat oven to 180°C (350°F).",
  "Toss almonds with olive oil and salt until evenly coated.",
  "Spread almonds on a baking tray in a single layer.",
  "Roast for 15 minutes, stirring halfway to avoid burning.",
  "Cool completely before serving.",
],

  },

  // Confused
  "Toast + Jam": {
description: "Classic comfort: crispy toast slathered with butter and your fave jam — quick, sweet, and foolproof.",
ingredients: [
  "2 slices of bread (white or whole grain)",
  "Butter (room temp)",
  "Jam or jelly (any flavor you love)"
],
steps: [
  "Pop the bread in the toaster till golden and crisp.",
  "Spread a thin layer of butter while warm so it melts in.",
  "Top with a generous spoonful of jam.",
  "Serve immediately before the toast gets soggy."
],

  },
  "Yogurt Bowl": {
description: "Creamy Greek yogurt topped with a sweet drizzle of honey, crunchy granola, and fresh fruit — simple brain fuel.",
ingredients: [
  "1 cup Greek yogurt",
  "1 tbsp honey",
  "1/4 cup granola",
  "Fresh fruit (berries, banana slices, or your fav)"
],
steps: [
  "Spoon yogurt into a bowl.",
  "Drizzle honey evenly on top.",
  "Scatter granola and fresh fruit over the yogurt.",
  "Serve chilled for that refreshing combo."
],

  },
  "Cereal": {
description: "No-brainer breakfast: your favorite cereal with cold milk and optional fresh fruit for some extra color and crunch.",
ingredients: [
  "1 cup cereal (any kind you like)",
  "1/2 to 1 cup milk (dairy or plant-based)",
  "Optional: sliced banana, berries, or other fruit"
],
steps: [
  "Pour cereal into a bowl.",
  "Add milk to cover or just splash, your call.",
  "Toss in fruit if you want a little upgrade.",
  "Dig in immediately before the cereal gets soggy."
],

  },
  "Bagel & Cream Cheese": {
description: "Toasted bagel halves with a smooth spread of cream cheese — easy, satisfying, and classic.",
ingredients: [
  "1 bagel (plain or flavored)",
  "2-3 tbsp cream cheese"
],
steps: [
  "Slice the bagel in half and toast until golden and slightly crispy.",
  "Spread cream cheese evenly over each half while warm.",
  "Serve right away for max softness and creaminess."
],

  },
  "Fruit Cup": {
description: "A refreshing mix of assorted fresh fruits — hydrating, colorful, and easy to snack on anytime.",
ingredients: [
  "Assorted fresh fruits (melon, berries, grapes, pineapple, etc.)"
],
steps: [
  "Wash and chop all fruits into bite-sized pieces.",
  "Toss everything gently in a bowl to mix colors and flavors.",
  "Serve chilled — perfect as a light snack or dessert."
],

  },
  "Muffin": {
description: "Sweet, moist homemade muffins baked fresh — simple base, great with coffee or for a quick sweet fix.",
ingredients: [
  "1 1/2 cups flour",
  "3/4 cup sugar",
  "2 eggs",
  "1/2 cup melted butter",
  "1/2 cup milk"
],
steps: [
  "Preheat oven to 180°C (350°F).",
  "Mix all ingredients until smooth and just combined (don’t overmix).",
  "Pour batter into lined muffin tins, filling 2/3 full.",
  "Bake for 20 minutes or until a toothpick comes out clean.",
  "Cool before serving so they don’t crumble."
],

  },
  "Porridge": {
description: "Warm, soothing oatmeal porridge sweetened with honey and a dash of cinnamon — perfect for fuzzy, slow mornings.",
ingredients: [
  "1/2 cup rolled oats",
  "1 cup milk or water",
  "1 tbsp honey",
  "A pinch of cinnamon"
],
steps: [
  "Cook oats in milk or water over medium heat until thick and creamy, about 5-7 minutes.",
  "Stir in honey for natural sweetness.",
  "Sprinkle cinnamon on top before serving warm.",
  "Optional: add fresh fruit or nuts for texture."
],

  },
  "Cheese Toastie": {
description: "Golden buttered bread with melty cheese in the middle — classic, cheesy, and foolproof.",
ingredients: [
  "2 slices of bread",
  "2-3 slices cheese (cheddar or your favorite)",
  "Butter for spreading"
],
steps: [
  "Butter one side of each bread slice.",
  "Place cheese slices between unbuttered sides to form a sandwich.",
  "Grill in a pan over medium heat until bread is golden and cheese melts.",
  "Flip once, press lightly for even melt.",
  "Serve hot, maybe with a side of pickles or ketchup."
],

  },
  "Rice Cake": {
description: "Light, crunchy rice cakes topped with your favorite spreads — quick, simple, and customizable.",
ingredients: [
  "Plain rice cakes",
  "Toppings: peanut butter, jam, cream cheese, or anything you like"
],
steps: [
  "Spread your chosen topping evenly over the rice cakes.",
  "Serve immediately so rice cakes stay crisp.",
  "Mix and match toppings for variety."
],

  },
  "Peach Slices": {
description: "Fresh, juicy peach slices — sweet, hydrating, and simple.",
ingredients: [
  "Ripe peaches"
],
steps: [
  "Wash and slice peaches into wedges or bite-sized pieces.",
  "Serve chilled or at room temp.",
  "Optional: sprinkle a little lemon juice to keep fresh."
],

  },

  // Grateful
  "Roast Veggie Wrap": {
description: "A warm tortilla loaded with flavorful roasted veggies and creamy hummus — fresh, filling, and grateful vibes only.",
ingredients: [
  "1 large tortilla wrap",
  "1-2 cups assorted roasted vegetables (bell peppers, zucchini, eggplant)",
  "2-3 tbsp hummus",
  "Handful of fresh lettuce"
],
steps: [
  "Lay the tortilla flat and spread hummus evenly over it.",
  "Add a generous layer of roasted veggies and a handful of crisp lettuce.",
  "Roll it tightly into a wrap.",
  "Slice in half if you want, then serve immediately or wrap up for later."
],

  },
  "Pasta Primavera": {
description: "Bright pasta tossed with fresh sautéed veggies and garlic, topped with sharp parmesan — light but satisfying.",
ingredients: [
  "200g pasta (penne or spaghetti)",
  "1 zucchini, sliced",
  "1 cup cherry tomatoes, halved",
  "2 cloves garlic, minced",
  "1/4 cup grated parmesan cheese",
  "Olive oil, salt, pepper"
],
steps: [
  "Cook pasta in salted boiling water until al dente, then drain.",
  "Heat olive oil in a pan, sauté garlic until fragrant.",
  "Add zucchini and cherry tomatoes, cook until tender but still vibrant.",
  "Toss pasta with the veggies, season with salt and pepper.",
  "Sprinkle parmesan on top before serving."
],

  },
  "Stuffed Peppers": {
description: "Sweet bell peppers packed with savory rice and veggie filling, baked to cheesy perfection.",
ingredients: [
  "4 large bell peppers, tops cut off and seeds removed",
  "1 cup cooked rice",
  "1/2 cup tomato sauce",
  "1/2 onion, diced",
  "1/2 cup shredded cheese (mozzarella or cheddar)",
  "Olive oil, salt, pepper"
],
steps: [
  "Preheat oven to 180°C (350°F).",
  "Sauté onion in olive oil until translucent.",
  "Mix cooked rice with tomato sauce and sautéed onions, season to taste.",
  "Stuff each pepper with the rice mixture.",
  "Place peppers in a baking dish, bake for 20 minutes.",
  "Top with cheese and bake another 5-10 minutes until melted and bubbly.",
  "Serve warm."
],

  },
  "Caesar Salad": {
description: "Classic Caesar with crisp romaine, crunchy croutons, and sharp parmesan — simple but packed with flavor.",
ingredients: [
  "1 head romaine lettuce, chopped",
  "1/2 cup croutons",
  "1/4 cup grated parmesan cheese",
  "Caesar dressing (store-bought or homemade)"
],
steps: [
  "Toss chopped romaine with enough Caesar dressing to coat lightly.",
  "Add croutons and parmesan cheese.",
  "Toss gently again and serve chilled.",
],

  },
  "Grilled Salmon": {
description: "Simple, perfectly grilled salmon fillet with lemon and olive oil — healthy, fresh, and packed with gratitude.",
ingredients: [
  "1 salmon fillet",
  "1 tbsp olive oil",
  "Salt and pepper to taste",
  "Lemon wedges"
],
steps: [
  "Preheat grill or pan over medium-high heat.",
  "Brush salmon with olive oil, season with salt and pepper.",
  "Grill for 4-5 minutes each side until cooked through and flaky.",
  "Serve immediately with fresh lemon wedges."
],

  },
  "Bruschetta": {
description: "Toasted baguette slices topped with a fresh mix of tomatoes, garlic, basil, and olive oil — simple Italian goodness.",
ingredients: [
  "1 baguette, sliced",
  "2 cups diced tomatoes",
  "2 cloves garlic, minced",
  "Fresh basil leaves, chopped",
  "2 tbsp olive oil",
  "Salt and pepper"
],
steps: [
  "Toast baguette slices until golden and crisp.",
  "In a bowl, mix tomatoes, garlic, basil, olive oil, salt, and pepper.",
  "Spoon tomato mixture onto toasted bread slices.",
  "Serve immediately before bread softens."
],

  },
  "Fruit Tart": {
description: "A buttery tart shell filled with creamy custard and topped with fresh, glistening fruit — a thankful dessert treat.",
ingredients: [
  "1 pre-made tart shell",
  "1 cup custard (vanilla or pastry cream)",
  "Assorted fresh fruits (strawberries, kiwi, blueberries)",
  "Fruit glaze or apricot jam (warmed)"
],
steps: [
  "Fill tart shell evenly with custard.",
  "Arrange fresh fruits on top in a pretty pattern.",
  "Brush fruits lightly with warmed glaze to add shine and sweetness.",
  "Chill before serving."
],

  },
  "Lentil Soup": {
description: "Hearty, comforting lentil soup with veggies and spices — nourishing and soul-soothing.",
ingredients: [
  "1 cup lentils, rinsed",
  "1 carrot, diced",
  "1 celery stalk, diced",
  "1 small onion, diced",
  "4 cups vegetable broth",
  "Spices (cumin, paprika, salt, pepper)"
],
steps: [
  "Sauté carrot, celery, and onion in a pot until softened.",
  "Add lentils and broth, bring to a boil.",
  "Reduce heat and simmer for 25-30 minutes until lentils are tender.",
  "Season with spices, adjust to taste.",
  "Serve hot."
],

  },
  "Caprese Skewers": {
description: "Mini skewers stacking mozzarella, cherry tomatoes, and fresh basil leaves — fresh bites with balsamic drizzle.",
ingredients: [
  "Cherry tomatoes",
  "Mozzarella balls (bocconcini)",
  "Fresh basil leaves",
  "Balsamic glaze"
],
steps: [
  "Thread a cherry tomato, mozzarella ball, and basil leaf onto small skewers or toothpicks.",
  "Drizzle with balsamic glaze just before serving.",
  "Serve fresh and chilled."
],

  },
  "Chocolate Mousse": {
description: "Light, airy chocolate mousse made with dark chocolate, whipped eggs, and cream — indulgent and grateful dessert.",
ingredients: [
  "100g dark chocolate",
  "3 eggs, separated",
  "2 tbsp sugar",
  "1/2 cup heavy cream"
],
steps: [
  "Melt chocolate gently over a double boiler or in microwave.",
  "Whip egg whites with sugar until stiff peaks form.",
  "Whip cream until soft peaks form.",
  "Fold melted chocolate into egg yolks, then gently fold in egg whites and whipped cream.",
  "Chill mousse for at least 2 hours before serving."
],

  },
};


const RecipePage = () => {
  const { mealName } = useParams();
  const recipe = recipeMap[mealName];

  // Scroll to top smoothly every time mealName changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mealName]);

  if (!recipe) {
    return (
      <div className="recipe-page">
        <h1 style={{ color: '#d32f2f', textAlign: 'center' }}>Recipe not found</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>
          Oops, we couldn’t find a recipe for <strong>"{mealName}"</strong>.
        </p>
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
