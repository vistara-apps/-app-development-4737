import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'accent', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    accent: 'border-accent/30 border-t-accent',
    primary: 'border-primary/30 border-t-primary',
    white: 'border-white/30 border-t-white'
  };

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;

