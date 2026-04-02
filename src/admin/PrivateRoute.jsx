import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple guard: checks sessionStorage for admin session
export default function PrivateRoute({ children }) {
  const isAdmin = sessionStorage.getItem('syngular_admin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
