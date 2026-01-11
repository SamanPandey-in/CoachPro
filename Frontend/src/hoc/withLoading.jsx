import React from 'react';

/**
 * HOC to add loading state to component
 * @param {Component} Component - Component to wrap
 */
export const withLoading = (Component) => {
  return function LoadingWrapper({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
