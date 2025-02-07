import React, { useState, useEffect } from 'react';

const DataProtection = () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Formulario de Filtros de Datos</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          className="p-2 border rounded mr-4"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="p-2 border rounded mr-4"
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="p-2 border rounded mr-4"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={() => fetchData()}
          className="bg-teal-500 text-white p-2 rounded ml-4"
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">Cédula</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.idProtecionDatosWeb}>
                    <td className="border p-2">{item.Cedula}</td>
                    <td className="border p-2">{item.Nombre}</td>
                    <td className="border p-2">{new Date(item.Fecha).toLocaleString()}</td>
                    <td className="border p-2">
                      <a href={item.UrlContrato} target="_blank" className="text-blue-500">Ver contrato</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center">No se encontraron datos</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="bg-gray-300 text-gray-600 p-2 rounded"
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-gray-300 text-gray-600 p-2 rounded"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProtection;
