import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error("Lỗi parse user trong ProtectedRoute:", e);
      localStorage.removeItem("user");
    }
  }

  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; 
};

export default ProtectedRoute;
