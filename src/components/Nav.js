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
import Fade from "@mui/material/Fade";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const Nav = ({ showButton, userData }) => {
  const LogoIco = "/img/logo.webp";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const pointLike = "/img/pontyClaus.webp"

  const { idMenu, socket } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [latestNotification, setLatestNotification] = useState("");

  // Socket listener
  useEffect(() => {
    if (!socket) return;
    

    const handleNotification = (data) => {
      const mensaje = data?.mensaje || "📩 Tienes una nueva notificación";
      const nuevaNoti = {
        id: Date.now(),
        mensaje,
        timestamp: new Date().toLocaleTimeString(),
        read: false,
      };

      setNotifications((prev) => [nuevaNoti, ...prev]);
      setLatestNotification(mensaje);
      setShowToast(true);
    };

    socket.on("solicitud-web-usuario", handleNotification);
    return () => socket.off("solicitud-web-usuario", handleNotification);
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
    setNotifications((prev) =>
      prev.map((noti) => ({ ...noti, read: true }))
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation();
    setNotifications((prev) => prev.filter((noti) => noti.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    handleClose();
  };

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter((noti) => !noti.read).length;

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
                          className={`py-3 px-4 ${!noti.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex w-full">
                            <div className="flex-grow pr-2">
                              <div className="flex items-start justify-between">
                                <div className="font-medium mb-1 text-sm">
                                  {noti.mensaje}
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
                                <span>{noti.timestamp}</span>
                                {!noti.read && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
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

export default Nav;