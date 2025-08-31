import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { NOTIFICATION_TYPES } from '../contexts/NotificationContext';

const Toast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  // Set up the auto-close timer and progress bar
  useEffect(() => {
    if (notification.autoClose) {
      const duration = 5000; // 5 seconds
      const interval = 10; // Update progress every 10ms
      const step = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - step;
        });
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [notification.autoClose]);
  
  // Handle close animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Animation duration
  };
  
  // Get icon and styles based on notification type
  const getTypeStyles = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-200',
          borderColor: 'border-green-200 dark:border-green-800',
          progressColor: 'bg-green-500',
        };
      case NOTIFICATION_TYPES.ERROR:
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-200',
          borderColor: 'border-red-200 dark:border-red-800',
          progressColor: 'bg-red-500',
        };
      case NOTIFICATION_TYPES.WARNING:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          progressColor: 'bg-yellow-500',
        };
      case NOTIFICATION_TYPES.INFO:
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-200',
          borderColor: 'border-blue-200 dark:border-blue-800',
          progressColor: 'bg-blue-500',
        };
    }
  };
  
  const { icon: Icon, bgColor, textColor, borderColor, progressColor } = getTypeStyles();
  
  return (
    <div 
      className={`max-w-sm w-full ${bgColor} ${borderColor} border rounded-lg shadow-lg mb-3 overflow-hidden transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="p-4 relative">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`${textColor} w-5 h-5`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`${textColor} text-sm font-medium`}>
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex ${textColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent`}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {notification.autoClose && (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full ${progressColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;

