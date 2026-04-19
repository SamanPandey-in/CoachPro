import React from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children, role }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand dark:border-brand-light border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (role && profile.role !== role) {
    return <Navigate to={`/${profile.role}/dashboard`} replace />;
  }

  return (
    <div className="flex min-h-screen bg-bg dark:bg-bg-dark">
      <Sidebar role={profile.role} />
      <div className="flex-1 flex flex-col">
        <Header user={profile} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
