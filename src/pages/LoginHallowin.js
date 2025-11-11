import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, CircularProgress, IconButton, Alert } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../configApi/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../components/AuthContext/AuthContext";
import fondo from "../assets/img/fondoHallowen.webp";
import logoCredi from "../assets/img//logo-credipoint.webp";
import fondoSinVer from "../assets/img/FondoSinVer.webp";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  TimerOff as TimerOffIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { APIURL } from "../configApi/apiConfig";

const Login = () => {
  const { login, isLoggedIn, isSessionExpired2 } = useAuth();
  const [sessionExpired, setShowExpiredModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [messageError, setMessageError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [mostrarCambioClave, setMostrarCambioClave] = useState(false);
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // Estados para modal de olvido de contraseña

  const [showOlvidoModal, setShowOlvidoModal] = useState(false);
  const [usuarioOlvido, setUsuarioOlvido] = useState("");
  const [cedulaOlvido, setCedulaOlvido] = useState("");
  const [isLoadingOlvido, setIsLoadingOlvido] = useState(false);


  const handleOlvidoPassword = async () => {
    if (!usuarioOlvido.trim() || !cedulaOlvido.trim()) {
      enqueueSnackbar("Por favor complete todos los campos", { variant: "error" });
      return;
    }

    setIsLoadingOlvido(true);
    try {
      const response = await axios.post(APIURL.recuperarClave(), {
        nombreUsuario: usuarioOlvido,
        cedula: cedulaOlvido,
      });

      // Manejo mejorado de respuestas del backend
      const mensaje = response.data;

      // Verificar si la respuesta indica éxito o error basándose en el mensaje
      if (mensaje === 'La contraseña ha sido enviada al correo registrado') {
        enqueueSnackbar(mensaje, { variant: "success" });
        setShowOlvidoModal(false);
        setUsuarioOlvido("");
        setCedulaOlvido("");
      } else {
        // Cualquier otro mensaje del backend se considera un error
        enqueueSnackbar(mensaje, { variant: "error" });
      }

    } catch (error) {
      console.error("Error al recuperar contraseña:", error);

      // Manejar los diferentes tipos de errores
      let mensajeError = "Error al procesar la solicitud. Intente nuevamente.";

      if (error.response?.data) {
        // Si el backend envía un mensaje específico en response.data
        mensajeError = error.response.data;
      } else if (error.response?.status === 400) {
        mensajeError = "Datos inválidos. Verifique su usuario y cédula.";
      } else if (error.response?.status === 404) {
        mensajeError = "Usuario no encontrado o datos incorrectos.";
      } else if (error.response?.status >= 500) {
        mensajeError = "Error del servidor. Intente más tarde.";
      }

      enqueueSnackbar(mensajeError, { variant: "error" });
    } finally {
      setIsLoadingOlvido(false);
    }
  };

  // Función para validar la contraseña
  const validarContrasena = (password) => {
    const minLength = password.length >= 8 && password.length <= 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasSpecialChar
    };
  };

  const passwordValidation = validarContrasena(nuevaClave);

  useEffect(() => {
    const preloadImages = [fondoSinVer, fondo];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [])

  useEffect(() => {
    if (isSessionExpired2) {
      setShowExpiredModal(true);
    }
  }, [isSessionExpired2]);

  const handleCloseModal = () => {
    setShowExpiredModal(false);
  };

  useEffect(() => {
    if (isLoggedIn && !mostrarCambioClave) {
      navigate("/ciudadanos", { replace: true });
    }
  }, [isLoggedIn, mostrarCambioClave]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessageError("");

    try {
      const response = await axios.post("auth/login", {
        Nombre: userName,
        Clave: password,
      });

      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem("token", data.token);

        // Verifica si existe en InfoSistemas2
        const verificacion = await axios.get(APIURL.verificarCambioClave(userName));
        const debeCambiar = !verificacion.data.existe;



        if (debeCambiar) {
          setMostrarCambioClave(true); // muestra el modal
        } else {
          const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000;
          login(data.token, expirationTime); // inicia sesión
          enqueueSnackbar("Acceso correcto!", { variant: "success" });
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMessageError("Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip; // IP pública
    } catch (e) {
      console.error("Error al obtener IP:", e);
      return "127.0.0.1";
    }
  };

  return (
    <section
      className="flex items-center justify-center min-h-screen relative halloween-bg overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom left, #008fff, #00447a)',
      }}
    >
      {/* 🕸️ Telarañas decorativas */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-60 spiderweb"></div>
      <div className="absolute top-0 right-0 w-40 h-40 opacity-60 spiderweb rotate-90"></div>
      <div className="absolute bottom-0 left-0 w-28 h-28 opacity-60 spiderweb rotate-180"></div>
      <div className="absolute bottom-0 right-0 w-36 h-36 opacity-60 spiderweb rotate-45"></div>


      {/* 🕷️ Arañas animadas */}
      <div className="absolute top-0 left-1/4 animate-spider">
        <div className="spider"></div>
      </div>
      <div className="absolute top-0 right-1/3 animate-spider delay-3000">
        <div className="spider"></div>
      </div>

      {/* Fondo dinámico (igual que antes) */}
      {showPassword ? (
        <img
          src={fondoSinVer}
          alt="fondo centrado ojos cerrados"
          className="hidden md:block absolute"
          style={{
            maxWidth: '60%',
            objectFit: 'contain',
            borderRadius: '24px',
            boxShadow: '40px 30px 20px rgba(0, 0, 0, 0.3)',
          }}
        />
      ) : (
        <img
          src={fondo}
          alt="fondo centrado"
          className="hidden md:block absolute"
          style={{
            maxWidth: '60%',
            objectFit: 'contain',
            borderRadius: '24px',
            boxShadow: '40px 30px 20px rgba(0, 0, 0, 0.3)',
          }}
        />
      )}

      {/* login */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 max-w-xs z-10">
        
         <div className="bg-white rounded-2xl p-6 shadow-2xl border-4 border-orange-600 relative">
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-600 rounded-full shadow-lg animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-purple-700 rounded-full shadow-lg animate-pulse"></div>

          {/* Título */}
          <div className="text-center mb-6">
            <img src={logoCredi} alt="Credi Point Digital" className="w-36 h-9 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-orange-700 drop-shadow-md">🎃 Iniciar Sesión</h2>
          </div>

          {/* Formulario */}
          <div className="space-y-3">
            <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
              {/* Campo Usuario */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PersonIcon className="h-4 w-4 text-black-400" />
                </div>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value.toUpperCase())}
                  placeholder="Usuario"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-sm"
                />
              </div>

              {/* Campo Contraseña */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-black-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <span className="flex items-center space-x-2 text-blue-800 font-semibold hover:text-blue-800 transition-colors duration-200">
                      <span>Ocultar</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2 text-blue-800 font-semibold hover:text-blue-800 transition-colors duration-200">
                      <span>Mostrar</span>
                    </span>
                  )}
                </button>
              </div>

              {/* olvidaste contraseña */}
              <div className="flex items-center text-sm">
              <button
                type="button"
                onClick={() => setShowOlvidoModal(true)}
                className="ml-auto text-orange-600 hover:text-orange-800 transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
              {messageError && (
                <div className="text-red-500 text-start mb-4 text-sm">¡{messageError}!</div>
              )}
            </div>

              {/* Botón Iniciar Sesión */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-2.5 px-4 rounded-xl font-semibold hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 text-sm mt-4"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #8B0000 0%, #FF4500 50%, #8B0000 100%)",
                }}
              >
                {isLoading ? "Cargando..." : "Iniciar Sesión 🎃"}
              </button>
            </form>
          </div>
        </div>
      </div>


      <Dialog
        open={sessionExpired}
        onClose={handleCloseModal}
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
          <Typography variant="h6" component="div">
            Sesión expirada <TimerOffIcon />
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Tu sesión ha expirado por inactividad. Por favor inicia sesión nuevamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{
              backgroundColor: "#2d3689",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#212863",
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de olvido de contraseña */}
      <Dialog
        open={showOlvidoModal}
        onClose={() => setShowOlvidoModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #1965F2 0%, #4A90E2 100%)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{
          textAlign: "center",
          pb: 1,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <Lock sx={{ fontSize: "2rem", color: "#FFD700" }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
              Recuperar Contraseña
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Ingrese sus datos para recuperar el acceso a su cuenta
          </Typography>
        </DialogTitle>

        <DialogContent sx={{
          p: 3,
          background: "rgba(255, 255, 255, 0.95)",
          color: "#333",
          m: 2,
          borderRadius: "8px",
        }}>
          <Alert
            severity="info"
            sx={{
              mb: 3,
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              border: "1px solid rgba(33, 150, 243, 0.3)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "500" }}>
              🔐 Complete los siguientes datos para verificar su identidad
            </Typography>
          </Alert>

          <TextField
            label="Usuario"
            fullWidth
            margin="dense"
            value={usuarioOlvido}
            onChange={(e) => setUsuarioOlvido(e.target.value.toUpperCase())}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#1965F2' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              mb: 2
            }}
          />

          <TextField
            label="Número de Cédula"
            fullWidth
            margin="dense"
            value={cedulaOlvido}
            onChange={(e) => setCedulaOlvido(e.target.value)}
            inputProps={{
              maxLength: 10,
              pattern: "[0-9]*"
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <Box sx={{ mt: 2, p: 2, backgroundColor: "rgba(25, 101, 242, 0.1)", borderRadius: "8px" }}>
            <Typography variant="body2" sx={{ color: "#1965F2", fontWeight: "500" }}>
              💡 Una vez verificados sus datos, recibirá instrucciones para restablecer su contraseña.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
          <Button
            onClick={() => {
              setShowOlvidoModal(false);
              setUsuarioOlvido("");
              setCedulaOlvido("");
            }}
            sx={{
              color: "#666",
              borderColor: "#666",
              "&:hover": {
                borderColor: "#333",
                color: "#333"
              }
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!usuarioOlvido.trim() || !cedulaOlvido.trim() || isLoadingOlvido}
            onClick={handleOlvidoPassword}
            sx={{
              backgroundColor: "#1965F2",
              color: "#fff",
              px: 4,
              borderRadius: "8px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#0f3a9f",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
          >
            {isLoadingOlvido ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Procesando...
              </>
            ) : (
              "Recuperar Contraseña"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={mostrarCambioClave}
        onClose={() => { }}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{
          textAlign: "center",
          pb: 1,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <SecurityIcon sx={{ fontSize: "2rem", color: "#FFD700" }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
              Configuración de Seguridad
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Al ser tu primer acceso, es necesario establecer una contraseña segura
          </Typography>
        </DialogTitle>

        <DialogContent sx={{
          p: 3,
          background: "rgba(255, 255, 255, 0.95)",
          color: "#333",
          m: 2,
          borderRadius: "8px",
        }}>
          <Alert
            severity="info"
            sx={{
              mb: 3,
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              border: "1px solid rgba(33, 150, 243, 0.3)",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "500" }}>
              🔒 Por tu seguridad, establece una contraseña que cumpla con los siguientes requisitos:
            </Typography>
          </Alert>

          <TextField
            label="Nueva contraseña"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            margin="dense"
            value={nuevaClave}
            onChange={(e) => setNuevaClave(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="dense"
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          {/* Indicadores de validación */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: "rgba(0, 0, 0, 0.05)", borderRadius: "8px" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1, color: "#555" }}>
              Requisitos de contraseña:
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              {passwordValidation.minLength ? (
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1rem" }} />
              ) : (
                <CancelIcon sx={{ color: "#f44336", fontSize: "1rem" }} />
              )}
              <Typography variant="body2" sx={{ color: passwordValidation.minLength ? "#4caf50" : "#f44336" }}>
                Mínimo 8 caracteres y máximo 12 caracteres
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              {passwordValidation.hasUpperCase ? (
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1rem" }} />
              ) : (
                <CancelIcon sx={{ color: "#f44336", fontSize: "1rem" }} />
              )}
              <Typography variant="body2" sx={{ color: passwordValidation.hasUpperCase ? "#4caf50" : "#f44336" }}>
                Al menos una letra mayúscula (A-Z)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              {passwordValidation.hasLowerCase ? (
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1rem" }} />
              ) : (
                <CancelIcon sx={{ color: "#f44336", fontSize: "1rem" }} />
              )}
              <Typography variant="body2" sx={{ color: passwordValidation.hasLowerCase ? "#4caf50" : "#f44336" }}>
                Al menos una letra minúscula (a-z)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {passwordValidation.hasSpecialChar ? (
                <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1rem" }} />
              ) : (
                <CancelIcon sx={{ color: "#f44336", fontSize: "1rem" }} />
              )}
              <Typography variant="body2" sx={{ color: passwordValidation.hasSpecialChar ? "#4caf50" : "#f44336" }}>
                Al menos un carácter especial (!@#$%^&*...)
              </Typography>
            </Box>

            {confirmarClave && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                {nuevaClave === confirmarClave ? (
                  <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1rem" }} />
                ) : (
                  <CancelIcon sx={{ color: "#f44336", fontSize: "1rem" }} />
                )}
                <Typography variant="body2" sx={{ color: nuevaClave === confirmarClave ? "#4caf50" : "#f44336" }}>
                  Las contraseñas coinciden
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!passwordValidation.isValid || nuevaClave !== confirmarClave || !nuevaClave || !confirmarClave}
            onClick={async () => {
              if (nuevaClave !== confirmarClave) {
                enqueueSnackbar("Las contraseñas no coinciden", { variant: "error" });
                return;
              }

              if (!passwordValidation.isValid) {
                enqueueSnackbar("La contraseña no cumple con los requisitos de seguridad", { variant: "error" });
                return;
              }

              try {
                const ip = await obtenerIP();

                // Cambiar la contraseña
                await axios.post(APIURL.cambiarClave(), {
                  nombreUsuario: userName,
                  nuevaClave,
                  direccionIP: ip,
                });

                // Realiza el login con el token ya guardado
                const token = localStorage.getItem("token");
                const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000;
                login(token, expirationTime);

                enqueueSnackbar("Contraseña cambiada exitosamente", { variant: "success" });
                setMostrarCambioClave(false);
                navigate("/dashboard", { replace: true });
              } catch (err) {
                console.error("Error al cambiar clave o registrar ingreso:", err);
                enqueueSnackbar("Error al cambiar la contraseña", { variant: "error" });
              }
            }}
            sx={{
              backgroundColor: "#1453C8",
              color: "#fff",
              py: 1.5,
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#0f3a9f",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
          >
            Establecer Nueva Contraseña Segura
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Login;