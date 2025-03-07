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
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom"

export function ListadoSolicitud() {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [datos, setDatos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [total, setTotal] = useState(0); // Total de registros
  const itemsPerPage = 5;
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [searchDateFrom, setSearchDateFrom] = useState(''); // Fecha de inicio
  const [searchDateTo, setSearchDateTo] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchTipoConsulta();
    fetchSolicitudes();
  }, [currentPage]); // Agrega tipoConsulta como dependencia


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
        const tipoConsulta = response.data.map((item) => ({
          id: item.idCompraEncuesta,
          descripcion: item.Descripcion,
        }));
        setTipoConsulta(tipoConsulta)
   
        // Aquí puedes establecer el estado con los datos obtenidos si es necesario
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching tipo de consulta:", error);
    }
  };

  const fetchSolicitudes = async () => {
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
        },
      });

      if (response.status === 200) {
        const totalRecords = response.data.total;
        const totalPages = Math.ceil(totalRecords / itemsPerPage);

        const datos = response.data.data.map((item) => {
          // Buscar la descripción del tipo de consulta correspondiente al ID
      
          const consulta = tipoConsulta.find((tipo) => tipo.id === item.idCompraEncuesta)?.descripcion || "Desconocido";
       
          return {
            id: item.idCre_SolicitudWeb,
            nombre: `${item.PrimerNombre} ${item.SegundoNombre} ${item.ApellidoPaterno} ${item.ApellidoMaterno}`,
            cedula: item.Cedula,
            almacen: item.Bodega === 1 ? "Quicentro" : "Desconocido",
            vendedor: item.idVendedor === 123 ? "Kevin Alexander Lema Naranjo" : "nonde",
            consulta: consulta, // Usar la descripción de la consulta
            estado: item.Estado === 0 ? "pendiente" : item.Estado === 1 ? "aprobado" : item.Estado === 2 ? "anulado" : item.Estado === 3 ? "rechazado" : "desconocido",
            imagen: item.Foto,
            celular: item.Celular,
            email: item.Email,
            fecha: item.Fecha,
            afiliado: item.bAfiliado ? "Sí" : "No",
            tieneRuc: item.bTieneRuc ? "Sí" : "No",
          };
        });

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


  const handledocumentos = (registro) => {
    navigate('/documental', {
      state: {
        id: registro.id,
        nombre: registro.nombre,
        cedula: registro.cedula,
        fecha: registro.fecha,
        almacen: registro.almacen,
        foto: registro.imagen
      }
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
  const filteredData = datos.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (estado ? item.estado === estado : true) &&
      (searchDateFrom
        ? new Date(item.fecha) >= new Date(searchDateFrom)
        : true) &&
      (searchDateTo ? new Date(item.fecha) <= new Date(searchDateTo) : true)
  );

  const handleSolictud = () => {
    navigate('/solicitud',{replace:true});
  };

  // Función para cambiar de página
  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">


      <div className="flex gap-6 mb-4">
        <TextField
          label="Fecha Desde"
          type="date"
          variant="outlined"
          value={searchDateFrom}
          onChange={(e) => setSearchDateFrom(e.target.value)}
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
          value={searchDateTo}
          onChange={(e) => setSearchDateTo(e.target.value)}
          fullWidth
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
        />
        <FormControl size="small" fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            label="Estado"
          >

            <MenuItem value="">
              <em>Seleccionar</em>
            </MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="anulado">Anulado</MenuItem>
            <MenuItem value="aprobado">Aprobado</MenuItem>
            <MenuItem value="rechazado">Rechazado</MenuItem>
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
                  IMAGEN
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Nombres
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  CEDULA
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  FECHA
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Almacen
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
                  OPCIONES
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Verificaciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell align="center">
                    <img
                      className="rounded-md object-cover w-1/3 h-full mx-auto"
                      src={data.imagen}
                      alt="Imagen"
                    />
                  </TableCell>
                  <TableCell align="center">{data.nombre}</TableCell>
                  <TableCell align="center">{data.cedula}</TableCell>
                  <TableCell align="center">{data.fecha.substring(0, 10)}</TableCell>
                  <TableCell align="center">{data.almacen}</TableCell>
                  <TableCell align="center">{data.vendedor}</TableCell>
                  <TableCell align="center">{data.consulta}</TableCell>
                  <TableCell align="center">{data.estado}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver más" arrow placement="top">
                      <IconButton onClick={() => handleOpenDialog(data)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handledocumentos(data)} className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-6 py-2.5 focus:ring-0 focus:shadow-none">
                        Documentos
                      </button>

                      <button className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-6 py-2.5 focus:shadow-none">
                        Telefonica
                      </button>
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
              {/* Imagen */}
              <div className="flex justify-center items-center md:w-1/3">
                <img
                  src={selectedRow.imagen}
                  alt="Imagen"
                  className="w-64 h-64 object-cover rounded-md"
                />
              </div>

              {/* Datos */}
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-base leading-relaxed">
                  <div className="flex items-center gap-2">
                    <PersonIcon className="text-blue-500" fontSize="medium" />
                    <p>{selectedRow.PrimerNombre}</p>
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
                  {/* Estado con color dinámico en el texto */}
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

      {/* Paginación */}
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
    </div>
  );
}
