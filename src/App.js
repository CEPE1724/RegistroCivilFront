import React, { useEffect } from "react";
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
import VerificacionTelefonica from "./pages/VerificacionTelefonica";
import ListaSolicitud from "./pages/ListaSolicitud";
import VerificacionTerrena from "./pages/VerificacionTerrena";
import VerificacionGeoreferencia from "./pages/VerificacionGeoreferencia";
import SolicitudGrande from "./pages/SolicitudGrande";
import Seguridad from "./pages/Seguridad";
import TelefonicaListSol from "./pages/TelefonicaListSol";
import GestorDocumentosCli from "./pages/GestorDocumentos";
import { useAuth } from "./components/AuthContext/AuthContext";
import RepositorioCreditos from "./pages/RepositorioCreditos";
import CalendarioOperador from "./pages/CalendarioOperador";
import CalendarioVerificador from "./pages/CalendarioVerificador";
import AgenteDocumental from "./pages/AgenteDocumental";
import Dashboard from "./pages/Dashboard";
import ListaNegra from "./pages/ListaNegra";
import NotificacionesCli  from "./pages/Notificaciones";

import Equifax from "./pages/Equifax";

import DepositoPendiente from "./pages/DepositoPendiente";

function App() {

  const { isSessionExpired, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay token, redirige al login automáticamente
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const PrivateRouteWrapper = ({ title, element }) => (
    <PrivateRoute>
      <TitleUpdater title={`${title} - POINT`} />
      {element}
    </PrivateRoute>
  );

  return (

    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={3500}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/*" element={<><TitleUpdater title="Página no encontrada - POINT" /><PaginaNotFound /></>} />

        <Route path="/dashboard" element={<PrivateRouteWrapper title="dashboard" element={<Dashboard />} />} />
        <Route path="/nueva-consulta" element={<PrivateRouteWrapper title="Nueva Consulta" element={<Home />} />} />
        <Route path="/ciudadanos" element={<PrivateRouteWrapper title="Ciudadanos Almacenados" element={<Ciudadanos />} />} />
        <Route path="/proteccion-datos" element={<PrivateRouteWrapper title="Protección de Datos" element={<DataProtection />} />} />
        <Route path="/gestor" element={<PrivateRouteWrapper title="Gestor Virtual" element={<GestorVirtual />} />} />
        <Route path="/calendar" element={<PrivateRouteWrapper title="calendar Virtual" element={<CalendarioOperador />} />} />
        <Route path="/calendarVerificador" element={<PrivateRouteWrapper title="calendar Virtual" element={<CalendarioVerificador />} />} />
        <Route path="/solicitud" element={<PrivateRouteWrapper title="Solicitud" element={<SolicitudCredito />} />} />
        <Route path="/documental" element={<PrivateRouteWrapper title="Documentos" element={<Documento1 />} />} />
        <Route path="/telefonica" element={<PrivateRouteWrapper title="Telefonica" element={<VerificacionTelefonica />} />} />
        <Route path="/terrena" element={<PrivateRouteWrapper title="Terrena" element={<VerificacionTerrena />} />} />
        <Route path="/georeferencia" element={<PrivateRouteWrapper title="Georeferencia" element={<VerificacionGeoreferencia />} />} />
        <Route path="/solicitudgrande" element={<PrivateRouteWrapper title="SolicitudGrande" element={<SolicitudGrande />} />} />
        <Route path="/ListadoSolicitud" element={<PrivateRouteWrapper title="Tabla" element={<ListaSolicitud />} />} />
        <Route path="/seguridad" element={<PrivateRouteWrapper title="Seguridad" element={<Seguridad />} />} />
        <Route path="/telefonicaList" element={<PrivateRouteWrapper title="Telefonica Lista Solicitud" element={<TelefonicaListSol />} />} />
        <Route path="/gestorDocumentos" element={<PrivateRouteWrapper title="Gestor Documentos" element={<GestorDocumentosCli />} />} />
        <Route path="/repositorio" element={<PrivateRouteWrapper title="Repositorio" element={<RepositorioCreditos />} />} />
        <Route path="/agentedocumental" element={<PrivateRouteWrapper title="Repositorio" element={<AgenteDocumental />} />} />
        <Route path="/listaNegra" element={<PrivateRouteWrapper title="ListaNegra" element={<ListaNegra />} />} />
        <Route path="/equifaxx" element={<PrivateRouteWrapper title="Equifax" element={<Equifax />} />} />
        <Route path="/depositoPendiente" element={<PrivateRouteWrapper title="Deposito Pendiente" element={<DepositoPendiente />} />} />
		<Route path="/notificaciones" element={<PrivateRouteWrapper title="Notificaciones" element={<NotificacionesCli />} />} />

      </Routes>

      {isSessionExpired && (
        <Modal open={isSessionExpired} onClose={() => { }}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 400, bgcolor: "background.paper", borderRadius: "8px", boxShadow: 24, p: 4, textAlign: "center"
          }}>
            <Typography variant="h6" component="h2">Sesión terminada <TimerOffIcon /></Typography>
            <Typography sx={{ mt: 2 }}>
              Tu sesión ha expirado. Haz clic en "Aceptar" para volver a iniciar sesión.
            </Typography>
            <Button onClick={logout} variant="contained" sx={{
              mt: 3, backgroundColor: "#2d3689", color: "#ffffff", "&:hover": { backgroundColor: "#212863", color: "#ffffff" }
            }}>
              Aceptar
            </Button>
          </Box>
        </Modal>
      )}
    </SnackbarProvider>

  );
}

export default App;
