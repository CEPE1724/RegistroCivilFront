// Listado Solicitud 2
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
} from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../../configApi/axiosConfig";
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
import LocationModal from "./LocationModal";
import VerificacionTerrenaModal from "./VerificacionTerrenaModal";
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // PENDIENTE
import HomeIcon from "@mui/icons-material/Home"; // DATOS DOMICILIO
import ContactsIcon from "@mui/icons-material/Contacts"; // DATOS REFERENCIAS
import CreditScoreIcon from "@mui/icons-material/CreditScore"; // INFORMACIÓN DE CRÉDITO
import AssessmentIcon from "@mui/icons-material/Assessment"; // FACTORES DE CRÉDITO
import { Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icono de tres puntos verticales
import DocumentStatusPopover from "./DocumentStatusPopover";
import DomicilioModal from "./DomicilioModal";
import TrabajoModal from "./TrabajoModal";
import { RegistroCivil } from "./RegistroCivil/RegistroCivil";
import uploadFile from "../../hooks/uploadFile";
import { Loader } from "../Utils/Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import { Checkbox, FormControlLabel } from '@mui/material';
import PreDocumentos from "./Pre-Documentos";
import { useRef } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {fetchConsultaYNotifica, fechaHoraEcuador} from "../Utils";
import CapturarCamara from "../CapturarCamara/CapturarCamara";

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

  const [recargar, setRecargar] = useState(false);
  const [selectedBodega, setSelectedBodega] = useState(sessionStorage.getItem('filtroBodega') || "todos");
  const [selectedVendedor, setSelectedVendedor] = useState(sessionStorage.getItem('filtroVendedor') || "todos");
  const [analistaSelected, setAnalistaSelected] = useState(sessionStorage.getItem('filtroAnalista') || "todos");
  const [dataBodega, setDataBodega] = useState([]);
  const [estado, setEstado] = useState(sessionStorage.getItem('filtroEstado') || "todos");
  const [datos, setDatos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [total, setTotal] = useState(0); // Total de registros
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openVerificacionModal, setOpenVerificacionModal] = useState(false);
  const [openModalPendiente, setOpenModalPendiente] = useState(false);
  const today = new Date().toISOString().split("T")[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
  const [tipo, setTipo] = useState([]);
  const [tipoClienteMap, setTipoClienteMap] = useState({});
  const [tipoVerificacionSeleccionada, setTipoVerificacionSeleccionada] = useState(null);
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const date15DaysAgo = new Date();
  date15DaysAgo.setDate(date15DaysAgo.getDate() - 15);
  const date15DaysAgoStr = date15DaysAgo.toISOString().split("T")[0];
  const [fechaInicio, setFechaInicio] = useState(sessionStorage.getItem('filtroIniFecha') || date15DaysAgoStr);
  const [fechaFin, setFechaFin] = useState(sessionStorage.getItem('filtroFinFecha') || today);
  const [isDomicilioModalOpen, setDomicilioModalOpen] = useState(false);
  const handleCloseDomicilioModal = () => setDomicilioModalOpen(false);
  const [openRegistroCivil, setOpenRegistroCivil] = useState(false);
  const [isTrabajoModalOpen, setTrabajoModalOpen] = useState(false);
  const handleCloseTrabajoModal = () => setTrabajoModalOpen(false);
  const [domicilioData, setDomicilioData] = useState([]);
  const [trabajoData, setTrabajoData] = useState([]);
  const [idsTerrenas, setIdsTerrenas] = useState([]);
  const navigate = useNavigate();
  const { userData, idMenu, socket } = useAuth();
  const puedeCrearSolicitud = userData?.idGrupo === 1 || userData?.idGrupo === 23;
  const verEquifax = userData?.idGrupo === 22 || userData?.idGrupo === 21;
  const [cedula, setCedula] = useState(sessionStorage.getItem('filtroCedula') || "");
  const [dactilar, setDactilar] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [urlCloudstorage, setUrlCloudstorage] = useState(null);
  const [resultadoVerificacion, setResultadoVerificacion] = useState([]);
  const [loadingVerificacion, setLoadingVerificacion] = useState(false);
  const [openCameraModal, setOpenCameraModal] = useState(false);
  const [imagenCapturada, setImagenCapturada] = useState(null);
  const [fechaTiempos, setfechaTiempos] = useState([]);
  const inputFileRef = useRef(null); // ⬅️ Coloca esto en la parte superior de tu componente
  const fetchImagenRegistroCivil = async (cedula, dactilar) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Intentar GET primero
      try {
        const getResponse = await axios.get(`dactilar/${cedula}`, config);
        if (getResponse.data.statusCode === 200 && getResponse.data.data) {
          return getResponse.data.data.FOTO;
        }
      } catch (err) {
        if (err.response && err.response.status === 500) {
          // Si falla GET, intentar POST
          const postResponse = await axios.post(
            "dactilar/consulta",
            { cedula, dactilar },
            config
          );
          if (postResponse.data.data) {
            return postResponse.data.data.FOTO;
          }
        }
        throw new Error("No se pudo obtener imagen del Registro Civil.");
      }
    } catch (error) {
      enqueueSnackbar("Error al obtener la imagen del Registro Civil.", {
        variant: "error",
      });
      console.error(error);
      return null;
    }
  };
  const handleAbrirVerificacionManual = async () => {
    const cedula = selectedRow?.cedula;
    const dactilar = selectedRow?.CodigoDactilar;
    const imagenSubida = selectedRow?.imagen;

    if (!cedula || !dactilar || !imagenSubida) {
      enqueueSnackbar("Faltan datos para mostrar la verificación facial.", {
        variant: "warning",
      });
      return;
    }

    try {
      setCedula(cedula);
      setDactilar(dactilar);

      const dataFOTO = await fetchImagenRegistroCivil(cedula, dactilar);

      if (dataFOTO && typeof dataFOTO === "string" && dataFOTO.trim() !== "") {
        // Ya tienes todo, abre el componente para mostrar
        setOpenRegistroCivil(true);
      } else {
        enqueueSnackbar("No se pudo obtener la imagen del Registro Civil.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error al cargar la verificación facial.", {
        variant: "error",
      });
    }
  };

  const handleVerificarIdentidad = async (imagenSubida, fotoRegistroCivil) => {
    try {
      setLoadingVerificacion(true);

      if (!imagenSubida || !fotoRegistroCivil) {
        enqueueSnackbar("Faltan imágenes para comparar.", { variant: "error" });
        return;
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const body = {
        image1_url: imagenSubida,
        image2_base64: fotoRegistroCivil,
      };

      const response = await axios.post(
        APIURL.postCompareFaces(),
        body,
        config
      );
      const { verified, distance } = response.data;

      // ✅ Guarda los datos de verificación
      setResultadoVerificacion(response.data);

      if (verified) {
        await patchSolicitud(selectedRow?.id, 2);
        fetchInsertarDatos(6, selectedRow?.id, 2)

        enqueueSnackbar("Identidad verificada correctamente.", {
          variant: "success",
        });
        setOpenRegistroCivil(false);
        setView(false);
      } else {
        enqueueSnackbar(
          `Las fotos no coinciden por favor contactar con el analista `,
          { variant: "error" }
          /////Las imágenes no coinciden. Distancia: ${distance.toFixed(3)}
        );
        setOpenRegistroCivil(true);
      }

    } catch (err) {
      console.error("Error durante la verificación facial:", err);
      enqueueSnackbar("Error durante la verificación facial.", {
        variant: "error",
      });
    } finally {
      setLoadingVerificacion(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== "jpeg" && extension !== "jpg" && extension !== "png") {
      enqueueSnackbar("Solo archivos con extensión .jpeg son permitidos", { variant: "error" });
      e.target.value = null; // reset input
      setFileToUpload(null);
      setPreviewUrl(null);
      return;
    }

    setFileToUpload(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };


  {/*
  const handleUploadClick = async () => {
    if (!fileToUpload) {
      alert("Primero selecciona una imagen");
      return;
    }

    try {
      let updatedUrl = ""; // ✅ lo declaramos aquí arriba

      const fileUploadResponse = await uploadFile(
        fileToUpload,
        selectedRow.almacen,
        selectedRow.cedula,
        selectedRow.NumeroSolicitud,
        "Foto"
      );

      if (fileUploadResponse) {
        updatedUrl = fileUploadResponse.url;

        // 1. Actualizar la imagen localmente
        setSelectedRow((prevRow) => ({
          ...prevRow,
          imagen: updatedUrl,
        }));

        // 2. Actualizar también la tabla
        setDatos((prevDatos) =>
          prevDatos.map((item) =>
            item.id === selectedRow.id ? { ...item, imagen: updatedUrl } : item
          )
        );

        // 3. Actualizar en backend
        const updatedData = { Foto: updatedUrl };
        await fetchActualizaSolicitud(selectedRow.id, updatedData);

        setUrlCloudstorage();
        setFileToUpload(null);

        enqueueSnackbar("Foto subida correctamente", {
          variant: "success",
        });
      }

      // 4. Ejecutar verificación automáticamente (fuera del if, usando updatedUrl declarado arriba)
      if (updatedUrl) {
        const cedula = selectedRow?.cedula;
        const dactilar = selectedRow?.CodigoDactilar;

        if (cedula && dactilar) {
          setCedula(cedula); // <== AÑADIR ESTO
          setDactilar(dactilar);
          const dataFOTO = await fetchImagenRegistroCivil(cedula, dactilar);
          if (
            dataFOTO &&
            typeof dataFOTO === "string" &&
            dataFOTO.trim() !== ""
          ) {
            await handleVerificarIdentidad(updatedUrl, dataFOTO);
          } else {
            enqueueSnackbar(
              "No se pudo obtener imagen del Registro Civil. Se continuara manualmente ",
              {
                variant: "error",
              }
            );

            setOpenRegistroCivil(true);
          }
        }
      }
    } catch (error) {
      alert(error.message);
    }
  }; */}

  const fetchInsertarimagen = async (tipo, data, estado, imagen) => {


    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {
        idCre_SolicitudWeb: data,
        Tipo: tipo,
        idEstadoVerificacionDocumental: estado,
        Usuario: userData.Nombre,
        Telefono: imagen

      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error.response?.data || error.message);

    }
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
        const updatedUrl = fileUploadResponse.url;

        // 1. Actualizar local
        setSelectedRow((prevRow) => ({
          ...prevRow,
          imagen: updatedUrl,
        }));

        // 2. Actualizar en la tabla
        setDatos((prevDatos) =>
          prevDatos.map((item) =>
            item.id === selectedRow.id ? { ...item, imagen: updatedUrl } : item
          )
        );

        // 3. Actualizar en backend
        const updatedData = { Foto: updatedUrl };
        await fetchActualizaSolicitud(selectedRow.id, updatedData);
        fetchInsertarimagen(1, selectedRow.id, 14, updatedUrl)

        setUrlCloudstorage();
        setFileToUpload(null);

        enqueueSnackbar("Foto subida correctamente", {
          variant: "success",
        });


      }
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

  ///// METODO QUE VALIDE SI 3 TIPOS DE DOCUMENTO UNICAMENTE YA FUERON APROBADOS 
  const [docAprobados, setDocAprobados] = useState({}); // <-- ahora es un objeto, no un solo booleano

  // función para verificar documentos
  const laboralYDomicilioAprobados = async (id) => {
    try {
      const response = await axios.get(APIURL.getVerificacionTresDocumentos(id));
      return response.data.allThreeDocsApproved; // true o false
    } catch (error) {
      console.error("Error fetching data:", error);
      return false; // si hay error, consideramos como no aprobado
    }
  };

  // ahora en el useEffect
  useEffect(() => {
    const verificarTodosDocumentos = async () => {
      const resultados = {}; // objeto para guardar resultados por id

      for (const solicitud of datos) {
        const aprobado = await laboralYDomicilioAprobados(solicitud.id);
        resultados[solicitud.id] = aprobado;
      }

      setDocAprobados(resultados); // guarda todo junto
    };

    if (datos.length > 0) {
      verificarTodosDocumentos();
    }
  }, [datos]);

  const estaDeshabilitado = (data) => {
    return data.resultado === 0;
  };

  const [solicitud, setSolicitud] = useState(sessionStorage.getItem('filtroSolicitud') || "Todos");

  /// estado solicitudes
  const estadoMap = {
    1: "PENDIENTE",
    10: "REVISIÓN",
    11: "CORRECIÓN",
    12: "APROBADO",
    13: "RECHAZADO",
  };

  const [documental, setDocumental] = useState(sessionStorage.getItem('filtroDocumental') || "Todos");
  const estadoDocumentalMap = {
    1: "PROCESO",
    2: "REVISIÓN",
    3: "CORRECIÓN",
    4: "APROBACION",
  };

  const [telefonica, setTelefonica] = useState(sessionStorage.getItem('filtroTelefonica') || "Todos");
  const estadoTelefonicaMap = {
    1: "NO ASIGNADO",
    2: "ASIGNADO",
    3: "APROBADO",
    4: "RECHAZADO",
  };

  const [domicilio, setDomicilio] = useState(sessionStorage.getItem('filtroDomicilio') || "Todos");
  const [laboral, setLaboral] = useState(sessionStorage.getItem('filtroLaboral') || "Todos");
  const [nombre, setNombre] = useState(sessionStorage.getItem('filtroNombre') || "");
  const [numeroSolicitud, setNumeroSolicitud] = useState(sessionStorage.getItem('filtroNumSolicitud') || "");
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

  const [openDialog2, setOpenDialog2] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); // Estado para saber qué acción se va a realizar
  const [currentData, setCurrentData] = useState([]);
  const [laboralChecked, setLaboralChecked] = useState(false);
  const [domicilioChecked, setDomicilioChecked] = useState(false);
  const [entrada, setEntrada] = useState("");

  const handleConfirm = async () => {
    if (currentAction === "estado") {
      handleApproveEstado(currentData);
    } else if (currentAction === "resultado") {
      await handleApproveResultado(currentData);
      if (laboralChecked) await patchLaboral(currentData.id);
      if (domicilioChecked) await patchDomicilio(currentData.id);
      if (entrada.trim() !== "") await patchEntrada(currentData.id, entrada);
    }

    setOpenDialog2(false);
    setLaboralChecked(false);
    setDomicilioChecked(false);
    setEntrada("");
  };

  const patchEntrada = async (idSolicitud, valor) => {
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        {
          Entrada: parseFloat(valor),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        enqueueSnackbar("Entrada registrada correctamente.", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la entrada:", error);
      enqueueSnackbar("Error al actualizar la entrada.", {
        variant: "error",
      });
    }
  };

  const patchDomicilio = async (idSolicitud) => {
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        {
          TerrenoDomicilio: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", {
        variant: "error",
      });
    }
  };

  const patchLaboral = async (idSolicitud) => {
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        {
          TerrenoLaboral: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", {
        variant: "error",
      });
    }
  };

  const fetchInsertarDatos = async (tipo, data, estado) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {
        idCre_SolicitudWeb: data,
        Tipo: tipo,
        idEstadoVerificacionDocumental: estado,
        Usuario: userData.Nombre,

      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  const fetchInsertarDatos2 = async (tipo, data, estado) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      const analistaNombre = analistas.find((a) => a.idUsuario === data.idAnalista)?.Nombre || "No disponible"; console.log(data)
      await axios.post(url, {
        idCre_SolicitudWeb: data.id,
        Tipo: tipo,
        idEstadoVerificacionDocumental: estado,
        Usuario: userData.Nombre,
        Telefono: analistaNombre

      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  const fetchInsertarDatos3 = async (tipo, data, estado) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      const operadorNombre = operadores.find((a) => a.idUsuario === data.Operador)?.Nombre || "Vacio"; console.log(data)
      await axios.post(url, {
        idCre_SolicitudWeb: data.id,
        Tipo: tipo,
        idEstadoVerificacionDocumental: estado,
        Usuario: userData.Nombre,
        Telefono: operadorNombre

      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  const handleApproveEstado = (data) => {
    patchSolicitudEstadoyResultado(data.id, { Estado: 2 });
    fetchInsertarDatos(6, data.id, 2);
    setRecargar(true);

  };

  const handleApproveResultado = (data) => {
    patchSolicitudEstadoyResultado(data.id, { Resultado: 1 });
    patchSolicitudEstadoyResultado(data.id, { Estado: 1 });
    fetchInsertarDatos(7, data.id, 1);
    setRecargar(true);
  };

  const patchSolicitudEstadoyResultado = async (
    idSolicitud,
    camposActualizar
  ) => {
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        camposActualizar, // Esto puede ser { Estado: 2 } o { Resultado: 1 }
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", {
        variant: "error",
      });
    }
  };

  const permisoAprobarResultado = (data) => {
    const permiso = permisos.find((p) => p.Permisos === `EDITAR RESULTADO`);
    // Retornar true si no existe el permiso o si no está activo
    return !permiso || !permiso.Activo;
  };

  const permisoAprobarEstado = (data) => {
    const permiso = permisos.find((p) => p.Permisos === `EDITAR ESTADO`);
    // Retornar true si no existe el permiso o si no está activo
    return !permiso || !permiso.Activo;
  };

  const tienePermisoEditarAnalista = () => {
    const permiso = permisos.find((p) => p.Permisos === "EDITAR ANALISTA");
    return permiso && permiso.Activo;
  };

  const permisoEditarOperador = () => {
    const permiso = permisos.find((p) => p.Permisos === "EDITAR OPERADORA");
    return permiso && permiso.Activo;
    // }
    //return true
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
          permissionscomponents(idMenu, userData?.idUsuario),
          fecthAnalista(),
          fetchOperador()
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

  const fetchTiempSolicweb = async (tipo, idCre_SolicitudWeb, estado) => {
    try {
      const url = APIURL.get_TiempSolicWeb(tipo, idCre_SolicitudWeb, estado);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching tiemposolicitudesweb data:", error);
      return null;
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

  const convertirTiempoASegundos = (tiempoStr) => {
    if (tiempoStr === "N/A") return 0;

    let segundos = 0;

    // Extraer días
    const diasMatch = tiempoStr.match(/(\d+)d/);
    if (diasMatch) {
      segundos += parseInt(diasMatch[1]) * 86400; // 1 día = 86400 segundos
    }

    // Extraer horas
    const horasMatch = tiempoStr.match(/(\d+)h/);
    if (horasMatch) {
      segundos += parseInt(horasMatch[1]) * 3600; // 1 hora = 3600 segundos
    }

    // Extraer minutos
    const minutosMatch = tiempoStr.match(/(\d+)min/);
    if (minutosMatch) {
      segundos += parseInt(minutosMatch[1]) * 60; // 1 minuto = 60 segundos
    }

    return segundos;
  };

  const convertirSegundosATuFormato = (totalSegundos) => {
    if (totalSegundos === 0) return "0min";

    const dias = Math.floor(totalSegundos / 86400);
    const horas = Math.floor((totalSegundos % 86400) / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);

    let resultado = [];

    if (dias > 0) resultado.push(`${dias}d`);
    if (horas > 0) resultado.push(`${horas}h`);
    if (minutos > 0) resultado.push(`${minutos}min`);

    return resultado.join(" ") || "0min";
  };

  const sumarTodosLosTiempos = () => {
    // Obtener todos los elementos con la clase 'tiempo-transcurrido'
    const elementosTiempo = Array.from(document.querySelectorAll('.tiempo-transcurrido'));

    let totalSegundos = 0;
    let tiemposValidos = 0;

    elementosTiempo.forEach(elemento => {
      const tiempoTexto = elemento.textContent.trim();
      if (tiempoTexto && tiempoTexto !== "N/A") {
        totalSegundos += convertirTiempoASegundos(tiempoTexto);
        tiemposValidos++;
      }
    });

    if (tiemposValidos === 0) return "N/A";

    return convertirSegundosATuFormato(totalSegundos);
  };

  const [tiempoTotal, setTiempoTotal] = useState("N/A");

  useEffect(() => {
    // Usar ResizeObserver para actualizar el tiempo total cuando cambia el tamaño
    const observer = new ResizeObserver(() => {
      const timer = setTimeout(() => {
        setTiempoTotal(sumarTodosLosTiempos());
      }, 100);
      return () => clearTimeout(timer);
    });

    // Observar el contenedor principal
    const dialogElement = document.querySelector('.MuiDialog-paper');
    if (dialogElement) {
      observer.observe(dialogElement);
    }

    // También actualizar cuando cambian las fechas
    setTiempoTotal(sumarTodosLosTiempos());

    return () => {
      if (dialogElement) {
        observer.unobserve(dialogElement);
      }
      observer.disconnect();
    };
  }, [fechaTiempos]);

  const [idsTerrenasMap, setIdsTerrenasMap] = useState({});
  const [openPreDocumentos, setOpenPreDocumentos] = useState(false);
  const [preDocumentosData, setPreDocumentosData] = useState(null);
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
        // No hay datos, abrir PreDocumentos (nuevo componente)
        setPreDocumentosData({ data, tipo });
        setOpenPreDocumentos(true);
        return;
      }

      if (tipo === "domicilio") {
        if (idsTerrenas.idTerrenaGestionDomicilio > 0) {
          setDomicilioData({ ...idsTerrenas, idSolicitud: data.id });
          setDomicilioModalOpen(true);
        } else if (idsTerrenas.idTerrenaGestionDomicilio === 0) {
          await fetchtiemposolicitudesweb(data.id, 4);
          setOpenModalPendiente(true);
        }
        return;
      }

      if (tipo === "trabajo") {
        if (idsTerrenas.idTerrenaGestionTrabajo > 0) {
          setTrabajoData({ ...idsTerrenas, idSolicitud: data.id });
          setTrabajoModalOpen(true);
        } else if (idsTerrenas.idTerrenaGestionTrabajo === 0) {
          await fetchtiemposolicitudesweb(data.id, 5);
          setOpenModalPendiente(true);
        }
        return;
      }

    } catch (error) {
      console.error("Error fetching data for verificación terrena:", error);
    }
  };

  const [selectDeshabilitado, setSelectDeshabilitado] = useState(false);

  useEffect(() => {
    if (userData?.Nombre && analistas?.length > 0) {
      const analistaCoincidente = analistas.find((a) => {
        const nombreAnalista = a.Nombre?.toLowerCase().trim();
        const nombreUser = userData.Nombre?.toLowerCase().trim();
        return nombreAnalista === nombreUser;
      });

      if (analistaCoincidente) {
        setAnalistaSelected(analistaCoincidente.idUsuario);
        setSelectDeshabilitado(true);
      } else {
        setSelectDeshabilitado(false);
      }
    }
  }, [userData?.Nombre, analistas]);

  // Obtener bodegas
  const fetchBodega = async () => {
    try {
      const userId = userData?.idUsuario;
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

    /*const verificacionDomicilioOk =
      !data.Domicilio || data.idEstadoVerificacionDomicilio === 2;

    const verificacionLaboralOk =
      !data.Laboral || data.idEstadoVerificacionTerrena === 2;
*/
    return condicionesBase
  };

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

  useEffect(() => {
    if (!socket) return;

    const onChanged = (data) => {
      // Forzar re-fetch
      setRecargar(prev => !prev);
    };

    socket.on("solicitud-web-changed", onChanged);

    return () => {
      socket.off("solicitud-web-changed", onChanged);
    };
  }, [socket]);


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
    recargar,

  ]);

  useEffect(() => {

    // Resetear página si cambian filtros
    setCurrentPage(1);
  }, [
    tipoConsulta,
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
  const [openDialog3, setOpenDialog3] = useState(false);
  const [analistasDisponibles, setAnalistasDisponibles] = useState([]);
  const [analistaSeleccionado, setAnalistaSeleccionado] = useState(null);
  const [filaActual, setFilaActual] = useState(null);
  const [openDialogConfirmar, setOpenDialogConfirmar] = useState(false); // Confirmación
  const [openDialogOperador, setOpenDialogOperador] = useState(false);
  const [operadorSeleccionado, setOperadorSeleccionado] = useState(null);

  const handleConfirmarAsignacion = async () => {
    try {
      setOpenDialogConfirmar(false);

      if (analistaSeleccionado === filaActual.idAnalista) {
        enqueueSnackbar("El analista seleccionado es el mismo que el actual.", {
          variant: "error",
        });
        setAnalistaSeleccionado(null)
        return;
      }

      await updateAnalista(filaActual, analistaSeleccionado);
      await fetchConsultaYNotifica(filaActual.id, filaActual, {
		title: "¡Nueva solicitud enviada a revisión! 👀",
        body: `Revisa la solicitud de crédito ${filaActual.numeroSolicitud} de 🧑‍💼 ${filaActual.PrimerNombre} ${filaActual.ApellidoPaterno}
		Fecha: ${fechaHoraEcuador}`,
        type: "success",
        empresa: "CREDI",
        url: "", // Opcional
        tipo: "analista",
        });
      enqueueSnackbar("Analista actualizado correctamente", {
        variant: "success",
      });
      setAnalistaSeleccionado(null)
    } catch (error) {
      console.error("Error al confirmar la asignación:", error);
      enqueueSnackbar("Ocurrió un error al actualizar el analista.", {
        variant: "error",
      });
    }
  };


  const handleEditarAnalista = (fila) => {
    setFilaActual(fila);
    fetchAnalistas();
  };


  const handleEditarOperador = (fila) => {
    setFilaActual(fila);
    fetchOperador(); // Ya la tienes definida
    setOpenDialogOperador(true);
  };


  const fetchAnalistas = async () => {
    try {
      const response = await axios.get(APIURL.analistacredito(), {
        headers: { method: "GET", cache: "no-store" },
      });

      const activos = response.data.filter((a) => a.Estado === 1);
      setAnalistasDisponibles(activos);
      setOpenDialog3(true);
    } catch (error) {
      console.error("Error al obtener analistas:", error);
    }
  };

  const updateAnalista = async (fila, numero) => {
    console.log(fila.id)
    console.log(numero)
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(fila.id),
        {
          idAnalista: numero,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", {
        variant: "error",
      });
    }

    fetchInsertarDatos2(8, fila, 1)
  };


  const updateOperador = async (fila, numero) => {
    console.log(fila.id)
    console.log(numero)
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(fila.id),
        {
          idOperador: numero,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", {
        variant: "error",
      });
    }

    fetchInsertarDatos3(9, fila, 1)
  };

  const [operadores, setOperadores] = useState([]);

  const fetchOperador = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(APIURL.getUsuarioPorROL(16), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setOperadores(response.data); // Guarda directamente la lista de operadores
      }
    } catch (error) {
      console.error("Error al obtener operadores:", error);
    }
  };

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
          EstadoDomicilio: domicilio == "Todos" ? 0 : domicilio,
          EstadoLaboral: laboral == "Todos" ? 0 : laboral,
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
              Operador: item.idOperador,
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
          `${vendedor.PrimerNombre || ""} ${vendedor.SegundoNombre || ""} ${vendedor.ApellidoPaterno || ""
            } ${vendedor.ApellidoMaterno || ""}`.trim() || "No disponible"
        );
      }
    } catch (error) {
      console.error("Error fetching vendedor data:", error);
      return "No disponible";
    }
  };

  // Manejar cambio de bodega
  //   const handleBodegaChange = (event) => {
  //     setSelectedBodega(event.target.value);
  //   };

  //   const handleVendedorChange = (event) => {
  //     setSelectedVendedor(event.target.value);
  //   };

  //   const handleAnalistaChange = (event) => {
  //     setAnalistaSelected(event.target.value);
  //   };

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
      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", {
          variant: "success",
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
    const stateData = {
      id: registro.id,
      NumeroSolicitud: registro.NumeroSolicitud,
      nombre: registro.nombre,
      cedula: registro.cedula,
      fecha: registro.fecha,
      almacen: registro.almacen,
      foto: registro.imagen,
      vendedor: registro.vendedor,
      consulta: registro.consulta,
      idEstadoVerificacionDocumental: registro.idEstadoVerificacionDocumental,
      estadoVerifD: registro.idEstadoVerificacionDocumental,
    };

    if (
      registro.idEstadoVerificacionDocumental === 2 ||
      registro.idEstadoVerificacionDocumental === 4
    ) {
      navigate("/gestorDocumentos", {
        replace: true,
        state: stateData,
      });
    } else {
      navigate("/documental", {
        replace: true,
        state: stateData,
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
    const [tipo1, tipo2, tipo3] = await Promise.all([
      fetchTiempSolicweb(1, row.id, "1,12"), //solicitudes
      fetchTiempSolicweb(2, row.id, "2,3"),  //telefonica 
      fetchTiempSolicweb(3, row.id, "2,4")   //documental
    ]);


    const resultados = {
      tipo1, tipo2, tipo3
    }
    setfechaTiempos(resultados);
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

  const handleApprove = (rowData) => {
    // aquí tu lógica para aprobar...
    console.log("Aprobando fila:", rowData);

  };


  const handleEquifax = () => {
    navigate("/equifaxx", {
      replace: true,
      state: {
        nombre: selectedRow.nombre,
        cedula: selectedRow.cedula,
        Fecha: selectedRow.fecha,
      },
    });
  }

  const limpiarFiltros = () => {
    setFechaInicio(date15DaysAgoStr);
    setFechaFin(today);
    setSelectedBodega("todos");
    setSelectedVendedor("todos");
    setAnalistaSelected("todos");
    setEstado("todos");
    setSolicitud("Todos");
    setDocumental("Todos");
    setTelefonica("Todos");
    setDomicilio("Todos");
    setLaboral("Todos");
    setCedula('')
    setNombre('')
    setNumeroSolicitud('')

    sessionStorage.removeItem('filtroIniFecha');
    sessionStorage.removeItem('filtroFinFecha');
    sessionStorage.removeItem('filtroBodega');
    sessionStorage.removeItem('filtroVendedor');
    sessionStorage.removeItem('filtroAnalista');
    sessionStorage.removeItem('filtroEstado');
    sessionStorage.removeItem('filtroSolicitud');
    sessionStorage.removeItem('filtroDocumental');
    sessionStorage.removeItem('filtroTelefonica');
    sessionStorage.removeItem('filtroDomicilio');
    sessionStorage.removeItem('filtroLaboral');
    sessionStorage.removeItem('filtroCedula')
    sessionStorage.removeItem('filtroNombre')
    sessionStorage.removeItem('filtroNumSolicitud')
  };


  useEffect(() => {
    if (userData?.idGrupo === 23) {
      if (bodegas.length > 0) {
        const primeraBodega = bodegas[0].b_Bodega;
        setSelectedBodega(primeraBodega);
        sessionStorage.setItem('filtroBodega', primeraBodega);
      }

      const vendedorAutorizado = vendedores.find(
        (v) => v.Codigo === userData.Nombre
      );
      if (vendedorAutorizado) {
        setSelectedVendedor(vendedorAutorizado.idPersonal);
        sessionStorage.setItem('filtroVendedor', vendedorAutorizado.idPersonal);
      }
    }
  }, [userData?.idGrupo, bodegas, vendedores]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  useEffect(() => {
    fetchSolicitudes();
  }, [itemsPerPage, currentPage]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
        <TextField
          label="Fecha Desde"
          type="date"
          variant="outlined"
          value={fechaInicio}
          onChange={(e) => { const fechaIniFiltro = e.target.value; setFechaInicio(fechaIniFiltro); sessionStorage.setItem('filtroIniFecha', fechaIniFiltro); }}
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
          onChange={(e) => { const fechaFinFiltro = e.target.value; setFechaFin(fechaFinFiltro); sessionStorage.setItem('filtroFinFecha', fechaFinFiltro); }}
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
            onChange={(e) => { const bodegaFiltro = e.target.value; setSelectedBodega(bodegaFiltro); sessionStorage.setItem('filtroBodega', bodegaFiltro); }}
            label="Buscar por nombre"
            disabled={userData?.idGrupo === 23}
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
            onChange={(e) => { const vendedorFiltro = e.target.value; setSelectedVendedor(vendedorFiltro); sessionStorage.setItem('filtroVendedor', vendedorFiltro); }}
            label="Buscar por nombre"
            disabled={userData?.idGrupo === 23}
          >
            {userData?.idGrupo !== 23 && (<MenuItem value="todos">Todos</MenuItem>)}
            {(userData?.idGrupo === 23 ? vendedores.filter(
              (vendedor) => vendedor?.Codigo === userData?.Nombre)
              : vendedores
            ).map((vendedor) => (
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
            onChange={(e) => { const analistaFiltro = e.target.value; setAnalistaSelected(analistaFiltro); sessionStorage.setItem('filtroAnalista', analistaFiltro); }}
            label="Analista"
            //disabled={selectDeshabilitado} //  solo si hubo match
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
            onChange={(e) => { const estadoFiltro = e.target.value; setEstado(estadoFiltro); sessionStorage.setItem('filtroEstado', estadoFiltro); }}
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
            onChange={(e) => { const solicitudFiltro = e.target.value; setSolicitud(solicitudFiltro); sessionStorage.setItem('filtroSolicitud', solicitudFiltro); }}
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
            onChange={(e) => { const documentalFiltro = e.target.value; setDocumental(documentalFiltro); sessionStorage.setItem('filtroDocumental', documentalFiltro); }}
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
            onChange={(e) => { const telefonicaFiltro = e.target.value; setTelefonica(telefonicaFiltro); sessionStorage.setItem('filtroTelefonica', telefonicaFiltro); }}
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
            onChange={(e) => { const domicilioFiltro = e.target.value; setDomicilio(domicilioFiltro); sessionStorage.setItem('filtroDomicilio', domicilioFiltro); }}
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
            onChange={(e) => { const LaboralFiltro = e.target.value; setLaboral(LaboralFiltro); sessionStorage.setItem('filtroLaboral', LaboralFiltro); }}
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
        {puedeCrearSolicitud && (
          <button
            title="Nueva Solicitud"
            className="group cursor-pointer outline-none hover:rotate-90 transition-transform duration-300 w-[60px] h-[60px] flex items-center justify-center"
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
                strokeWidth="1.5"
              ></path>
              <path d="M8 12H16" strokeWidth="1.5"></path>
              <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg>
          </button>)}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
        {/* Busqueda por cedula */}

        <TextField
          label="Buscar por cédula"
          variant="outlined"
          value={cedula}
          onChange={(e) => { const cedulaFiltro = e.target.value; setCedula(cedulaFiltro); sessionStorage.setItem('filtroCedula', cedulaFiltro); }}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: <IconButton></IconButton>,
          }}
        />

        {/* Busqueda por nombre cliente  */}

        <TextField
          label="Buscar por nombre cliente"
          variant="outlined"
          value={nombre}
          onChange={(e) => { const nombreFiltro = e.target.value; setNombre(nombreFiltro); sessionStorage.setItem('filtroNombre', nombreFiltro); }}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: <IconButton></IconButton>,
          }}
        />

        {/* Busqueda por numero de solicitud */}
        <TextField
          label="Buscar por número de solicitud"
          variant="outlined"
          value={numeroSolicitud}
          onChange={(e) => { const numSoliFiltro = e.target.value; setNumeroSolicitud(numSoliFiltro); sessionStorage.setItem('filtroNumSolicitud', numSoliFiltro); }}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: <IconButton></IconButton>,
          }}
        />
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105"
          onClick={limpiarFiltros}
        >
          <DeleteIcon /> Limpiar Filtros
        </button>
      </div>

      <div className="p-6 bg-gray-50 rounded-xl">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 750,
              width: "100%",
              boxShadow: "none",
              margin: "0.5rem auto",
            }}
          >
            <Table
              stickyHeader
              sx={{
                borderSpacing: "0 10px",
                borderCollapse: "separate",
                marginTop: "-10px", // Reduce el espacio después del encabezado
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "linear-gradient(90deg, #f9fafb 0%, #e5e7eb 100%)",
                    "& th": {
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      padding: "8px 8px", // Reducido del padding vertical de 12px a 8px
                      borderBottom: "1px solid #e2e8f0", // Reducido el grosor del borde inferior
                    },
                  }}
                >
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
                  <TableCell align="center">Operador</TableCell>
                </TableRow>
              </TableHead>

              <TableBody sx={{ marginTop: 0 }}>
                {datos.map((data, index) => {
                  const isError = data.resultado === 0;
                  const bgColor = isError
                    ? "#fee2e2"
                    : index % 2 === 0
                      ? "#f9fafb"
                      : "#ffffff";
                  const textColor = isError ? "#991b1b" : "#1f2937";
                  return (
                    <TableRow
                      key={data.id}
                      sx={{
                        backgroundColor: bgColor,
                        transition: "all 0.25s ease-in-out",
                        "&:hover": {
                          backgroundColor: isError ? "#fecaca" : "#f1f5f9",
                          boxShadow: "0 8px 15px rgba(0,0,0,0.12)",
                          transform: "translateY(-4px)",
                        },
                        "&:active": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
                        },
                        // Definimos bordes para todas las celdas
                        "& td": {
                          border: "1px solid",
                          borderColor: isError ? "#fecaca" : "#e5e7eb",
                          padding: "14px 8px",
                          fontSize: "0.875rem",
                          color: textColor,
                          transition: "all 0.25s ease-in-out",
                        },
                        // Aplicar esquinas redondeadas a primera y última celda
                        "& td:first-of-type": {
                          borderRadius: "8px 0 0 8px",
                          borderRight: "none",
                        },
                        "& td:last-of-type": {
                          borderRadius: "0 8px 8px 0",
                          borderLeft: "none",
                        },
                        // Para celdas intermedias, eliminamos bordes laterales duplicados
                        "& td:not(:first-of-type):not(:last-of-type)": {
                          borderLeft: "none",
                          borderRight: "none",
                        },
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        cursor: "pointer",
                      }}
                    >
                      <TableCell align="center">
                        {data.NumeroSolicitud}
                      </TableCell>
                      <TableCell align="center">{data.nombre}</TableCell>
                      <TableCell align="center">{data.cedula}</TableCell>
                      <TableCell align="center">
                        {new Date(data.fecha).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">{data.almacen}</TableCell>
                      <TableCell align="center">{data.vendedor}</TableCell>
                      <TableCell align="center">{data.consulta}</TableCell>

                      <TableCell align="center">
                        {data.estado === "RECHAZADO" ? (
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-block",
                              ...(permisoAprobarEstado(data)
                                ? {}
                                : {
                                  "&:hover .approveOverlay": {
                                    transform: "translateY(0)",
                                    opacity: 1,
                                  },
                                }),
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                display: "inline-flex",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                borderRadius: "9999px",
                                backgroundColor: "#fee2e2",
                                color: "#991b1b",
                                transition: "all 0.3s ease",
                              }}
                            >
                              {data.estado}
                            </Box>
                            {!permisoAprobarEstado(data) && (
                              <Box
                                className="approveOverlay"
                                onClick={() => {
                                  setCurrentAction("estado");
                                  setCurrentData(data); // Guarda la fila actual
                                  setOpenDialog2(true); // Abrir el diálogo para confirmar
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "#22c55e",
                                  borderRadius: "9999px",
                                  cursor: "pointer",
                                  transform: "translateY(100%)",
                                  opacity: 0,
                                  transition:
                                    "transform 0.3s ease, opacity 0.3s ease",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#ffffff",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                  APROBAR?
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              px: 1.5,
                              py: 0.5,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              borderRadius: "9999px",
                              backgroundColor:
                                data.estado === "APROBADO"
                                  ? "#dcfce7"
                                  : data.estado === "PRE-APROBADO"
                                    ? "#dbeafe"
                                    : data.estado === "ANULADO"
                                      ? "#f3f4f6"
                                      : "#fef9c3",
                              color:
                                data.estado === "APROBADO"
                                  ? "#166534"
                                  : data.estado === "PRE-APROBADO"
                                    ? "#1e40af"
                                    : data.estado === "ANULADO"
                                      ? "#374151"
                                      : "#854d0e",
                            }}
                          >
                            {data.estado}
                          </Box>
                        )}

                        {/* Ícono de los tres puntos y llamada al popover */}
                        <span
                          style={{
                            pointerEvents: estaDeshabilitado(data)
                              ? "none"
                              : "auto",
                            opacity: estaDeshabilitado(data) ? 0.5 : 1,
                          }}
                        >
                          <MoreVertIcon
                            onClick={(event) =>
                              handlePopoverOpen(event, 6, data)
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </span>

                        {/* Popover */}
                        <DocumentStatusPopover
                          open={
                            popoverData.open &&
                            popoverData.selectedRowId === data.id
                          }
                          anchorEl={popoverData.anchorEl}
                          onClose={handlePopoverClose}
                          clienteEstados={clienteEstados}
                          estadoColores={estadoColores}
                        />
                      </TableCell>
                      <TableCell align="center">{data.tipoCliente}</TableCell>
                      <TableCell align="center">
                        {data.resultado === 0 ? (
                          <Box
                            sx={{
                              position: "relative",
                              width: 24,
                              height: 24,
                              display: "inline-block",
                              ...(permisoAprobarResultado(data)
                                ? {} // Sin efectos si no tiene permiso
                                : {
                                  "&:hover .approveOverlay": {
                                    opacity: 1,
                                    transform: "translateY(0)",
                                  },
                                }),
                            }}
                          >
                            {/* Ícono ❌ */}
                            <HighlightOffIcon
                              sx={{
                                color: "#DC3545",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: 24,
                                height: 24,
                              }}
                            />

                            {/* Overlay solo si tiene permiso */}
                            {!permisoAprobarResultado(data) && (
                              <Box
                                className="approveOverlay"
                                onClick={() => {
                                  setCurrentAction("resultado");
                                  setCurrentData(data); // Guarda la fila actual
                                  setOpenDialog2(true); // Abrir el diálogo para confirmar
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: 24,
                                  height: 24,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  backgroundColor: "#28A745",
                                  color: "#fff",
                                  cursor: "pointer",
                                  opacity: 0,
                                  transform: "translateY(100%)",
                                  transition:
                                    "opacity 0.3s ease, transform 0.3s ease",
                                }}
                              >
                                <CheckCircleIcon sx={{ fontSize: 20 }} />
                              </Box>
                            )}
                          </Box>
                        ) : data.resultado === 1 ? (
                          <CheckCircleIcon sx={{ color: "#28A745" }} />
                        ) : null}

                        {/* Ícono de acciones y popover */}
                        <span
                          style={{
                            pointerEvents: estaDeshabilitado(data)
                              ? "none"
                              : "auto",
                            opacity: estaDeshabilitado(data) ? 0.5 : 1,
                          }}
                        >
                          <MoreVertIcon
                            onClick={(event) =>
                              handlePopoverOpen(event, 7, data)
                            } // identificador para "resultado"
                            style={{ cursor: "pointer" }}
                          />
                        </span>

                        <DocumentStatusPopover
                          open={
                            popoverData.open &&
                            popoverData.selectedRowId === data.id
                          }
                          anchorEl={popoverData.anchorEl}
                          onClose={handlePopoverClose}
                          clienteEstados={clienteEstados}
                          estadoColores={estadoColores}
                        />
                      </TableCell>

                      <TableCell align="center">{data.entrada}</TableCell>

                      {/* Detalles */}
                      <TableCell align="center">
                        <Tooltip title="Ver más" arrow placement="top">
                          <IconButton
                            onClick={() => handleOpenDialog(data)}
                            size="small"
                            sx={{
                              bgcolor: isError ? "#fee2e2" : "#f1f5f9",
                              "&:hover": {
                                bgcolor: isError ? "#fca5a5" : "#e2e8f0",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <VisibilityIcon
                              fontSize="small"
                              sx={{ color: isError ? "#b91c1c" : "#475569" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      {/* Solicitudes */}
                      <TableCell align="center">
                        <div>
                          <span>
                            <IconButton
                              onClick={() => handlesolicitud(data)}
                              disabled={
                                estaDeshabilitado(data) ||
                                estadoDeshabilitadoporPermisos(data)
                              }
                              size="small"
                              sx={{
                                opacity: estaDeshabilitado(data) ? 0.4 : 1,
                                bgcolor: isError ? "#fee2e2" : "#f1f5f9",
                                "&:hover": {
                                  bgcolor: isError ? "#fca5a5" : "#e2e8f0",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              {getSolicitudIconByEstado(
                                data.idEstadoVerificacionSolicitud
                              )}
                            </IconButton>
                            <span
                              style={{
                                pointerEvents: estaDeshabilitado(data)
                                  ? "none"
                                  : "auto",
                                opacity: estaDeshabilitado(data) ? 0.5 : 1,
                              }}
                            >
                              <MoreVertIcon
                                onClick={(event) =>
                                  handlePopoverOpen(event, 1, data)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          </span>

                          <DocumentStatusPopover
                            open={
                              popoverData.open &&
                              popoverData.selectedRowId === data.id
                            } // Verificar si el popover corresponde a esta fila
                            anchorEl={popoverData.anchorEl}
                            onClose={handlePopoverClose}
                            clienteEstados={clienteEstados}
                            estadoColores={estadoColores}
                          />
                        </div>
                      </TableCell>

                      {/* Documental */}
                      <TableCell align="center">
                        <div>
                          <span>
                            <IconButton
                              onClick={() => handledocumentos(data)}
                              disabled={
                                //// data.idEstadoVerificacionDocumental === 2 ||
                                estaDeshabilitado(data) ||
                                estadoDeshabilitadoDocumental(data) ||
                                verificacionSolicitud(data)
                              }
                              size="small"
                              sx={{
                                opacity: estaDeshabilitado(data) ? 0.4 : 1,
                                bgcolor: isError ? "#fee2e2" : "#f1f5f9",
                                "&:hover": {
                                  bgcolor: isError ? "#fca5a5" : "#e2e8f0",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              {getIconByEstado(
                                data.idEstadoVerificacionDocumental
                              )}
                            </IconButton>

                            {/* InfoIcon al lado del IconButton */}
                            <span
                              style={{
                                pointerEvents: estaDeshabilitado(data)
                                  ? "none"
                                  : "auto",
                                opacity: estaDeshabilitado(data) ? 0.5 : 1,
                              }}
                            >
                              <MoreVertIcon
                                onClick={(event) =>
                                  handlePopoverOpen(event, 3, data)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          </span>

                          <DocumentStatusPopover
                            open={
                              popoverData.open &&
                              popoverData.selectedRowId === data.id
                            } // Verificar si el popover corresponde a esta fila
                            anchorEl={popoverData.anchorEl}
                            onClose={handlePopoverClose}
                            clienteEstados={clienteEstados}
                            estadoColores={estadoColores}
                          />
                        </div>
                      </TableCell>

                      {/* Telefónica */}
                      <TableCell align="center">
                        <div>
                          <span>
                            <IconButton
                              onClick={() => handleTelefonica(data)}
                              disabled={
                                data.idEstadoVerificacionTelefonica === 1 ||
                                estaDeshabilitado(data) ||
                                verificacionSolicitud(data) ||
                                estadoDeshabilitadotelefonica(data)
                              }
                              size="small"
                              sx={{
                                opacity: estaDeshabilitado(data) ? 0.4 : 1,
                                bgcolor: isError ? "#fee2e2" : "#f1f5f9",
                                "&:hover": {
                                  bgcolor: isError ? "#fca5a5" : "#e2e8f0",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              {getPhoneIconByEstado(
                                data.idEstadoVerificacionTelefonica
                              )}
                            </IconButton>
                            {/* InfoIcon al lado del IconButton */}
                            <span
                              style={{
                                pointerEvents: estaDeshabilitado(data)
                                  ? "none"
                                  : "auto",
                                opacity: estaDeshabilitado(data) ? 0.5 : 1,
                              }}
                            >
                              <MoreVertIcon
                                onClick={(event) =>
                                  handlePopoverOpen(event, 2, data)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          </span>

                          <DocumentStatusPopover
                            open={
                              popoverData.open &&
                              popoverData.selectedRowId === data.id
                            } // Verificar si el popover corresponde a esta fila
                            anchorEl={popoverData.anchorEl}
                            onClose={handlePopoverClose}
                            clienteEstados={clienteEstados}
                            estadoColores={estadoColores}
                          />
                        </div>
                      </TableCell>

                      {/* Domicilio */}
                      <TableCell align="center">
                        <div>
                          <span>
                            <IconButton
                              onClick={() =>
                                handleOpenModalVerificacion(data, "domicilio")
                              }
                              disabled={
                                verificacionSolicitud(data) ||
                                data.Domicilio === false || !docAprobados[data.id]



                              }
                              size="small"
                              sx={{
                                opacity:
                                  estaDeshabilitado(data) ||
                                    verificacionSolicitud(data)
                                    ? 0.4
                                    : 1,
                                bgcolor: isError ? "#fee2e2" : "#f1f5f9",
                                "&:hover": {
                                  bgcolor: isError ? "#fca5a5" : "#e2e8f0",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              {getIconDomicilio(
                                data.idEstadoVerificacionDomicilio
                              )}
                            </IconButton>

                            {/* InfoIcon al lado del IconButton */}

                            <span
                              style={{
                                pointerEvents: estaDeshabilitado(data)
                                  ? "none"
                                  : "auto",
                                opacity: estaDeshabilitado(data) ? 0.5 : 1,
                              }}
                            >
                              <MoreVertIcon
                                onClick={(event) =>
                                  handlePopoverOpen(event, 4, data)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          </span>

                          <DocumentStatusPopover
                            open={
                              popoverData.open &&
                              popoverData.selectedRowId === data.id
                            } // Verificar si el popover corresponde a esta fila
                            anchorEl={popoverData.anchorEl}
                            onClose={handlePopoverClose}
                            clienteEstados={clienteEstados}
                            estadoColores={estadoColores}
                          />
                        </div>
                      </TableCell>

                      {/* Laborales */}
                      <TableCell align="center">
                        <div>
                          <span>
                            <IconButton
                              onClick={() =>
                                handleOpenModalVerificacion(data, "trabajo")
                              }
                              disabled={
                                verificacionSolicitud(data) ||
                                data.Laboral === false ||
                                !docAprobados[data.id]

                              }
                              size="small"
                              sx={{
                                opacity:
                                  verificacionSolicitud(data) ||
                                    data.Laboral === false
                                    ? 0.2
                                    : 1,
                                bgcolor: isError ? "#fee2e2" : "#f1f5f9",
                                "&:hover": {
                                  bgcolor: isError ? "#fca5a5" : "#e2e8f0",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              {getIconLaboral(data.idEstadoVerificacionTerrena)}
                            </IconButton>

                            {/* InfoIcon al lado del IconButton */}
                            <span
                              style={{
                                pointerEvents: estaDeshabilitado(data)
                                  ? "none"
                                  : "auto",
                                opacity: estaDeshabilitado(data) ? 0.5 : 1,
                              }}
                            >
                              <MoreVertIcon
                                onClick={(event) =>
                                  handlePopoverOpen(event, 5, data)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          </span>

                          <DocumentStatusPopover
                            open={
                              popoverData.open &&
                              popoverData.selectedRowId === data.id
                            } // Verificar si el popover corresponde a esta fila
                            anchorEl={popoverData.anchorEl}
                            onClose={handlePopoverClose}
                            clienteEstados={clienteEstados}
                            estadoColores={estadoColores}
                          />
                        </div>
                      </TableCell>

                      {/* Analista */}

                      <TableCell align="center">
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-block",
                            maxWidth: "100%",
                            px: 1,
                            ...(tienePermisoEditarAnalista() && (data.idEstadoVerificacionSolicitud == 10 || data.idEstadoVerificacionSolicitud == 12) && {
                              "&:hover .analistaNombre": {
                                opacity: 0,
                                visibility: "hidden",
                              },
                              "&:hover .editIcon": {
                                opacity: 1,
                                visibility: "visible",
                              },
                            }),
                          }}
                        >
                          {/* Nombre del analista */}
                          <Box
                            className="analistaNombre"
                            sx={{
                              transition: "opacity 0.2s ease",
                              fontWeight: 500,
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {analistas.find((a) => a.idUsuario === data.idAnalista)?.Nombre || "No disponible"}
                          </Box>

                          {/* Ícono de editar solo si tiene permiso */}
                          {tienePermisoEditarAnalista() && (
                            <Box
                              className="editIcon"
                              onClick={() => handleEditarAnalista(data)}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                textAlign: "center",
                                opacity: 0,
                                visibility: "hidden",
                                color: "#6b7280",
                                cursor: "pointer",
                                transition: "opacity 0.2s ease",
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </Box>
                          )}
                          <span
                            style={{
                              pointerEvents: estaDeshabilitado(data)
                                ? "none"
                                : "auto",
                              opacity: estaDeshabilitado(data) ? 0.5 : 1,
                            }}
                          >
                            <MoreVertIcon
                              onClick={(event) =>
                                handlePopoverOpen(event, 8, data)
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </span>
                        </Box>
                      </TableCell>

                      {/* OPerador */}
                      <TableCell align="center">
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-block",
                            maxWidth: "100%",
                            px: 1,
                            ...(permisoEditarOperador() && (data.idEstadoVerificacionSolicitud == 10 || data.idEstadoVerificacionSolicitud == 12) && {
                              "&:hover .operadorNombre": {
                                opacity: 0,
                                visibility: "hidden",
                              },
                              "&:hover .editIcon": {
                                opacity: 1,
                                visibility: "visible",
                              },
                            }),
                          }}
                        >
                          <Box
                            className="operadorNombre"
                            sx={{
                              transition: "opacity 0.2s ease",
                              fontWeight: 500,
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {operadores.find((o) => o.idUsuario === data.Operador)?.Nombre || "Vacio"}
                          </Box>

                          {permisoEditarOperador() && (
                            <Box
                              className="editIcon"
                              onClick={() => handleEditarOperador(data)}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                textAlign: "center",
                                opacity: 0,
                                visibility: "hidden",
                                color: "#6b7280",
                                cursor: "pointer",
                                transition: "opacity 0.2s ease",
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </Box>
                          )}
                          <span
                            style={{
                              pointerEvents: estaDeshabilitado(data)
                                ? "none"
                                : "auto",
                              opacity: estaDeshabilitado(data) ? 0.5 : 1,
                            }}
                          >
                            <MoreVertIcon
                              onClick={(event) =>
                                handlePopoverOpen(event, 9, data)
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </span>
                        </Box>
                      </TableCell>



                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Cuadro de diálogo para ver detalles */}
      <Dialog open={view} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="text-xl font-bold flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: "20%",
              width: "5%",
              transform: "translateY(-50%)",
              backgroundColor: "#e8eaf6",
              borderRadius: "0 12px 12px 0",
              border: "1px solid #2d3689",
              borderLeft: "none",
              padding: "8px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
              minWidth: "20px",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#2d3689",
                fontWeight: 700,
                fontSize: "0.75rem",
                marginBottom: "4px"
              }}
            >
              Total:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#2d3689",
                fontWeight: 600,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              {sumarTodosLosTiempos()}
            </Typography>
          </Box>
          <Timeline
            // position="alternate"
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

            {/* Solicitud */}
            <TimelineItem>
              <TimelineSeparator
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
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
                    {fechaTiempos?.tipo1?.length > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "inline-block",
                          color: "text.primary",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          backgroundColor: "#f0f4f8",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {formatDateTime(fechaTiempos?.tipo1[0].FechaSistema)}
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
                    {fechaTiempos?.tipo1?.length > 1 && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "inline-block",
                            color: "text.primary",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            backgroundColor: "#f0f4f8",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDateTime(fechaTiempos?.tipo1[1]?.FechaSistema)}
                        </Typography>
                        {/* Tiempo transcurrido */}
                        <Typography
                          variant="caption"
                          className="tiempo-transcurrido"
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
                            fechaTiempos?.tipo1[0]?.FechaSistema,
                            fechaTiempos?.tipo1[1]?.FechaSistema
                          )}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>
            {/* Documental */}
            <TimelineItem>
              <TimelineSeparator
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: "40px",
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
                    {fechaTiempos?.tipo3?.some(item => item.idEstadoVerificacionDocumental === 2) && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "inline-block",
                          color: "text.primary",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          backgroundColor: "#f0f4f8",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {formatDateTime(fechaTiempos?.tipo3?.find(item => item.idEstadoVerificacionDocumental === 2)?.FechaSistema)}
                      </Typography>
                    )}
                  </Box>

                  {/* Icono */}
                  <TimelineDot
                    sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)", zIndex: 2 }}
                  >
                    <FolderIcon
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
                    {fechaTiempos?.tipo3?.some(item => item.idEstadoVerificacionDocumental === 4) && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "inline-block",
                            color: "text.primary",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            backgroundColor: "#f0f4f8",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDateTime(fechaTiempos?.tipo3?.find(item => item.idEstadoVerificacionDocumental === 4)?.FechaSistema)}
                        </Typography>
                        {/* Tiempo transcurrido */}
                        <Typography
                          variant="caption"
                          className="tiempo-transcurrido"
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
                            fechaTiempos?.tipo3.find(item => item.idEstadoVerificacionDocumental === 2)?.FechaSistema,
                            fechaTiempos?.tipo3.find(item => item.idEstadoVerificacionDocumental === 4)?.FechaSistema
                          )}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>
            {/* Telefónica */}
            <TimelineItem>
              <TimelineSeparator
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
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
                    {fechaTiempos?.tipo2?.some(item => item.idEstadoVerificacionDocumental === 2) && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "inline-block",
                          color: "text.primary",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          backgroundColor: "#f0f4f8",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {formatDateTime(fechaTiempos?.tipo2?.find(item => item.idEstadoVerificacionDocumental === 2)?.FechaSistema)}
                      </Typography>
                    )}
                  </Box>

                  {/* Icono */}
                  <TimelineDot
                    sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)", zIndex: 2 }}
                  >
                    <PhoneInTalkIcon
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
                    {fechaTiempos?.tipo2?.some(item => item.idEstadoVerificacionDocumental === 3) && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "inline-block",
                            color: "text.primary",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            backgroundColor: "#f0f4f8",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            marginBottom: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDateTime(fechaTiempos?.tipo2?.find(item => item.idEstadoVerificacionDocumental === 3)?.FechaSistema)}
                        </Typography>
                        {/* Tiempo transcurrido */}
                        <Typography
                          variant="caption"
                          className="tiempo-transcurrido"
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
                            fechaTiempos?.tipo2?.find(item => item.idEstadoVerificacionDocumental === 2)?.FechaSistema,
                            fechaTiempos?.tipo2?.find(item => item.idEstadoVerificacionDocumental === 3)?.FechaSistema
                          )}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <TimelineConnector />
              </TimelineSeparator>
            </TimelineItem>

            {/* <TimelineItem>
              <TimelineSeparator
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
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
                          fontSize: "0.7rem",
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

                 
                  <TimelineDot
                    sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)", zIndex: 2 }}
                  >
                    <StoreIcon
                      sx={{ color: "#2d3689", fontSize: "1.2rem" }}
                    />
                  </TimelineDot>

                  
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
                            fontSize: "0.7rem",
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
                        
                        <Typography
                          variant="caption"
                          className="tiempo-transcurrido"
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
            </TimelineItem> */}

            {/* <TimelineItem>
              <TimelineSeparator
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
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
                          fontSize: "0.7rem",
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

                 
                  <TimelineDot
                    sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)", zIndex: 2 }}
                  >
                    <HouseIcon
                      sx={{ color: "#2d3689", fontSize: "1.2rem" }}
                    />
                  </TimelineDot>

                  
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
                            fontSize: "0.7rem",
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
                        
                        <Typography
                          variant="caption"
                          className="tiempo-transcurrido"
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
            </TimelineItem> */}

            <TimelineItem>
              <TimelineSeparator
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
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
                          fontSize: "0.7rem",
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
                    <PersonIcon
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
                            fontSize: "0.7rem",
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
                          className="tiempo-transcurrido"
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

                  {puedeAprobar(selectedRow) && selectedRow.estado !== "APROBADO" && (
                    <div className="flex flex-col gap-4 mt-4">
                      {/* INPUT INVISIBLE PARA CARGAR IMAGEN */}
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                        ref={inputFileRef}
                        style={{ display: "none" }}
                      />

                      {/* PRIMERA FILA DE BOTONES */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <Button onClick={() => setOpenCameraModal(true)}>
                          Tomar Foto
                        </Button>

                        <button
                          onClick={handleUploadClick}
                          disabled={!fileToUpload}
                          className={`flex-1 w-full md:w-auto py-2 px-4 rounded-lg font-semibold shadow-md transition duration-300 ${fileToUpload
                            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                          Subir imagen
                        </button>

                        <Button onClick={() => inputFileRef.current.click()}>
                          Cargar foto
                        </Button>
                      </div>

                      {/* SEGUNDA FILA: BOTÓN VERIFICAR */}
                      <div>
                        <Button
                          onClick={async () => {
                            const cedula = selectedRow?.cedula;
                            const dactilar = selectedRow?.CodigoDactilar;
                            const imagenSubida = selectedRow?.imagen;

                            if (!cedula || !dactilar || !imagenSubida) {
                              enqueueSnackbar("Faltan datos para mostrar la verificación facial.", {
                                variant: "warning",
                              });
                              return;
                            }

                            const fotoRegistro = await fetchImagenRegistroCivil(cedula, dactilar);

                            if (fotoRegistro && typeof fotoRegistro === "string" && fotoRegistro.trim() !== "") {
                              await handleVerificarIdentidad(imagenSubida, fotoRegistro);
                            } else {
                              enqueueSnackbar("No se pudo obtener la imagen del Registro Civil.", {
                                variant: "error",
                              });
                              setOpenRegistroCivil(true);
                            }
                          }}
                        >
                          Verificar fotos
                        </Button>
                      </div>
                    </div>
                  )}



                </div>
              </div>

              <Dialog
                open={openCameraModal}
                onClose={() => setOpenCameraModal(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>Tomar Foto con Cámara</DialogTitle>
                <DialogContent>
                  <CapturarCamara
                    onCapture={(imgBase64) => {
                      setImagenCapturada(imgBase64);
                      setPreviewUrl(imgBase64);
                      setOpenCameraModal(false);

                      // Convertir base64 a objeto File para permitir subir
                      const blob = fetch(imgBase64)
                        .then((res) => res.blob())
                        .then((blobData) => {
                          const file = new File([blobData], "captura.jpg", {
                            type: "image/jpeg",
                          });
                          setFileToUpload(file); // ✅ Esto habilita el botón de "Subir imagen"
                        });
                    }}
                  />
                </DialogContent>
              </Dialog>

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
                      className={`ml-2 font-semibold ${selectedRow.estado === "activo"
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
                  <div className="flex items-center gap-2">
                    {!verEquifax && (
                      <button
                        onClick={() => handleEquifax(data)}
                        className="py-2 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition duration-300 text-sm md:text-base"
                      >
                        Consultar Equifax
                      </button>
                    )}
                  </div>

                  {puedeAprobar(selectedRow) && selectedRow.estado !== "APROBADO" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAbrirVerificacionManual}
                        className="py-2 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition duration-300 text-sm md:text-base"
                      >
                        Verificación Facial
                      </button>
                    </div>
                  )}


                </div>
              </div>

            </div>
          )}
        </DialogContent>
        <DialogActions>
          {selectedRow?.Estado === 1 && (<Button
            color="error"
            onClick={() => {
              patchSolicitudEstadoyResultado(selectedRow?.id, { Estado: 4 });
              patchSolicitudEstadoyResultado(selectedRow?.id, { Resultado: 0 });
              fetchInsertarDatos(6, selectedRow?.id, 4); handleCloseDialog();
            }}
            className="group relative py-3 px-8 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-red-200 hover:shadow-xl"
          >
            Rechazar Solicitud
          </Button>)}
          <Button
            onClick={handleCloseDialog}
            color="primary"
            className="text-base font-semibold"
          >
            Cerrar
          </Button>

          {/* {selectedRow &&
            selectedRow.imagen &&
            selectedRow.imagen !== "prueba" &&
            puedeAprobar(selectedRow) && (
              <Button
                onClick={async () => {
                  setCedula(selectedRow?.cedula);
                  setDactilar(selectedRow?.CodigoDactilar);
                  const dataFOTO = await fetchImagenRegistroCivil(
                    selectedRow?.cedula,
                    selectedRow?.CodigoDactilar
                  );
                  if (dataFOTO) {
                    await handleVerificarIdentidad(
                      selectedRow.imagen,
                      dataFOTO
                    );
                  }
                }}
                color="primary"
                className="text-base font-semibold"
              >
                Aprobar
              </Button>
            )} */}
        </DialogActions>
        {loadingVerificacion && <Loader />}
      </Dialog>

      <Dialog open={openDialog3} onClose={() => setOpenDialog3(false)}>
        <DialogTitle>Seleccionar Analista</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="select-analista-label">Analista</InputLabel>
            <Select
              labelId="select-analista-label"
              value={analistaSeleccionado || ""}
              onChange={(e) => setAnalistaSeleccionado(e.target.value)}
              label="Analista"
            >
              {analistasDisponibles.map((analista) => (
                <MenuItem key={analista.idUsuario} value={analista.idUsuario}>
                  {analista.Nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog3(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenDialog3(false);
              setOpenDialogConfirmar(true); // Mostrar diálogo de confirmación
            }}
            disabled={!analistaSeleccionado}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      {/* confirmacion de cambiar analista  */}
      <Dialog open={openDialogConfirmar} onClose={() => setOpenDialogConfirmar(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de asignar este analista a la solicitud?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogConfirmar(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleConfirmarAsignacion();
            }}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* confirmacion de cambiar operador  */}
      <Dialog open={openDialogOperador} onClose={() => setOpenDialogOperador(false)}>
        <DialogTitle>Seleccionar Operador</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="select-operador-label">Operador</InputLabel>
            <Select
              labelId="select-operador-label"
              value={operadorSeleccionado || ""}
              onChange={(e) => setOperadorSeleccionado(e.target.value)}
              label="Operador"
            >
              {operadores.map((operador) => (
                <MenuItem key={operador.idUsuario} value={operador.idUsuario}>
                  {operador.Nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogOperador(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenDialogOperador(false);
              if (filaActual.Operador === operadorSeleccionado) {
                enqueueSnackbar("El operador seleccionado es el mismo que el actual.", {
                  variant: "error",
                });
                setOperadorSeleccionado(null)
                return;
              }
              updateOperador(filaActual, operadorSeleccionado);
              enqueueSnackbar("Operador actualizado correctamente.", {
                variant: "success",
              });
              setOperadorSeleccionado(null)
            }}
            disabled={!operadorSeleccionado}
          >
            Asignar
          </Button>

        </DialogActions>
      </Dialog>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          {/* Espacio vacío para alineación */}
          <div className="w-1/3" />

          {/* Navegación centrada */}
          <div className="flex justify-center items-center gap-4 w-1/3">
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

          {/* Select en el extremo derecho */}
          <div className="w-1/3 flex justify-end">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {[5, 10, 15, 20].map((value) => (
                <option key={value} value={value}>
                  {value} por página
                </option>
              ))}
            </select>
          </div>
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

      <PreDocumentos
        open={openPreDocumentos}
        onClose={() => setOpenPreDocumentos(false)}
        idSolicitud={preDocumentosData?.data?.id}
        onContinue={async () => {
          setOpenPreDocumentos(false);

          const data = preDocumentosData.data;
          const tipo = preDocumentosData.tipo;
          const idsTerrenas = idsTerrenasMap[data.id];

          if (!idsTerrenas || idsTerrenas.length === 0) {
            setUserSolicitudData(data);
            setTipoVerificacionSeleccionada(tipo);
            setOpenVerificacionModal(true);
            return;
          }

          if (tipo === "domicilio") {
            if (idsTerrenas.idTerrenaGestionDomicilio > 0) {
              setDomicilioData({ ...idsTerrenas, idSolicitud: data.id });
              setDomicilioModalOpen(true);
            } else if (idsTerrenas.idTerrenaGestionDomicilio === 0) {
              await fetchtiemposolicitudesweb(data.id, 4);
              setOpenModalPendiente(true);
            }
            return;
          }

          if (tipo === "trabajo") {
            if (idsTerrenas.idTerrenaGestionTrabajo > 0) {
              setTrabajoData({ ...idsTerrenas, idSolicitud: data.id });
              setTrabajoModalOpen(true);
            } else if (idsTerrenas.idTerrenaGestionTrabajo === 0) {
              await fetchtiemposolicitudesweb(data.id, 5);
              setOpenModalPendiente(true);
            }
            return;
          }
        }}
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
        idSolicitud={domicilioData?.idSolicitud}

      />

      <TrabajoModal
        openModal={isTrabajoModalOpen}
        closeModal={handleCloseTrabajoModal}
        idsTerrenas={idsTerrenas}
        idSolicitud={trabajoData?.idSolicitud}
      />

      <Dialog open={openModalPendiente} onClose={() => setOpenModalPendiente(false)}>
        <DialogTitle>Verificación Pendiente</DialogTitle>
        <DialogContent>
          <Typography>
            Verificación pendiente por el verificador:
            <strong className="ml-2 text-blue-700">
              {clienteEstados.length > 0 ? clienteEstados[0].Telefono : "N/A"}
            </strong>
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
            fetchInsertarDatos(6, selectedRow?.id, 2)
            setOpenRegistroCivil(false);
          }}
          onRechazar={() => {
            // Acción al rechazar
            patchSolicitud(selectedRow?.id, 4);
            fetchInsertarDatos(6, selectedRow?.id, 4)
            setOpenRegistroCivil(false);
          }}
          resultadoVerificacion={resultadoVerificacion}
          permisos={permisos}
        />
      </Dialog>

      {/* Dialog de confirmación */}
      <Dialog open={openDialog2} onClose={() => setOpenDialog2(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de cambiar el{" "}
            {currentAction === "estado" ? "estado" : "resultado"}?
          </Typography>

          {currentAction === "resultado" && (
            <div style={{ marginTop: '1rem' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={laboralChecked}
                    onChange={(e) => setLaboralChecked(e.target.checked)}
                  />
                }
                label="Laboral"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={domicilioChecked}
                    onChange={(e) => setDomicilioChecked(e.target.checked)}
                  />
                }
                label="Domicilio"
              />
              <TextField
                label="Digite la entrada"
                fullWidth
                margin="normal"
                value={entrada}
                onChange={(e) => {
                  const val = e.target.value;

                  // Solo permitir números positivos con hasta 7 enteros y 2 decimales
                  const regex = /^\d{0,7}(\.\d{0,2})?$/;

                  if (val === "" || regex.test(val)) {
                    setEntrada(val);
                  }
                }}
                inputProps={{
                  inputMode: "decimal", // para móviles
                  pattern: "^[0-9]{1,7}(\\.[0-9]{0,2})?$",
                  maxLength: 10,
                }}
                error={
                  entrada !== "" &&
                  (isNaN(parseFloat(entrada)) ||
                    parseFloat(entrada) > 9999999.99)
                }
                helperText={
                  entrada !== "" && parseFloat(entrada) > 9999999.99
                    ? "Máximo permitido: 9,999,999.99"
                    : ""
                }
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog2(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={
              currentAction === "resultado" && !laboralChecked && !domicilioChecked
            }
          >
            Confirmar
          </Button>

        </DialogActions>
      </Dialog>

    </div>
  );
}