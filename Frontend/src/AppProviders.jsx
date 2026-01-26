import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DataProvider } from './contexts/DataContext';
import ErrorBoundary from './components/UI/ErrorBoundary';

/**
 * Main App Providers Wrapper
 * Centralizes all context providers for the application
 */
const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DataProvider>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppProviders;
