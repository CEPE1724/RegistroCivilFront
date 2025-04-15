import React, { useState, useEffect, use } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Icon,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import { FaCheckCircle } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { APIURL } from "../../configApi/apiConfig";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import StoreIcon from "@mui/icons-material/Store";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";
import useBodegaUsuario from "../../hooks/useBodegaUsuario";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HouseIcon from "@mui/icons-material/House";
import { red, yellow } from "@mui/material/colors";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../AuthContext/AuthContext";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import PendingIcon from "@mui/icons-material/Pending";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationModal from "./LocationModal";

import VerificacionTerrenaModal from "./VerificacionTerrenaModal";

import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // PENDIENTE
import HomeIcon from "@mui/icons-material/Home"; // DATOS DOMICILIO
import FavoriteIcon from "@mui/icons-material/Favorite"; // DATOS CÓNYUGE
import ContactsIcon from "@mui/icons-material/Contacts"; // DATOS REFERENCIAS
import CreditScoreIcon from "@mui/icons-material/CreditScore"; // INFORMACIÓN DE CRÉDITO
import AssessmentIcon from "@mui/icons-material/Assessment"; // FACTORES DE CRÉDITO

import { Popover, Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icono de tres puntos verticales
import DocumentStatusPopover from "./DocumentStatusPopover";
import Domicilio from "../SolicitudGrande/DatosCliente/Domicilio/Domicilio";
import DomicilioModal from "./DomicilioModal";
import TrabajoModal from "./TrabajoModal";
import { set } from "react-hook-form";
import { Api } from "@mui/icons-material";
import { RegistroCivil } from "./RegistroCivil/RegistroCivil";
import uploadFile from "../../hooks/uploadFile";

export function ListadoSolicitud() {
  const {
    data,
    loading,
    error,
    fetchBodegaUsuario,
    listaVendedoresporBodega,
    vendedor,
    analista,
    listadoAnalista,
  } = useBodegaUsuario();

  const [bodegass, setBodegass] = useState([]);
  const [selectedBodega, setSelectedBodega] = useState("todos");
  const [selectedVendedor, setSelectedVendedor] = useState("todos");
  const [analistaSelected, setAnalistaSelected] = useState("todos");
  const [dataBodega, setDataBodega] = useState([]);
  const [estado, setEstado] = useState("todos");
  const [datos, setDatos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [total, setTotal] = useState(0); // Total de registros
  const itemsPerPage = 5;
  const [searchDateFrom, setSearchDateFrom] = useState(""); // Fecha de inicio
  const [searchDateTo, setSearchDateTo] = useState("");
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openVerificacionModal, setOpenVerificacionModal] = useState(false);
  const [openModalPendiente, setOpenModalPendiente] = useState(false);
  const [closeVerificacionModal, setCloseVerificacionModal] = useState(false);
  const today = new Date().toISOString().split("T")[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
  const [tipo, setTipo] = useState([]);
  const [tipoClienteMap, setTipoClienteMap] = useState({});
  const [tipoVerificacionSeleccionada, setTipoVerificacionSeleccionada] =
    useState(null);

  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(today);
  const [fechaFin, setFechaFin] = useState(today);

  const [isDomicilioModalOpen, setDomicilioModalOpen] = useState(false);
  const handleCloseDomicilioModal = () => setDomicilioModalOpen(false);
  const [openRegistroCivil, setOpenRegistroCivil] = useState(false);

  const [isTrabajoModalOpen, setTrabajoModalOpen] = useState(false);
  const handleCloseTrabajoModal = () => setTrabajoModalOpen(false);

  const [domicilioData, setDomicilioData] = useState([]);
  const [trabajoData, setTrabajoData] = useState([]);

  const [idsTerrenas, setIdsTerrenas] = useState([]);

  const navigate = useNavigate();
  const { userData, idMenu } = useAuth();

  const [cedula, setCedula] = useState("");
  const [dactilar, setDactilar] = useState("");

  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [urlCloudstorage, setUrlCloudstorage] = useState(null);

  const handleFileChange = (event) => {
    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
    const file = event.target.files?.[0];

    if (!file) return;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      alert("El archivo debe ser una imagen (JPG o PNG)");
      return;
    }

    setFileToUpload(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadClick = async () => {
    if (!fileToUpload) {
      alert("Primero selecciona una imagen");
      return;
    }

    try {
      const fileUploadResponse = await uploadFile(
        fileToUpload,
        selectedRow.almacen,
        selectedRow.cedula,
        selectedRow.NumeroSolicitud,
        "Foto"
      );

      if (fileUploadResponse) {
        setUrlCloudstorage(fileUploadResponse.url); // Guardar URL del archivo subido

        // 6. Actualizar la solicitud con la URL de la foto
        const updatedData = {
          Foto: fileUploadResponse.url, // Usamos la URL obtenida del archivo subido
        };

        const updatedSolicitud = await fetchActualizaSolicitud(
          selectedRow.id,
          updatedData
        );

        // Actualiza visualmente la imagen del selectedRow directamente
setSelectedRow((prevRow) => ({
  ...prevRow,
  imagen: fileUploadResponse.url, // Actualiza el campo de imagen
}));
        setUrlCloudstorage();
      }
      fetchSolicitudes();

      // Si deseas refrescar la imagen desde la URL real del servidor, podrías usar:
      // setPreviewUrl(APIURL.getImagenURL(res.nombreArchivo));
      handleCloseDialog();
      setFileToUpload(null);

      enqueueSnackbar("foto subida correctamente", {
        variant: "success",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchActualizaSolicitud = async (idSolicitud, data) => {
    try {
      const url = APIURL.putUpdatesolicitud(idSolicitud); // URL para actualizar la solicitud
      const response = await axios.put(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data; // Retornar datos actualizados si es necesario
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error.message);
      throw error; // Re-lanzar error para manejarlo más tarde
    }
  };

  const bodegas = data || []; // Safely access the bodegas data
  const vendedores = vendedor || []; // Safely access the vendedores data
  const analistas = analista || []; // Safely access the analistas data

  const estadosOpciones = [
    { label: "Todos", value: "todos" },
    { label: "PRE-APROBADO", value: 1 },
    { label: "APROBADO", value: 2 },
    { label: "ANULADO", value: 3 },
    { label: "RECHAZADO", value: 4 },
    { label: "NO APLICA", value: 5 },
  ];
  const [clienteEstados, setClienteEstados] = useState([]);

  const verificacionSolicitud = (data) => {
    return data.idEstadoVerificacionSolicitud !== 12;
  };

  const estaDeshabilitado = (data) => {
    return data.resultado === 0;
  };

  const [solicitud, setSolicitud] = useState("Todos");

  /// estado solicitudes
  const estadoMap = {
    1: "PENDIENTE",
    10: "REVISIÓN",
    11: "CORRECIÓN",
    12: "APROBADO",
    13: "RECHAZADO",
  };

  const [documental, setDocumental] = useState("Todos");
  const estadoDocumentalMap = {
    1: "PROCESO",
    2: "REVISIÓN",
    3: "CORRECIÓN",
    4: "APROBACION",
  };

  const [telefonica, setTelefonica] = useState("Todos");
  const estadoTelefonicaMap = {
    1: "NO ASIGNADO",
    2: "ASIGNADO",
    3: "APROBADO",
    4: "RECHAZADO",
  };

const [domicilio , setDomicilio] = useState("Todos");
const [laboral , setLaboral] = useState("Todos");

const [nombre, setNombre] = useState("");
const [numeroSolicitud, setNumeroSolicitud] = useState("");

const DomicilioLaboralMap = {
  1: "ASIGNADO",
  2: "DATOS VERIFICADOR",
  3: "RECHAZA VERIFICADOR",
  4: "APROBADO ANALISTA",
  5: "RECHAZA ANALISTA",
};





  const estadoDeshabilitadoDocumental = (data) => {
    // Obtener el estado correspondiente al ID
    const estado = estadoDocumentalMap[data.idEstadoVerificacionDocumental];

    if (!estado) return true; // Si el estado no está mapeado, deshabilitar por seguridad
    // Buscar el permiso correspondiente en la lista de permisos
    const permiso = permisos.find(
      (p) => p.Permisos === `EDITAR DOCUMENTAL ${estado}`
    );
    // Retornar true si no existe el permiso o si no está activo
    return !permiso || !permiso.Activo;
  };

  const estadoDeshabilitadoporPermisos = (data) => {
    // Obtener el estado correspondiente al ID
    const estado = estadoMap[data.idEstadoVerificacionSolicitud];

    if (!estado) return true; // Si el estado no está mapeado, deshabilitar por seguridad

    // Buscar el permiso correspondiente en la lista de permisos
    const permiso = permisos.find(
      (p) => p.Permisos === `EDITAR SOLICITUD ${estado}`
    );

    // Retornar true si no existe el permiso o si no está activo
    return !permiso || !permiso.Activo;
  };

  const estadoDeshabilitadotelefonica = (data) => {
    // Obtener el estado correspondiente al ID
    const estado = estadoTelefonicaMap[data.idEstadoVerificacionTelefonica];

    if (!estado) return true; // Si el estado no está mapeado, deshabilitar por seguridad
    // Buscar el permiso correspondiente en la lista de permisos
    const permiso = permisos.find(
      (p) => p.Permisos === `EDITAR TELEFONICA ${estado}`
    );

    // Retornar true si no existe el permiso o si no está activo
    return !permiso || !permiso.Activo;
  };

  const estadoColores = {
    1: "#d0160e", // Rojo para Revisión
    2: "#f5a623", // Amarillo para Corrección
    3: "#2d3689", // Azul para Aprobado
    4: "#32CD32", // Verde para Aprobado
  };

  // Abre el Popover cuando el InfoIcon es clickeado
  const handlePopoverOpen = (event, tipo, data) => {
    fetchtiemposolicitudesweb(data.id, tipo);
    setPopoverData({
      open: true,
      anchorEl: event.currentTarget,
      selectedRowId: data.id, // Guardar la ID de la fila seleccionada
    });
  };

  const [popoverData, setPopoverData] = React.useState({
    open: false,
    anchorEl: null,
    clienteEstados: [],
    selectedRowId: null, // ID para identificar qué fila tiene el popover abierto
  });

  const handlePopoverClose = () => {
    setPopoverData({ open: false, anchorEl: null, selectedRowId: null });
  };

  const [userSolicitudData, setUserSolicitudData] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchTipoConsulta(),
          fetchBodega(),
          fetchTipoCliente(),
          permissionscomponents(idMenu, userData.idUsuario),
          fecthAnalista(),
        ]);
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
      }
    };
    ///permissionscomponents(idMenu, userData.idUsuario);
    fetchData();
  }, []);

  const [permisos, setPermisos] = useState([]);

  const permissionscomponents = async (idMenu, idUsuario) => {
    try {
      const url = APIURL.getacces(idMenu, idUsuario);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setPermisos(data);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching permissions components:", error);
    }
  };

  const fetchtiemposolicitudesweb = async (idCre_SolicitudWeb, estado) => {
    try {
      const url = APIURL.get_tiemposolicitudesweb(idCre_SolicitudWeb, estado);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setClienteEstados(data);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching tiemposolicitudesweb data:", error);
    }
  };

  const [fechaTiempos, setfechaTiempos] = useState([]);
  const fetchTiempSolicweb = async (tipo, idCre_SolicitudWeb, estado) => {
    try {
      const url = APIURL.get_TiempSolicWeb(tipo, idCre_SolicitudWeb, estado);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setfechaTiempos(data);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching tiemposolicitudesweb data:", error);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //función para calcular la diferencia de tiempo
  const calcularTiempoTranscurrido = (fechaInicial, fechaFinal) => {
    if (!fechaInicial || !fechaFinal) return "N/A";

    const inicio = new Date(fechaInicial);
    const fin = new Date(fechaFinal);

    // Si las fechas son inválidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return "N/A";

    const diferencia = fin - inicio;

    // Convertir milisegundos a días, horas, minutos
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    if (dias > 0) {
      return `${dias}d ${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}min`;
    } else {
      return `${minutos}min`;
    }
  };

  const [idsTerrenasMap, setIdsTerrenasMap] = useState({});

  const handleOpenModalVerificacion = async (data, tipo) => {
    try {
      let idtipo = 0;
      if (tipo === "domicilio") idtipo = 1;
      else if (tipo === "trabajo") idtipo = 2;
      const url = APIURL.getIdsTerrenas(data.id, idtipo);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error("Error al obtener los IDs terrenas");
      }

      const idsTerrenas = response.data;

      setIdsTerrenasMap((prev) => ({
        ...prev,
        [data.id]: idsTerrenas,
      }));

      setIdsTerrenas(idsTerrenas);

      if (!idsTerrenas || idsTerrenas.length === 0) {
        // Si no hay datos, abre el modal de verificación terrena
        setUserSolicitudData(data);
        setTipoVerificacionSeleccionada(tipo);
        setOpenVerificacionModal(true);
      } else {
        // Si hay datos, determina qué modal abrir en función del tipo y los datos recibidos
        if (tipo === "domicilio" && idsTerrenas.idTerrenaGestionDomicilio > 0) {
          setDomicilioData(idsTerrenas); // Asigna los datos necesarios para el modal de domicilio
          setDomicilioModalOpen(true);
        }
        if (tipo === "trabajo" && idsTerrenas.idTerrenaGestionTrabajo > 0) {
          setTrabajoData(idsTerrenas); // Asigna los datos necesarios para el modal de trabajo
          setTrabajoModalOpen(true);
        }

        if (
          tipo === "domicilio" &&
          idsTerrenas.idTerrenaGestionDomicilio == 0
        ) {
          setOpenModalPendiente(true);
        }
        if (tipo === "trabajo" && idsTerrenas.idTerrenaGestionTrabajo == 0) {
          setOpenModalPendiente(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data for verificación terrena:", error);
    }
  };

  /// variable y useffect para que se stere el nombre de usuario

  const [selectDeshabilitado, setSelectDeshabilitado] = useState(false);

  /*
  useEffect(() => {
    if (userData?.Nombre && analistas?.length > 0) {
      const analistaCoincidente = analistas.find((a) => {
        const nombreAnalista = a.Nombre?.toLowerCase().trim();
        const nombreUser = userData.Nombre?.toLowerCase().trim();
        return nombreAnalista === nombreUser;
      });
  
      if (analistaCoincidente) {
        setAnalistaSelected(analistaCoincidente.idUsuario);
      }
    }
  }, [userData?.Nombre, analistas]);
  */

  useEffect(() => {
    if (userData?.Nombre && analistas?.length > 0) {
      const analistaCoincidente = analistas.find((a) => {
        const nombreAnalista = a.Nombre?.toLowerCase().trim();
        const nombreUser = userData.Nombre?.toLowerCase().trim();
        return nombreAnalista === nombreUser;
      });

      if (analistaCoincidente) {
        setAnalistaSelected(analistaCoincidente.idUsuario);
        setSelectDeshabilitado(true); // 👈 desactiva edición
      } else {
        setSelectDeshabilitado(false); // por si no hay coincidencia
      }
    }
  }, [userData?.Nombre, analistas]);

  // Obtener bodegas
  const fetchBodega = async () => {
    try {
      const userId = userData.idUsuario;
      const idTipoFactura = 43;
      const fecha = new Date().toISOString();
      const recibeConsignacion = true;

      await fetchBodegaUsuario(
        userId,
        idTipoFactura,
        fecha,
        recibeConsignacion
      );
    } catch (err) {
      console.error("Error al obtener datos de la bodega:", err);
    }
  };

  // si cambia la bodega llamae a fecthUsuariobodega

  useEffect(() => {
    if (selectedBodega !== "todos") {
      fecthaUsuarioBodega(fechaInicio, selectedBodega, 0);
    } else {
      fetchSolicitudes();
    }
  }, [selectedBodega, fechaInicio]);

  const fecthaUsuarioBodega = async (fecha, bodega, nivel) => {
    try {
      await listaVendedoresporBodega(fecha, bodega, nivel);
    } catch (err) {
      console.error("Error al obtener datos de la bodega:", err);
    }
  };

  const fecthAnalista = async () => {
    try {
      await listadoAnalista();
    } catch (err) {
      console.error("Error al obtener datos de la bodega:", err);
    }
  };

  const getIconByEstado = (estadoId) => {
    switch (estadoId) {
      case 1: // Estado "Aprobado"
        return <FolderIcon sx={{ color: "#6C757D" }} />; // Estado por defecto
      case 2: // Estado "En revisión"
        return <PendingIcon sx={{ color: "#FFC107" }} />;
      case 3: // Estado "Corrección"
        return <ReportProblemIcon sx={{ color: "#FF5722" }} />;
      case 4: // Estado "Aprobado"
        return <CheckCircleIcon sx={{ color: "#28A745" }} />;
      case 5: // Estado "Rechazado"
        return <HighlightOffIcon sx={{ color: "#DC3545" }} />;
    }
  };

  const getPhoneIconByEstado = (estado) => {
    switch (estado) {
      case 1: // NO ASIGNADO
        return <PhoneDisabledIcon />;
      case 2: // ASIGNADO
        return <PhoneInTalkIcon sx={{ color: "#6C757D" }} />;
      case 3: // Aprobado
        return <CheckCircleIcon sx={{ color: "#28A745" }} />;
      case 4: // rechazado
        return <HighlightOffIcon sx={{ color: "#DC3545" }} />;
      case 5:
        return <HighlightOffIcon sx={{ color: "#DC3545" }} />;
      default: // Estado no especificado
        return <PhoneIcon />;
    }
  };

  const getSolicitudIconByEstado = (estado) => {
    switch (estado) {
      case 1: // PENDIENTE
        return <PendingActionsIcon sx={{ color: "gray" }} />;
      case 2: // DATOS CLIENTE
        return <PersonIcon sx={{ color: "gray" }} />;
      case 3: // DATOS DOMICILIO
        return <HomeIcon sx={{ color: "gray" }} />;
      case 4: // DATOS CÓNYUGE
        return <SupervisorAccountIcon sx={{ color: "gray" }} />;
      case 5: // DATOS REFERENCIAS
        return <ContactsIcon sx={{ color: "gray" }} />;
      case 6: // DATOS NEGOCIO
        return <StoreIcon sx={{ color: "gray" }} />;
      case 7: // DATOS DEPENDIENTE
        return <BadgeIcon sx={{ color: "gray" }} />;
      case 8: // INFORMACIÓN DE CRÉDITO
        return <CreditScoreIcon sx={{ color: "gray" }} />;
      case 9: // FACTORES DE CRÉDITO
        return <AssessmentIcon sx={{ color: "gray" }} />;
      case 10: // verificaciomn
        return <VerifiedIcon sx={{ color: "gray" }} />;
      case 11:
        return <SettingsPhoneIcon sx={{ color: "#FFC107" }} />; // Amarillo para GESTIONANDO
      case 12:
        return <CheckCircleIcon sx={{ color: "#28A745" }} />;
      case 13:
        return <PendingActionsIcon sx={{ color: "#DC3545" }} />; // Rojo para RECHAZADO
      // Verde para COMPLETADO
      default: // Default icon si el estado es desconocido
        return <HourglassEmptyIcon sx={{ color: "gray" }} />; // Fallback icon
    }
  };

  const getIconDomicilio = (estadoId) => {
    switch (estadoId) {
      case 0:
        return <HomeIcon sx={{ color: "gray" }} />;
      case 1:
        return <PendingIcon sx={{ color: "#FFC107" }} />;
      case 2:
        return <CheckCircleIcon sx={{ color: "#28A745" }} />;
      default:
        return <HomeIcon sx={{ color: "gray" }} />;
    }
  };

  const getIconLaboral = (estadoId) => {
    switch (estadoId) {
      case 0:
        return <StoreIcon sx={{ color: "gray" }} />;
      case 1:
        return <PendingIcon sx={{ color: "#FFC107" }} />;
      case 2:
        return <CheckCircleIcon sx={{ color: "#28A745" }} />;
      default:
        return <StoreIcon sx={{ color: "gray" }} />;
    }
  };

  const puedeAprobar = (data) => {
    if (!data) return false;

    const condicionesBase =
      data.idEstadoVerificacionDocumental === 4 &&
      data.idEstadoVerificacionSolicitud === 12 &&
      data.idEstadoVerificacionTelefonica === 3;

    const verificacionDomicilioOk =
      !data.Domicilio || data.idEstadoVerificacionDomicilio === 2;

    const verificacionLaboralOk =
      !data.Laboral || data.idEstadoVerificacionTerrena === 2;

    return condicionesBase && verificacionDomicilioOk && verificacionLaboralOk;
  };

  /* idEstadoVerificacionDocumental	Nombre
1	PROCESO
2	REVISIÓN
3	CORRECIÓN
4	APROBACION
5	RECHAZAR */

  const bodegasIds = bodegas.map((bodega) => bodega.b_Bodega); // Obtener los IDs de las bodegas
  // Obtener tipo de consulta
  const fetchTipoConsulta = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(APIURL.getTipoConsulta(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setTipoConsulta(
          response.data.map((item) => ({
            id: item.idCompraEncuesta,
            descripcion: item.Descripcion,
          }))
        );
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching tipo de consulta:", error);
    }
  };

  const fetchTipoCliente = async () => {
    try {
      const response = await axios.get(APIURL.getTipoCliente());
      if (response.status === 200) {
        // Crear un mapeo de idTipoCliente a Nombre
        const tipoMap = response.data.reduce((acc, item) => {
          acc[item.idTipoCliente] = item.Nombre;
          return acc;
        }, {});
        setTipoClienteMap(tipoMap);
        setTipo(
          response.data.map((item) => ({
            value: item.idTipoCliente,
            label: item.Nombre,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener el tipo de cliente:", error);
      enqueueSnackbar("No se pudo cargar los tipos de clientes", {
        variant: "error",
      });
    }
  };

  // Obtener solicitudes con filtros aplicados
  useEffect(() => {
    if (tipoConsulta.length > 0 && dataBodega.length > 0) {
      fetchSolicitudes();
    }
  }, [
    currentPage,
    tipoConsulta,
    dataBodega,
    selectedBodega,
    estado,
    fechaInicio,
    fechaFin,
    selectedVendedor,
    analistaSelected,
    solicitud,
    documental,
    telefonica,
    domicilio,
    laboral,
    nombre,
    numeroSolicitud,
    cedula,
  ]);

  const fetchSolicitudes = async () => {
    // Primero se obtiene el array de bodegas
    let bodegasId = [];
    // Verificar que tipoConsulta y dataBodega no estén vacíos
    if (tipoConsulta.length === 0 || dataBodega.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const offset = (currentPage - 1) * itemsPerPage;

      // Si selectedBodega es "todos", pasar un array vacío (esto también se puede ajustar según el comportamiento deseado)
      if (selectedBodega !== "todos") {
        // Si selectedBodega tiene un valor específico, tomarlo como un array
        bodegasId = [selectedBodega];
      } else {
        // Si es "todos", se puede pasar un array vacío o la lógica que desees
        bodegasId = bodegasIds; // Aquí se asigna el array de bodegas
      }

      // Realizar la consulta con los parámetros ajustados
      const response = await axios.get(APIURL.getCreSolicitudCredito(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: itemsPerPage,
          offset: offset,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          bodega: bodegasId, // Pasar el array de bodegas al backend
          estado: estado === "todos" ? 0 : estado,
          vendedor: selectedVendedor === "todos" ? 0 : selectedVendedor,
          analista: analistaSelected === "todos" ? 0 : analistaSelected,
          EstadoSolicitud: solicitud == "Todos" ? 0 : solicitud,
          EstadoDocumental: documental == "Todos" ? 0 : documental,
          EstadoTelefonica: telefonica == "Todos" ? 0 : telefonica,
          EstadoDomicilio : domicilio == "Todos" ? 0 : domicilio,
          EstadoLaboral : laboral == "Todos" ? 0 : laboral,
          nombres: nombre?.trim() || undefined,
          numeroSolicitud: numeroSolicitud?.trim() || undefined,
          cedula: cedula?.trim() || undefined,
        },
      });

      if (response.status === 200) {
        const totalRecords = response.data.total;
        const totalPages = Math.ceil(totalRecords / itemsPerPage);

        // Mapeo de datos con fetchVendedor
        const datos = await Promise.all(
          response.data.data.map(async (item) => {
            const vendedorNombre = await fetchVendedor(item.idVendedor);
            return {
              id: item.idCre_SolicitudWeb,
              NumeroSolicitud: item.NumeroSolicitud,
              nombre: `${item.PrimerNombre} ${item.SegundoNombre} ${item.ApellidoPaterno} ${item.ApellidoMaterno}`,
              PrimerNombre: item.PrimerNombre,
              SegundoNombre: item.SegundoNombre,
              ApellidoPaterno: item.ApellidoPaterno,
              ApellidoMaterno: item.ApellidoMaterno,
              cedula: item.Cedula,
              almacen:
                dataBodega.find((bodega) => bodega.value === item.Bodega)
                  ?.label || "Desconocido",
              vendedor: vendedorNombre,
              consulta:
                tipoConsulta.find((tipo) => tipo.id === item.idCompraEncuesta)
                  ?.descripcion || "CLIENTE NO APLICA",
              estado:
                item.Estado === 1
                  ? "PRE-APROBADO"
                  : item.Estado === 2
                  ? "APROBADO"
                  : item.Estado === 3
                  ? "ANULADO"
                  : item.Estado === 4
                  ? "RECHAZADO"
                  : item.Estado === 5
                  ? "NO APLICA"
                  : "Desconocido",
              imagen: item.Foto,
              Estado: item.Estado,
              celular: item.Celular,
              email: item.Email,
              fecha: item.Fecha,
              afiliado: item.bAfiliado ? "Sí" : "No",
              tieneRuc: item.bTieneRuc ? "Sí" : "No",
              tipoCliente: tipoClienteMap[item.idTipoCliente] || "NO APLICA",
              idEstadoVerificacionDocumental:
                item.idEstadoVerificacionDocumental,
              idEstadoVerificacionSolicitud: item.idEstadoVerificacionSolicitud,
              idEstadoVerificacionTelefonica:
                item.idEstadoVerificacionTelefonica,
              idEstadoVerificacionTerrena: item.idEstadoVerificacionTerrena,
              resultado: item.Resultado,
              entrada: item.Entrada,
              Domicilio: item.TerrenoDomicilio,
              Laboral: item.TerrenoLaboral,
              CodigoDactilar: item.CodDactilar,
              idEstadoVerificacionDomicilio: item.idEstadoVerificacionDomicilio,
              idAnalista: item.idAnalista,
            };
          })
        );

        setDatos(datos);
        setTotal(totalRecords);
        setTotalPages(totalPages);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Obtener vendedor
  const fetchVendedor = async (idVendedor) => {
    try {
      const response = await axios.get(APIURL.getVendedor(idVendedor), {
        headers: { method: "GET", cache: "no-store" },
      });

      if (response.status === 200) {
        const vendedor = response.data;
        return (
          `${vendedor.PrimerNombre || ""} ${vendedor.SegundoNombre || ""} ${
            vendedor.ApellidoPaterno || ""
          } ${vendedor.ApellidoMaterno || ""}`.trim() || "No disponible"
        );
      }
    } catch (error) {
      console.error("Error fetching vendedor data:", error);
      return "No disponible";
    }
  };

  // Manejar cambio de bodega
  const handleBodegaChange = (event) => {
    setSelectedBodega(event.target.value);
  };

  const handleVendedorChange = (event) => {
    setSelectedVendedor(event.target.value);
  };

  const handleAnalistaChange = (event) => {
    setAnalistaSelected(event.target.value);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setDataBodega(
        data.map((item) => ({
          value: item.b_Bodega,
          label: item.b_Nombre,
        }))
      );
    }
  }, [data]);

  //// patch solicitud cuando se aprueba la solicitud de credito

  const patchSolicitud = async (idSolicitud, numero) => {
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        {
          Estado: numero,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response data:", response.data); // Log the response data
      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", {
          variant: "success",
        });
        navigate("/ListadoSolicitud", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", {
        variant: "error",
      });
    }
  };

  const handledocumentos = (registro) => {
    if (registro.idEstadoVerificacionDocumental == 4) {
      navigate("/gestorDocumentos", {
        replace: true,
        state: {
          id: registro.id,
          NumeroSolicitud: registro.NumeroSolicitud,
          nombre: registro.nombre,
          cedula: registro.cedula,
          fecha: registro.fecha,
          almacen: registro.almacen,
          foto: registro.imagen,
          vendedor: registro.vendedor,
          consulta: registro.consulta,
        },
      });
    } else {
      navigate("/documental", {
        replace: true,
        state: {
          id: registro.id,
          NumeroSolicitud: registro.NumeroSolicitud,
          nombre: registro.nombre,
          cedula: registro.cedula,
          fecha: registro.fecha,
          almacen: registro.almacen,
          foto: registro.imagen,
          vendedor: registro.vendedor,
          consulta: registro.consulta,
          idEstadoVerificacionDocumental:
            registro.idEstadoVerificacionDocumental,
        },
      });
    }
  };

  const handleTelefonica = (registro) => {
    navigate("/telefonicaList", {
      replace: true,
      state: {
        id: registro.id,
        NumeroSolicitud: registro.NumeroSolicitud,
        nombre: registro.nombre,
        cedula: registro.cedula,
        fecha: registro.fecha,
        almacen: registro.almacen,
        foto: registro.imagen,
        vendedor: registro.vendedor,
        consulta: registro.consulta,
        idEstadoVerificacionTelefonica: registro.idEstadoVerificacionTelefonica,
        permisos: permisos,
      },
    });
  };

  const handlesolicitud = (registro) => {
    navigate("/solicitudgrande", {
      replace: true,
      state: {
        data: registro,
      },
    });
  };

  const handleOpenDialog = async (row) => {
    setSelectedRow(row);
    setView(true);
    await fetchTiempSolicweb(1, row.id, "1,12");
  };

  const handleCloseDialog = () => {
    setView(false);
    setSelectedRow(null);
    setPreviewUrl(null); // Limpiar imagen temporal
  setFileToUpload(null);
  };

  const handleSolictud = () => {
    navigate("/solicitud", { replace: true });
  };

  // Función para cambiar de página
  const changePage = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (data) => {
    setUserSolicitudData(data);

    setOpenLocationModal((prevState) => !prevState);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
<div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
<TextField
          label="Fecha Desde"
          type="date"
          variant="outlined"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Fecha Hasta"
          type="date"
          variant="outlined"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl size="small" fullWidth>
          <InputLabel>Buscar por bodega</InputLabel>
          <Select
            value={selectedBodega}
            onChange={handleBodegaChange}
            label="Buscar por nombre"
          >
            <MenuItem value="todos">Todos</MenuItem>

            {bodegas.map((bodega) => (
              <MenuItem key={bodega.b_Bodega} value={bodega.b_Bodega}>
                {bodega.b_Nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel>Buscar por Vendedor</InputLabel>

          <Select
            value={selectedVendedor}
            onChange={handleVendedorChange}
            label="Buscar por nombre"
          >
            <MenuItem value="todos">Todos</MenuItem>
            {vendedores.map((vendedor) => (
              <MenuItem key={vendedor.idPersonal} value={vendedor.idPersonal}>
                {`${vendedor.Nombre || ""}`.trim() || "No disponible"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Analista</InputLabel>
          <Select
            value={analistaSelected}
            onChange={handleAnalistaChange}
            label="Analista"
            disabled={selectDeshabilitado} //  solo si hubo match
          >
            <MenuItem value="todos">Todos</MenuItem>
            {analistas.map((vendedor) => (
              <MenuItem key={vendedor.idUsuario} value={vendedor.idUsuario}>
                {vendedor.Nombre?.trim() || "No disponible"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            label="Estado"
          >
            {estadosOpciones.map((estado) => (
              <MenuItem key={estado.value} value={estado.value}>
                {estado.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
      
      <FormControl size="small" fullWidth>
          <InputLabel>Solicitud</InputLabel>
          <Select
            value={solicitud}
            onChange={(e) => setSolicitud(e.target.value)}
            label="Solicitud"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            {Object.entries(estadoMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel>Documental</InputLabel>
          <Select
            value={documental}
            onChange={(e) => setDocumental(e.target.value)}
            label="Documental"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            {Object.entries(estadoDocumentalMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Telefonica</InputLabel>
          <Select
            value={telefonica}
            onChange={(e) => setTelefonica(e.target.value)}
            label="Telefonica"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            {Object.entries(estadoTelefonicaMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Domicilio</InputLabel>
          <Select
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            label="Domicilio"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            {Object.entries(DomicilioLaboralMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Laboral</InputLabel>
          <Select
            value={laboral}
            onChange={(e) => setLaboral(e.target.value)}
            label="Laboral"
          >
            <MenuItem value="Todos">Todos</MenuItem>
            {Object.entries(DomicilioLaboralMap).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <button
          title="Nueva Solicitud"
          className="group cursor-pointer outline-none hover:rotate-90 duration-300"
          onClick={handleSolictud}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            className="stroke-indigo-400 fill-none group-hover:fill-indigo-800 group-active:stroke-indigo-200 group-active:fill-indigo-600 group-active:duration-0 duration-300"
          >
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke-width="1.5"
            ></path>
            <path d="M8 12H16" stroke-width="1.5"></path>
            <path d="M12 16V8" stroke-width="1.5"></path>
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">

       {/* Busqueda por cedula */}

        <TextField
          label="Buscar por cédula"
          variant="outlined"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <IconButton>
              </IconButton>
            ),
          }}
        />


       {/* Busqueda por nombre cliente  */}

        <TextField
          label="Buscar por nombre cliente"
          variant="outlined"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <IconButton>
              </IconButton>
            ),
          }}
        />

        


       {/* Busqueda por numero de solicitud */}
        <TextField
          label="Buscar por número de solicitud"
          variant="outlined"
          value={numeroSolicitud}
          onChange={(e) => setNumeroSolicitud(e.target.value)}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <IconButton>
              </IconButton>
            ),
          }}
        />
        

        </div>

   
      <div className="p-6 bg-gray-50 rounded-xl">
  <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
    <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: 'none' }}>
      <Table>
        {/* Encabezado de la tabla con estilo mejorado */}
        <TableHead>
          <TableRow sx={{ 
            background: 'linear-gradient(90deg, #f6f9fc 0%, #edf2f7 100%)',
            '& th': {
              color: '#334155',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '14px 10px',
              borderBottom: '2px solid #e2e8f0'
            }
          }}>
            <TableCell align="center">N° Solicitud</TableCell>
            <TableCell align="center">Cliente</TableCell>
            <TableCell align="center">Cédula</TableCell>
            <TableCell align="center">Fecha</TableCell>
            <TableCell align="center">Almacén</TableCell>
            <TableCell align="center">Vendedor</TableCell>
            <TableCell align="center">Tipo de Consulta</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="center">Tipo de Cliente</TableCell>
            <TableCell align="center">Resultado</TableCell>
            <TableCell align="center">Entradas</TableCell>
            <TableCell align="center">Detalles</TableCell>
            <TableCell align="center">Solicitudes</TableCell>
            <TableCell align="center">Documental</TableCell>
            <TableCell align="center">Telefonica</TableCell>
            <TableCell align="center">Domicilio</TableCell>
            <TableCell align="center">Laborales</TableCell>
            <TableCell align="center">Analista</TableCell>
          </TableRow>
        </TableHead>
        
        {/* Cuerpo de la tabla con estilos mejorados */}
        <TableBody>
          {datos.map((data, index) => (
            <TableRow 
              key={data.id}
              sx={{ 
                '&:nth-of-type(odd)': { backgroundColor: '#f8fafc' },
                '&:hover': { backgroundColor: '#f1f5f9' },
                transition: 'background-color 0.2s ease',
                '& td': { 
                  padding: '12px 10px',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #e2e8f0'
                }
              }}
            >
              <TableCell align="center" sx={{ fontWeight: 500 }}>{data.NumeroSolicitud}</TableCell>
              <TableCell align="center">{data.nombre}</TableCell>
              <TableCell align="center">{data.cedula}</TableCell>
              <TableCell align="center">
                {new Date(data.fecha).toLocaleString()}
              </TableCell>
              <TableCell align="center">{data.almacen}</TableCell>
              <TableCell align="center">{data.vendedor}</TableCell>
              <TableCell align="center">{data.consulta}</TableCell>
               {/* Estado con colores dinámicos según el valor */}
               <TableCell align="center">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  data.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                  data.estado === 'PRE-APROBADO' ? 'bg-blue-100 text-blue-800' :
                  data.estado === 'RECHAZADO' ? 'bg-red-100 text-red-800' :
                  data.estado === 'ANULADO' ? 'bg-gray-100 text-gray-800' :
                  data.estado === 'N0 APLICA' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800' // Estado predeterminado (pendiente u otros)
                }`}>
                  {data.estado}
                </span>
              </TableCell>
              <TableCell align="center">{data.tipoCliente}</TableCell>
              <TableCell align="center">
                {data.resultado === 0 ? (
                  <HighlightOffIcon sx={{ color: "#DC3545", filter: 'drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2))' }} />
                ) : data.resultado === 1 ? (
                  <CheckCircleIcon sx={{ color: "#28A745", filter: 'drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2))' }} />
                ) : null}
              </TableCell>
              <TableCell align="center">{data.entrada}</TableCell>
              
              {/* Botón de detalles mejorado */}
              <TableCell align="center">
                <Tooltip title="Ver más" arrow placement="top">
                  <IconButton 
                    onClick={() => handleOpenDialog(data)}
                    sx={{
                      bgcolor: '#f1f5f9',
                      '&:hover': {
                        bgcolor: '#e2e8f0'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <VisibilityIcon fontSize="small" sx={{ color: '#475569' }} />
                  </IconButton>
                </Tooltip>
              </TableCell>

              {/* Columna Solicitudes */}
              <TableCell align="center">
                <div className="flex items-center justify-center space-x-1">
                  <IconButton
                    onClick={() => handlesolicitud(data)}
                    disabled={estaDeshabilitado(data) || estadoDeshabilitadoporPermisos(data)}
                    sx={{ 
                      opacity: estaDeshabilitado(data) ? 0.5 : 1,
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: !estaDeshabilitado(data) && '#e2e8f0'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {getSolicitudIconByEstado(data.idEstadoVerificacionSolicitud)}
                  </IconButton>

                  <Tooltip title="Ver historial" arrow placement="top">
                    <span
                      style={{
                        pointerEvents: estaDeshabilitado(data) ? "none" : "auto",
                        opacity: estaDeshabilitado(data) ? 0.5 : 1,
                      }}
                    >
                      <MoreVertIcon
                        onClick={(event) => handlePopoverOpen(event, 1, data)}
                        style={{ cursor: "pointer", color: '#64748b' }}
                        fontSize="small"
                      />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>

              {/* Columna Documental */}
              <TableCell align="center">
                <div className="flex items-center justify-center space-x-1">
                  <IconButton
                    onClick={() => handledocumentos(data)}
                    disabled={
                      data.idEstadoVerificacionDocumental === 2 ||
                      estaDeshabilitado(data) ||
                      estadoDeshabilitadoDocumental(data) ||
                      verificacionSolicitud(data)
                    }
                    sx={{ 
                      opacity: (estaDeshabilitado(data) || verificacionSolicitud(data)) ? 0.5 : 1,
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: !(estaDeshabilitado(data) || verificacionSolicitud(data)) && '#e2e8f0'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {getIconByEstado(data.idEstadoVerificacionDocumental)}
                  </IconButton>

                  <Tooltip title="Ver historial" arrow placement="top">
                    <span
                      style={{
                        pointerEvents: estaDeshabilitado(data) ? "none" : "auto",
                        opacity: estaDeshabilitado(data) ? 0.5 : 1,
                      }}
                    >
                      <MoreVertIcon
                        onClick={(event) => handlePopoverOpen(event, 3, data)}
                        style={{ cursor: "pointer", color: '#64748b' }}
                        fontSize="small"
                      />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>

              {/* Columna Telefónica */}
              <TableCell align="center">
                <div className="flex items-center justify-center space-x-1">
                  <IconButton
                    onClick={() => handleTelefonica(data)}
                    disabled={
                      data.idEstadoVerificacionTelefonica === 1 ||
                      estaDeshabilitado(data) ||
                      verificacionSolicitud(data) ||
                      estadoDeshabilitadotelefonica(data)
                    }
                    sx={{ 
                      opacity: (data.Estado === 5 || estaDeshabilitado(data) || verificacionSolicitud(data)) ? 0.5 : 1,
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: !(data.Estado === 5 || estaDeshabilitado(data) || verificacionSolicitud(data)) && '#e2e8f0'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {getPhoneIconByEstado(data.idEstadoVerificacionTelefonica)}
                  </IconButton>

                  <Tooltip title="Ver historial" arrow placement="top">
                    <span
                      style={{
                        pointerEvents: estaDeshabilitado(data) ? "none" : "auto",
                        opacity: estaDeshabilitado(data) ? 0.5 : 1,
                      }}
                    >
                      <MoreVertIcon
                        onClick={(event) => handlePopoverOpen(event, 2, data)}
                        style={{ cursor: "pointer", color: '#64748b' }}
                        fontSize="small"
                      />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>

              {/* Columna Domicilio */}
              <TableCell align="center">
                <div className="flex items-center justify-center space-x-1">
                  <IconButton
                    onClick={() => handleOpenModalVerificacion(data, "domicilio")}
                    disabled={
                      data.idEstadoVerificacionDocumental !== 4 ||
                      data.Domicilio === false
                    }
                    sx={{ 
                      opacity: (data.Estado === 5 || estaDeshabilitado(data) || verificacionSolicitud(data)) ? 0.5 : 1,
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: !(data.Estado === 5 || estaDeshabilitado(data) || verificacionSolicitud(data)) && '#e2e8f0'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {getIconDomicilio(data.idEstadoVerificacionDomicilio)}
                  </IconButton>

                  <Tooltip title="Ver historial" arrow placement="top">
                    <span
                      style={{
                        pointerEvents: estaDeshabilitado(data) ? "none" : "auto",
                        opacity: estaDeshabilitado(data) ? 0.5 : 1,
                      }}
                    >
                      <MoreVertIcon
                        onClick={(event) => handlePopoverOpen(event, 4, data)}
                        style={{ cursor: "pointer", color: '#64748b' }}
                        fontSize="small"
                      />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>

              {/* Columna Laborales */}
              <TableCell align="center">
                <div className="flex items-center justify-center space-x-1">
                  <IconButton
                    onClick={() => handleOpenModalVerificacion(data, "trabajo")}
                    disabled={verificacionSolicitud(data) || data.Laboral === false}
                    sx={{ 
                      opacity: (estaDeshabilitado(data) || verificacionSolicitud(data) || data.Laboral === false) ? 0.1 : 1,
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: !(estaDeshabilitado(data) || verificacionSolicitud(data) || data.Laboral === false) && '#e2e8f0'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {getIconLaboral(data.idEstadoVerificacionTerrena)}
                  </IconButton>

                  <Tooltip title="Ver historial" arrow placement="top">
                    <span
                      style={{
                        pointerEvents: estaDeshabilitado(data) ? "none" : "auto",
                        opacity: estaDeshabilitado(data) ? 0.5 : 1,
                      }}
                    >
                      <MoreVertIcon
                        onClick={(event) => handlePopoverOpen(event, 4, data)}
                        style={{ cursor: "pointer", color: '#64748b' }}
                        fontSize="small"
                      />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>

              {/* Columna Analista */}
              <TableCell align="center">
                {data.idAnalista ? (
                  <span className="text-gray-800 font-medium">
                    {analistas.find((a) => a.idUsuario === data.idAnalista)?.Nombre || "No disponible"}
                  </span>
                ) : (
                  <span className="text-gray-400 italic text-sm">Sin asignar</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
</div>

      {/* Cuadro de diálogo para ver detalles */}
      <Dialog open={view} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="text-xl font-bold flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Timeline
            position="bottom"
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: 0,
              overflowX: "auto",
              maxWidth: "100%",
              position: "relative",
              width: "100%",
              justifyContent: "space-between",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "2px",
                backgroundColor: "#ccc",
                transform: "translateY(-50%)",
                zIndex: 0,
              },
              "& .MuiTimelineItem-root": {
                minWidth: "130px",
                padding: "0 16px",
                minHeight: "180px",
                display: "flex",
                alignItems: "center",
                zIndex: 1,
                flex: "1 1 0",
              },
              "& .MuiTimelineSeparator-root": {
                height: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              },
              "& .MuiTimelineDot-root": {
                backgroundColor: "white",
                border: "2px solid #2d3689",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                margin: 0,
              },
              "& .MuiTimelineConnector-root": {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translateX(-50%)",
                height: "2px",
                width: "calc(100% - 32px)",
                backgroundColor: "transparent",
              },
            }}
          >
            {/* Primer ítem con fechas */}
            <TimelineItem>
              <TimelineSeparator
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
                {/* Estructura con posicionamiento absoluto para centrar el icono y permitir fechas arriba/abajo */}
                <Box
                  sx={{
                    position: "relative",
                    height: "40px", // Altura del icono
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Contenedor fecha superior */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "auto",
                      textAlign: "center",
                      marginBottom: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fechaTiempos[0] && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "inline-block",
                          color: "text.primary",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          backgroundColor: "#f0f4f8",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {formatDateTime(fechaTiempos[0].FechaSistema)}
                      </Typography>
                    )}
                  </Box>

                  {/* Icono */}
                  <TimelineDot
                    sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)", zIndex: 2 }}
                  >
                    <PendingActionsIcon
                      sx={{ color: "#2d3689", fontSize: "1.2rem" }}
                    />
                  </TimelineDot>

                  {/* Contenedor fecha inferior */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "auto",
                      textAlign: "center",
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {fechaTiempos[1] && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "inline-block",
                            color: "text.primary",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            backgroundColor: "#f0f4f8",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDateTime(fechaTiempos[1].FechaSistema)}
                        </Typography>
                        {/* Tiempo transcurrido */}
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "#2d3689",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            border: "1px solid #2d3689",
                            backgroundColor: "#e8eaf6",
                            padding: "1px 6px",
                            borderRadius: "12px",
                          }}
                        >
                          {calcularTiempoTranscurrido(
                            fechaTiempos[0]?.FechaSistema,
                            fechaTiempos[1]?.FechaSistema
                          )}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot>
                  <FolderIcon sx={{ color: "#6C757D" }} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot>
                  <PhoneInTalkIcon sx={{ color: "#6C757D" }} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot>
                  <StoreIcon sx={{ color: "gray" }} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot>
                  <HouseIcon sx={{ color: "gray" }} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot>
                  <PersonIcon sx={{ color: "#6C757D" }} />
                </TimelineDot>
              </TimelineSeparator>
            </TimelineItem>
          </Timeline>
        </DialogTitle>

        <DialogContent dividers>
          {selectedRow && (
            <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
              <div className="w-64 flex flex-col items-center space-y-4">
                {/* Contenedor de la imagen */}
                <div className="w-64 h-64 border-2 border-dashed border-gray-400 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100 shadow-inner">
                  {!previewUrl &&
                  (!selectedRow.imagen || selectedRow.imagen === "prueba") ? (
                    <div className="w-80 h-80 md:w-64 md:h-64 flex items-center justify-center bg-gray-100 border-4 border-gray-300 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={previewUrl || selectedRow.imagen}
                      alt="Foto del cliente"
                      className="w-80 h-80 md:w-64 md:h-64 object-cover border-4 border-gray-300 rounded-lg"
                    />
                  )}
                </div>

                {/* Botones debajo de la imagen */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-3 w-full">
                  {/* Botón seleccionar imagen */}
                  <label
                    htmlFor="upload-image"
                    className="flex-1 w-full md:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 cursor-pointer"
                  >
                    Seleccionar imagen
                    <input
                      id="upload-image"
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg"
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Botón subir imagen */}
                  <button
                    onClick={handleUploadClick}
                    disabled={!fileToUpload}
                    className={`flex-1 w-full md:w-auto py-2 px-4 rounded-lg font-semibold shadow-md transition duration-300 ${
                      fileToUpload
                        ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Subir imagen
                  </button>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-base leading-relaxed">
                  <div className="flex items-center gap-2">
                    <PersonIcon className="text-blue-500" fontSize="medium" />
                    <p>{selectedRow.nombre}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeIcon className="text-blue-500" fontSize="medium" />
                    <p className="font-semibold">Cédula:</p>
                    <p>{selectedRow.cedula}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StoreIcon className="text-blue-500" fontSize="medium" />
                    <p className="font-semibold">Almacén:</p>
                    <p>{selectedRow.almacen}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SupervisorAccountIcon
                      className="text-blue-500"
                      fontSize="medium"
                    />
                    <p className="font-semibold">Vendedor:</p>
                    <p>{selectedRow.vendedor}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <InfoIcon className="text-blue-500" fontSize="medium" />
                    <p className="font-semibold">Tipo de Consulta:</p>
                    <p>{selectedRow.consulta}</p>
                  </div>
                  <div className="flex items-center">
                    <InfoIcon className="mr-2 text-blue-500" />
                    <span
                      className={`ml-2 font-semibold ${
                        selectedRow.estado === "activo"
                          ? "text-green-500"
                          : selectedRow.estado === "pendiente"
                          ? "text-yellow-500"
                          : selectedRow.estado === "anulado"
                          ? "text-gray-500"
                          : selectedRow.estado === "aprobado"
                          ? "text-blue-500"
                          : selectedRow.estado === "rechazado"
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                    >
                      {selectedRow.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="text-blue-500" fontSize="medium" />
                    <p>{selectedRow.celular}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <EmailIcon className="text-blue-500" fontSize="medium" />
                    <p>{selectedRow.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <EventIcon className="text-blue-500" fontSize="medium" />
                    <p className="font-semibold">Fecha:</p>
                    <p>{selectedRow.fecha.substring(0, 10)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon
                      className="text-blue-500"
                      fontSize="medium"
                    />
                    <p className="font-semibold">Afiliado:</p>
                    <p>{selectedRow.afiliado}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BusinessIcon className="text-blue-500" fontSize="medium" />
                    <p className="font-semibold">Tiene RUC:</p>
                    <p>{selectedRow.tieneRuc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            className="text-base font-semibold"
          >
            Cerrar
          </Button>

          {selectedRow &&
            selectedRow.imagen &&
            selectedRow.imagen !== "prueba" &&
            puedeAprobar(selectedRow) && (
              <Button
                onClick={() => {
                  setCedula(selectedRow?.cedula);
                  setDactilar(selectedRow?.CodigoDactilar);
                  setOpenRegistroCivil(true);
                }}
                color="primary"
                className="text-base font-semibold"
              >
                Aprobar
              </Button>
            )}
        </DialogActions>
      </Dialog>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => changePage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition disabled:invisible"
          >
            <SkipPreviousIcon />
          </button>
          <span className="font-semibold text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition disabled:invisible"
          >
            <SkipNextIcon />
          </button>
        </div>
      )}
      <LocationModal
        isOpen={() => handleOpenModal()}
        openLocationModal={openLocationModal}
        locationType={null}
        locationData={null}
        onLocationChange={null}
        userSolicitudData={userSolicitudData}
      />

      <VerificacionTerrenaModal
        isOpen={openVerificacionModal}
        onClose={() => setOpenVerificacionModal(false)}
        userSolicitudData={userSolicitudData}
        userData={userData}
        tipoSeleccionado={tipoVerificacionSeleccionada}
      />

      <DomicilioModal
        openModal={isDomicilioModalOpen}
        closeModal={handleCloseDomicilioModal}
        idsTerrenas={idsTerrenas}
      />

      <TrabajoModal
        openModal={isTrabajoModalOpen}
        closeModal={handleCloseTrabajoModal}
        idsTerrenas={idsTerrenas}
      />

      <Dialog
        open={openModalPendiente}
        onClose={() => setOpenModalPendiente(false)}
      >
        <DialogTitle>Verificación Pendiente</DialogTitle>
        <DialogContent>
          <Typography>
            Verificación pendiente por el personal asignado.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalPendiente(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Registro Civil */}
      <Dialog
        open={openRegistroCivil}
        onClose={() => setOpenRegistroCivil(false)}
        maxWidth="md"
        fullWidth
      >
        <RegistroCivil
          cedula={cedula}
          dactilar={dactilar}
          imagenSubida={selectedRow?.imagen}
          onAceptar={() => {
            // Acción al aceptar

            patchSolicitud(selectedRow?.id, 2);

            setOpenRegistroCivil(false);
          }}
          onRechazar={() => {
            // Acción al rechazar

            patchSolicitud(selectedRow?.id, 4);

            setOpenRegistroCivil(false);
          }}
        />
      </Dialog>
    </div>
  );
}
