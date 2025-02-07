import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import LogoEcommerce from "../img/manoRegistro.png";
import axios from "../configApi/axiosConfig";
import { useSnackbar } from "notistack";
import PersonIcon from "@mui/icons-material/Person";
const Login = () => {
  const Logo = "/img/logo.webp"; // Ruta relativa desde la carpeta public

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/nueva-consulta", { replace: true });
    }
  }, [navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("auth/login", {
        Nombre: userName,
        password: password,
      });

      if (response.status === 201) {
        const data = response.data;
        if (data.token) {
          const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 horas
          //const expirationTime = new Date().getTime() + 1 * 60 * 1000; // 1 minuto
          localStorage.setItem("token", data.token);
          localStorage.setItem("tokenExpiration", expirationTime); // Guarda la expiración
          enqueueSnackbar("Acceso correcto!", { variant: "success" });
          setTimeout(() => {
            navigate("/ciudadanos", { replace: true });
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      if (error.response) {
        // Errores que tienen una respuesta del servidor
        if (error.response.status === 401) {
          setMessageError("Credenciales inválidas");
        } else if (error.response.status === 403) {
          setMessageError(
            "No tiene permiso para acceder. Contacte con soporte."
          );
        } else if (error.response.status === 500) {
          setMessageError(
            "Error interno del servidor. Por favor, intente más tarde."
          );
        } else {
          setMessageError(
            error.response.data.message || "Error al iniciar sesión."
          );
        }
      } else if (error.request) {
        // Errores que ocurren cuando no hay respuesta del servidor
        setMessageError(
          "No se pudo conectar con el servidor. Por favor, verifique su conexión a Internet."
        );
      } else {
        // Otros errores
        setMessageError(
          "Ha habido un error intentando logearse, contáctese con soporte."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <section className="gradient-form flex items-center justify-center min-h-screen">
        <div className="container max-w-4xl p-4 sm:p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full">
              <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                <div className="flex flex-col lg:flex-row">
                  {/* Formulario de inicio de sesión */}
                  <div className="w-full lg:w-6/12 px-4 py-8 md:px-6">
                    <div className="md:mx-6 md:p-8">
                      <div className="text-center">
                        <h4 className="text-2xl font-semibold mb-6">
                          Registro Ciudadanos
                        </h4>
                        <h5 className="pt-4 pb-6 text-xl font-semibold">
                          Iniciar Sesión
                        </h5>
                      </div>
                      {messageError && (
                        <div className="text-red-500 text-start mb-4 text-sm">
                          *{messageError}
                        </div>
                      )}
                      <form className="space-y-4" onSubmit={handleSubmit}>
                        <TextField
                          label="Usuario POINT"
                          fullWidth
                          required
                          value={userName}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#2d3689",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#2d3689",
                            },
                          }}
                          onChange={(e) =>
                            setUserName(e.target.value.toUpperCase())
                          } // Convertir a mayúsculas
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ fontSize: "1.3rem" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          label="Contraseña"
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#2d3689",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#2d3689",
                            },
                          }}
                          type={showPassword ? "text" : "password"} // Cambia entre texto y contraseña
                          fullWidth
                          required
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value.toUpperCase())
                          } // Convertir a mayúsculas
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ fontSize: "1.3rem" }}/>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleTogglePasswordVisibility}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff
                                      sx={{ fontSize: "1.3rem" }}
                                    />
                                  ) : (
                                    <Visibility sx={{ fontSize: "1.3rem" }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <button
                          className="mb-2 w-full bg-morado text-white py-2 px-4 rounded-md hover:bg-moradoHover flex items-center justify-center"
                          type="submit"
                        >
                          {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <span className="flex items-center">
                              Ingresar <LoginIcon className="ml-2" />
                            </span>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Sección de imágenes y texto informativo */}
                  <div
                    className="w-full lg:w-6/12 flex items-center justify-center rounded-b-lg lg:rounded-e-lg lg:rounded-bl-none"
                    style={{
                      background:
                        "linear-gradient(to right, #212863, #3c46a5, #6f79d5, #b5bcfc)",
                    }}
                  >
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <div className="mt-8 text-center">
                        <img
                          className="mx-auto w-[80px] sm:w-[100px] md:w-[120px] lg:w-2/3"
                          src={Logo}
                          alt="logo"
                        />
                        <img
                          className="mx-auto mt-4 w-[80px] sm:w-[100px] md:w-[120px] lg:w-1/3"
                          src={LogoEcommerce}
                          alt="logo"
                        />
                        <p className="text-white">
                          BDD de ciudadanos o nueva consulta al Registro Civil.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
