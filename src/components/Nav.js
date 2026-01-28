import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SwipeableTemporaryDrawer } from "../components/SidebarMenu";
import DropDown from "./DropDows";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../components/AuthContext/AuthContext";
import { useNotificationContext } from "../components/AuthContext/NotificationContext";
import Fade from "@mui/material/Fade";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const Nav = ({ showButton }) => {
  const LogoIco = "/img/logo.webp";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const pointLike = "/img/ponty.png"

  console.log('🔄 Nav.js RE-RENDER');

  const { socket, userData } = useAuth();
  console.log('🔐 useAuth llamado - userData:', userData?.Nombre || 'N/A');
  
  const { notifications, latestNotification, addNotification, markNotificationsAsRead, clearNotifications } = useNotificationContext();
  console.log('📢 useNotificationContext llamado - notificaciones:', notifications.length);

  const [showToast, setShowToast] = useState(false);

  // Socket listener
useEffect(() => {
  console.log('🪝 useEffect [socket] ejecutado');
  
  if (!socket) {
    console.warn('⚠️ Socket no disponible en Nav');
    return;
  }

  console.log('📡 Registrando listeners en Nav - Socket conectado:', socket.connected);

  // 🆕 Listener para notificaciones de pagos
  const handleNotificationPago = (data) => {
    const { tipo = 'info', mensaje = '📩 Tienes una nueva notificación', solicitudId } = data;
    
    console.log('💰 Notificación de pago recibida:', data);

    // Emoji según el tipo
    const emoji = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[tipo] || '💰';

    addNotification({
      message: `${emoji} ${mensaje}`,
      type: tipo,
      data: solicitudId,
    });
    
    setShowToast(true);
  };

  // ✅ Listener existente (solicitud-web-usuario)
  const handleNotification = (data) => {
    const mensaje = data?.mensaje || "📩 Tienes una nueva notificación";
    
    console.log('📬 Notificación de solicitud recibida:', data);

    addNotification({
      message: mensaje,
      type: 'info',
    });
    
    setShowToast(true);
  };

  // Verificar si los listeners ya están registrados
  const isAlreadyListening = socket.hasListeners("solicitud-web-usuario");
  
  if (!isAlreadyListening) {
    // Registrar los listeners SOLO si no existen
    socket.on("solicitud-web-usuario", handleNotification);
    socket.on("nueva-notificacion-pago", handleNotificationPago);
    console.log('✅ Listeners registrados en Nav (primera vez)');
  } else {
    console.log('⚠️ Listeners ya estaban registrados en Nav');
  }

  // Cleanup: NO remover listeners para mantenerlos activos entre cambios de ruta
  return () => {
    console.log('🧹 Component Nav desmontado, pero listeners permanecen activos');
  };
}, [socket]);


  // Ocultar toast automáticamente
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Marcar todas las notificaciones como leídas
    markNotificationsAsRead();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation();
    // removeNotification(id); // Usar función del contexto si existe
  };

  const handleClearAll = () => {
    clearNotifications();
    handleClose();
  };

  // Contar notificaciones no leídas
  const unreadCount = 0; // Las nuevas notificaciones no tienen sistema de "leído"

  return (
    <>
      <nav className="lg:px-12 w-full h-20 bg-morado px-4 py-3 text-white flex items-center justify-between static">
        <div className="flex items-center">
          {userData && (
            <SwipeableTemporaryDrawer
              userDataToken={userData}
              className="flex-shrink-0 w-full md:w-auto"
            />
          )}
          <Link to="/dashboard" className="ml-4">
            <img
              className="w-24 lg:w-36 cursor-pointer"
              src={LogoIco}
              alt="Logo Point"
            />
          </Link>
        </div>

			  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-6 pointer-events-none overflow-hidden w-[600px]">

				  {/* Imagen fija */}
				  <img
					  src={pointLike}
					  alt="Point Like"
					  className="w-16 h-16 object-contain flex-shrink-0"
					  style={{
						  filter: "drop-shadow(20px 0px 12px rgba(0,0,0,0.6))"
					  }}
				  />

				  {/* Texto */}
				  <div className="marquee-container">
					  <div className="marquee-text">
						  <span className="text-white font-bold text-4xl colorCycle">
							  ¡Buenas noticias! IPHONE ahora disponible a crédito directo. 📲
						  </span>
					  </div>
				  </div>
			  </div>


        {showButton && (
          <div className="flex space-x-6 items-center justify-end flex-shrink-0">
            <span className="ml-4 truncate max-w-xs">{userData?.Nombre || "Usuario"}</span>

            <DropDown />

            {/* Notificaciones */}
            <div>
              <IconButton
                onClick={handleClick}
                className="transition-transform duration-200 hover:scale-110"
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.7rem",
                      height: 18,
                      minWidth: 18,
                      top: 4,
                      right: 4,
                    },
                  }}
                >
                  <NotificationsIcon sx={{ color: "white" }} />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    width: 350,
                    maxHeight: 400,
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    overflow: 'hidden'
                  }
                }}
                TransitionComponent={Fade}
              >
                <div className="bg-morado text-white py-3 px-4 flex justify-between items-center">
                  <Typography variant="subtitle1" fontWeight="medium">
                    Notificaciones ({notifications.length})
                  </Typography>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-white/80 hover:text-white hover:underline transition-colors"
                    >
                      Borrar todas
                    </button>
                  )}
                </div>
                <Divider />

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 px-4 text-center text-gray-500">
                      <div className="text-4xl mb-2">🔕</div>
                      <Typography variant="body2">
                        No tienes notificaciones pendientes
                      </Typography>
                    </div>
                  ) : (
                    notifications.map((noti, index) => (
                      <React.Fragment key={noti.id}>
                        <MenuItem
                          className={`py-3 px-4`}
                        >
                          <div className="flex w-full">
                            <div className="flex-grow pr-2">
                              <div className="flex items-start justify-between">
                                <div className="font-medium mb-1 text-sm">
                                  {noti.message}
                                </div>
                                <IconButton
                                  size="small"
                                  className="ml-2 -mt-1 -mr-1"
                                  onClick={(e) => handleDelete(noti.id, e)}
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <span>{new Date(noti.timestamp).toLocaleTimeString("es-ES")}</span>
                              </div>
                            </div>
                          </div>
                        </MenuItem>
                        {index < notifications.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </Menu>
            </div>
          </div>
        )}
      </nav>

      {/* Toast flotante mejorado */}
      {showToast && (
        <div
          className="fixed bottom-4 right-4 bg-white text-gray-800 shadow-xl rounded-xl border-l-4 border-blue-500
                   flex items-center space-x-3 z-50 overflow-hidden transition-all duration-300 
                   animate-slide-in-right max-w-md"
        >
          <div className="py-4 px-5 flex items-center space-x-3">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
              <NotificationsIcon sx={{ color: "#3b82f6", fontSize: "1.5rem" }} />
            </div>
            <div className="flex-1 pr-8">
              <div className="font-medium text-sm">Nueva notificación</div>
              <div className="text-sm text-gray-600 mt-1">{latestNotification}</div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className="h-1 w-full bg-gray-100 absolute bottom-0 left-0">
            <div
              className="h-full bg-blue-500 animate-shrink"
              style={{
                animation: 'shrink 5s linear forwards',
              }}
            />
          </div>
        </div>
      )}


      {/* Estilos CSS adicionales agregados internamente */}
		  <style>
			  {`
    /* Contenedor que oculta el exceso */
  .marquee-container {
    position: relative;
    width: 400px;
    overflow: hidden;
    white-space: nowrap;
  }

  /* Animación */
  @keyframes marqueeSlide {
    0% { transform: translateX(15%); }
    100% { transform: translateX(-100%); }
  }

  /* Texto que se mueve */
  .marquee-text {
    display: inline-block;
    animation: marqueeSlide 20s linear infinite;
  }


  .colorCycle {
  animation: cycleColor 6s linear infinite;
}

@keyframes cycleColor {
  0% { color: #ffffff; }
  30% { color: #FF9F45; }
  60% { color: #9DB4FF; }
  100% { color: #ffffff; }
}

.bounce {
  animation: bounceLoop 1s ease-in-out infinite;
}

@keyframes bounceLoop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
  `}
		  </style>


    </>
  );
};

// ✅ Memoizar Nav para evitar re-renders si las props no cambian
export default React.memo(Nav);

