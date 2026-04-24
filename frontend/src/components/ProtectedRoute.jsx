import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, user } = useAuthStore();

  // Check if user is authenticated
  if (!isLoggedIn || !authService.isAuthenticated()) {
    // Redirect to login page with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optionally check user role for specific routes
  // This can be expanded based on route requirements
  if (!user) {
    // Try to get user info from token
    const userInfo = authService.getUserFromToken();
    if (!userInfo) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
