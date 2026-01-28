import React, { createContext, useState, useCallback, useMemo, useContext } from "react";

// Crear contexto de notificaciones
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [latestNotification, setLatestNotification] = useState("");

  // 🔔 Función para agregar notificación globalmente
  const addNotification = useCallback((notificationData) => {
    const notification = {
      id: Date.now(),
      ...notificationData,
      timestamp: notificationData.timestamp || new Date().toLocaleTimeString(),
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);
    setLatestNotification(notificationData.mensaje || "");
    return notification.id;
  }, []);

  // 🔔 Función para marcar notificaciones como leídas
  const markNotificationsAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((noti) => ({ ...noti, read: true }))
    );
  }, []);

  // 🔔 Función para remover notificación
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((noti) => noti.id !== id));
  }, []);

  // 🔔 Función para limpiar todas las notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // 🔒 Memoizar el value para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    notifications,
    latestNotification,
    addNotification,
    markNotificationsAsRead,
    removeNotification,
    clearNotifications,
  }), [
    notifications,
    latestNotification,
    addNotification,
    markNotificationsAsRead,
    removeNotification,
    clearNotifications,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook para acceder al contexto de notificaciones
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext debe usarse dentro de NotificationProvider');
  }
  return context;
};
