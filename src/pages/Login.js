import React, { useState , useEffect } from "react";
import { TextField, InputAdornment, CircularProgress, IconButton, Alert } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../configApi/axiosConfig";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import { useSnackbar } from "notistack";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../components/AuthContext/AuthContext";
import crediPointLogo from "../img/credipoint_digital2.png";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"; // <-- agrega Dialog, Button, etc.
import {
  TimerOff as TimerOffIcon, // <-- agrega este ícono
} from "@mui/icons-material"; // <-- TimerOffIcon también
const Login = () => {
  const { login, isLoggedIn, isSessionExpired2,  logout } = useAuth();
  const [sessionExpired, setShowExpiredModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [messageError, setMessageError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log(isSessionExpired2)
    if (isSessionExpired2) {
      setShowExpiredModal(true);
    }
  }, [isSessionExpired2]);

  const handleCloseModal = () => {
  
    setShowExpiredModal(false);
    
  };

  if (isLoggedIn) {
    navigate("/ciudadanos", { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Llama a tu API para hacer login

      const response = await axios.post("auth/login", {
        Nombre: userName,
        Clave: password,
      });

      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem("token", data.token);

        const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 horas
        login(data.token, expirationTime);
        enqueueSnackbar("Acceso correcto!", { variant: "success" });
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMessageError("Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-red-600" style={{ background: '#1453C8' }}>
      <div className="container max-w-4xl p-4 sm:p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full" style={{ borderRadius: '20px' }}>
            <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800" style={{ borderRadius: '20px' }}>
              <div className="flex flex-col lg:flex-row relative rounded-lg" style={{ background: 'linear-gradient(to bottom, #1965F2, #D9E6FF)', borderRadius: '20px' }}>
                <div className="w-full lg:w-6/12 px-4 py-8 md:px-6 relative">
                  <img className="mx-auto w-[150px] sm:w-[180px] md:w-[200px] lg:w-5/6 mb-2" src={crediPointLogo} alt="logo" />
                  <div className="md:mx-6 p-8 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.50)' }}>

                    {messageError && <div className="text-red-500 text-start mb-4 text-sm">*{messageError}</div>}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <Box>

                        <TextField
                          placeholder="Usuario"
                          fullWidth
                          required
                          value={userName}
                          variant="outlined"
                          onChange={(e) => setUserName(e.target.value.toUpperCase())}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ fontSize: '1.3rem', color: '#000' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      <Box sx={{ width: '100%' }}>

                        <TextField
                          placeholder="Contraseña"
                          fullWidth
                          required
                          value={password}
                          variant="outlined"
                          onChange={(e) => setPassword(e.target.value.toUpperCase())}
                          type={showPassword ? 'text' : 'password'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ fontSize: '1.3rem', color: '#000' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                  {showPassword ? <VisibilityOff sx={{ fontSize: '1.3rem', color: '#000' }} /> : <Visibility sx={{ fontSize: '1.3rem', color: '#000' }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      <button className="mb-2 w-full text-white py-2 px-4 rounded-md hover:bg-red flex items-center justify-center" style={{ backgroundColor: '#1965F2', pointerEvents: isLoading ? 'none' : 'auto' }} type="submit" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : <span className="flex items-center">Ingresar <LoginIcon className="ml-2" /></span>}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 flex items-center justify-start">
                  <img className="hidden md:block" src="/img/ponty.png" alt="logo" />
                </div>
              </div>
            </div>
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

    </section>
  );
};

export default Login;
