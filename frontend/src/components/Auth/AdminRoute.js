import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, currentUser, loading } = useAuth();

  // If still loading auth state, show a loading spinner
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not authenticated or not admin, redirect to home
  return isAuthenticated && currentUser?.role === 'ADMIN' ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoute;