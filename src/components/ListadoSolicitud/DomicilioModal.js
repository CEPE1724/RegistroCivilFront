import axios from "../../configApi/axiosConfig";
import React, { useEffect, useState } from "react";
import { APIURL } from "../../configApi/apiConfig";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Modal from "react-modal";
import VerificacionTerrenaModal from "./VerificacionTerrenaModal";
import { useAuth } from "../AuthContext/AuthContext";
import jsPDF from "jspdf";
import DownloadIcon from '@mui/icons-material/Download';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export const GoogleMapModal = ({ lat, lng, onClose, apiKey }) => {
  const center = { lat, lng };
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
  };

  const generatePDF = (latitude, longitude) => {
	const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=20&size=600x400&scale=2&maptype=hybrid&markers=color:red|${latitude},${longitude}&key=AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag`;
  
	const pdf = new jsPDF();
  
	//titulo
	pdf.setFontSize(18);
	pdf.text("Croquis", 80, 20);
	
	// Cargar la imagen en el PDF
	const img = new Image();
	img.src = mapImageUrl;
	
	img.onload = () => {
	  // Añadir la imagen al PDF 
	  pdf.addImage(img, 'JPEG', 17, 45, 180, 120);
	  
	  // Guardar el PDF
	  pdf.save('ubicacion.pdf');
	};
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
		<div className="absolute bottom-4 left-4">
			<button
			onClick= {() => generatePDF(lat, lng)}
				className="bg-primaryBlue text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
			>
				<DownloadIcon/>
				Descargar
			</button>
		</div>
      </div>
    </div>
  );
};

// Cambia la firma del componente para aceptar onAprobar
const DomicilioModal = ({ openModal, closeModal, idsTerrenas, idSolicitud, datosCliente, onAprobar }) => {
  const { userData, idMenu } = useAuth();
  const [verificacionData, setVerificacionData] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [verificador, setVerificador] = useState(null);
  const [openVerificacionModal, setOpenVerificacionModal] = useState(false);
  const [permisos, setPermisos] = useState([]);
  const [showObsDialog, setShowObsDialog] = useState(false);
  const [obsAprobar, setObsAprobar] = useState("");
  const [estadoVerificacion, setEstadoVerificacion] = useState(null);

  const fetchVerificador = async (idCre_SolicitudWeb, estado) => {
    try {
      const url = APIURL.get_tiemposolicitudesweb(idCre_SolicitudWeb, estado);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data[0].Telefono;
        // data puede ser un array o un objeto, asumo objeto:
        // El nombre del verificador está en data.Telefono
        setVerificador(data || "Sin verificador");
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching tiemposolicitudesweb data:", error);
    }
  };

  useEffect(() => {
    const fetchVerificacionData = async () => {
      try {
        const id = idsTerrenas.idTerrenaGestionDomicilio;
        if (!id) return;
        const response = await axios.get(APIURL.getTerrenaGestionDomicilio(id));
        const data = response.data;

        // 👇 Convertir imágenes de string a array si es necesario
        if (typeof data.domicilioImages === "string") {
          try {
            data.domicilioImages = JSON.parse(data.domicilioImages);
          } catch (e) {
            // Si falla JSON.parse, lo tratamos como string manual
            data.domicilioImages = data.domicilioImages
              .replace(/[\[\]"]+/g, "")
              .split(",")
              .map((url) => url.trim());
          }
        }

        setVerificacionData(data);

        if (idSolicitud) {
          fetchVerificador(idSolicitud, 4);
        }

      } catch (error) {
        console.error("Error al obtener los datos de verificación:", error);
      }
    };

    if (openModal) {
      fetchVerificacionData();

    }
  }, [openModal, idsTerrenas, idSolicitud]);

  useEffect(() => {
    if (!openModal) {
      setVerificacionData("");
    }
  }, [openModal]);

  // Cargar permisos al abrir el modal (ajustado como en Cabecera)
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        if (userData?.idUsuario && idMenu) {
          const url = APIURL.getacces(idMenu, userData.idUsuario);
          const response = await axios.get(url, {
            headers: { "Content-Type": "application/json" },
          });
          if (response.status === 200) {
            setPermisos(response.data);
          } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching permisos:", error);
      }
    };
    if (openModal) fetchPermisos();
  }, [openModal, userData?.idUsuario, idMenu]);

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

  const direccionCoinMap = {
    1: "Coincide",
    2: "No Coincide",
  };

  const tipoVerificacionMap = {
    1: "Dirección incorrecta",
    2: "Aprobado",
    3: "Malas referencias",
    4: "No vive ahí",
    5: "Datos falsos",
    6: "Zona Vetada",
    7: "No sustenta ingresos",
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
    idClienteVerificacion,
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
    domicilioImages,
    direccionCoincide,
    tipoVerificacion,
  } = verificacionData;

  // NUEVO: función para registrar la aprobación con observación
  const fetchInsertarDatosAprobarEstado = async (tipo, data, estado, observacion) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();
      await axios.post(url, {
        idCre_SolicitudWeb: idSolicitud,
        Tipo: tipo,
        idEstadoVerificacionDocumental: estado,
        Usuario: userData.Nombre,
        Telefono: observacion
      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  // NUEVO: función para aprobar tipo de verificación con observación
  const handleAprobarVerificacion = async () => {
    setShowObsDialog(true);
  };

  const handleConfirmAprobar = async () => {
    try {
      // 1. Actualiza tipo de verificación en backend
      await axios.patch(APIURL.patchTipoVerificacionDomicilio(verificacionData.idTerrenaGestionDomicilio), {}, {
        headers: { "Content-Type": "application/json" }
      });
      // 2. Registra en tiemposolicitudesweb
      await fetchInsertarDatosAprobarEstado(4, idSolicitud, 6, obsAprobar.toUpperCase());
      // 3. Actualiza el estado local
      setVerificacionData((prev) => ({
        ...prev,
        tipoVerificacion: 2
      }));
      // 4. Actualiza el estado de la solicitud principal
      await axios.patch(APIURL.update_solicitud(idSolicitud), {
        idEstadoVerificacionDomicilio: 2
      }, {
        headers: { "Content-Type": "application/json" }
      });
      setShowObsDialog(false);
      setObsAprobar("");
      // Notificar al padre para recargar datos
      if (typeof onAprobar === "function") {
        onAprobar();
      }
    } catch (error) {
      console.error("Error al aprobar la verificación:", error);
    }
  };

  const renderField = (label, value, extra = null) =>
    value !== null && value !== "" ? (
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          {value}
          {extra}
        </p>
      </div>
    ) : null;

	const handleAbrirModalVerificador = () => {
		setOpenVerificacionModal(true)
	}

  // Permiso para aprobar tipo de verificación
  const tienePermisoEditarTipoVerificacion = () => {
    const permiso = permisos.find((p) => p.Permisos === "ANALISTA EDITAR TIPO VERIFICACION DOMICILIO");
    return permiso && permiso.Activo;
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-40">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8 max-h-[90vh] overflow-y-auto animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6">Domicilio</h2>
          {verificador && (
            <p className="mb-4 text-sm font-medium text-gray-700">
              Verificador: <span className="font-semibold">{verificador}</span>
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-4">
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
            {renderField(
              "Dirección Coincide",
              direccionCoinMap[direccionCoincide]
            )}
            {renderField(
              "Tipo de Verificación",
              tipoVerificacionMap[tipoVerificacion],
              // Mostrar botón solo si tiene permiso
              (tipoVerificacion !== 2 && 
                tienePermisoEditarTipoVerificacion() && idsTerrenas?.iEstado == 1) ? (
                <button
                  className="ml-2 px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 transition"
                  onClick={handleAprobarVerificacion}
                >
                  Aprobar Verificación
                </button>
              ) : null
            )}
			  { verificacionData?.tipoVerificacion !==2 && idsTerrenas.iEstado !== 2 && datosCliente?.Estado !== 3 && datosCliente?.Estado !== 4 && datosCliente?.Estado !== 5 && (
			  <div className="col-span-full flex justify-end mt-2">
				<button
				  className="rounded-full bg-yellow-500 text-white px-6 py-2 text-sm hover:bg-yellow-600 transition"
				  onClick={handleAbrirModalVerificador}
				>
				  Reasignar verificador
				</button>
			  </div>)}
            {Array.isArray(domicilioImages) && domicilioImages.length > 0 && (
              <div className="col-span-full mt-6">
                <h3 className="text-lg font-semibold mb-2">Fotos del domicilio</h3>
                <div className="flex overflow-x-auto space-x-4 p-2 border rounded-lg">
                  {domicilioImages.map((url, idx) => (
                    <div key={idx} className="relative flex-shrink-0 w-40 h-40 border rounded-lg overflow-hidden group">
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="object-cover w-full h-full"
                        onClick={() => setSelectedImage(url)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-white text-2xl"
                          onClick={() => {
                            setSelectedImage(url);
                            setShowImageModal(true);
                          }}
                        >
                          👁
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

      <Modal
        isOpen={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
        contentLabel="Imagen ampliada"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
        overlayClassName="Overlay"
      >
        <div className="relative bg-white rounded-xl p-4 max-w-4xl w-full flex flex-col items-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-2 right-2 text-red-600 font-bold text-xl"
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            className="max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      </Modal>

      {/* MAP MODAL */}
      {showMapModal && Latitud && Longitud && (
        <GoogleMapModal
          lat={Latitud}
          lng={Longitud}
          apiKey={GOOGLE_MAPS_API_KEY}
          onClose={() => setShowMapModal(false)}
        />
      )}

	  <VerificacionTerrenaModal
	  isOpen={openVerificacionModal}
	  onClose={() => setOpenVerificacionModal(false)}
	  userSolicitudData={datosCliente}
	  userData={userData}
	  tipoSeleccionado={"domicilio"}
	  idClienteVerificacion={verificacionData?.idClienteVerificacion}
	  />

      {/* Modal para observación al aprobar */}
      <Dialog open={showObsDialog} onClose={() => setShowObsDialog(false)}>
        <DialogTitle>Observación para aprobar verificación</DialogTitle>
        <DialogContent>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Ingrese una observación"
            value={obsAprobar}
            onChange={e => setObsAprobar(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-700"
            onClick={() => setShowObsDialog(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white"
            onClick={handleConfirmAprobar}
            disabled={!obsAprobar.trim()}
          >
            Aprobar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DomicilioModal;