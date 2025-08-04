import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import MealSuggestions from './components/MealSuggestions';
import RecipePage from './components/RecipePage';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import MoodTracker from './pages/MoodTracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="suggestions" element={<MealSuggestions />} />
                  <Route path="recipes/:mealName" element={<RecipePage />} />
                  <Route path="mood-tracker" element={<MoodTracker />} />

                </Routes>
                <Footer />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
