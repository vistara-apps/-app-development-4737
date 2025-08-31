import { useNotification } from '../contexts/NotificationContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();
  
  // Only show the 5 most recent notifications as toasts
  const toastNotifications = notifications.slice(0, 5);
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-sm">
      {toastNotifications.map(notification => (
        <Toast 
          key={notification.id} 
          notification={notification} 
          onClose={removeNotification} 
        />
      ))}
    </div>
  );
};

export default ToastContainer;

