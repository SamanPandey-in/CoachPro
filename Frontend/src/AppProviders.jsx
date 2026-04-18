import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/UI/ErrorBoundary';

/**
 * Main App Providers Wrapper
 * Centralizes all context providers for the application
 */
const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default AppProviders;
