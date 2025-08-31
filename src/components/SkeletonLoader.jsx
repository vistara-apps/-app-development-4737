import React from 'react';

/**
 * SkeletonLoader component for displaying loading placeholders
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='rectangle'] - Type of skeleton (rectangle, circle, text, card, influencer)
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.count=1] - Number of skeleton items to display
 * @param {boolean} [props.animate=true] - Whether to animate the skeleton
 * @returns {JSX.Element} - Rendered component
 */
const SkeletonLoader = ({ 
  type = 'rectangle', 
  className = '', 
  count = 1,
  animate = true
}) => {
  const baseClasses = `bg-gray-200 ${animate ? 'animate-pulse' : ''} rounded`;
  
  const getSkeletonByType = () => {
    switch (type) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full w-12 h-12 ${className}`} aria-hidden="true" />;
      
      case 'text':
        return <div className={`${baseClasses} h-4 w-full max-w-[200px] ${className}`} aria-hidden="true" />;
      
      case 'card':
        return (
          <div className={`${baseClasses} p-6 rounded-lg ${className}`} aria-hidden="true">
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-gray-300 h-12 w-12"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        );
      
      case 'influencer':
        return (
          <div className={`${baseClasses} p-6 rounded-lg shadow ${className}`} aria-hidden="true">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-300 rounded flex-1"></div>
              <div className="h-8 bg-gray-300 rounded flex-1"></div>
            </div>
          </div>
        );
      
      case 'rectangle':
      default:
        return <div className={`${baseClasses} h-6 w-full ${className}`} aria-hidden="true" />;
    }
  };

  // If count is 1, just return the single skeleton
  if (count === 1) {
    return getSkeletonByType();
  }

  // Otherwise, return multiple skeletons
  return (
    <div className="space-y-3" role="status" aria-label="Loading...">
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {getSkeletonByType()}
        </React.Fragment>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonLoader;

