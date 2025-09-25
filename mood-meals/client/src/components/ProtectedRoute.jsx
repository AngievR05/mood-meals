import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const tokenValid = isTokenValid();
  console.log('ProtectedRoute: tokenValid =', tokenValid); // <-- add this

  if (!tokenValid) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/" replace />; // redirect to login
  }
  return children;
};

export default ProtectedRoute;
