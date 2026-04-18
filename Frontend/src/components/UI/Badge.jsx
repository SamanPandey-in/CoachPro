import React from 'react';

const variants = {
  brand: 'bg-brand-muted text-brand dark:bg-brand-muted-dark dark:text-brand-light',
  primary: 'bg-brand-muted text-brand dark:bg-brand-muted-dark dark:text-brand-light',
  gold: 'bg-brand-muted text-brand dark:bg-brand-muted-dark dark:text-brand-light',
  default: 'bg-border text-text-muted dark:bg-border-dark dark:text-text-muted-dark',
  purple: 'bg-brand-muted text-brand dark:bg-brand-muted-dark dark:text-brand-light',
  success: 'bg-green-100 text-success dark:bg-green-900/30 dark:text-success-dark',
  warning: 'bg-amber-100 text-warning dark:bg-amber-900/30 dark:text-warning-dark',
  danger: 'bg-red-100 text-danger dark:bg-red-900/30 dark:text-danger-dark',
  neutral: 'bg-border text-text-muted dark:bg-border-dark dark:text-text-muted-dark',
};

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span
    className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]}
      ${className}
    `}
  >
    {children}
  </span>
);

export default Badge;
