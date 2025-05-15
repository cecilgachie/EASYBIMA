// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Default notification settings
const DEFAULT_PREFERENCES = {
  email: true,
  push: true,
  sms: false,
  desktop: true,
  sound: true
};

// Get notifications from storage
export const getNotifications = () => {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
};

// Add a new notification
export const addNotification = (notification) => {
  const notifications = getNotifications();
  const newNotification = {
    id: generateNotificationId(),
    timestamp: new Date().toISOString(),
    read: false,
    ...notification
  };
  
  notifications.unshift(newNotification);
  
  // Keep only last 50 notifications
  const updatedNotifications = notifications.slice(0, 50);
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  
  // Show desktop notification if enabled
  if (getNotificationPreferences().desktop) {
    showDesktopNotification(newNotification);
  }
  
  return newNotification;
};

// Mark notification as read
export const markAsRead = (notificationId) => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, read: true }
      : notification
  );
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
};

// Mark all notifications as read
export const markAllAsRead = () => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    read: true
  }));
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
};

// Delete a notification
export const deleteNotification = (notificationId) => {
  const notifications = getNotifications().filter(
    notification => notification.id !== notificationId
  );
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

// Clear all notifications
export const clearAllNotifications = () => {
  localStorage.setItem('notifications', JSON.stringify([]));
};

// Get notification preferences
export const getNotificationPreferences = () => {
  return JSON.parse(
    localStorage.getItem('notificationPreferences') || 
    JSON.stringify(DEFAULT_PREFERENCES)
  );
};

// Update notification preferences
export const updateNotificationPreferences = (preferences) => {
  localStorage.setItem(
    'notificationPreferences',
    JSON.stringify({ ...getNotificationPreferences(), ...preferences })
  );
};

// Helper function to generate notification ID
const generateNotificationId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Show desktop notification
const showDesktopNotification = (notification) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notifications");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/logo.png' // Add your app logo path here
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        showDesktopNotification(notification);
      }
    });
  }
}; 