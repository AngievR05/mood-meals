import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const tokenValid = isTokenValid();
  if (!tokenValid) {
    localStorage.removeItem('token');  // clear invalid token
    localStorage.removeItem('role');   // clear stored role
    return <Navigate to="/" replace />; // redirect to login
  }
  return children;
};

export default ProtectedRoute;
