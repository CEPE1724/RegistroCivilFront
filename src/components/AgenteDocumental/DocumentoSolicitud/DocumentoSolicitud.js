import React, { useState, useEffect } from "react";
import useBodegaUsuario from "../../../hooks/useBodegaUsuario";
import { useAuth } from '../../AuthContext/AuthContext';
import { FaEye } from 'react-icons/fa'; // Importamos el ícono de ojo
import NumbersIcon from '@mui/icons-material/Numbers';
import BadgeIcon from '@mui/icons-material/Badge';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from "react-router-dom";

export function DocumentoSolicitud() {
  const { data, loading, error, fetchBodegaUsuario } = useBodegaUsuario();
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientesList, setClientesList] = useState([]);
  const [selectedBodega, setSelectedBodega] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10); // You can set the limit here, or make it dynamic
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBodega(); // Fetch the bodega data
        await fetchClientes(); // Fetch the client data based on the selected filters
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
      }
    };

    fetchData();
  }, [selectedBodega, searchTerm, offset, limit]); // Rerun the fetch on these changes

  const fetchBodega = async () => {
    const userId = userData.idUsuario;
    const idTipoFactura = 43;
    const fecha = new Date().toISOString();
    const recibeConsignacion = true;

    try {
      await fetchBodegaUsuario(userId, idTipoFactura, fecha, recibeConsignacion);
      console.log("Datos de la bodega obtenidos correctamente.", data);
    } catch (err) {
      console.error("Error al obtener los datos de la bodega:", err);
    }
  };

  // Fetch clients from the API based on filters
  const fetchClientes = async () => {
    const filterParams = {
      Filtro: searchTerm,
      bodega: selectedBodega,
      limit,
      offset,
    };

    try {
      const response = await fetch(
        `http://192.168.2.167:3008/api/v1/cre-solicitud-web/documentosanalista?${new URLSearchParams(filterParams)}`
      );
      const result = await response.json();
      if (result.data) {
        // Filtrar los clientes con idEstadoVerificacionDocumental mayor a 1
        const filteredClientes = result.data.filter(cliente => cliente.idEstadoVerificacionDocumental > 1);
        setClientesList(filteredClientes);
        setTotalCount(filteredClientes.length);
      } else {
        setClientesList([]);
      }
    } catch (error) {
      console.error("Error al obtener los datos de los clientes:", error);
    }
  };

  const bodegas = data || [];  // Safely access the bodegas data

  const handleBodegaChange = (event) => {
    setSelectedBodega(event.target.value);
  };

  // Filter clients by name
  const filteredClientes = clientesList.filter((cliente) =>
    cliente.PrimerNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.ApellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función que muestra un alert al hacer clic en el ícono de ojo
  const handleEyeClick = (cliente) => {
    //alert(`Detalles de cliente: ${cliente.PrimerNombre} ${cliente.ApellidoPaterno}`);
    console.log("cliente", cliente)
    navigate('/gestorDocumentos', {
      replace: true,
      state: {
        id: cliente.idCre_SolicitudWeb,
        NumeroSolicitud: cliente.NumeroSolicitud,
        nombre: cliente.PrimerNombre,
        apellido: cliente.ApellidoPaterno,
        cedula: cliente.Cedula,
        fecha: cliente.Fecha,
        almacen: cliente.Bodega,
        foto: cliente.Foto,
        vendedor: cliente.idVendedor,
        consulta: cliente.idCompraEncuesta,
        estadoVerifD: cliente.idEstadoVerificacionDocumental,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Cargando mientras se obtienen los datos */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Cargando bodegas...</p>
          </div>
        )}

        {/* Error handling */}
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-row items-center space-x-4 w-full mb-6">
          {/* Select de Bodegas */}
          {!loading && (
            <div className="flex-grow">
              <label htmlFor="bodega-select" className="block text-gray-700 font-semibold mb-2">
                Selecciona una Bodega
              </label>
              <select
                id="bodega-select"
                className="w-full sm:w-1/2 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedBodega}
                onChange={handleBodegaChange}
              >
                <option value="">
                  Todas las bodega
                </option>
                {bodegas.length > 0 ? (
                  bodegas.map((bodega) => (
                    <option key={bodega.b_Bodega} value={bodega.b_Bodega}>
                      {bodega.b_Nombre}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No se encontraron bodegas.</option>
                )}
              </select>
            </div>
          )}

          {/* Buscador de Clientes */}
          <div className="flex-grow">
            <label htmlFor="cliente-search" className="block text-gray-700 font-semibold mb-2">
              Buscar Cliente
            </label>
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="w-full sm:w-1/2 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cards de Clientes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClientes.length > 0 ? (
            filteredClientes.map((cliente) => (
              <div
                key={cliente.idCre_SolicitudWeb}
                className={`relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ${cliente.idEstadoVerificacionDocumental === 2 ? 'border-2 border-yellow-500' : cliente.idEstadoVerificacionDocumental === 3 ? 'border-2 border-yellow-500' : cliente.idEstadoVerificacionDocumental === 4 ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}
              >
                {/* Icono de ojo como botón */}
                <button
                  onClick={() => handleEyeClick(cliente)}
                  className="absolute top-3 right-3 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <FaEye size={24} />
                </button>

                {/* Foto del cliente */}
                <div className="flex justify-center mb-4">
                  <img
                    src={cliente.Foto || 'https://via.placeholder.com/150'} // Si no tiene foto, mostramos un placeholder
                    alt={`${cliente.PrimerNombre} ${cliente.ApellidoPaterno}`}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>

                {/* Contenido de la tarjeta */}
                <h2 className="text-2xl font-semibold text-gray-800">{cliente.PrimerNombre} {cliente.ApellidoPaterno}</h2>
                <p className="text-gray-600"><NumbersIcon fontSize="small"/> Número de solicitud: {cliente.NumeroSolicitud}</p>
                <p className="text-gray-600"><BadgeIcon fontSize="small"/> Cédula: {cliente.Cedula}</p>
                <p className="text-gray-600"><AlternateEmailIcon fontSize="small"/> Email: {cliente.Email}</p>
                <p className="text-gray-600"><PhoneIcon fontSize="small"/> Teléfono: {cliente.Celular}</p>
                <p className={`mt-4 font-semibold text-sm ${cliente.idEstadoVerificacionDocumental === 2 ? 'text-yellow-600' : cliente.idEstadoVerificacionDocumental === 3 ? 'text-yellow-600' : cliente.idEstadoVerificacionDocumental === 4 ? 'text-green-600' : 'text-red-600'}`}>
                  Estado: {cliente.idEstadoVerificacionDocumental === 2 ? 'Revisión' : cliente.idEstadoVerificacionDocumental === 3 ? 'Corrección' : cliente.idEstadoVerificacionDocumental === 4 ? 'Aprobado' : 'Rechazado'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No se encontraron resultados.</p>
          )}
        </div>

      </div>
    </div>
  );
}
