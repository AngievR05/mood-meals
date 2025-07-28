import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import MealSuggestions from './components/MealSuggestions';
import RecipePage from './components/RecipePage'; 
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suggestions" element={<MealSuggestions />} />
        <Route path="/recipes/:mealName" element={<RecipePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
