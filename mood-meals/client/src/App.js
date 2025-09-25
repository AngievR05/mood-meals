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

// Wrapper for protected pages with Navbar, Footer, and FloatingFeedbackButton
const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <FloatingFeedbackButton />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - no navbar/footer/feedback */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout><Home /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/suggestions" element={
          <ProtectedRoute>
            <Layout><MealSuggestions /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/meals" element={
          <ProtectedRoute>
            <Layout><MealsDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/friends" element={
          <ProtectedRoute>
            <Layout><Friends /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <Layout><Recipes /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/recipes/:mealId" element={
          <ProtectedRoute>
            <Layout><RecipePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/mood-tracker" element={
          <ProtectedRoute>
            <Layout><MoodTracker /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/saved-meals" element={
          <ProtectedRoute>
            <Layout><SavedMealsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <Layout><FeedbackPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <Layout><AdminPanel /></Layout>
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/admin/add-meal" element={
          <ProtectedRoute>
            <AdminRoute>
              <Layout><AddMealPage /></Layout>
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-meal/:id" element={
          <ProtectedRoute>
            <AdminRoute>
              <Layout><EditMealPage /></Layout>
            </AdminRoute>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
