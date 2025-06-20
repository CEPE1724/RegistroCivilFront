import React, { useEffect, useState } from "react";
import axios from "../../../configApi/axiosConfig";
import { CircularProgress, Alert, Button } from "@mui/material";

export function RegistroCivil({
  cedula,
  dactilar,
  imagenSubida,
  onAceptar,
  onRechazar,
  resultadoVerificacion,
  permisos,
  estadoSolicitud,
}) {
	console.log("estadoSolicitud", estadoSolicitud)
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // Calcular porcentaje de similitud basado en el threshold
  const distance = resultadoVerificacion?.distance || 0;
  const threshold = resultadoVerificacion?.threshold || 1;
  const similarityPercent =
    Math.max(0, Math.min(1, 1 - distance / threshold)) * 100;

  const hanldeResetInputs = () => setError(null);


  const handleQuery = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const getResponse = await axios.get(`dactilar/${cedula}`, config);
        if (getResponse.data.statusCode === 200 && getResponse.data.data) {
          setData(getResponse.data.data);
          hanldeResetInputs();
        } else {
          throw new Error("Data not found for the provided cedula.");
        }
      } catch (err) {
        if (err.response && err.response.status === 500) {
          const postResponse = await axios.post(
            "dactilar/consulta",
            { cedula, dactilar },
            config
          );
          if (postResponse.data.data) {
            setData(postResponse.data.data);
            hanldeResetInputs();
          } else {
            throw new Error("Data query failed");
          }
        } else {
          throw new Error("Error fetching data: " + err.message);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        const errorMessage = err.response.data.message;
        let parsedMessage;
        try {
          const errorObject = JSON.parse(
            errorMessage.replace("Error en la consulta: ", "")
          );
          parsedMessage = errorObject.mensaje?.mensaje;
        } catch (parseError) {
          parsedMessage = "Error desconocido";
        }
        setError(parsedMessage);
        setData(null);
      } else {
        console.error("Error fetching data:", err.message);
      }
    }
  };

  //   const handleVerificarIdentidad = async () => {
  // 	try {
  // 	  if (!imagenSubida || !data?.FOTO) {
  // 		setError("Faltan imágenes para comparar.");
  // 		return;
  // 	  }

  // 	  const token = localStorage.getItem("token");
  // 	  const config = {
  // 		headers: {
  // 		  Authorization: `Bearer ${token}`,
  // 		  "Content-Type": "application/json"
  // 		}
  // 	  };

  // 	  const body = {
  // 		image1_url: imagenSubida,
  // 		image2_base64: data.FOTO,
  // 	  };

  // 	  const response = await axios.post(APIURL.postCompareFaces(), body, config);

  // 	  console.log("Resultado comparación:", response.data);
  // 	  const { verified, distance } = response.data;

  // 	  if (verified) {
  // 		onAceptar();
  // 	  } else {
  // 		setError(`Las imágenes no coinciden. Distancia: ${distance.toFixed(3)}`);
  // 	  }

  // 	} catch (err) {
  // 	  console.error("Error al verificar identidad:", err);
  // 	  setError("Error durante la verificación facial.");
  // 	}
  //   };

    const permisoAprobarVerificacion = () => {
    const permiso = permisos.find((p) => p.Permisos === "APROBAR RECONOCIMIENTO FACIAL");
    return permiso && permiso.Activo;
  //}
    //return true
  };

  useEffect(() => {
    if (cedula && dactilar) {
      handleQuery();
    }
  }, [cedula, dactilar]);

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      {/* Error Alert */}
      {error && (
        <div className="flex justify-center my-4">
          <Alert
            severity="error"
            onClose={() => setError(null)}
            className="animate-fadeIn shadow-lg"
          >
            {error}
          </Alert>
        </div>
      )}

      {data ? (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 pb-6">
              Verificación de Identidad
            </h2>
            {/*<p className="text-gray-600 mt-2">
              Compare las imágenes para confirmar la identidad
            </p>*/}
          </div>

          {/* Image Comparison Section */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            {/* Uploaded Image */}
            {imagenSubida && (
              <div className="relative group w-full lg:w-1/2 max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
                  <div className="bg-blue-600 text-white py-3 px-4 font-semibold text-center">
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Imagen Subida
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src={imagenSubida}
                      alt="Imagen subida por el usuario"
                      className="rounded object-cover w-full h-80 transform transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Arrow */}
            <div className="flex flex-col items-center justify-center py-4 lg:py-0">
              <div className="hidden lg:flex bg-white p-3 rounded-full shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
              <div className="block lg:hidden bg-white p-3 rounded-full shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Civil Registry Image */}
            {data.FOTO && (
              <div className="relative group w-full lg:w-1/2 max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-teal-200 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
                  <div className="bg-green-600 text-white py-3 px-4 font-semibold text-center">
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3.707 9.293a1 1 0 011.414 0L9 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Imagen del Registro Civil
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src={`data:image/jpeg;base64,${data.FOTO}`}
                      alt="Imagen del Registro Civil"
                      className="rounded object-cover w-full h-80 transform transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Similarity Indicator */}
          {/* <div className="mt-8 mb-6 max-w-md mx-auto">
            <p className="text-center text-gray-700 font-medium mb-2">Coincidencia de identidad</p>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 via-green-500 to-green-600 w-4/5"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Diferente</span>
              <span>Similar</span>
              <span>Idéntico</span>
            </div>
          </div> */}

          {/* Decision Buttons */}
          {/* Decision Buttons */}
          {resultadoVerificacion && (
            <>
              {!data?.FOTO && (
                <p className="text-center text-yellow-700 bg-yellow-100 p-3 rounded my-4 font-medium">
                  No se encontró imagen del Registro Civil. La verificación será
                  manual.
                </p>
              )}

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                {(!resultadoVerificacion.verified || !data?.FOTO) && permisoAprobarVerificacion() && estadoSolicitud !== 2 && estadoSolicitud !== 6 && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={onAceptar}
                    className="group relative py-3 px-8 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-green-200 hover:shadow-xl"
                    startIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    Aprobar Verificación
                  </Button>
                )}

                { permisoAprobarVerificacion() && estadoSolicitud !== 2 &&  estadoSolicitud !== 6 &&
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onRechazar}
                  className="group relative py-3 px-8 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-red-200 hover:shadow-xl"
                  startIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                >
                  Rechazar Verificación
                </Button>}
              </div>
            </>
          )}

          {/* Decision Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            {/* <Button
              variant="contained"
              color="success"
              onClick={ () => handleVerificarIdentidad() }
              className="group relative py-3 px-8 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-green-200 hover:shadow-xl"
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              }
            >
              Verificar Identidad
            </Button> */}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center py-16">
          <CircularProgress size={60} thickness={4} />
          <p className="mt-4 text-gray-600 font-medium">
            Cargando información...
          </p>
        </div>
      )}
    </div>
  );
}
