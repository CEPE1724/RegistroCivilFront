import React, { useEffect, useState } from "react";
import axios from "../../../configApi/axiosConfig";
import { CircularProgress, Alert, Button } from "@mui/material";
import { useAuth } from "../../AuthContext/AuthContext";
import { APIURL } from "../../../configApi/apiConfig";

export function RegistroCivil({
  cedula,
  dactilar,
  imagenSubida,
  onAceptar,
  onRechazar,
  resultadoVerificacion,
  permisos,
  estadoSolicitud,
  idSolicitud,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { userData} = useAuth();
  
  // Calcular porcentaje de similitud basado en el threshold
  const distance = resultadoVerificacion?.distance || 0;
  const threshold = resultadoVerificacion?.threshold || 1;
  const similarityPercent =
    Math.max(0, Math.min(1, 1 - distance / threshold)) * 100;

  const hanldeResetInputs = () => setError(null);

  const fetchInsertarDatos = async (tipo, data, estado) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {
        idCre_SolicitudWeb: data,
        Tipo: tipo,
        idEstadoVerificacionDocumental: estado,
        Usuario: userData?.Nombre,
        Telefono: dactilar, // Código dactilar
      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

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
        // Si el GET da 500, hacer el POST
        if (err.response && err.response.status === 500) {
          const postResponse = await axios.post(
            "dactilar/consulta",


            { 
              cedula, 
              dactilar, 
              Usuario: userData?.Nombre
            },

            config
          );
          if (postResponse.data.data) {
            setData(postResponse.data.data);
            hanldeResetInputs();
            
            // Registrar consulta exitosa
            await fetchInsertarDatos(1, idSolicitud, 20);
          } else {
            // No registrar error aquí - simplemente no hay datos
            throw new Error("Data query failed");
          }
        } else {
          throw new Error("Error fetching data: " + err.message);
        }
      }
    } catch (err) {
      // Este catch maneja errores del POST
      if (err.response && err.response.status === 500) {
        const errorMessage = err.response.data.message;
        let parsedMessage;
        try {
          const errorObject = JSON.parse(
            errorMessage.replace("Error en la consulta: ", "")
          );
          parsedMessage = errorObject.mensaje?.mensaje;
          
          // Solo registrar como fallida cuando hay un error real del POST
          await fetchInsertarDatos(1, idSolicitud, 21);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 animate-fadeIn">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-1">Error en la verificación</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {data ? (
        <div className="max-w-7xl mx-auto">
         
          {/* Comparación de Imágenes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Imagen Subida */}
            {imagenSubida && (
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                  {/* Header de la tarjeta */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Imagen Capturada</h3>
                          <p className="text-blue-100 text-xs">Fotografía del cliente</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                        <span className="text-white text-xs font-semibold">1/2</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenedor de imagen */}
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner bg-white">
                      <img
                        src={imagenSubida}
                        alt="Imagen subida por el usuario"
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay con efecto hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Imagen original capturada
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Imagen del Registro Civil */}
            {data.FOTO ? (
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                  {/* Header de la tarjeta */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">Registro Civil</h3>
                          <p className="text-green-100 text-xs">Fuente oficial verificada</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                        <span className="text-white text-xs font-semibold">2/2</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenedor de imagen */}
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-green-50">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner bg-white">
                      <img
                        src={`data:image/jpeg;base64,${data.FOTO}`}
                        alt="Imagen del Registro Civil"
                        className="w-full h-full object-cover"
                      />
                      {/* Badge de verificación */}
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-green-600 rounded-full shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white text-xs font-bold">OFICIAL</span>
                      </div>
                      {/* Overlay con efecto hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Base de datos del Registro Civil
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-300 p-8 text-center shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Imagen No Disponible</h3>
                  <p className="text-amber-700 text-sm mb-4">
                    No se encontró imagen en el Registro Civil
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-lg text-amber-800 text-sm font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Verificación manual requerida
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de Decisión */}
          {resultadoVerificacion && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              {/* Información de estado */}
              <div className="mb-8">
                {resultadoVerificacion.verified && data?.FOTO ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-900 mb-1">Verificación Exitosa</h3>
                        <p className="text-green-700 text-sm">La identidad ha sido verificada automáticamente mediante comparación biométrica facial.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-amber-100 rounded-full">
                        <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-amber-900 mb-1">Revisión Manual Requerida</h3>
                        <p className="text-amber-700 text-sm">
                          {!data?.FOTO 
                            ? 'No se encontró imagen del Registro Civil. Se requiere verificación manual por un operador autorizado.'
                            : 'La verificación automática no pudo confirmar la identidad. Se requiere revisión manual.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                {(!resultadoVerificacion.verified || !data?.FOTO) && permisoAprobarVerificacion() && estadoSolicitud !== 2 && estadoSolicitud !== 6 && (
                  <button
                    onClick={onAceptar}
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Aceptar Verificación</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                )}

                {permisoAprobarVerificacion() && estadoSolicitud !== 2 && estadoSolicitud !== 6 && (
                  <button
                    onClick={onRechazar}
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Rechazar Verificación</span>
                  </button>
                )}
              </div>

              {/* Nota de permisos */}
              {(!permisoAprobarVerificacion() || estadoSolicitud === 2 || estadoSolicitud === 6) && (
                <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Acciones no disponibles en este estado o sin permisos</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="relative">
            {/* Círculo animado externo */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping"></div>
            {/* Círculo de progreso */}
            <div className="relative w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
            {/* Icono central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cargando información</h3>
            <p className="text-gray-600">Consultando datos del Registro Civil...</p>
          </div>
        </div>
      )}
    </div>
  );
}


