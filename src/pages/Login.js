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
import Ponty from "../img/ponty.png";
import axios from "../configApi/axiosConfig";
import { useSnackbar } from "notistack";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";
const Login = () => {
  const Logo = "/img/Point.png"; // Ruta relativa desde la carpeta public

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
      <section
        className=" flex items-center justify-center min-h-screen bg-red-600"
        style={{ background: "linear-gradient(to bottom, #1965F2, #D9E6FF)" }}
      >
        <div className="container max-w-4xl p-4 sm:p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full " style={{borderRadius: "20px"}}>
              <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800" style={{borderRadius: "20px"}}>
                <div
                  className="flex flex-col lg:flex-row relative rounded-lg "
                  style={{
                    background:
                      "linear-gradient(90deg, #5592F3 0%, #A6C8FF 50%, #ffffff 100%)",
                      borderRadius: "20px",
                  }}
                >
                  {/* Formulario de inicio de sesión */}
                  <div className="w-full lg:w-6/12 px-4 py-8 md:px-6 relative">
                     {   /* Capa morada semitransparente */}
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        background: `linear-gradient(
                           to bottom,
                                    rgb(16, 16, 18) 100%,
                                 rgba(10, 9, 16, 0.6) 61%,
                                 rgba(171, 163, 236, 0.5) 61%,
                                  rgba(0, 0, 0, 0) 100%
                                  )`,
                        mixBlendMode: "overlay",
                        borderTopLeftRadius: "20px",
                        borderBottomLeftRadius: "20px",
                        
                      }}
                    ></div>

                    <img
                      className="mx-auto w-[80px] sm:w-[100px] md:w-[120px] lg:w-2/3 mb-6 pb-2"
                      src={Logo}
                      alt="logo"
                    />
                    <div
                      className="md:mx-6 p-8 rounded-2xl"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.50)" }}
                    >
                      <div className="text-center">
                        {/* <h4 className="text-2xl font-semibold mb-6">
                                Registro Ciudadanos
                              </h4> */}
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
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.95rem",
                              color: "#000",
                              mb: 0.5,
                            }}
                          >
                            Usuario POINT 
                          </Typography>

                          <TextField
                          placeholder="username@gmail.com"
                            fullWidth
                            required
                            value={userName}
                            variant="outlined"
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "4px",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "transparent", // Sin borde
                                },
                                "&:hover fieldset": {
                                  borderColor: "#ccc", // Color al pasar el mouse
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#2d3689", // Color al enfocar
                                },
                              },
                              "& input": {
                                padding: "12px 14px",
                                paddingLeft: "0px",  // Ajusta el padding interno
                              },
                            }}
                            onChange={(e) =>
                              setUserName(e.target.value.toUpperCase())
                            } // Convertir a mayúsculas
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon
                                    sx={{
                                      fontSize: "1.3rem",
                                      color: "#000",
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        <Box sx={{ widht: "100%" }}>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.95rem",
                              color: "#000",
                              mb: 0.5,
                            }}
                          >
                            Contraseña
                          </Typography>

                          <TextField
                            fullWidth
                            required
                            value={password}
                            variant="outlined"
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "4px",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "transparent", // Sin borde
                                },
                                "&:hover fieldset": {
                                  borderColor: "#ccc", // Color al pasar el mouse
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#2d3689", // Color al enfocar
                                },
                              },
                              "& input": {
                                padding: "12px 14px", // Ajusta el padding interno
                              },
                            }}
                            onChange={(e) =>
                              setPassword(e.target.value.toUpperCase())
                            } // Convertir a mayúsculas
                            type={showPassword ? "text" : "password"} // Cambia entre texto y contraseña
                            InputProps={{
                              startAdornment: (
                              <InputAdornment position="start">
                                <Lock
                                sx={{
                                  fontSize: "1.3rem",
                                  color: "#000",
                                }}
                                />
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
                                  sx={{
                                    fontSize: "1.3rem",
                                    color: "#000",
                                  }}
                                  />
                                ) : (
                                  <Visibility
                                  sx={{
                                    fontSize: "1.3rem",
                                    color: "#000",
                                  }}
                                  />
                                )}
                                </IconButton>
                              </InputAdornment>
                              ),
                            }}
                            />
                          </Box>

                          <button
                            className="mb-2 w-full text-white py-2 px-4 rounded-md hover:bg-moradoHover flex items-center justify-center" style={{backgroundColor: "#1965F2"}}
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
                  <div className="w-full lg:w-6/12 flex items-center justify-start">
                    <img className="" src={Ponty} alt="logo" />
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <div className="mt-8 text-center">
                        {/* <img
                          className="w-[1000px] h-[500px]"
                          src={Ponty}
                          alt="logo"
                        />*/}
                        {/* <p className="text-white">
                          BDD de ciudadanos o nueva consulta al Registro Civil.
                        </p> */}
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
