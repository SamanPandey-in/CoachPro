import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  actionLabel,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-500" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-center max-w-md mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <button
          onClick={action}
          className="bg-gold text-dark px-6 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
