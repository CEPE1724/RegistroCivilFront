import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPerfil } from "../../actions/fetchPerfil"; // Asegúrate de que esta función esté correctamente exportada
import { APIURL } from "../../configApi/apiConfig";
import { connectToServer } from "../../socket/socket-client"; // Asegúrate de que esta función esté correctamente exportada
import SessionExpiredModal from "../SessionExpiredModal";
// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isSessionExpired2, setIsSessionExpired2] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Para almacenar los datos del usuario
  const [userUsuario, setUserUsuario] = useState(null); // Para almacenar los datos de la API 'get_nomina'
  const [idMenu, setIdMenu] = useState(localStorage.getItem("rutaUsuario") || null); // Leer idMenu desde localStorage

  const [isConnected, setIsConnected] = useState(false);  // Estado de conexión WebSocket
  const [connectedClients, setConnectedClients] = useState([]); // Almacena los clientes conectados
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionMessage, setSessionMessage] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !socketRef.current) {
      const socket = connectToServer(token);
      socketRef.current = socket;

      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));
      socket.on("clients-updated", (clients) => setConnectedClients(clients));

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [token]);

  // Effect para escuchar el evento de forzar logout desde el socket
  useEffect(() => {
    const handleForceLogout = (event) => {
      console.warn('🚪 Force logout detectado:', event.detail);
      const message = event.detail.message || event.detail.reason || 'Tu sesión ha sido cerrada';
      setSessionMessage(message);
      setShowSessionModal(true);
      
      // Cerrar automáticamente después de 3 segundos
      setTimeout(() => {
        setShowSessionModal(false);
        logout();
      }, 3000);
    };

    window.addEventListener('force-logout', handleForceLogout);

    return () => {
      window.removeEventListener('force-logout', handleForceLogout);
    };
  }, []);

  const handleCloseSessionModal = () => {
    setShowSessionModal(false);
    logout();
  };

  // Effect para revisar la expiración del token
  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("tokenExpiration");
      const currentTime = new Date().getTime();

      // Verifica si el token ha expirado
      if (token && expirationTime && currentTime > expirationTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        setToken(null);
        setIsSessionExpired(true);
        setIsLoggedIn(false);

        const currentPath = window.location.pathname;
        if (currentPath !== "/FelizCumpleaños" && !currentPath.startsWith("/mapScreenLatinium")) {
          navigate("/login");
        }

      }

    };

    if (token) {
      checkTokenExpiration();
      const interval = setInterval(checkTokenExpiration, 60000); // Revisar cada minuto
      return () => clearInterval(interval); // Limpieza al desmontar
    } else {
      setIsLoggedIn(false); // Si no hay token, el usuario no está logueado
    }
  }, [token, navigate]);

  // Effect para obtener datos del perfil una vez que el token está disponible
  useEffect(() => {
    const getUserData = async () => {
      if (token) {
        try {
          const userPerfil = await fetchPerfil(token); // Asegúrate de que esta función esté correctamente definida
          setUserData(userPerfil.usuario);
        } catch (error) {
          console.error("Error al obtener los datos del perfil:", error.message);
        }
      }
    };
    if (token) {
      getUserData();
    }
  }, [token]); // Ejecuta solo cuando cambia el token

  // Effect para consultar la API 'get_nomina' cuando 'userData' cambia
  useEffect(() => {
    const getUserDataUsuario = async () => {
      if (token && userData) {
        try {
          const url = APIURL.get_nomina(userData.Nombre); // Usamos 'Nombre' de userData
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setUserUsuario(data); // Almacenamos los datos obtenidos
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error.message);
        }
      }
    };
    if (userData) {
      getUserDataUsuario();
    }
  }, [userData, token]); // Se ejecuta cada vez que 'userData' cambia

  // Función de login
  const login = (newToken, expirationTime) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpiration", expirationTime);
    setIsLoggedIn(true);
    setIsSessionExpired(false);
  };
  const setMenuId = (id) => {
    setIdMenu(id);
    localStorage.setItem("rutaUsuario", id); // Guardar el idMenu en localStorage
  };
  // Función de logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("rutaUsuario"); // Limpiar el idMenu de localStorage
    setToken(null);
    setIsSessionExpired(false);
    setIsLoggedIn(false);
    setUserData(null); // Limpiar los datos del usuario
    setUserUsuario(null); // Limpiar los datos de 'get_nomina'
    navigate("/login");
  };

  const logoutinactividad = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("rutaUsuario"); // Limpiar el idMenu de localStorage
    setToken(null);
    setIsSessionExpired2(true);
    setIsLoggedIn(false);
    setUserData(null); // Limpiar los datos del usuario
    setUserUsuario(null); // Limpiar los datos de 'get_nomina'
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isSessionExpired,
        isSessionExpired2,
        isLoggedIn,
        userData,
        userUsuario, // Datos obtenidos de 'get_nomina'
        login,
        logout,
        logoutinactividad,
        idMenu,
        setMenuId,
        isConnected,
        connectedClients,
        socket: socketRef.current,
      }}
    >
      {children}
      <SessionExpiredModal 
        isOpen={showSessionModal}
        message={sessionMessage}
        onClose={handleCloseSessionModal}
      />
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
