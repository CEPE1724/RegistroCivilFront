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
  Alert,
  Icon,
} from "@mui/material";
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

import SettingsPhoneIcon from '@mui/icons-material/SettingsPhone';
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // PENDIENTE
import HomeIcon from "@mui/icons-material/Home"; // DATOS DOMICILIO
import FavoriteIcon from "@mui/icons-material/Favorite"; // DATOS CÓNYUGE
import ContactsIcon from "@mui/icons-material/Contacts"; // DATOS REFERENCIAS
import CreditScoreIcon from "@mui/icons-material/CreditScore"; // INFORMACIÓN DE CRÉDITO
import AssessmentIcon from "@mui/icons-material/Assessment"; // FACTORES DE CRÉDITO


import { Popover, Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icono de tres puntos verticales
import DocumentStatusPopover from "./DocumentStatusPopover";
export function ListadoSolicitud() {
  const { data, loading, error, fetchBodegaUsuario } = useBodegaUsuario();
  const [bodegass, setBodegass] = useState([]);
  const [selectedBodega, setSelectedBodega] = useState("todos");
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
  const today = new Date().toISOString().split("T")[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
  const [tipo, setTipo] = useState([]);
  const [tipoClienteMap, setTipoClienteMap] = useState({});

  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(today);
  const [fechaFin, setFechaFin] = useState(today);

  const navigate = useNavigate();
  const { userData } = useAuth();
  const bodegas = data || []; // Safely access the bodegas data
  const estadosOpciones = [
    { label: "Todos", value: "todos" },
    { label: "Pendiente", value: 1 },
    { label: "Aprobado", value: 2 },
    { label: "Anulado", value: 3 },
    { label: "Rechazado", value: 4 },
  ];
  const [clienteEstados, setClienteEstados] = useState([]);



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
        ]);
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
      }
    };
    fetchData();
  }, []);

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
        console.log("imprimo la data a ver que pex", data);
        setClienteEstados(data);
        console.log(
          "voy a imprimir los estadossssssss de cliente estados porque no pasa ",
          clienteEstados
        );
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching tiemposolicitudesweb data:", error);
    }
  };

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
      case 3: // GESTIONANDO
        return <SettingsPhoneIcon sx={{ color: "#FFC107" }} />;
      case 4: // APROBADO
        return <CheckCircleIcon sx={{ color: "#28A745" }} />;
      case 5: // RECHAZADO
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
      case 10: // COMPLETADO
        return <CheckCircleIcon sx={{ color: "#28A745" }} />; // Verde para COMPLETADO
      default: // Default icon si el estado es desconocido
        return <HourglassEmptyIcon sx={{ color: "gray" }} />; // Fallback icon
    }
  };


  /* idEstadoVerificacionDocumental	Nombre
1	PROCESO
2	REVISIÓN
3	CORRECIÓN
4	APROBACION
5	RECHAZAR */

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
  ]);

  const fetchSolicitudes = async () => {
    console.log(selectedBodega);
    if (tipoConsulta.length === 0 || dataBodega.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const offset = (currentPage - 1) * itemsPerPage;

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
          bodega: selectedBodega === "todos" ? 0 : selectedBodega,
          estado: estado === "todos" ? 0 : estado,
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
                  ? "PENDIENTE"
                  : item.Estado === 2
                    ? "APROBADO"
                    : item.Estado === 3
                      ? "ANULADO"
                      : item.Estado === 4
                        ? "RECHAZADO"
                        : "Desconocido",
              imagen: item.Foto,
              celular: item.Celular,
              email: item.Email,
              fecha: item.Fecha,
              afiliado: item.bAfiliado ? "Sí" : "No",
              tieneRuc: item.bTieneRuc ? "Sí" : "No",
              tipoCliente: tipoClienteMap[item.idTipoCliente] || "Desconocido",
              idEstadoVerificacionDocumental:
                item.idEstadoVerificacionDocumental,
              idEstadoVerificacionSolicitud: item.idEstadoVerificacionSolicitud,
              idEstadoVerificacionTelefonica:
                item.idEstadoVerificacionTelefonica,
              idEstadoVerificacionTerrena: item.idEstadoVerificacionTerrena,
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
  const handleBodegaChange = (event) => {
    setSelectedBodega(event.target.value);
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

  const handledocumentos = (registro) => {
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
        idEstadoVerificacionDocumental: registro.idEstadoVerificacionDocumental,
      },
    });
  };

  const handleTelefonica = (registro) => {
    console.log("registro", registro);
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
      },
    });
  };

  const handlesolicitud = (registro) => {
    console.log("Registro:", registro);
    navigate("/solicitudgrande", {
      replace: true,
      state: {
        data: registro,
      },
    });
  };

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setView(true);
  };

  const handleCloseDialog = () => {
    setView(false);
    setSelectedRow(null);
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

    setOpenLocationModal(prevState => !prevState);
  }


  const handleOpenModalVerificacion = (data) => {
    setUserSolicitudData(data);
    setOpenVerificacionModal(prevState => !prevState);
  }
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      <div className="flex gap-6 mb-4">
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

      <div className="bg-white shadow-lg rounded-lg border border-gray-300">
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  N° Solicitud
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Cliente
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Cédula
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Fecha
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Almacén
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Vendedor
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Tipo de Consulta
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Estado
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Tipo de Cliente
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Detalles
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Solicitudes
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Documental
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Telefonica
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Terrenales
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datos.map((data) => (
                <TableRow key={data.id}>
                  <TableCell align="center">{data.NumeroSolicitud}</TableCell>
                  <TableCell align="center">{data.nombre}</TableCell>
                  <TableCell align="center">{data.cedula}</TableCell>
                  <TableCell align="center">
                    {new Date(data.fecha).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">{data.almacen}</TableCell>
                  <TableCell align="center">{data.vendedor}</TableCell>
                  <TableCell align="center">{data.consulta}</TableCell>
                  <TableCell align="center">{data.estado}</TableCell>
                  <TableCell align="center">{data.tipoCliente}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver más" arrow placement="top">
                      <IconButton onClick={() => handleOpenDialog(data)}>
                        <VisibilityIcon sx={{ color: "gray" }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  {/* solicitud */}
                  <TableCell align="center">
                    <div>
                      <span>
                        <IconButton
                          onClick={() => handlesolicitud(data)}
                          disabled={data.idEstadoVerificacionSolicitud === 10}
                        >
                          {getSolicitudIconByEstado(data.idEstadoVerificacionDocumental)}
                        </IconButton>

                        <MoreVertIcon
                          onClick={(event) => handlePopoverOpen(event, 1, data)}
                          style={{ cursor: "pointer" }}
                        />
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

                  {/* documental */}
                  <TableCell align="center">
                    <div>
                      <span>
                        <IconButton
                          onClick={() => handledocumentos(data)} // Aquí va la lógica para manejar el clic
                          disabled={
                            data.idEstadoVerificacionDocumental === 2 ||
                            data.idEstadoVerificacionDocumental === 4 ||
                            data.idEstadoVerificacionDocumental === 5
                          }
                        >
                          {getIconByEstado(data.idEstadoVerificacionDocumental)}
                        </IconButton>

                        {/* InfoIcon al lado del IconButton */}

                        <MoreVertIcon
                          onClick={(event) => handlePopoverOpen(event, 3, data)}
                          style={{ cursor: "pointer" }}
                        />
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


                  {/* telefonica */}
                  <TableCell align="center">
                    <div>
                      <span>
                        <IconButton
                          onClick={() => handleTelefonica(data)} // Aquí va la lógica para manejar el clic
                          disabled={data.idEstadoVerificacionTelefonica === 1}
                        >
                          {getPhoneIconByEstado(data.idEstadoVerificacionDocumental)}
                        </IconButton>

                        {/* InfoIcon al lado del IconButton */}

                        <MoreVertIcon
                          onClick={(event) => handlePopoverOpen(event, 2, data)}
                          style={{ cursor: "pointer" }}
                        />
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

                  {/* terrenales */}
                  <TableCell align="center" className="cursor-pointer">
                    <div>
                      <span>
                        <IconButton
                          onClick={() => handleOpenModalVerificacion(data)} // Aquí va la lógica para manejar el clic
                          disabled={
                            data.idEstadoVerificacionSolicitud === 1 ||
                            data.idEstadoVerificacionTerrena === 1
                          }
                        >
                          <HouseIcon sx={{ color: "gray" }} />
                        </IconButton>

                        {/* InfoIcon al lado del IconButton */}

                        <MoreVertIcon
                          onClick={(event) => handlePopoverOpen(event, 4, data)}
                          style={{ cursor: "pointer" }}
                        />
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Cuadro de diálogo para ver detalles */}
      <Dialog open={view} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="text-xl font-bold">
          Detalles de la Solicitud
        </DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
              <div className="flex justify-center items-center md:w-1/3">
                <img
                  src={selectedRow.imagen}
                  alt="Imagen"
                  className="w-64 h-64 object-cover rounded-md"
                />
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
        isOpen={() => handleOpenModalVerificacion()}
        openVerificacionModal={openVerificacionModal}
        userSolicitudData={userSolicitudData}
        userData={userData}
      />
    </div>
  );
}