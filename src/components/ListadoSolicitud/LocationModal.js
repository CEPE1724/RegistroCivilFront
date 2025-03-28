import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { APIURL } from "../../configApi/apiConfig";

function LocationModal({
  openLocationModal,
  isOpen,
  locationType,
  locationData,
  onLocationChange,
  userSolicitudData,
}) {
  const defaultLocation = {
    address: "",
    latitude: "",
    longitude: "",
    files: "",
  };
  const initialLocation = locationData || defaultLocation;

  const [localLocation, setLocalLocation] = useState(initialLocation);
  const [errors, setErrors] = useState({
    address: "",
    latitude: "",
    longitude: "",
    files: "",
  });
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    visible: false,
  });
  const [files, setFiles] = useState([]);

  const autocompleteRef = useRef(null);

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
    setErrors({ address: "", latitude: "", longitude: "", files: "" });
    setFiles([]);
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
    } else if (name === "address") {
      if (value.trim() === "") {
        error = "La dirección es obligatoria.";
      } else if (!/^[\w\s\u00C0-\u017F,.\-+#/]+$/.test(value)) {
        error = "La dirección contiene caracteres no permitidos.";
      }
    } else if (name === "files") {
      if (files.length === 0) {
        error = "Debe subir al menos tres archivos.";
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validExtensions = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const validFiles = [];
    let hasInvalid = false;

    selectedFiles.forEach((file) => {
      if (
        file.type.startsWith("image/") ||
        validExtensions.includes(file.type)
      ) {
        validFiles.push(file);
      } else {
        hasInvalid = true;
        showSnackbar(
          `El archivo ${file.name} no es un formato permitido.`,
          "error"
        );
      }
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setErrors((prev) => ({ ...prev, files: "" })); // Limpia error si hay válidos
    }

    if (validFiles.length === 0 && hasInvalid) {
      setErrors((prev) => ({
        ...prev,
        files: "Debe subir al menos un archivo válido.",
      }));
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    showSnackbar("Archivo eliminado.", "info");
  };

  const handleGetCurrentLocation = async () => {
    const consent = window.confirm("¿Desea compartir su ubicación?");
    if (!consent) return;

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

  const onMapClick = (event) => {
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

  // Función de subida de archivos: llama al backend y retorna las URLs públicas
  const uploadFiles = async () => {
    if (!files || files.length === 0) {
      showSnackbar("Debe subir al menos un archivo.", "error");
      return null;
    }
    if (files.length < 3) {
      showSnackbar("Debe subir al menos 3 archivos.", "error");
      return null;
    }
    const uploadEndpoint = APIURL.postFileupload();
    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("almacen", userSolicitudData.almacen);
          formData.append("cedula", userSolicitudData.cedula);
          formData.append("numerosolicitud", userSolicitudData.NumeroSolicitud);
          formData.append("Tipo", userSolicitudData.Tipo || "DEFAULT");
          const res = await fetch(uploadEndpoint, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok || !data.url) throw new Error("Upload failed");
          return data.url;
        })
      );
      return uploadResults;
    } catch (error) {
      console.error("Error al subir archivos:", error);
      showSnackbar("Error al subir algunos archivos.", "error");
      return null;
    }
  };

  const handleSave = async () => {
    const newErrors = {
      address: validateField("address", localLocation.address),
      latitude: validateField("latitude", localLocation.latitude),
      longitude: validateField("longitude", localLocation.longitude),
      files: validateField("files", files.length),
    };
    setErrors(newErrors);
    const errorMessages = Object.values(newErrors)
      .filter((e) => e !== "")
      .join(" ");
    if (errorMessages) {
      showSnackbar(errorMessages, "error");
      return;
    }

    if (files.length < 3) {
      setErrors((prev) => ({
        ...prev,
        files: "Debe subir al menos 3 archivos.",
      }));
      showSnackbar("Debe subir al menos 3 archivos.", "error");
      return;
    }

    const uploadedUrls = await uploadFiles();
    if (!uploadedUrls) return;

    const payload = {
      id: userSolicitudData.id,
      cedula: userSolicitudData.cedula,
      latitud: parseFloat(localLocation.latitude),
      longitud: parseFloat(localLocation.longitude),
      direccion: localLocation.address,
      ip: "192.168.2.183",
      UrlImagen: uploadedUrls,
    };

    try {
      await axios.post(APIURL.postInsertarCoordenadasprefactura(), payload);
      showSnackbar("Ubicación guardada exitosamente.", "success");
      if (onLocationChange) {
        onLocationChange(localLocation);
      }
      setTimeout(() => {
        if (isOpen) {
          isOpen();
        }
      }, 3000);
    } catch (error) {
      console.error("Error al guardar la ubicación:", error);
      showSnackbar(
        "Error al guardar la ubicación. Por favor, intente más tarde.",
        "error"
      );
    }
  };

  if (!openLocationModal) return null;

  const mapCenter = {
    lat:
      localLocation.latitude !== ""
        ? parseFloat(localLocation.latitude)
        : -1.8312,
    lng:
      localLocation.longitude !== ""
        ? parseFloat(localLocation.longitude)
        : -78.1834,
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
      <div className="bg-white rounded-xl w-full max-w-2xl p-2 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Botón de cierre en la esquina superior derecha */}
        <button
          className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-900"
          onClick={() => isOpen()}
          title="Cerrar"
        >
          <span className="text-xl">&times;</span>
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
              zoom={13}
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
                  <Autocomplete
                    onLoad={handleAutocompleteLoad}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="Buscar dirección"
                      className="w-48 p-1.5 bg-transparent border-none focus:outline-none text-xs pac-target-input"
                    />
                  </Autocomplete>
                  <button
                    onClick={handleGetCurrentLocation}
                    className="bg-white p-1.5 rounded-full hover:bg-gray-100 transition-all duration-300 ease-in-out"
                    title="Obtener mi ubicación"
                  >
                    <LocationOnIcon className="text-blue-600 w-4 h-4" />
                  </button>
                </div>
              </div>
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Campos de latitud y longitud */}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              Subir archivos
            </label>
            <input
              type="file"
              name="files"
              multiple
              onChange={handleFileChange}
              className={`w-full text-xs p-1 border rounded-md focus:outline-none focus:ring-1 ${
                errors.files
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            {errors.files && (
              <p className="text-red-500 text-xs mt-1">{errors.files}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Dirección
            </label>
            <input
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
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
        </div>

        {/* Lista de archivos seleccionados */}
        {files.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700">
              Archivos seleccionados:
            </p>
            <ul className="list-disc list-inside text-xs text-gray-600">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-evenly">
                  <span>{file.name}</span>
                  <button
                    className="text-white bg-red-500 text-[14px] font-bold p-1 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    title="Eliminar archivo"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 text-[10px] text-gray-600 hover:bg-gray-100 rounded-md transition duration-200"
            onClick={() => isOpen()}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-1 text-[10px] bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
            onClick={handleSave}
          >
            Guardar
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

export default LocationModal;
