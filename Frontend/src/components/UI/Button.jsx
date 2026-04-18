import React from 'react';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark focus:ring-brand',
  secondary: 'text-text-muted dark:text-text-muted-dark hover:bg-border dark:hover:bg-border-dark focus:ring-border',
  outline: 'border border-brand text-brand hover:bg-brand-muted dark:hover:bg-brand-muted-dark focus:ring-brand',
  ghost: 'text-text-muted dark:text-text-muted-dark hover:bg-border dark:hover:bg-border-dark focus:ring-border',
  danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex items-center gap-2 font-medium rounded-btn
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors duration-150
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

export default Button;
