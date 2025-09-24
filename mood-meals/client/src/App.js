import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import MealSuggestions from './components/MealSuggestions';
import MealsDashboard from './pages/MealsDashboard';
import RecipePage from './components/RecipePage';
import Friends from './pages/Friends';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MoodTracker from './pages/MoodTracker';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel'; // your admin page
import AddMealPage from "./pages/AddMealPage";
import EditMealPage from "./pages/EditMealPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="suggestions" element={<MealSuggestions />} />
                  <Route path="meals" element={<MealsDashboard />} />
                  <Route path="friends" element={<Friends />} />
                  <Route path="recipes/:mealName" element={<RecipePage />} />
                  <Route path="mood-tracker" element={<MoodTracker />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="/admin/add-meal" element={<AddMealPage />} />
                  <Route path="/admin/edit-meal/:id" element={<EditMealPage />} />

                  {/* Admin-only route */}
                  <Route
                    path="admin"
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    }
                  />
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
