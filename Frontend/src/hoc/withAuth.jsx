import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Higher-Order Component for route protection
 * @param {Component} Component - Component to wrap
 * @param {Array} allowedRoles - Allowed user roles
 */
export const withAuth = (Component, allowedRoles = []) => {
  return function ProtectedRoute(props) {
    const { user, profile, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand dark:border-brand-light border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
};
