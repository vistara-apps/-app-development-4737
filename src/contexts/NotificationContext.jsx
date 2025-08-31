import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the notification context
const NotificationContext = createContext();

// Types of notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Add a new notification
  const addNotification = (type, message, autoClose = true, duration = 5000) => {
    const id = uuidv4();
    const newNotification = {
      id,
      type,
      message,
      timestamp: new Date(),
      read: false,
      autoClose,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-close the notification after the specified duration
    if (autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };
  
  // Get unread notifications count
  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };
  
  // Convenience methods for different notification types
  const success = (message, autoClose = true, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.SUCCESS, message, autoClose, duration);
  };
  
  const error = (message, autoClose = true, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.ERROR, message, autoClose, duration);
  };
  
  const warning = (message, autoClose = true, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.WARNING, message, autoClose, duration);
  };
  
  const info = (message, autoClose = true, duration = 5000) => {
    return addNotification(NOTIFICATION_TYPES.INFO, message, autoClose, duration);
  };
  
  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        getUnreadCount,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

