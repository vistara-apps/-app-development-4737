import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, X, Check } from 'lucide-react';
import { useNotification, NOTIFICATION_TYPES } from '../contexts/NotificationContext';
import { format } from 'date-fns';

const NotificationCenter = () => {
  const { 
    notifications, 
    removeNotification, 
    markAsRead, 
    markAllAsRead, 
    clearAll, 
    getUnreadCount 
  } = useNotification();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircle className="text-green-500" size={16} />;
      case NOTIFICATION_TYPES.ERROR:
        return <AlertCircle className="text-red-500" size={16} />;
      case NOTIFICATION_TYPES.WARNING:
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case NOTIFICATION_TYPES.INFO:
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };
  
  // Format notification timestamp
  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };
  
  const unreadCount = getUnreadCount();
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        className="p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary dark:text-primary-dark">Notifications</h3>
            <div className="flex space-x-2">
              <button
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
              <button
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
                onClick={clearAll}
              >
                Clear all
              </button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      notification.read ? 'opacity-70' : 'bg-blue-50/30 dark:bg-blue-900/10'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium break-words">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex ml-2">
                        {!notification.read && (
                          <button
                            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          className="ml-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                          onClick={() => removeNotification(notification.id)}
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

