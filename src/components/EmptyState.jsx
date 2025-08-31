import React from 'react';
import { Target, Users, BarChart3, Search, AlertCircle } from 'lucide-react';

/**
 * EmptyState component for displaying when no data is available
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='default'] - Type of empty state (default, campaigns, influencers, analytics, search)
 * @param {string} [props.title] - Custom title
 * @param {string} [props.message] - Custom message
 * @param {React.ReactNode} [props.action] - Action button or component
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const EmptyState = ({ 
  type = 'default', 
  title, 
  message, 
  action,
  className = '' 
}) => {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'campaigns':
        return {
          icon: <Target size={48} className="text-gray-400 dark:text-gray-500" />,
          title: 'No campaigns yet',
          message: 'Create your first campaign to start connecting with influencers.'
        };
      case 'influencers':
        return {
          icon: <Users size={48} className="text-gray-400 dark:text-gray-500" />,
          title: 'No influencers found',
          message: 'Try adjusting your filters or search criteria.'
        };
      case 'analytics':
        return {
          icon: <BarChart3 size={48} className="text-gray-400 dark:text-gray-500" />,
          title: 'No data available',
          message: 'Start a campaign to see performance analytics.'
        };
      case 'search':
        return {
          icon: <Search size={48} className="text-gray-400 dark:text-gray-500" />,
          title: 'No results found',
          message: 'Try different search terms or filters.'
        };
      case 'error':
        return {
          icon: <AlertCircle size={48} className="text-red-400" />,
          title: 'Something went wrong',
          message: 'Please try again or contact support if the problem persists.'
        };
      default:
        return {
          icon: <AlertCircle size={48} className="text-gray-400 dark:text-gray-500" />,
          title: 'No data available',
          message: 'There is no data to display at this time.'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;
  const displayIcon = defaultContent.icon;

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="inline-block mb-4">
        {displayIcon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{displayTitle}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {displayMessage}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

