import React, { useState, useEffect } from "react";
import { APIURL } from "../../configApi/apiConfig";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Home, Work, CalendarToday, AttachMoney, LocationOn, Phone, Person, Map } from '@mui/icons-material';


const GoogleMapModal = ({ lat, lng, onClose, apiKey }) => {
  const center = { lat, lng };
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[500px] relative animate-fade-in">

        {/* Botón de cerrar tipo X fuera del área del mapa */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-primaryBlue border border-primaryBlue rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-primaryBlue hover:text-white transition z-50"
        >
          X
        </button>

        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={18}
            options={{
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

const TrabajoModal = ({ openModal, closeModal, idsTerrenas }) => {
  const [trabajoInfo, setTrabajoInfo] = useState(null); // Estado para almacenar los datos del trabajo
  const [showMapModal, setShowMapModal] = useState(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";

  // Usamos useEffect para realizar la llamada a la API solo cuando el modal está abierto
  useEffect(() => {
    if (openModal && idsTerrenas.idTerrenaGestionTrabajo) {
      fetchTrabajoInfo(idsTerrenas.idTerrenaGestionTrabajo);
    }
  }, [openModal, idsTerrenas.idTerrenaGestionTrabajo]); // Se ejecuta cuando cambia openModal o idsTerrenas.idTerrenaGestionTrabajo

  // Función para obtener la información del trabajo
  const fetchTrabajoInfo = async (id) => {
    try {
      const url = APIURL.get_info_trabajo(id);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setTrabajoInfo(response.data); // Guardamos los datos en el estado
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al obtener la información del trabajo:", error);
    }
  };

  console.log(trabajoInfo, "   haasdasda");

  // Si el modal no está abierto, retornamos null
  if (!openModal) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl sm:max-w-3xl md:max-w-2xl lg:max-w-7xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Work className="mr-2 w-5 h-5" /> Trabajo
        </h2>
  
        <div className="grid grid-cols-1 gap-4">
          {trabajoInfo && (
            <>
              <div className="col-span-1">
                <label className="font-semibold flex items-center mb-2">
                  <Home className="mr-2 w-5 h-5" /> Tipo de Vivienda
                </label>
                <div className="flex flex-wrap sm:flex-row sm:space-x-4 mt-2">
                  {trabajoInfo.idTerrenaTipoTrabajo === 1 && (
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="housing" value="dependiente" className="form-radio" checked readOnly />
                      <span>Dependiente</span>
                    </label>
                  )}
                  {trabajoInfo.idTerrenaTipoTrabajo === 2 && (
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="housing" value="independiente" className="form-radio" checked readOnly />
                      <span>Independiente</span>
                    </label>
                  )}
                  {trabajoInfo.idTerrenaTipoTrabajo === 3 && (
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="housing" value="informal" className="form-radio" checked readOnly />
                      <span>Informal</span>
                    </label>
                  )}
                </div>
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Tiempo de Trabajo (Meses)", value: trabajoInfo.iTiempoTrabajo, icon: CalendarToday },
                  { label: "Tiempo de Trabajo (Años)", value: trabajoInfo.iTiempoTrabajoYear, icon: CalendarToday },
                  { label: "Ingresos Mensuales", value: trabajoInfo.dIngresoTrabajo, icon: AttachMoney },
                  { label: "Actividad Laboral", value: trabajoInfo.ActividadTrabajo, icon: Work },
                ].map(({ label, value, icon: Icon }, index) => (
                  <div key={index}>
                    <label className="font-semibold flex items-center mb-2">
                      <Icon className="mr-2 w-5 h-5" /> {label}
                    </label>
                    <input
                      type="text"
                      placeholder={label}
                      value={value || ""}
                      className="block bg-gray-100 w-full rounded-md border border-gray-300 px-4 py-1.5 shadow-sm"
                      readOnly
                    />
                  </div>
                ))}
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold flex items-center mb-2">
                    <Phone className="mr-2 w-5 h-5" /> Teléfono Laboral
                  </label>
                  <input
                    type="text"
                    placeholder="Teléfono Laboral"
                    value={trabajoInfo.TelefonoTrabajo || ""}
                    className="block bg-gray-100 w-full rounded-md border border-gray-300 px-4 py-1.5 shadow-sm"
                    readOnly
                  />
                </div>
  
                <div>
                  <button
                    className="mt-6 px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-white hover:text-blue-500 border border-blue-500 transition flex items-center justify-center"
                    onClick={() => setShowMapModal(true)}
                  >
                    <Map className="mr-2 w-5 h-5" /> Ver ubicación en el mapa
                  </button>
                </div>
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Punto de Referencia Laboral", value: trabajoInfo.PuntoReferencia, icon: LocationOn },
                  { label: "Persona Entrevistada", value: trabajoInfo.PersonaEntrevistada, icon: Person },
                ].map(({ label, value, icon: Icon }, index) => (
                  <div key={index}>
                    <label className="font-semibold flex items-center mb-2">
                      <Icon className="mr-2 w-5 h-5" /> {label}
                    </label>
                    <input
                      type="text"
                      placeholder={label}
                      value={value || ""}
                      className="block bg-gray-100 w-full rounded-md border border-gray-300 px-4 py-1.5 shadow-sm"
                      readOnly
                    />
                  </div>
                ))}
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Calle Principal", value: trabajoInfo.CallePrincipal, icon: LocationOn },
                  { label: "Calle Secundaria", value: trabajoInfo.CalleSecundaria, icon: LocationOn },
                ].map(({ label, value, icon: Icon }, index) => (
                  <div key={index}>
                    <label className="font-semibold flex items-center mb-2">
                      <Icon className="mr-2 w-5 h-5" /> {label}
                    </label>
                    <input
                      type="text"
                      placeholder={label}
                      value={value || ""}
                      className="block bg-gray-100 w-full rounded-md border border-gray-300 px-4 py-1.5 shadow-sm"
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
  
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={closeModal}
            className="rounded-full hover:shadow-md transition bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 text-xs px-6 py-2.5 flex items-center"
          >
            Salir
          </button>
          <button
            onClick={closeModal}
            className="rounded-full hover:shadow-md transition bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 text-xs px-6 py-2.5 flex items-center"
          >
            Aceptar
          </button>
        </div>
      </div>
  
      {showMapModal && (
        <GoogleMapModal
          lat={trabajoInfo.Latitud}
          lng={trabajoInfo.Longitud}
          apiKey={GOOGLE_MAPS_API_KEY}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  );
};

export default TrabajoModal;