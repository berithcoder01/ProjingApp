import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20",
    ghost: "bg-transparent text-muted border-2 border-border hover:text-white hover:border-accent",
    success: "bg-success text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20",
    danger: "bg-danger text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
