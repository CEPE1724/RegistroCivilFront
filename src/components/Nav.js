import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SwipeableTemporaryDrawer } from "../components/SidebarMenu";
import DropDown from "./DropDows";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import CloseIcon from "@mui/icons-material/Close";

const Nav = ({ showButton, userData }) => {
  const LogoIco = "/img/logo.webp";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);



   // Notificaciones
  const [notificationCount, setNotificationCount] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const [latestNotification, setLatestNotification] = useState("tienes una nueva solicitud que te llego");
  
  // Puede venir de props o estado dinámico
  React.useEffect(() => {
    if (notificationCount > 0) {
      setShowToast(true);
  
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [notificationCount]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null)

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

      {showButton && (
        <div className="flex space-x-6 items-center justify-end flex-shrink-0">
          <span className="ml-4 truncate max-w-xs">{userData.Nombre}</span>


          <DropDown />


          {/* Notificaciones */}
          <div>
            <IconButton onClick={handleClick}>
              <Badge
                badgeContent={notificationCount}
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
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  width: 250,
                },
              }}
            >
              <MenuItem onClick={handleClose}>📩 Nueva solicitud recibida</MenuItem>
              <MenuItem onClick={handleClose}>✅ Cliente aprobó documento</MenuItem>
              <MenuItem onClick={handleClose}>⏰ Tienes tareas pendientes</MenuItem>
            </Menu>
          </div>
        </div>
      )}
    </nav>
   {/* Toast flotante tipo chat */}
   {showToast && (
        <div className="fixed bottom-4 right-4 bg-white text-gray-800 shadow-lg rounded-xl px-4 py-3 flex items-start space-x-2 animate-fade-in-up z-50 max-w-xs">
          <div className="text-xl">🔔</div>
          <div className="flex-1 text-sm">{latestNotification}</div>
          <button onClick={() => setShowToast(false)} className="text-gray-500 hover:text-gray-700">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      )}
    </>
  );
};

export default Nav;
