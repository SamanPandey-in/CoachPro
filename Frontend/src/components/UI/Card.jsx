import React from 'react';

const Card = ({ children, className = '', hover = false }) => (
  <div
    className={`
      bg-surface dark:bg-surface-dark
      border border-border dark:border-border-dark
      rounded-card shadow-card
      p-6
      ${hover ? 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

export default Card;
