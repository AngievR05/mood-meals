import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    return <Navigate to="/" replace />; // redirect if no valid token
  }
  return children;
};

export default ProtectedRoute;
