import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function LocationModal({ openLocationModal, isOpen, locationType, locationData, onLocationChange }) {
  // Objeto por defecto para la ubicación en caso de que no se reciba nada
  const defaultLocation = { address: "", latitude: "-1.8312", longitude: "-78.1834" };

  // Si locationData es nulo, usamos defaultLocation
  const initialLocation = locationData || defaultLocation;
  const [localLocation, setLocalLocation] = useState(initialLocation);

  // Actualiza el estado local cada vez que cambie locationData
  useEffect(() => {
    setLocalLocation(locationData || defaultLocation);
  }, [locationData]);

  // Maneja los cambios en los inputs (dirección, latitud, longitud)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalLocation((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para guardar los cambios y enviarlos al componente padre
  const handleSave = () => {
    if (onLocationChange) {
      onLocationChange(localLocation);
    }
    if (isOpen) {
      isOpen(); // Se asume que isOpen es la función para cerrar el modal
    }
  };

  // Si el modal no debe mostrarse, retorna null
  if (!openLocationModal) return null;

  // Definición de la posición a mostrar en el mapa
  const defaultPosition = {
    lat: localLocation.latitude ? parseFloat(localLocation.latitude) : 37.7749,
    lng: localLocation.longitude ? parseFloat(localLocation.longitude) : -122.4194
  };

  // Maneja el clic en el mapa y actualiza la posición del marcador
  const onMapClick = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setLocalLocation((prev) => ({
      ...prev,
      latitude: newLat.toFixed(6),
      longitude: newLng.toFixed(6)
    }));
  };

  // Estilos para el contenedor del mapa
  const containerStyle = {
    width: "100%",
    height: "100%"
  };

  // Reemplaza con tu API Key de Google Maps
  const googleMapsApiKey = "";

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
            placeholder="Ingrese la dirección"
          />
        </div>

        {/* Campos para latitud y longitud */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 font-medium">Latitud:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="latitude"
              value={localLocation.latitude}
              onChange={handleChange}
              placeholder="Latitud"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Longitud:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="longitude"
              value={localLocation.longitude}
              onChange={handleChange}
              placeholder="Longitud"
            />
          </div>
        </div>

        {/* Mapa interactivo con la API de Google Maps */}
        <div className="mb-4 h-64 w-full rounded overflow-hidden">
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultPosition}
              zoom={13}
              onClick={onMapClick}
            >
              <Marker position={defaultPosition} />
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
          <button
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 text-xs px-6 py-2.5"
            onClick={isOpen}
          >
            Cancelar
          </button>
          <button
            className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-8 py-2.5 focus:shadow-none"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
