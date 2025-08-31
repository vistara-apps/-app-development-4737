import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast notification component
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display
 * @param {string} [props.type='success'] - Type of toast (success, error, info)
 * @param {number} [props.duration=5000] - Duration in milliseconds
 * @param {Function} props.onClose - Function to call when toast is closed
 * @returns {JSX.Element} - Rendered component
 */
const Toast = ({ 
  message, 
  type = 'success', 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} aria-hidden="true" />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={20} aria-hidden="true" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-md transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`flex items-center justify-between p-4 rounded-lg shadow-lg border ${getBgColor()}`}>
        <div className="flex items-center space-x-3">
          {getIcon()}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 rounded-full p-1"
          aria-label="Close notification"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

