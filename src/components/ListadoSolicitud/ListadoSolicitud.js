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
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import StoreIcon from '@mui/icons-material/Store';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';

export function ListadoSolicitud() {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [datos, setDatos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalPages, setTotalPages] = useState(1);  // Total de páginas
  const [total, setTotal] = useState(0);  // Total de registros
  const itemsPerPage = 5  ;

  useEffect(() => {
    fetchSolicitudes();
  }, [currentPage]);  // Agregar `currentPage` como dependencia

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
          offset : offset,
        },
      });
  
      if (response.status === 200) {
        // Contar el total de registros (tamaño del array recibido)
        const totalRecords = response.data.total; // Si la API devuelve un campo 'total' con el número total de registros

 // Mostrar el total de registros
        // Calcular el total de páginas (redondeando hacia arriba)
        const totalPages = Math.ceil(totalRecords / itemsPerPage);
  
        // Establecer los datos y el total de páginas
      
          const datos = response.data.data.map((item) => ({
          id: item.idCre_SolicitudWeb,
          nombre: `${item.Nombres} ${item.Apellidos}`,
          cedula: item.Cedula,
          almacen: item.Bodega,
          vendedor: item.idVendedor,
          consulta: item.idCompraEncuesta,
          estado: item.Estado === 1 ? "activo" : "pendiente",
          imagen: item.Foto,
          celular: item.Celular,
          email: item.Email,
          fecha: item.Fecha,
          afiliado: item.bAfiliado ? "Sí" : "No",
          tieneRuc: item.bTieneRuc ? "Sí" : "No",
        }));
      
        console.log("imprime aqui "+ datos);
        setDatos(datos);
      
        // Establecer el total de páginas y total de registros
        setTotal(totalRecords);
        setTotalPages(totalPages);
      } else {
        // Maneja el caso en que la respuesta es exitosa pero con un código de estado distinto
        // setError(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      (estado ? item.estado === estado : true)
  );

  // Función para cambiar de página
  const changePage = (page) => {
    setCurrentPage(page);
    
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Tabla de Datos
      </h1>

      <div className="flex gap-6 mb-4">
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
                      <Button
                        class="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-6 py-2.5"
                      >
                        Documentos
                      </Button>
                      <Button
                        class="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-6 py-2.5"
                      >
                        Telefonica 
                      </Button>

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
  <DialogTitle className="text-xl font-bold">Detalles de la Solicitud</DialogTitle>
  <DialogContent dividers>
    {selectedRow && (
      <div className="flex flex-col md:flex-row gap-4">
        {/* Columna izquierda: Imagen */}
        <div className="flex justify-center items-center md:w-1/3">
          <img
            src={selectedRow.imagen}
            alt="Imagen"
            className="w-64 h-64 object-cover rounded-md"
          />
        </div>
        {/* Columna derecha: Datos en dos columnas */}
        <div className="md:w-2/3">
          <div className="grid grid-cols-2 gap-x-8  text-base">
            <div className="flex items-center gap-2 mb-8">
              <PersonIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Nombre:</p>
                <p>{selectedRow.nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ">
              <BadgeIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Cédula:</p>
                <p>{selectedRow.cedula}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <StoreIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Almacén:</p>
                <p>{selectedRow.almacen}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SupervisorAccountIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Vendedor:</p>
                <p>{selectedRow.vendedor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <InfoIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Tipo de Consulta:</p>
                <p>{selectedRow.consulta}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VerifiedIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Estado:</p>
                <p>{selectedRow.estado}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Celular:</p>
                <p>{selectedRow.celular}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EmailIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Email:</p>
                <p>{selectedRow.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EventIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Fecha:</p>
                <p>{selectedRow.fecha}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Afiliado:</p>
                <p>{selectedRow.afiliado}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BusinessIcon className="text-blue-500" fontSize="medium" />
              <div>
                <p className="font-semibold">Tiene RUC:</p>
                <p>{selectedRow.tieneRuc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary" className="text-base font-semibold">
      Cerrar
    </Button>
  </DialogActions>
</Dialog>


      {/* Paginación */}
      { totalPages > 1 &&(
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
