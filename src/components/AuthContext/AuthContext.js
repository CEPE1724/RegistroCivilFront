import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPerfil } from "../../actions/fetchPerfil"; // Make sure this is properly exported
import { APIURL } from "../../configApi/apiConfig";
// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Para almacenar los datos del usuario
  const navigate = useNavigate();

  // Effect to check token expiration
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
        navigate("/login");
      }
    };

    // Only check expiration if there's a token
    if (token) {
      checkTokenExpiration();
      const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
      return () => clearInterval(interval); // Cleanup on unmount
    } else {
      setIsLoggedIn(false); // If no token, user is not logged in
    }
  }, [token, navigate]);

  // Effect to fetch user data once the token is available
  useEffect(() => {
    const getUserData = async () => {
      if (token) {
        try {
          const userPerfil = await fetchPerfil(token); // Make sure this function is defined and correctly returns data
          setUserData(userPerfil);
        } catch (error) {
          console.error("Error al obtener los datos del perfil:", error.message);
        }
      }
    };
    if (token) {
      getUserData();
    }
  }, [token]); // Runs only when the token changes

  // Login function
  const login = (newToken, expirationTime) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpiration", expirationTime);
    setIsLoggedIn(true);
    setIsSessionExpired(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setToken(null);
    setIsSessionExpired(false);
    setIsLoggedIn(false);
    setUserData(null); // Clear user data on logout
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isSessionExpired, isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access the context
export const useAuth = () => {
  return useContext(AuthContext);
};
