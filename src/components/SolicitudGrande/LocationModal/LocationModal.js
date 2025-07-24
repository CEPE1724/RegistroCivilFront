import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { APIURL } from "../../../configApi/apiConfig";


export function LocationModal({
  openLocationModal,
  isOpen,
  locationType,
  locationData,
  onLocationChange,
  userSolicitudData,
  tipo,
  userData
}) {
  const defaultLocation = {
    address: "",
    latitude: "",
    longitude: "",
  };
  const initialLocation = locationData || defaultLocation;
  const [posicionActual, setPosicionActual ] = useState({lat: -1.8312, lng: -78.1834,})

  const [localLocation, setLocalLocation] = useState(initialLocation);
  const [errors, setErrors] = useState({
    address: "",
    latitude: "",
    longitude: "",
  });
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    visible: false,
  });
  

  const autocompleteRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const showSnackbar = (message, type = "info") => {
    setSnackbar({ message, type, visible: true });
    setTimeout(() => {
      setSnackbar({ message: "", type: "info", visible: false });
    }, 3000);
  };

  useEffect(() => {
    setLocalLocation(locationData || defaultLocation);
  }, [locationData]);

  useEffect(() => {
    setLocalLocation(initialLocation);
    setErrors({ address: "", latitude: "", longitude: ""});
  }, [isOpen]);

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
        if (num < -81 || num > -75) {
          error = "La longitud debe pertenecer a Ecuador (entre -81 y -75).";
        }
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setLocalLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const error = validateField(name, localLocation[name] || "");
    if (error) {
      showSnackbar(error, "error");
    }
  };

  const handleGetCurrentLocation = async () => {
    // const consent = window.confirm("¿Desea compartir su ubicación?");
    // if (!consent) return;

    if (!navigator.geolocation) {
      return showSnackbar(
        "La geolocalización no es soportada por tu navegador.",
        "error"
      );
    }
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      setLocalLocation((prev) => ({
        ...prev,
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
      }));
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
      );
      if (!data.results?.length) throw new Error("Sin resultados de dirección");
      setLocalLocation((prev) => ({
        ...prev,
        address: data.results[0].formatted_address,
      }));
      showSnackbar("Ubicación y dirección actualizadas.", "info");
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      showSnackbar("No se pudo obtener la ubicación o la dirección.", "error");
    }
  };

  const onMapClick = async (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setLocalLocation((prev) => ({
      ...prev,
      latitude: newLat.toFixed(6),
      longitude: newLng.toFixed(6),
    }));
    const latError = validateField("latitude", newLat.toFixed(6));
    const lngError = validateField("longitude", newLng.toFixed(6));
    setErrors((prev) => ({ ...prev, latitude: latError, longitude: lngError }));
    if (latError) showSnackbar(latError, "error");
    if (lngError) showSnackbar(lngError, "error");

  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=${googleMapsApiKey}`
    );
    if (data.results && data.results.length > 0) {
      setLocalLocation((prev) => ({
      ...prev,
      address: data.results[0].formatted_address,
      }));
    }
    } catch (error) {
    console.error("Error obteniendo dirección desde coordenadas:", error);
    }
  };

  const handleAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setLocalLocation((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      address: place.formatted_address || prev.address,
    }));
  };

  const handleSave = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

    const newErrors = {
      address: validateField("address", localLocation.address),
      latitude: validateField("latitude", localLocation.latitude),
      longitude: validateField("longitude", localLocation.longitude),
    };
    setErrors(newErrors);
    const errorMessages = Object.values(newErrors)
      .filter((e) => e !== "")
      .join(" ");
    if (errorMessages) {
      showSnackbar(errorMessages, "error");
      return;
    }

    const payload = {
    id: userSolicitudData.idCre_SolicitudWeb,
    cedula: userSolicitudData.Cedula,
    latitud: parseFloat(localLocation.latitude),
    longitud: parseFloat(localLocation.longitude),
    direccion: localLocation.address,
    ip: "192.168.2.183",
    Tipo: tipo,
    Usuario: userData.Nombre,
    web:1,
    };


    try {
      const token = localStorage.getItem("token");

      await axios.post(APIURL.postInsertarCoordenadasprefactura(), payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });      showSnackbar("Ubicación guardada exitosamente.", "success");
      if (onLocationChange) {
        onLocationChange(localLocation);
      }
      setTimeout(() => {
        if (isOpen) {
          isOpen();
        }
    setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error("Error al guardar la ubicación:", error);
      showSnackbar(
        "Error al guardar la ubicación. Por favor, intente más tarde.",
        "error"
      );
    setIsSubmitting(false);
    }
  };

  useEffect(()=> {
  if(isOpen && navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (position)=> {
        setPosicionActual({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, 
      (error)=>{
        console.error("Error al obtener la ubicacion", error);
      }
    );
  } else {
    console.warn("La geolocalización no está disponible en este navegador.");
  }
  }, [isOpen]);


  // función para extraer lat/lng de una URL tipo https://maps.google.com/?q=-0.139652,-78.437134
  const extractLatLngFromUrl = (text) => {
    const regex = /maps\.google\.com\/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = text.match(regex);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  };

  // Ejemplo: -0.2134171255355895, -78.50336508272733
  const extractLatLngFromDecimal = (text) => {
    const regex = /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/;
    const match = text.match(regex);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  };

  // Ejemplo: 2°12'04.7"S 78°50'51.9"W
  const extractLatLngFromDMS = (text) => {
    // Regex para DMS: 2°12'04.7"S 78°50'51.9"W
    const dmsRegex = /([\d.]+)[°º]\s*(\d+)[']\s*([\d.]+)[\"]?([NSns])\s+([\d.]+)[°º]\s*(\d+)[']\s*([\d.]+)[\"]?([EWew])/;
    const match = text.match(dmsRegex);
    if (!match) return null;
    // Latitud
    let latDeg = parseFloat(match[1]);
    let latMin = parseFloat(match[2]);
    let latSec = parseFloat(match[3]);
    let latDir = match[4].toUpperCase();
    // Longitud
    let lonDeg = parseFloat(match[5]);
    let lonMin = parseFloat(match[6]);
    let lonSec = parseFloat(match[7]);
    let lonDir = match[8].toUpperCase();
    // Convertir a decimal
    let lat = latDeg + latMin / 60 + latSec / 3600;
    let lon = lonDeg + lonMin / 60 + lonSec / 3600;
    if (latDir === 'S') lat = -lat;
    if (lonDir === 'W') lon = -lon;
    return { lat, lng: lon };
  };

  // NUEVO: función para actualizar dirección desde lat/lng
  const updateAddressFromLatLng = async (lat, lng) => {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
      );
      if (data.results && data.results.length > 0) {
        setLocalLocation((prev) => ({
          ...prev,
          address: data.results[0].formatted_address,
        }));
      }
    } catch (error) {
      console.error("Error obteniendo dirección desde coordenadas:", error);
    }
  };

  // NUEVO: handler para el input de búsqueda
  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    // Si es una URL de Google Maps, extraer lat/lng
    let coords = extractLatLngFromUrl(value);
    // Si no es URL, intentar extraer DMS
    if (!coords) {
      coords = extractLatLngFromDMS(value);
    }
    // Si no es DMS, intentar extraer decimal
    if (!coords) {
      coords = extractLatLngFromDecimal(value);
    }
    if (coords) {
      setLocalLocation((prev) => ({
        ...prev,
        latitude: coords.lat.toFixed(6),
        longitude: coords.lng.toFixed(6),
      }));
      await updateAddressFromLatLng(coords.lat, coords.lng);
    }
    // ...si quieres, puedes guardar el texto en un estado para el input de búsqueda...
  };

  if (!openLocationModal) return null;

  const mapCenter = {
    lat:
      localLocation.latitude !== ""
        ? parseFloat(localLocation.latitude)
        : posicionActual.lat,
    lng:
      localLocation.longitude !== ""
        ? parseFloat(localLocation.longitude)
        : posicionActual.lng,
  };

  const mapOptions = {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    restriction: {
      latLngBounds: {
        north: 2.0,
        south: -5.0,
        east: -75.0,
        west: -81.0,
      },
      strictBounds: true,
    },
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const snackbarColor =
    snackbar.type === "success"
      ? "bg-green-600"
      : snackbar.type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  const googleMapsApiKey = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-xl w-full max-w-5xl p-4 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Botón de cierre en la esquina superior derecha */}
        <button
          className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-900 z-50"
          onClick={() => isOpen()}
          title="Cerrar"
        >
          ❌
        </button>

        {/* Mapa con Autocomplete alineado a la derecha */}
        <div className="relative mb-4 rounded-xl overflow-hidden shadow-lg">
          <LoadScript
            googleMapsApiKey={googleMapsApiKey}
            libraries={["places"]}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={20}
              onClick={onMapClick}
              options={{
                ...mapOptions,
                disableDefaultUI: true,
                zoomControl: true,
                fullscreenControl: true,
              }}
            >
              <div
                className="absolute z-10 pointer-events-none flex items-center space-x-2"
                style={{ top: "10px", left: "250px" }}
              >
                <div className="bg-white rounded-lg shadow-md flex items-center space-x-2 p-1 pointer-events-auto">
                  {/* MODIFICADO: input de búsqueda editable */}
                  <Autocomplete
                    onLoad={handleAutocompleteLoad}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="Buscar dirección o pega URL Google Maps"
                      className="w-96 p-2 bg-transparent border-none focus:outline-none text-sm pac-target-input"
                      onChange={handleSearchInputChange}
                    />
                  </Autocomplete>
                </div>
              </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        <button
            onClick={handleGetCurrentLocation}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-all duration-300 ease-in-out"
            title="Obtener mi ubicación"
          >
            <MyLocationIcon className="text-black w-5 h-5" />
          </button>
          </div>
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Campos de latitud y longitud EDITABLES */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Latitud
            </label>
            <input
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              type="text"
              name="latitude"
              value={localLocation.latitude}
              onChange={(e) => {
                handleChange(e);
                // Si el valor es válido, actualizar dirección y marcador
                const val = e.target.value;
                if (/^-?\d+\.\d+$/.test(val) && localLocation.longitude) {
                  updateAddressFromLatLng(parseFloat(val), parseFloat(localLocation.longitude));
                }
              }}
              onBlur={handleBlur}
              placeholder="Latitud"
            />
            {errors.latitude && (
              <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Longitud
            </label>
            <input
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              type="text"
              name="longitude"
              value={localLocation.longitude}
              onChange={(e) => {
                handleChange(e);
                // Si el valor es válido, actualizar dirección y marcador
                const val = e.target.value;
                if (/^-?\d+\.\d+$/.test(val) && localLocation.latitude) {
                  updateAddressFromLatLng(parseFloat(localLocation.latitude), parseFloat(val));
                }
              }}
              onBlur={handleBlur}
              placeholder="Longitud"
            />
            {errors.longitude && (
              <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
            )}
          </div>
        </div>

        {/* Campos de Dirección y Subir Archivos (alineados en dos columnas) */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Dirección
            </label>
            <input
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
              type="text"
              name="address"
              disabled
              value={localLocation.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingrese la dirección"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 text-[10px] text-gray-600 hover:bg-gray-100 rounded-md transition duration-200"
            onClick={() => isOpen()}
          >
            Cancelar
          </button>
          <button
            className={`px-3 py-1 text-[10px] bg-blue-600 text-white rounded-md transition duration-200 shadow-md ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>

        {/* Snackbar */}
        {snackbar.visible && (
          <div
            className={`fixed top-4 right-4 ${snackbarColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 text-xs`}
          >
            {snackbar.message}
          </div>
        )}
      </div>
    </div>
  );
}