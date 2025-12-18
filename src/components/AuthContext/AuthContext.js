import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from "react";
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

  // Función de logout (debe estar antes de los useEffect que la usan)
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("rutaUsuario"); // Limpiar el idMenu de localStorage
    localStorage.removeItem("loginTimestamp"); // Limpiar el timestamp del login
    setToken(null);
    setIsSessionExpired(false);
    setIsLoggedIn(false);
    setUserData(null); // Limpiar los datos del usuario
    setUserUsuario(null); // Limpiar los datos de 'get_nomina'
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (token && !socketRef.current) {
      // Verificar si el login fue reciente (últimos 5 segundos)
      const loginTimestamp = parseInt(localStorage.getItem("loginTimestamp") || "0");
      const timeSinceLogin = Date.now() - loginTimestamp;
      const isNewLogin = timeSinceLogin < 5000; // true si login fue hace menos de 5 segundos
      
      console.log(`🔌 Conectando WebSocket | Nuevo Login: ${isNewLogin} | Tiempo desde login: ${timeSinceLogin}ms`);
      
      // ✅ AHORA connectToServer retorna una Promise, necesitamos await
      const initSocket = async () => {
        try {
          const socket = await connectToServer(token, isNewLogin);
          socketRef.current = socket;

          socket.on("connect", () => {
            console.log("✅ WebSocket conectado en AuthContext");
            setIsConnected(true);
          });
          
          socket.on("disconnect", () => {
            console.log("❌ WebSocket desconectado");
            setIsConnected(false);
          });
          
          socket.on("clients-updated", (clients) => setConnectedClients(clients));

          // Escuchar el evento de sesión terminada por nuevo login
          socket.on("session-terminated", (data) => {
            console.warn("⚠️ Sesión terminada:", data);
            setSessionMessage(data.message || "Tu sesión fue cerrada por un nuevo login");
            setShowSessionModal(true);
            
            setTimeout(() => {
              setShowSessionModal(false);
              logout();
            }, 3000);
          });
        } catch (error) {
          console.error('❌ Error al conectar WebSocket en AuthContext:', error);
        }
      };

      initSocket();

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [token, logout]);

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
  }, [logout]);

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
  }, [token, navigate, logout]);

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
    localStorage.setItem("loginTimestamp", Date.now().toString()); // Guardar timestamp del login
    setIsLoggedIn(true);
    setIsSessionExpired(false);
  };
  const setMenuId = (id) => {
    setIdMenu(id);
    localStorage.setItem("rutaUsuario", id); // Guardar el idMenu en localStorage
  };

  const logoutinactividad = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("rutaUsuario"); // Limpiar el idMenu de localStorage
    localStorage.removeItem("loginTimestamp"); // Limpiar el timestamp del login
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
