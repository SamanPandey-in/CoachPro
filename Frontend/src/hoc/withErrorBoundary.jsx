import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * HOC to wrap component with error boundary
 * @param {Component} Component - Component to wrap
 * @param {Component} FallbackComponent - Fallback UI component
 */
export const withErrorBoundary = (Component, FallbackComponent) => {
  return function ErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};
