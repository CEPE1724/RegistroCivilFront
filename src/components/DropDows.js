import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useAuth } from "../components/AuthContext/AuthContext";

function DropDown() {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAuth();  // Usamos el logout y isLoggedIn desde el contexto
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  let logoutTimer;

  const handleLogout = () => {
    setIsLoading(true);
    logout();  // Llamar al logout desde el contexto
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login", { replace: true });
    }, 1000);
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer); // Limpiar el temporizador anterior

    logoutTimer = setTimeout(() => {
      setIsModalOpen(true); // Mostrar el modal de sesión expirada
    }, 300000); // 5 minutos
  };

  useEffect(() => {
    resetLogoutTimer(); // Inicializar el temporizador

    // Agregar eventos de interacción
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetLogoutTimer));

    return () => {
      // Limpiar eventos y temporizador al desmontar
      clearTimeout(logoutTimer);
      events.forEach((event) =>
        window.removeEventListener(event, resetLogoutTimer)
      );
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    handleLogout(); // Cerrar sesión y redirigir al login
    setIsModalOpen(false); // Cerrar el modal
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        sx={{
          ":hover": { color: "#d8d8d8" },
          color: "white",
        }}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { maxWidth: 200 },
        }}
      >
        <div className="p-4">
          <p className="font-bold text-center text-sm text-gray-700">
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Cerrar Sesión"
            )}
          </p>
        </div>
        <hr className="my-2 border-gray-200" />
        <MenuItem
          onClick={handleLogout}
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "#2d3689",
            fontSize: "14px",
          }}
        >
          Salir
          {isLoading ? (
            <CircularProgress size={18} className="ml-2" />
          ) : (
            <LogoutIcon className="ml-2" />
          )}
        </MenuItem>
      </Menu>

      {/* Modal estático de sesión expirada */}
      <Dialog
        open={isModalOpen}
        onClose={() => {}}
        PaperProps={{
          sx: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="h2">
            Sesión expirada <TimerOffIcon />
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Tu sesión ha expirado. Por Inactividad, presiona "Aceptar" para
            volver a iniciar sesión.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleModalClose}
            variant="contained"
            sx={{
              backgroundColor: "#2d3689", // Color de fondo morado
              color: "#ffffff", // Color del texto
              "&:hover": {
                backgroundColor: "#212863", // Color de fondo al pasar el mouse
                color: "#ffffff", // Color del texto
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DropDown;
