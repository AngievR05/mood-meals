-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2025 at 09:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mood_meals`
--

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `status` enum('pending','resolved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `subject`, `message`, `attachments`, `status`, `created_at`) VALUES
(1, 3, 'hi', 'just testing', '[]', 'resolved', '2025-09-30 20:42:28'),
(2, 3, 'test', 'still testing', '[]', 'resolved', '2025-10-06 17:31:08');

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('pending','accepted','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `status`, `created_at`) VALUES
(12, 4, 3, 'accepted', '2025-10-06 20:24:13');

-- --------------------------------------------------------

--
-- Table structure for table `friend_encouragements`
--

CREATE TABLE `friend_encouragements` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friend_encouragements`
--

INSERT INTO `friend_encouragements` (`id`, `sender_id`, `receiver_id`, `message`, `created_at`) VALUES
(1, 3, 2, 'HI', '2025-10-01 21:35:45'),
(2, 4, 3, 'Hii', '2025-10-06 20:24:53');

-- --------------------------------------------------------

--
-- Table structure for table `groceries`
--

CREATE TABLE `groceries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` varchar(50) DEFAULT NULL,
  `purchased` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `mood` enum('Happy','Sad','Angry','Stressed','Bored','Energised','Confused','Grateful') DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `steps` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `name`, `description`, `ingredients`, `mood`, `image_url`, `steps`, `created_at`) VALUES
(1, 'Berry Smoothie', 'A creamy, tangy, and naturally sweet smoothie packed with antioxidants — ideal for kickstarting your happy vibes.', '[\"1 cup frozen mixed berries\",\"1/2 cup Greek yogurt\",\"1 tbsp honey or maple syrup\",\"1/2 cup almond milk (or regular milk)\",\"1/2 banana (optional)\",\"Handful of ice cubes\"]', 'Happy', 'http://localhost:5000/uploads/1759263711882.jpg', '[\"Add berries, yogurt, honey, and milk into a blender.\",\"Optional: Add banana for extra creaminess.\",\"Toss in a few ice cubes.\",\"Blend until smooth and thick.\",\"Pour into a glass and top with a few whole berries or chia seeds.\",\"Serve immediately.\"]', '2025-09-30 20:21:51'),
(2, 'Grilled Cheese', 'A golden, buttery grilled cheese with gooey melted cheddar — pure comfort with a crunch that sparks joy.', '[\"2 slices thick white or sourdough bread\",\"2–3 slices cheddar cheese (or a cheese blend)\",\"1 tbsp butter (softened)\",\"Optional: tomato slices\",\"caramelized onion\"]', 'Happy', 'http://localhost:5000/uploads/1759437712509.jpg', '[\"Spread butter on the outside of both bread slices.\",\"Place cheese between the non-buttered sides of the bread.\",\"Optional: Add extras like tomato or onion inside the sandwich.\",\"Heat a pan over medium heat.\",\"Grill sandwich on both sides until golden brown and cheese is melted.\",\"Slice diagonally and serve hot.\"]', '2025-10-02 20:41:52'),
(3, 'Caprese Salad', 'A simple yet elegant salad that layers happiness in every bite with creamy mozzarella, juicy tomatoes, and fresh basil.', '[\"2 ripe tomatoes sliced\",\"1 ball fresh mozzarella sliced\",\"Fresh basil leaves\",\"Extra virgin olive oil\",\"Salt and black pepper to taste\",\"Balsamic glaze (optional)\"]', 'Happy', 'http://localhost:5000/uploads/1759437858070.jpg', '[\"Arrange alternating slices of tomato and mozzarella on a plate.\",\"Tuck whole basil leaves between slices.\",\"Drizzle generously with olive oil.\",\"Season with salt and pepper.\",\"Optional: Add a swirl of balsamic glaze for extra flavor.\",\"Serve immediately or chill slightly before serving.\"]', '2025-10-02 20:44:18'),
(4, 'Banana Pancakes', 'Soft, fluffy pancakes naturally sweetened with ripe bananas — ideal for joyful mornings or cozy brunches.', '[\"1 ripe banana mashed\",\"1 cup all-purpose flour\",\"1 egg\",\"1/2 cup milk\",\"1 tsp baking powder\",\"1/2 tsp vanilla extract\",\"Butter or oil for cooking\",\"Optional toppings: maple syrup\",\"berries\",\"whipped cream\"]', 'Happy', 'http://localhost:5000/uploads/1759438014562.jpg', '[\"In a bowl, mash the banana until smooth.\",\"Whisk in the egg, milk, and vanilla extract.\",\"Add flour and baking powder, mixing until just combined (don\'t overmix).\",\"Heat a non-stick pan over medium heat and add a little butter or oil.\",\"Pour small rounds of batter and cook until bubbles form on the surface.\",\"Flip and cook the other side until golden brown.\",\"Serve warm with your favorite toppings.\"]', '2025-10-02 20:46:54'),
(5, 'Mango Salsa', 'A tropical sweet-and-spicy salsa that dances on your taste buds — great for happy-hour vibes or taco nights.', '[\"1 ripe mango diced\",\"1/4 red onion finely chopped\",\"1 small jalapeño minced (seeds removed)\",\"Juice of 1 lime\",\"Fresh cilantro chopped\",\"Salt to taste\"]', 'Happy', 'http://localhost:5000/uploads/1759438178304.jpg', '[\"Dice all ingredients into small, even pieces.\",\"In a bowl, combine mango, onion, jalapeño, and cilantro.\",\"Squeeze fresh lime juice over the mixture.\",\"Add salt and mix well.\",\"Refrigerate for 30 minutes for best flavor.\",\"Serve chilled with chips, grilled chicken, or tacos.\"]', '2025-10-02 20:49:38'),
(6, 'Yogurt Parfait', 'A layered beauty of creamy yogurt, crunchy granola, and sweet berries — joy in every spoonful.', '[\"1 cup Greek yogurt (vanilla or plain)\",\"1/2 cup granola\",\"1/2 cup mixed berries\",\"1 tbsp honey or maple syrup\",\"Optional: chia seeds or nuts\"]', 'Happy', 'http://localhost:5000/uploads/1759438305485.jpg', '[\"In a glass or jar, spoon a layer of yogurt.\",\"Add a layer of granola followed by berries.\",\"Repeat layers until the glass is full.\",\"Drizzle honey on top.\",\"Optional: Add chia seeds or crushed nuts for texture.\",\"Serve immediately or chill for later.\"]', '2025-10-02 20:51:45'),
(7, 'Cucumber Sandwiches', 'Delicate, crisp cucumber tea sandwiches that make you feel fancy for no reason — perfect for a light and joyful snack.', '[\"4 slices white bread crusts removed\",\"3 tbsp cream cheese softened\",\"1/2 cucumber thinly sliced\",\"Fresh dill or chives\",\"Salt and pepper\"]', 'Happy', 'http://localhost:5000/uploads/1759438435393.jpg', '[\"Spread cream cheese evenly on all bread slices.\",\"Arrange cucumber slices on two slices of bread.\",\"Sprinkle with salt, pepper, and fresh dill or chives.\",\"Top with the remaining slices, cream cheese side down.\",\"Gently press and cut into quarters or triangles.\",\"Serve chilled.\"]', '2025-10-02 20:53:55'),
(8, 'Lemonade', 'A zesty, refreshing drink that brings instant summer happiness with every icy sip.', '[\"1/2 cup fresh lemon juice (about 2–3 lemons)\",\"1/2 cup sugar\",\"2.5 cups cold water\",\"Ice cubes\",\"Lemon slices and mint for garnish (optional)\"]', 'Happy', 'http://localhost:5000/uploads/1759438548878.jpg', '[\"In a pitcher, combine lemon juice and sugar.\",\"Stir until sugar is fully dissolved (or heat gently to make simple syrup first).\",\"Add cold water and mix well.\",\"Serve over ice and garnish with lemon slices or mint.\",\"Optional: Sparkle it up with soda water for fizz.\"]', '2025-10-02 20:55:48'),
(9, 'Mac & Cheese', 'The ultimate comfort dish. Creamy, cheesy, and baked to golden perfection — this classic warms you up from the inside out.', '[\"2 cups elbow macaroni\",\"2 tbsp butter\",\"2 tbsp all-purpose flour\",\"2 cups milk (whole preferred)\",\"2 cups shredded cheddar cheese\",\"Salt and pepper to taste\",\"Optional: breadcrumbs and extra cheese for topping\"]', 'Sad', 'http://localhost:5000/uploads/1759438691203.jpg', '[\"Boil macaroni in salted water until al dente. Drain and set aside.\",\"In a saucepan, melt butter over medium heat.\",\"Whisk in flour to form a roux. Cook for 1–2 minutes to remove floury taste.\",\"Slowly add milk while whisking to avoid lumps. Simmer until thickened.\",\"Stir in cheddar cheese until melted and smooth.\",\"Mix cheese sauce with cooked macaroni. Transfer to a baking dish.\",\"Optional: Sprinkle breadcrumbs and extra cheese on top.\",\"Bake at 180°C (350°F) for 20 minutes or until bubbly and golden.\"]', '2025-10-02 20:58:11'),
(10, 'Tomato Soup', 'Rich, tangy, and velvety smooth. This tomato soup is like a hug in a mug, perfect for cold nights or rainy moods.', '[\"1 tbsp olive oil\",\"1 onion\",\"chopped\",\"2 garlic cloves\",\"minced\",\"4 cups chopped ripe tomatoes (or 2 cans crushed tomatoes)\",\"2 cups vegetable broth\",\"1/4 cup heavy cream (optional)\",\"Salt\",\"pepper\",\"and sugar to taste\",\"Fresh basil or parsley for garnish\"]', 'Sad', 'http://localhost:5000/uploads/1759438845908.jpg', '[\"Heat olive oil in a pot and sauté onion until soft.\",\"Add garlic and cook for another 1–2 minutes.\",\"Stir in tomatoes and broth. Bring to a boil, then lower heat and simmer for 20 minutes.\",\"Use an immersion blender (or regular blender) to purée until smooth.\",\"Season with salt, pepper, and a pinch of sugar if too acidic.\",\"Optional: Stir in cream for a richer finish.\",\"Garnish with fresh herbs and serve hot, ideally with grilled cheese.\"]', '2025-10-02 21:00:45'),
(12, 'Chamomile Tea', 'Classic calming chamomile tea — perfect to slow your brain down when boredom is creeping in.', '[\"1-2 tsp dried chamomile flowers (or 1 chamomile tea bag)\",\"250 ml hot water (just off boiling)\",\"Honey or agave syrup (optional\",\"for a touch of sweetness)\"]', 'Stressed', 'http://localhost:5000/uploads/meals/1759760059196.jpg', '[\"Heat water until just boiling (around 95°C).\",\"Place chamomile flowers or tea bag in your cup or teapot.\",\"Pour hot water over and cover to keep the heat in.\",\"Steep for 5 minutes — patience is key.\",\"Strain out flowers or remove tea bag.\",\"Add honey or sweetener if you want a mild sweet note.\",\"Sip slowly, let the floral notes calm your restless mind.\"]', '2025-10-06 14:14:19');

-- --------------------------------------------------------

--
-- Table structure for table `moods`
--

CREATE TABLE `moods` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood` enum('Happy','Sad','Angry','Stressed','Bored','Energised','Confused','Grateful') NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `moods`
--

INSERT INTO `moods` (`id`, `user_id`, `mood`, `note`, `created_at`) VALUES
(1, 3, 'Happy', 'good day', '2025-09-30 19:00:09'),
(2, 3, 'Confused', 'weird errors', '2025-10-01 20:58:46'),
(3, 3, 'Happy', 'working code', '2025-10-02 19:12:21'),
(4, 3, 'Grateful', 'fun project', '2025-10-03 15:30:03'),
(5, 3, 'Stressed', 'a little anxiety', '2025-10-06 13:23:45'),
(6, 4, 'Confused', 'whats going on', '2025-10-06 20:22:42');

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `id` int(11) NOT NULL,
  `mood` enum('Happy','Sad','Angry','Stressed','Bored','Energised','Confused','Grateful') DEFAULT NULL,
  `meal_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_picture` varchar(500) DEFAULT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `dietary_prefs` varchar(255) DEFAULT NULL,
  `mood_goal` enum('Happy','Sad','Angry','Stressed','Bored','Energised','Confused','Grateful') DEFAULT NULL,
  `last_seen` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `profile_picture`, `tagline`, `dietary_prefs`, `mood_goal`, `last_seen`) VALUES
(1, 'testuser', 'test@example.com', '$2a$10$somethinghashedhere', 'user', '2025-09-30 18:50:23', NULL, NULL, NULL, NULL, NULL),
(2, 'Angie', '241077@virtualwindow.co.za', '$2b$10$ZJmd2XL3XVs13F9Nnni5H.0tgfTaoX2KK/mZiO3bZXlguFxMz6H5.', 'user', '2025-09-30 18:50:23', NULL, NULL, NULL, NULL, NULL),
(3, 'AngievR0', 'vanrooyenangie719@gmail.com', '$2b$10$QbkUHRpH7h6OH.T84arS0./ppgXwri5Zu1TxviTzRYT.VFgnAIvS.', 'admin', '2025-09-30 18:51:37', 'Grateful', NULL, NULL, NULL, NULL),
(4, 'Sammy', 'sammy@gmail.com', '$2b$10$2P3Fz3Zj2Xb6P/NuntR8GOXiIWAO3lhfGYK2vjifU2jomzn4ec2KS', 'user', '2025-10-06 20:22:22', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_badges`
--

CREATE TABLE `user_badges` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `badge_name` varchar(100) NOT NULL,
  `earned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_meals`
--

CREATE TABLE `user_meals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL,
  `saved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_meals`
--

INSERT INTO `user_meals` (`id`, `user_id`, `meal_id`, `saved`, `created_at`) VALUES
(6, 3, 1, 1, '2025-10-02 20:14:26'),
(7, 3, 9, 1, '2025-10-02 21:03:00'),
(8, 3, 10, 1, '2025-10-06 14:48:55');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notifications_enabled` tinyint(1) DEFAULT 1,
  `reminder_time` time DEFAULT NULL,
  `privacy` enum('public','private','friends') DEFAULT 'private'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_feedback_user` (`user_id`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_friendship` (`user_id`,`friend_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `friend_encouragements`
--
ALTER TABLE `friend_encouragements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `groceries`
--
ALTER TABLE `groceries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_meals_mood` (`mood`);

--
-- Indexes for table `moods`
--
ALTER TABLE `moods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_moods_user_created` (`user_id`,`created_at`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meal_id` (`meal_id`),
  ADD KEY `idx_recommendations_mood` (`mood`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_meals`
--
ALTER TABLE `user_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `meal_id` (`meal_id`),
  ADD KEY `idx_user_meals_user_created` (`user_id`,`created_at`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `friend_encouragements`
--
ALTER TABLE `friend_encouragements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `groceries`
--
ALTER TABLE `groceries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `moods`
--
ALTER TABLE `moods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_badges`
--
ALTER TABLE `user_badges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_meals`
--
ALTER TABLE `user_meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `friend_encouragements`
--
ALTER TABLE `friend_encouragements`
  ADD CONSTRAINT `friend_encouragements_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friend_encouragements_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `groceries`
--
ALTER TABLE `groceries`
  ADD CONSTRAINT `groceries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `moods`
--
ALTER TABLE `moods`
  ADD CONSTRAINT `moods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD CONSTRAINT `user_badges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_meals`
--
ALTER TABLE `user_meals`
  ADD CONSTRAINT `user_meals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_meals_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
