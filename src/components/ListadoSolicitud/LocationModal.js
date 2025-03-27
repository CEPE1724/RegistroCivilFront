import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { APIURL } from "../../configApi/apiConfig";

function LocationModal({ 
  openLocationModal, 
  isOpen, 
  locationType, 
  locationData, 
  onLocationChange, 
  userSolicitudData 
}) {
  
  const defaultLocation = { address: "", latitude: "", longitude: "" };
  const initialLocation = locationData || defaultLocation;
  
  const [localLocation, setLocalLocation] = useState(initialLocation);
  const [errors, setErrors] = useState({ address: "", latitude: "", longitude: "" });
  // Snackbar: ahora incluye 'type' para definir el color (success, error, info).
  const [snackbar, setSnackbar] = useState({ message: "", type: "info", visible: false });

  // Función para mostrar el snackbar por 3 segundos.
  const showSnackbar = (message, type = "info") => {
    setSnackbar({ message, type, visible: true });
    setTimeout(() => {
      setSnackbar({ message: "", type: "info", visible: false });
    }, 3000);
  };

  useEffect(() => {
    setLocalLocation(locationData || defaultLocation);
  }, [locationData]);

  // Reinicia datos y errores al abrir el modal.
  useEffect(() => {
    setLocalLocation(initialLocation);
    setErrors({ address: "", latitude: "", longitude: "" });
  }, [isOpen]);

  // Función de validación para cada campo.
  const validateField = (name, value) => {
    let error = "";
    if (name === "latitude") {
      if (value.trim() === "") {
        error = "La latitud es obligatoria.";
      } else if (!/^-?\d{1,2}(\.\d{1,6})?$/.test(value)) {
        error = "Formato inválido para la latitud.";
      } else {
        const num = parseFloat(value);
        if (num < -90 || num > 90) {
          error = "La latitud debe estar entre -90 y 90.";
        }
        // Restricción para Ecuador: entre -5.0 y 2.0.
        if (num < -5 || num > 2) {
          error = "La latitud debe pertenecer a Ecuador (entre -5.0 y 2.0).";
        }
      }
    } else if (name === "longitude") {
      if (value.trim() === "") {
        error = "La longitud es obligatoria.";
      } else if (!/^-?\d{1,3}(\.\d{1,6})?$/.test(value)) {
        error = "Formato inválido para la longitud.";
      } else {
        const num = parseFloat(value);
        if (num < -180 || num > 180) {
          error = "La longitud debe estar entre -180 y 180.";
        }
        // Restricción para Ecuador: entre -81 y -75.
        if (num < -81 || num > -75) {
          error = "La longitud debe pertenecer a Ecuador (entre -81 y -75).";
        }
      }
    } else if (name === "address") {
      if (value.trim() === "") {
        error = "La dirección es obligatoria.";
      } else if (!/^[a-zA-Z0-9\s,.\-]+$/.test(value)) {
        error = "La dirección contiene caracteres no permitidos.";
      }
    }
    return error;
  };

  // Maneja cambios en los inputs y valida en línea.
  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setLocalLocation((prev) => ({ ...prev, [name]: value }));
  };

  // Al salir del campo, muestra snackbar si hay error.
  const handleBlur = (e) => {
    const { name } = e.target;
    const error = validateField(name, localLocation[name] || "");
    if (error) {
      showSnackbar(error, "error");
    }
  };

  // Obtiene la ubicación actual y utiliza geocodificación inversa para actualizar la dirección.
  const handleGetCurrentLocation = async () => {
    // Preguntar al usuario si desea compartir su ubicación.
    const consent = window.confirm("¿Desea compartir su ubicación?");
    if (!consent) return;
    
    if (!navigator.geolocation) {
      return showSnackbar("La geolocalización no es soportada por tu navegador.", "error");
    }
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      setLocalLocation((prev) => ({
        ...prev,
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6)
      }));
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
      );
      if (!data.results?.length) throw new Error("Sin resultados de dirección");
      setLocalLocation((prev) => ({
        ...prev,
        address: data.results[0].formatted_address
      }));
      showSnackbar("Ubicación y dirección actualizadas.", "info");
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      showSnackbar("No se pudo obtener la ubicación o la dirección.", "error");
    }
  };

  // Actualiza coordenadas al hacer clic en el mapa.
  const onMapClick = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setLocalLocation((prev) => ({
      ...prev,
      latitude: newLat.toFixed(6),
      longitude: newLng.toFixed(6)
    }));
    // Valida la selección desde el mapa.
    const latError = validateField("latitude", newLat.toFixed(6));
    const lngError = validateField("longitude", newLng.toFixed(6));
    setErrors((prev) => ({ ...prev, latitude: latError, longitude: lngError }));
    if (latError) showSnackbar(latError, "error");
    if (lngError) showSnackbar(lngError, "error");
  };


  const googleMapsApiKey = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";

  
  const handleSave = async () => {
    const newErrors = {
      address: validateField("address", localLocation.address),
      latitude: validateField("latitude", localLocation.latitude),
      longitude: validateField("longitude", localLocation.longitude)
    };
    setErrors(newErrors);
    const errorMessages = Object.values(newErrors).filter((e) => e !== "").join(" ");
    if (errorMessages) {
      showSnackbar(errorMessages, "error");
      return;
    }
    
    const payload = {
      id: userSolicitudData.id, // Ajusta según corresponda.
      cedula: userSolicitudData.cedula,
      latitud: parseFloat(localLocation.latitude),
      longitud: parseFloat(localLocation.longitude),
      direccion: localLocation.address,
      ip: "192.168.2.183", 
      UrlImagen: [
        userSolicitudData.imagen,
        userSolicitudData.imagen,
        userSolicitudData.imagen
      ]
    };

    try {
      await axios.post(APIURL.postInsertarCoordenadasprefactura(), payload);
      showSnackbar("Ubicación guardada exitosamente.", "success");
      // Notificar al componente padre si es necesario.
      if (onLocationChange) {
        onLocationChange(localLocation);
      }
      // Esperar 3 segundos para que el usuario vea el mensaje, luego cerrar el modal.
      setTimeout(() => {
        if (isOpen) {
          isOpen(); // Cierra el modal.
        }
      }, 3000);
    } catch (error) {
      console.error("Error al guardar la ubicación:", error);
      showSnackbar("Error al guardar la ubicación. Por favor, intente más tarde.", "error");
    }
  };

  if (!openLocationModal) return null;

  // Centro del mapa: si no hay coordenadas ingresadas, se centra en Ecuador.
  const mapCenter = {
    lat: localLocation.latitude !== "" ? parseFloat(localLocation.latitude) : -1.8312,
    lng: localLocation.longitude !== "" ? parseFloat(localLocation.longitude) : -78.1834
  };

  // Opciones para restringir el mapa a Ecuador.
  const mapOptions = {
    restriction: {
      latLngBounds: {
        north: 2.0,
        south: -5.0,
        east: -75.0,
        west: -81.0
      },
      strictBounds: true
    }
  };

  const containerStyle = {
    width: "100%",
    height: "100%"
  };

  // Determina el color del snackbar según su tipo.
  const snackbarColor = snackbar.type === "success"
    ? "bg-green-600"
    : snackbar.type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md w-full max-w-md p-6 relative shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          Ubicación {locationType || ""}
        </h2>

        {/* Campo para la dirección */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Dirección:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="address"
            value={localLocation.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingrese la dirección"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* Inputs para latitud y longitud */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 font-medium">Latitud:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="latitude"
              value={localLocation.latitude}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Latitud"
            />
            {errors.latitude && (
              <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Longitud:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="longitude"
              value={localLocation.longitude}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Longitud"
            />
            {errors.longitude && (
              <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
            )}
          </div>
        </div>

        {/* Texto con icono para obtener la ubicación actual */}
        <div className="mb-4 flex justify-center items-center">
          <div
            onClick={handleGetCurrentLocation}
            className="flex items-center cursor-pointer text-primaryBlue hover:text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline-block mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a6 6 0 00-6 6c0 3.15 4.5 9.58 5.24 10.54.3.36.86.36 1.16 0C11.5 17.58 16 11.15 16 8a6 6 0 00-6-6zM7 8a3 3 0 116 0 3 3 0 01-6 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Obtener mi ubicación actual</span>
          </div>
        </div>

        {/* Mapa interactivo con Google Maps */}
        <div className="mb-3 h-48 w-full rounded overflow-hidden">
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={13}
              onClick={onMapClick}
              options={mapOptions}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
          <button
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 text-xs px-6 py-2.5"
            onClick={isOpen}
          >
            Cancelar
          </button>
          <button
            className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-8 py-2.5 focus:shadow-none"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
      {/* Snackbar para mostrar mensajes */}
      {snackbar.visible && (
        <div className={`fixed top-1 right-3 ${snackbarColor} text-white px-4 py-2 rounded shadow-lg`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
}

export default LocationModal;
