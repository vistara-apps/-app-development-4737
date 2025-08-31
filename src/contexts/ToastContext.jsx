import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

/**
 * Custom hook to use the toast context
 * @returns {Object} Toast context methods
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Provider component for toast notifications
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - Rendered component
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, info)
   * @param {number} duration - Duration in milliseconds
   */
  const addToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
  }, []);

  /**
   * Remove a toast notification by ID
   * @param {string} id - Toast ID to remove
   */
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message, duration) => {
    addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    addToast(message, 'error', duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    addToast(message, 'info', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;

