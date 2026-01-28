import React, { createContext, useState, useContext, useMemo, useCallback } from "react";

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext debe ser usado dentro de NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((data) => {
    const id = Date.now().toString();
    const notification = {
      id,
      message: typeof data === 'string' ? data : (data.message || "Notificación"),
      type: data.type || "info",
      timestamp: new Date(),
      data: data.data || null,
    };

    setNotifications((prev) => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    // Optional: implement if needed for marking as read
    // This is here for future extensibility
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      markNotificationsAsRead,
    }),
    [notifications, addNotification, removeNotification, clearNotifications, markNotificationsAsRead]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
