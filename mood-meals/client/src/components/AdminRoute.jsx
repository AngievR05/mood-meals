// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role') || 'user';

  if (role !== 'admin') {
    // Redirect non-admin users to home (or any other page)
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
