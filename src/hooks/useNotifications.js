import { useAuth } from "../components/AuthContext/AuthContext";
import { useMemo } from "react";

/**
 * Hook customizado para acceder SOLO a las notificaciones
 * Sin re-renderizar cuando cambia otros valores del contexto de auth
 */
export const useNotifications = () => {
  const {
    notifications,
    latestNotification,
    addNotification,
    markNotificationsAsRead,
    removeNotification,
    clearNotifications,
  } = useAuth();



  // Memoizar el objeto de notificaciones para evitar re-renders innecesarios
  return useMemo(() => {

    return {
    notifications,
    latestNotification,
    addNotification,
    markNotificationsAsRead,
    removeNotification,
    clearNotifications,
  };
  }, [
    notifications,
    latestNotification,
    addNotification,
    markNotificationsAsRead,
    removeNotification,
    clearNotifications,
  ]);
};
