import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, MenuItem, Select, InputLabel, FormControl, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useEffect } from "react";
import { APIURL } from '../../configApi/apiConfig';

export function ListadoSolicitud() {
  const [search, setSearch] = useState(""); // Estado para la búsqueda
  const [estado, setEstado] = useState(""); // Estado para el filtro de estado
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  const itemsPerPage = 5

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Función para manejar cambios en el filtro de estado
  const handleEstadoChange = (event) => {
    setEstado(event.target.value);
  };

  useEffect(() => {
    fetchDato();
  }, []);

  const fetchDato = async () => {
    try {
      const token = localStorage.getItem("token");

      const offset = (currentPage - 1) * itemsPerPage; // Calcula el offset basado en la página actual y el tamaño de la página
      const limit = itemsPerPage; // Número de elementos por página
      
      const response = await axios.get(APIURL.getCreSolicitudCredito(), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          offset: offset,  // El valor de offset
          limit: limit      // El valor de limit
        }
      });

      // Mapear la respuesta de la API para transformarla en el formato necesario
      const fetchedData = response.data.map(item => ({
        id: item.idCre_SolicitudWeb,
        nombre: `${item.Nombres} ${item.Apellidos}`,
        cedula: item.Cedula,
        almacen: item.Bodega,
        vendedor: item.idVendedor,
        consulta: item.idCompraEncuesta,
        estado: item.Estado === 1 ? "activo" : "pendiente", // Ajusta este mapeo si es necesario
        imagen: item.Foto
      }));
      setDatos(fetchedData);
    } catch (error) {
      console.error("Error fetching Dato:", error);
    }
  };

  const filteredData = datos.filter(item => {
    return (
      (item.nombre.toLowerCase().includes(search.toLowerCase())) &&
      (estado ? item.estado === estado : true)
    );
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Tabla de Datos</h1>

      {/* Barra de búsqueda y filtro */}
      <div className="flex gap-6 mb-4">
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          fullWidth
          size="small"
        />
        <FormControl size="small" fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={estado}
            onChange={handleEstadoChange}
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
                  ACCIONES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Mapear los datos filtrados */}
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">
                    {/* Imagen */}
                    <img
                      className="rounded-md object-cover w-1/3 h-full mx-auto"
                      src={row.imagen}
                      alt="Imagen"
                    />
                  </TableCell>
                  <TableCell align="center">{row.nombre}</TableCell>
                  <TableCell align="center">{row.cedula}</TableCell>
                  <TableCell align="center">{row.almacen}</TableCell>
                  <TableCell align="center">{row.vendedor}</TableCell>
                  <TableCell align="center">{row.consulta}</TableCell>
                  <TableCell align="center">{row.estado}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver más" arrow placement="top">
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-2">
                      <Button variant="contained" color="primary" size="small">
                        Documentos
                      </Button>
                      <Button variant="contained" color="secondary" size="small">
                        Verificación Telefónica
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
