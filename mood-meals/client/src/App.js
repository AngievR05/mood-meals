import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingFeedbackButton from './components/FloatingFeedbackButton';

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
import AdminPanel from './pages/AdminPanel';
import AddMealPage from "./pages/AddMealPage";
import EditMealPage from "./pages/EditMealPage";
import Recipes from "./pages/Recipes";
import SavedMealsPage from "./pages/SavedMealsPage";
import FeedbackPage from "./pages/FeedbackPage";

function App() {
  return (
    <Router>
      {/* Floating feedback button available on all pages */}
      <FloatingFeedbackButton />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Navbar /><Home /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/suggestions" element={
          <ProtectedRoute>
            <Navbar /><MealSuggestions /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/meals" element={
          <ProtectedRoute>
            <Navbar /><MealsDashboard /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/friends" element={
          <ProtectedRoute>
            <Navbar /><Friends /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <Navbar /><Recipes /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/recipes/:mealId" element={
          <ProtectedRoute>
            <Navbar /><RecipePage /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/mood-tracker" element={
          <ProtectedRoute>
            <Navbar /><MoodTracker /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar /><Profile /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/saved-meals" element={
          <ProtectedRoute>
            <Navbar /><SavedMealsPage /><Footer />
          </ProtectedRoute>
        } />
        {/* Feedback Page */}
        <Route path="/feedback" element={
          <ProtectedRoute>
            <Navbar /><FeedbackPage /><Footer />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <Navbar /><AdminPanel /><Footer />
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/admin/add-meal" element={
          <ProtectedRoute>
            <AdminRoute>
              <Navbar /><AddMealPage /><Footer />
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-meal/:id" element={
          <ProtectedRoute>
            <AdminRoute>
              <Navbar /><EditMealPage /><Footer />
            </AdminRoute>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
