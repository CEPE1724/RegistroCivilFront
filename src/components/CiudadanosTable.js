import React, { useState, useEffect } from "react";
import axios from "../configApi/axiosConfig";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "./AuthContext/AuthContext";

const CiudadanosTable = () => {
  const [ciudadanos, setCiudadanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchNombres, setSearchNombres] = useState(""); // Estado para búsqueda por nombres
  const [searchCedula, setSearchCedula] = useState(""); // Estado para búsqueda por cedula
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [open, setOpen] = useState(false);
  const [selectedCiudadano, setSelectedCiudadano] = useState(null); // Estado para el ciudadano seleccionado
  const [totalRecords, setTotalRecords] = useState(0); // Total de registros de la API
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const { userData, idMenu } = useAuth();
  

  // Función para obtener ciudadanos con filtros y paginación
  const fetchCiudadanos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtén el token del localStorage
      const token = localStorage.getItem("token");

      // Configura los headers con el token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token a la solicitud
        },
        params: {
          NOMBRE: searchNombres,
          NUI: searchCedula,
          page: currentPage, // Página actual
          pageSize: itemsPerPage, // Tamaño de página
        },
      };

      const response = await axios.get("/dactilar", config);

      // Verifica si la respuesta es exitosa
      if (response.status === 200) {
        setCiudadanos(response.data.data);
        setTotalRecords(response.data.totalRecords); // Total de registros
        setTotalPages(response.data.totalPages); // Total de páginas
      } else {
        // Maneja el caso en que la respuesta es exitosa pero con un código de estado distinto
        setError(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      // Manejo de errores más detallado
      if (error.response) {
        // La solicitud se completó y el servidor respondió con un código de estado que no está en el rango de 2xx
        setError(`${error.response.data.error}`);
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        setError("Error: No se recibió respuesta del servidor.");
      } else {
        // Algo salió mal al configurar la solicitud
        setError(`Error: ${error.message}`);
      }
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCiudadanos();
  }, [currentPage]); // Llamar a la API cada vez que cambia la página

  // Validar cédula (solo números y máximo 10 caracteres)
  const handleCedulaChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setSearchCedula(value);
    }
  };

  // Validar nombres (solo letras A-Z, mayúsculas y minúsculas, y espacios)
  const handleNombresChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-ZñÑ\s]*$/.test(value)) {
      setSearchNombres(value);
    }
  };
  

  const handleOpen = (ciudadano) => {
    setSelectedCiudadano(ciudadano);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCiudadano(null);
  };

  // Función para manejar el cambio de página
  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Ciudadanos Almacenados
      </h1>

      {/* Formulario de filtros */}
      <div className="mb-4">
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} sm={4} sx={{ paddingX: "10px", paddingY: "10px" }}>
            <TextField
              fullWidth
              label="Buscar por Cédula"
              placeholder="1234567890"
              value={searchCedula}
              onChange={handleCedulaChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ paddingX: "10px", paddingY: "10px" }}>
            <TextField
              fullWidth
              label="Buscar por Nombres"
              placeholder="Solo texto"
              value={searchNombres}
              onChange={handleNombresChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={2} sx={{ paddingX: "10px", paddingY: "10px" }}>
            <Button
              variant="contained"
              onClick={() => {
                setCurrentPage(1); // Restablecer a la primera página
                fetchCiudadanos();
              }}
              fullWidth
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-gray-300">
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <CircularProgress color="primary" />
            <Typography variant="body1" color="textSecondary" sx={{ ml: 2 }}>
              Cargando...
            </Typography>
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <Typography variant="body1">* {error}</Typography>
          </div>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    IMAGEN
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    FECHA CONSULTA
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    NUI (CEDULA)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    NOMBRES
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    NACIONALIDAD
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    FECHA DE NAC.
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    LUGAR DE NAC.
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    OPCIONES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ciudadanos.length > 0 ? (
                  ciudadanos.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell align="center">
                        <img
                          className="rounded-md object-cover w-1/3 h-full mx-auto"
                          src={`data:image/jpeg;base64,${data.FOTO}`}
                          alt="Foto"
                        />
                      </TableCell>
                      <TableCell align="center">{data.FECHACONSULTA}</TableCell>
                      <TableCell align="center">{data.NUI}</TableCell>
                      <TableCell align="center">{data.NOMBRE}</TableCell>
                      <TableCell align="center">{data.NACIONALIDAD}</TableCell>
                      <TableCell align="center">{data.FECHANACIMIENTO}</TableCell>
                      <TableCell align="center">{data.LUGARNACIMIENTO}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver más" arrow placement="top">
                          <IconButton onClick={() => handleOpen(data)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay datos disponibles
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {selectedCiudadano && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          sx={{ rounded: "80px" }}
        >
          <DialogTitle sx={{ backgroundColor: "#f2f2f2", color: "gray" }}>
            Datos adicionales:
          </DialogTitle>
          <DialogContent dividers sx={{ padding: "30px" }}>
            <h2 className="text-xl font-bold mb-4 text-center">
              {selectedCiudadano.NOMBRE}
            </h2>
            <div className="flex-1 flex flex-col mt-4 overflow-hidden">
              {selectedCiudadano.ESTADOCIVIL && (
                <img
                className="rounded-md object-cover w-36 h-full mx-auto"
                src={`data:image/jpeg;base64,${selectedCiudadano.FOTO}`}
                alt="Foto"
              />
              )}
              {selectedCiudadano.ESTADOCIVIL && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    sexo:{" "}
                  </span>
                  {selectedCiudadano.SEXO}
                </p>
              )}
              {selectedCiudadano.ESTADOCIVIL && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    fecha de emisión:{" "}
                  </span>
                  {selectedCiudadano.FECHACEDULACION}
                </p>
              )}
              {selectedCiudadano.ESTADOCIVIL && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    estado civil:{" "}
                  </span>
                  {selectedCiudadano.ESTADOCIVIL}
                </p>
              )}
              {selectedCiudadano.CONYUGE && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    conyuge:{" "}
                  </span>
                  {selectedCiudadano.CONYUGE}
                </p>
              )}
              {selectedCiudadano.FECHAMATRIMONIO && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    fecha matrimonio:{" "}
                  </span>
                  {selectedCiudadano.FECHAMATRIMONIO}
                </p>
              )}
              {selectedCiudadano.INSTRUCCION && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    instrucción:{" "}
                  </span>
                  {selectedCiudadano.INSTRUCCION}
                </p>
              )}
              {selectedCiudadano.PROFESION && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    profesión:{" "}
                  </span>
                  {selectedCiudadano.PROFESION}
                </p>
              )}
              {selectedCiudadano.NOMBREPADRE && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    nombres padre:{" "}
                  </span>
                  {selectedCiudadano.NOMBREPADRE}
                </p>
              )}
              {selectedCiudadano.NOMBREMADRE && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    nombres madre:{" "}
                  </span>
                  {selectedCiudadano.NOMBREMADRE}
                </p>
              )}
              {selectedCiudadano.DOMICILIO && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    domicilio:{" "}
                  </span>
                  {selectedCiudadano.DOMICILIO}
                </p>
              )}
              {selectedCiudadano.CALLE && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    calle:{" "}
                  </span>
                  {selectedCiudadano.CALLE}
                </p>
              )}
              {selectedCiudadano.NUMEROCASA && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    n° casa:{" "}
                  </span>
                  {selectedCiudadano.NUMEROCASA}
                </p>
              )}
              {selectedCiudadano.FECHAFALLECIMIENTO && (
                <p className="uppercase text-sm font-medium truncate">
                  <span className="uppercase text-sm text-gray-600 font-bold">
                    fecha fallecimiento:{" "}
                  </span>
                  {selectedCiudadano.FECHAFALLECIMIENTO}
                </p>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}


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
};

export default CiudadanosTable;
