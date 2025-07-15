import React, { useEffect, useState } from "react";
import axios from "../configApi/axiosConfig";
import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const DactilarQuery = () => {
  const [cedula, setCedula] = useState("");
  const [dactilar, setDactilar] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isCedulaValid, setIsCedulaValid] = useState(false);
  const [isDactilarValid, setIsDactilarValid] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const hanldeResetInputs = () => {
    setCedula("");
    setDactilar("");
    setError(null);
    setIsCedulaValid(false);
    setIsDactilarValid(false);
    setIsButtonDisabled(true);
  };

  const handleQuery = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const getResponse = await axios.get(`dactilar/${cedula}`, config);

        if (getResponse.data.statusCode === 200 && getResponse.data.data) {
          setData(getResponse.data.data);
          try {
            const historicoResponse = await axios.post(
              "historico/registrar",
              { cedula: cedula, apiRC: 0 },
              config
            );
         
          } catch (historicoError) {
            console.error(
              "Error al registrar la consulta en el histórico:",
              historicoError
            );
          }
          hanldeResetInputs();
          return;
        }
      } catch (err) {
        if (err.response && err.response.status === 500) {
          const postResponse = await axios.post(
            "dactilar/consulta",
            { cedula, dactilar, usuario: "ECEPEDA" },
            config
          );

          if (postResponse.data.data) {
            setData(postResponse.data.data);
            try {
              const historicoResponse = await axios.post(
                "historico/registrar",
                { cedula: cedula, apiRC: 1 },
                config
              );
             
            } catch (historicoError) {
              console.error(
                "Error al registrar la consulta en el histórico:",
                historicoError
              );
            }
            hanldeResetInputs();
          } else {
            throw new Error("Data query failed");
          }
        } else {
          throw new Error("Error al buscar la cédula: " + err.message);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        // Extraer el mensaje que llega como string de JSON
        const errorMessage = err.response.data.message;

        let parsedMessage;
        try {
          // Intentar parsear el mensaje completo
          const errorObject = JSON.parse(
            errorMessage.replace("Error en la consulta: ", "")
          ); // Eliminar la parte que dice "Error en la consulta: " antes de parsear
          // Acceder al campo "mensaje" dentro del objeto parseado
          parsedMessage = errorObject.mensaje?.mensaje;
        } catch (parseError) {
          parsedMessage = "Error desconocido"; // Si falla la conversión, mostrar un error genérico
        }

        setError(parsedMessage); // Mostrar solo el mensaje que quieres

        setData(null);
      } else {
        console.error("Error al buscar los datos solicitados:", err.message);
      }
    }
  };
  const validateCedula = (value) => {
    const cedulaRegex = /^[0-9]{10}$/; // Verifica que sea un número de 10 dígitos

    if (cedulaRegex.test(value)) {
      const firstTwoDigits = parseInt(value.slice(0, 2), 10); // Obtiene los dos primeros dígitos
      const thirdDigit = parseInt(value.charAt(2), 10); // Obtiene el tercer dígito

      // Validar los dos primeros dígitos (1-24) y el tercer dígito (1-6)
      if (
        firstTwoDigits >= 0 &&
        firstTwoDigits <= 24 &&
        thirdDigit >= 0 &&
        thirdDigit <= 6
      ) {
        setIsCedulaValid(true); // La cédula es válida
      } else {
        setIsCedulaValid(false); // La cédula no es válida
      }
    } else {
      setIsCedulaValid(false); // La cédula no tiene 10 dígitos
    }
  };

  const validateDactilar = (value) => {
    const dactilarRegex = /^[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9]{4}$/;
    setIsDactilarValid(dactilarRegex.test(value.toUpperCase()));
  };

  useEffect(() => {
    setIsButtonDisabled(!(isCedulaValid && isDactilarValid));
  }, [isCedulaValid, isDactilarValid]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Consulta al Registro Civil
      </h1>

      {/* Formulario de Consulta */}
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Cédula"
            placeholder="1234567890"
            value={cedula}
            onChange={(e) => {
              setCedula(e.target.value);
              validateCedula(e.target.value);
            }}
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
          />
          {!isCedulaValid && cedula.length > 0 && (
            <Typography color="error">* La cédula no es válida</Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Cód. Dactilar"
            placeholder="A1234B5678"
            value={dactilar}
            onChange={(e) => {
              setDactilar(e.target.value.toUpperCase());
              validateDactilar(e.target.value);
            }}
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
          />
          {!isDactilarValid && dactilar.length > 0 && (
            <Typography color="error">
              * El código dactilar debe seguir el formato A1234B5678
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            onClick={handleQuery}
            fullWidth
            disabled={isButtonDisabled} // Deshabilitar el botón si es necesario
            sx={{
              minHeight: "56px",
              backgroundColor: isButtonDisabled ? "#e0e0e0" : "#2d3689", // Color gris si está deshabilitado
              color: "#ffffff", // Color del texto
              cursor: isButtonDisabled ? "not-allowed" : "pointer", // Cambia el cursor si está deshabilitado
              "&:hover": {
                backgroundColor: isButtonDisabled ? "#e0e0e0" : "#212863", // Mantén el gris si está deshabilitado
                color: "#ffffff", // Color del texto
              },
            }}
          >
            Consultar
          </Button>
        </Grid>
      </Grid>

      {error && (
        <div className="mt-4 sm:m-8 md:m-12 lg:m-12 flex flex-col lg:flex-row justify-center gap-6">
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </div>
      )}
      {data && (
        <>
          <div className="sm:m-8 md:m-12 lg:m-12 flex flex-col lg:flex-row justify-center gap-6">
            {/* Primer Card */}
            <div className="card shadow-lg relative lg:w-1/2 sm:w-full flex flex-col justify-between p-6 text-gray-700 rounded-xl gap-4 bg-gradient-to-b from-blue-100 to-white overflow-hidden">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="uppercase text-lg font-semibold">
                    Documento de Identidad
                  </p>
                  <div className="flex-1 flex flex-col mt-4 overflow-hidden">
                    {data.NOMBRES && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          nombres:{" "}
                        </span>
                        {data.NOMBRES}
                      </p>
                    )}
                    {data.APELLIDOS && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          apellidos:{" "}
                        </span>
                        {data.APELLIDOS}
                      </p>
                    )}
                    {data.NACIONALIDAD && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          nacionalidad:{" "}
                        </span>
                        {data.NACIONALIDAD}
                      </p>
                    )}
                    {data.FECHANACIMIENTO && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="text-sm text-gray-600 font-bold">
                          fecha de Nac.:{" "}
                        </span>
                        {data.FECHANACIMIENTO}
                      </p>
                    )}
                    {data.LUGARNACIMIENTO && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="text-sm text-gray-600 font-bold">
                          lugar de nac.:{" "}
                        </span>
                        {data.LUGARNACIMIENTO}
                      </p>
                    )}
                    {data.SEXO && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="text-sm text-gray-600 font-bold">
                          sexo:{" "}
                        </span>
                        {data.SEXO}
                      </p>
                    )}
                    {data.FECHACEDULACION && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="text-sm text-gray-600 font-bold">
                          fecha de emisión:{" "}
                        </span>
                        {data.FECHACEDULACION}
                      </p>
                    )}
                  </div>
                </div>
                {data.FOTO && (
                  <div className="flex flex-col items-center">
                    <img
                      className="rounded-md object-cover w-2/3 h-3/3"
                      src={`data:image/jpeg;base64,${data.FOTO}`}
                      alt="Foto"
                    />
                    {data.NUI && (
                      <p className="uppercase font-medium mb-4 mt-2 text-center">
                        <span className="text-gray-600 font-bold">nui: </span>
                        {data.NUI}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Segundo Card */}
            <div className="card shadow-lg relative lg:w-1/2 sm:w-full flex flex-col justify-between p-6 text-gray-700 rounded-xl gap-4 bg-gradient-to-b from-blue-100 to-white overflow-hidden">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="uppercase text-lg font-semibold">
                    Datos Adicionales
                  </p>
                  <div className="flex-1 flex flex-col mt-4 overflow-hidden">
                    {data.ESTADOCIVIL && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          estado civil:{" "}
                        </span>
                        {data.ESTADOCIVIL}
                      </p>
                    )}
                    {data.CONYUGE && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          conyuge:{" "}
                        </span>
                        {data.CONYUGE}
                      </p>
                    )}
                    {data.FECHAMATRIMONIO && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          fecha matrimonio:{" "}
                        </span>
                        {data.FECHAMATRIMONIO}
                      </p>
                    )}
                    {data.INSTRUCCION && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          instrucción:{" "}
                        </span>
                        {data.INSTRUCCION}
                      </p>
                    )}
                    {data.PROFESION && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          profesión:{" "}
                        </span>
                        {data.PROFESION}
                      </p>
                    )}
                    {data.NOMBREPADRE && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          nombres padre:{" "}
                        </span>
                        {data.NOMBREPADRE}
                      </p>
                    )}
                    {data.NOMBREMADRE && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          nombres madre:{" "}
                        </span>
                        {data.NOMBREMADRE}
                      </p>
                    )}
                    {data.DOMICILIO && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          domicilio:{" "}
                        </span>
                        {data.DOMICILIO}
                      </p>
                    )}
                    {data.CALLE && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          calle:{" "}
                        </span>
                        {data.CALLE}
                      </p>
                    )}
                    {data.NUMEROCASA && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          n° casa:{" "}
                        </span>
                        {data.NUMEROCASA}
                      </p>
                    )}
                    {data.FECHAFALLECIMIENTO && (
                      <p className="uppercase text-sm font-medium truncate">
                        <span className="uppercase text-sm text-gray-600 font-bold">
                          fecha fallecimiento:{" "}
                        </span>
                        {data.FECHAFALLECIMIENTO}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DactilarQuery;
