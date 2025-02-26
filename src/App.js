import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { Modal, Box, Button, Typography } from "@mui/material";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TitleUpdater from "./components/TitleUpdater";
import PaginaNotFound from "./pages/PaginaNotFound";
import PrivateRoute from "./components/PrivateRoute";
import Ciudadanos from "./pages/Ciudadanos";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import DataProtection from "./pages/DataProtection";
import GestorVirtual from "./pages/GestorVirtual";
import SolicitudCredito from "./pages/SolicitudCredito";
import Documento1 from "./pages/Documento1";
/* Angel crea la ruta aqui*/
import VerificacionTelefonica from "./pages/VerificacionTelefonica";
/* Kevin crea la ruta aqui*/
import Tabla from "./pages/ListaSolicitud";
import ListaSolicitud from "./pages/ListaSolicitud";
import VerificacionTerrena from "./pages/VerificacionTerrena";
import VerificacionGeoreferencia from "./pages/VerificacionGeoreferencia";
import SolicitudGrande from "./pages/SolicitudGrande";
function App() {
  const navigate = useNavigate(); // Coloca el hook fuera del return
  const [isSessionExpired, setIsSessionExpired] = useState(false); // Estado para manejar el modal

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      const expirationTime = localStorage.getItem("tokenExpiration");
      const currentTime = new Date().getTime();

      if (token && expirationTime && currentTime > expirationTime) {
        // Si el token ha expirado, mostramos el modal
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        setIsSessionExpired(true);
      }
    };

    // Comprobación al montar el componente (cuando recargas la página)
    checkTokenExpiration();

    // Intervalo para comprobar cada minuto
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Verifica cada minuto

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  const handleLogout = () => {
    // Eliminar los datos del localStorage y redirigir a login
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setIsSessionExpired(false); // Cierra el modal
    navigate("/login", { replace: true }); // Redirige a la página de login
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={3500}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <>
              <TitleUpdater title="Login - POINT" />
              <Login />
            </>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <TitleUpdater title="Página no encontrada - POINT" />
              <PaginaNotFound />
            </>
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/nueva-consulta"
          element={
            <PrivateRoute>
              <TitleUpdater title="Nueva Consulta - POINT" />
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/ciudadanos"
          element={
            <PrivateRoute>
              <TitleUpdater title="Ciudadanos Almacenados - POINT" />
              <Ciudadanos />
            </PrivateRoute>
          }
        />

        <Route
          path="/proteccion-datos"
          element={
            <PrivateRoute>
              <TitleUpdater title="Protección de Datos - POINT" />
              <DataProtection />
            </PrivateRoute>
          }
        />

        <Route
          path="/gestor"
          element={
            <PrivateRoute>
              <TitleUpdater title="Gestor Virtual - POINT" />
              <GestorVirtual />
            </PrivateRoute>
          }
        />

        {/* ruta Angel */}
        <Route
          path="/solicitud"
          element={
            <PrivateRoute>
              <TitleUpdater title="Solicictud - POINT" />

              <SolicitudCredito />
            </PrivateRoute>
          }
        />
        {/* ruta Kevin */}
        <Route
          path="/documental"
          element={
            <PrivateRoute>
              <TitleUpdater title="Documentos " />
              <Documento1 />
            </PrivateRoute>
          }
        />
        {/* ruta Daniel */}
        <Route
          path="/telefonica"
          element={
            <PrivateRoute>
              <TitleUpdater title="Telefonica - POINT" />

              <VerificacionTelefonica />
            </PrivateRoute>
          }
        />

        {/* ruta Daniel Terrena */}
        <Route
          path="/terrena"
          element={
            <PrivateRoute>
              <TitleUpdater title="Terrena - POINT" />

              <VerificacionTerrena />
            </PrivateRoute>
          }
        />

        {/* ruta georeferencia */}
        <Route
          path="/georeferencia"
          element={
            <PrivateRoute>
              <TitleUpdater title="Georeferencia - POINT" />

              <VerificacionGeoreferencia />
            </PrivateRoute>
          }
        />

        {/* ruta solicitudgrande */}

        <Route
          path="/solicitudgrande"
          element={
            <PrivateRoute>
              <TitleUpdater title="SolicitudGrande - POINT" />
              <SolicitudGrande />
            </PrivateRoute>
          }
        />

        <Route
          path="/ListadoSolicitud"
          element={
            <PrivateRoute>
              <TitleUpdater title="Tabla - POINT" />
              <ListaSolicitud />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Modal de sesión expirada */}
      <Modal open={isSessionExpired} onClose={() => { }}>
        <Box
          sx={{
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
          }}
        >
          <Typography variant="h6" component="h2">
            Sesión terminada <TimerOffIcon />
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Tu sesión ha expirado. Haz clic en "Aceptar" para volver a iniciar
            sesión.
          </Typography>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              mt: 3,
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
        </Box>
      </Modal>
    </SnackbarProvider>
  );
}

export default App;
