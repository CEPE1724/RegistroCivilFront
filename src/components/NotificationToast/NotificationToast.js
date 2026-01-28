import React, { useState, useEffect } from "react";
import { useNotificationContext } from "../AuthContext/NotificationContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotificationContext();
  const [displayNotifications, setDisplayNotifications] = useState([]);
  const [exitingIds, setExitingIds] = useState(new Set());

  // Display only the last 3 notifications
  useEffect(() => {
    setDisplayNotifications(notifications.slice(-3));
  }, [notifications]);

  // Auto-dismiss notifications after 9 seconds
  useEffect(() => {
    const timers = displayNotifications.map((notif) => {
      if (!exitingIds.has(notif.id)) {
        return setTimeout(() => {
          handleClose(notif.id);
        }, 9000);
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [displayNotifications, exitingIds]);

  const handleClose = (id) => {
    setExitingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      removeNotification(id);
      setExitingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const getIcon = (type) => {
    const iconProps = "w-6 h-6";
    switch (type) {
      case "success":
        return <CheckCircleIcon className={`${iconProps} text-emerald-500`} />;
      case "error":
        return <ErrorIcon className={`${iconProps} text-red-500`} />;
      case "warning":
        return <WarningIcon className={`${iconProps} text-amber-500`} />;
      case "info":
      default:
        return <InfoIcon className={`${iconProps} text-sky-500`} />;
    }
  };

  const getColorScheme = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50",
          border: "border-l-4 border-emerald-400",
          text: "text-emerald-900",
          accent: "text-emerald-600",
          progress: "bg-emerald-500",
          shadow: "shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-l-4 border-red-400",
          text: "text-red-900",
          accent: "text-red-600",
          progress: "bg-red-500",
          shadow: "shadow-[0_4px_20px_rgba(239,68,68,0.2)]"
        };
      case "warning":
        return {
          bg: "bg-amber-50",
          border: "border-l-4 border-amber-400",
          text: "text-amber-900",
          accent: "text-amber-600",
          progress: "bg-amber-500",
          shadow: "shadow-[0_4px_20px_rgba(217,119,6,0.2)]"
        };
      case "info":
      default:
        return {
          bg: "bg-sky-50",
          border: "border-l-4 border-sky-400",
          text: "text-sky-900",
          accent: "text-sky-600",
          progress: "bg-sky-500",
          shadow: "shadow-[0_4px_20px_rgba(14,165,233,0.2)]"
        };
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(420px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(420px);
            opacity: 0;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .notification-enter {
          animation: slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .notification-exit {
          animation: slideOutRight 0.35s ease-in forwards;
        }

        .progress-bar {
          animation: shrink 5s linear forwards;
        }

        .notification-container:hover .close-btn {
          opacity: 1;
        }
      `}</style>

      <div className="fixed top-24 right-4 z-50 space-y-3 pointer-events-none w-96 max-w-[calc(100vw-2rem)]">
        {displayNotifications.map((notification) => {
          const isExiting = exitingIds.has(notification.id);
          const notificationType = notification.type || "info";
          const colors = getColorScheme(notificationType);

          return (
            <div
              key={notification.id}
              className={`${isExiting ? "notification-exit" : "notification-enter"} pointer-events-auto`}
            >
              <div
                className={`notification-container group relative overflow-hidden rounded-xl backdrop-blur-sm border border-white/80 transition-all duration-300 hover:shadow-2xl
                  ${colors.bg} ${colors.border} ${colors.shadow}
                  flex items-start gap-4 p-5 bg-opacity-95`}
              >
                {/* Icon Container */}
                <div className="flex-shrink-0 mt-0.5 p-2 rounded-full bg-white/60 backdrop-blur-sm">
                  {getIcon(notificationType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-8">
                  <p className={`${colors.text} font-bold text-sm leading-snug break-words`}>
                    {notification.message || "Notificación"}
                  </p>

                  <p className={`${colors.accent} text-xs mt-2 opacity-60 font-medium`}>
                    🕐 {new Date(notification.timestamp).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </p>
                </div>

                {/* Close Button - Floating */}
                <button
                  onClick={() => handleClose(notification.id)}
                  className={`close-btn flex-shrink-0 absolute top-3 right-3 p-1.5 rounded-lg bg-white/40 hover:bg-white/80 transition-all duration-200 opacity-0 group-hover:opacity-100 ${colors.accent}`}
                  aria-label="Cerrar notificación"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>

                {/* Progress Bar */}
                {!isExiting && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/20">
                    <div className={`progress-bar ${colors.progress} h-full`} />
                  </div>
                )}

                {/* Accent Glow */}
                <div className={`absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${colors.bg}`} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationToast;
