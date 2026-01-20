import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '../redux/slices/authSlice';
import LoadingSpinner from './LoadingSpinner';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirectTo = '/dashboard' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }

  // If user is authenticated, redirect them away from auth pages
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;