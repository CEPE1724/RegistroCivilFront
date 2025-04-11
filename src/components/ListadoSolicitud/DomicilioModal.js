import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURL } from "../../configApi/apiConfig";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
          className="absolute -top-3 -left-4 bg-white text-primaryBlue border border-primaryBlue rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-primaryBlue hover:text-white transition z-50"
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


const DomicilioModal = ({ openModal, closeModal, idsTerrenas }) => {
  const [verificacionData, setVerificacionData] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";

  useEffect(() => {
    const fetchVerificacionData = async () => {
      try {
        const id = idsTerrenas.idTerrenaGestionDomicilio;
        if (!id) return;
        const response = await axios.get(APIURL.getTerrenaGestionDomicilio(id));
        setVerificacionData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de verificación:", error);
      }
    };

    if (openModal) {
      fetchVerificacionData();
    }
  }, [openModal, idsTerrenas]);

  if (!openModal || !verificacionData) return null;

  // Mapeos legibles
  const tipoViviendaMap = {
    1: "Casa",
    3: "Villa",
    4: "Mixta",
    2: "Departamento",
    5: "Media agua",
  };

  const estadoViviendaMap = {
    1: "Bueno",
    2: "Muy Bueno",
    3: "Malo",
  };

  const zonaViviendaMap = {
    1: "Urbano",
    2: "Rural",
  };

  const propiedadMap = {
    1: "Propio",
    2: "Arrendado",
    3: "Familiar",
  };

  const accesoMap = {
    1: "Fácil",
    2: "Difícil",
  };

  const coberturaMap = {
    1: "Llamada Móvil",
    2: "WhatsApp",
  };

  const tipoClienteMap = {
    1: "Cliente",
    2: "Garante",
  };

  const {
    // idTerrenaGestionDomicilio,
    // idClienteVerificacion,
    idTerrenaTipoCliente,
    iTiempoVivienda,
    idTerrenaTipoVivienda,
    idTerrenaEstadoVivienda,
    idTerrenaZonaVivienda,
    idTerrenaPropiedad,
    idTerrenaAcceso,
    idTerrenaCobertura,
    PuntoReferencia,
    PersonaEntrevistada,
    Observaciones,
    VecinoEntreVisto,
    DireccionesVisitada,
    CallePrincipal,
    CalleSecundaria,
    // FechaSistema,
    ValorArrendado,
    Latitud,
    Longitud,
  } = verificacionData;

  const renderField = (label, value) =>
    value !== null && value !== "" ? (
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
    ) : null;

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-40">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8 max-h-[90vh] overflow-y-auto animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6">Domicilio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-4">
            {/* {renderField("ID Terreno", idTerrenaGestionDomicilio)} */}
            {/* {renderField("ID Cliente Verificación", idClienteVerificacion)} */}
            {renderField(
              "Tipo de Cliente",
              tipoClienteMap[idTerrenaTipoCliente]
            )}
            {renderField(
              "Tiempo en Vivienda",
              iTiempoVivienda && `${iTiempoVivienda} años`
            )}
            {renderField(
              "Tipo de Vivienda",
              tipoViviendaMap[idTerrenaTipoVivienda]
            )}
            {renderField(
              "Estado de la Vivienda",
              estadoViviendaMap[idTerrenaEstadoVivienda]
            )}
            {renderField(
              "Zona de la Vivienda",
              zonaViviendaMap[idTerrenaZonaVivienda]
            )}
            {renderField("Propiedad", propiedadMap[idTerrenaPropiedad])}
            {renderField("Acceso", accesoMap[idTerrenaAcceso])}
            {renderField("Cobertura", coberturaMap[idTerrenaCobertura])}
            {renderField("Punto de Referencia", PuntoReferencia)}
            {renderField("Persona Entrevistada", PersonaEntrevistada)}
            {renderField("Vecino entrevistado", VecinoEntreVisto)}
            {renderField("Dirección Visitada", DireccionesVisitada)}
            {renderField("Calle Principal", CallePrincipal)}
            {renderField("Calle Secundaria", CalleSecundaria)}
            {renderField("Observaciones", Observaciones)}
            {/* {renderField("Fecha", FechaSistema?.slice(0, 19).replace("T", " "))} */}
            {renderField("Valor Arrendado", ValorArrendado)}

            {Latitud && Longitud && (
              <div>
                <button
                  className="mt-1 px-4 py-2 text-sm rounded-full bg-primaryBlue text-white hover:bg-white hover:text-primaryBlue border hover:border-primaryBlue transition"
                  onClick={() => setShowMapModal(true)}
                >
                  Ver ubicación en el mapa
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <button
              onClick={closeModal}
              className="rounded-full bg-gray-400 text-white px-6 py-2 text-sm hover:bg-gray-500 transition"
            >
              Salir
            </button>
            <button
              onClick={closeModal}
              className="rounded-full bg-primaryBlue text-white px-6 py-2 text-sm hover:bg-blue-700 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>

      {/* MAP MODAL */}
      {showMapModal && Latitud && Longitud && (
        <GoogleMapModal
          lat={Latitud}
          lng={Longitud}
          apiKey={GOOGLE_MAPS_API_KEY}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </>
  );
};



export default DomicilioModal;

