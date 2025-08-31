import React from 'react';

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4'
};

/**
 * LoadingSpinner component for indicating loading states
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Size of the spinner (sm, md, lg)
 * @param {string} [props.color='accent'] - Color of the spinner (accent, primary, white)
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.label] - Accessible label for screen readers
 * @returns {JSX.Element} - Rendered component
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'accent', 
  className = '',
  label = 'Loading...'
}) => {
  const sizeClasses = sizes[size] || sizes.md;
  
  const colorClasses = {
    accent: 'border-accent/30 border-t-accent',
    primary: 'border-primary/30 border-t-primary',
    white: 'border-white/30 border-t-white'
  };
  
  const colorClass = colorClasses[color] || colorClasses.accent;
  
  return (
    <div className={`flex items-center justify-center ${className}`} role="status">
      <div
        className={`${sizeClasses} ${colorClass} rounded-full animate-spin`}
        aria-hidden="true"
      ></div>
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;

