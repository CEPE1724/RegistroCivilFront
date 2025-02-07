import React, { useState, useEffect } from 'react';
import { FileCopy, CameraAlt } from '@mui/icons-material'; // Iconos de MUI
import { Button, TextField, Grid, Typography } from '@mui/material'; // Componentes de MUI
import * as XLSX from 'xlsx'; // Importar la librería xlsx para exportar a Excel

const DataProtectionTable = () => {
  // Estado para manejar los filtros y los resultados
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Función para realizar la solicitud a la API
  const fetchData = async (page = 1) => {
    setLoading(true);
    const pageSize = 10;
    const url = new URL('https://appservices.com.ec/cobranza/api/v1/point/data/all');
    
    const params = {
      page,
      pageSize,
      cedula,
      nombre,
      fechaInicio,
      fechaFin
    };
    
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar la tabla a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data); // Convertir los datos JSON a una hoja de Excel
    const wb = XLSX.utils.book_new(); // Crear un nuevo libro
    XLSX.utils.book_append_sheet(wb, ws, 'ProteccionDatos'); // Agregar la hoja al libro
    XLSX.writeFile(wb, 'ProteccionDatos.xlsx'); // Escribir el archivo Excel
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  return (
    <div className="container mx-auto p-6">
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12} sm={3}>
          <TextField
            label="Cédula"
            variant="outlined"
            fullWidth
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            type="date"
            label="Fecha Inicio"
            variant="outlined"
            fullWidth
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            type="date"
            label="Fecha Fin"
            variant="outlined"
            fullWidth
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={2} className="flex items-end">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => fetchData()}
          >
            Buscar
          </Button>
        </Grid>
      </Grid>

      {/* Botón para exportar */}
      <div className="mb-4">
        <Button
          variant="contained"
          color="secondary"
          onClick={exportToExcel}
        >
          Exportar a Excel
        </Button>
      </div>

      {/* Cargando */}
      {loading ? (
        <div className="text-center text-xl text-gray-500">Cargando...</div>
      ) : (
        <div>
          <table className="min-w-full table-auto border-collapse shadow-lg">
            <thead>
              <tr className="bg-teal-500 text-white">
                <th className="px-4 py-2 border">Cédula</th>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Código Dactilar</th>
                <th className="px-4 py-2 border">IP</th>
                <th className="px-4 py-2 border">Celular</th>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.idProtecionDatosWeb} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{item.Cedula}</td>
                    <td className="px-4 py-2 border">{item.Nombre} {item.Apellido}</td>
                    <td className="px-4 py-2 border">{item.CodigoDactilar}</td>
                    
                    <td className="px-4 py-2 border">{item.IpWeb}</td>
                    <td className="px-4 py-2 border">{item.Celular}</td>
                    <td className="px-4 py-2 border">{new Date(item.Fecha).toLocaleString()}</td>
                    <td className="px-4 py-2 border flex gap-4 justify-center">
                      <a href={item.UrlContrato} target="_blank" className="text-teal-500 hover:text-teal-600">
                        <FileCopy className="w-5 h-5" />
                      </a>
                      <a href={item.UrlImage} target="_blank" className="text-teal-500 hover:text-teal-600">
                        <CameraAlt className="w-5 h-5" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center px-4 py-2 border text-gray-500">
                    No se encontraron datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="bg-gray-300 text-gray-600 p-2 rounded-md"
            >
              Anterior
            </button>
            <span className="text-lg">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-gray-300 text-gray-600 p-2 rounded-md"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProtectionTable;
