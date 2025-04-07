import React, { useState, useEffect } from "react";
import useBodegaUsuario from "../../../hooks/useBodegaUsuario";
import { useAuth } from '../../AuthContext/AuthContext';
import { FaEye } from 'react-icons/fa'; // Importamos el ícono de ojo
import NumbersIcon from '@mui/icons-material/Numbers';
import BadgeIcon from '@mui/icons-material/Badge';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from "react-router-dom";
import { APIURL } from "../../../configApi/apiConfig";
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
  const [selectedEstado, setSelectedEstado] = useState("");

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
      const url = APIURL.getdocumentosanalista(filterParams);
    
      const response = await fetch(url);
    
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

  const handleEstadoChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  // Filter clients by name
  const filteredClientes = clientesList.filter((cliente) => {
    const matchesSearch =
      cliente.PrimerNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.ApellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      selectedEstado === "" ||
      cliente.idEstadoVerificacionDocumental === parseInt(selectedEstado);

    return matchesSearch && matchesEstado;
  });

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

    <div className="min-h-screen bg-gray-100 py-8 px-6">
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
  
      {/* Cargando mientras se obtienen los datos */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600 font-semibold text-lg">Cargando información...</p>
        </div>
      )}
  
      {/* Error handling */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      )}
  
      {/* Filtros de selección y búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Select de Bodegas */}
        {!loading && (
          <div className="sm:w-full">
            <label htmlFor="bodega-select" className="block text-gray-700 font-semibold mb-2">
              Seleccionar Bodega
            </label>
            <select
              id="bodega-select"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
              value={selectedBodega}
              onChange={handleBodegaChange}
            >
              <option value="">Todas las bodegas</option>
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
        <div className="sm:w-full">
          <label htmlFor="cliente-search" className="block text-gray-700 font-semibold mb-2">
            Buscar Cliente
          </label>
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
  
        {/* Select de Estado */}
        <div className="sm:w-full">
          <label className="block text-gray-700 font-semibold mb-2">Estados:</label>
          <select
            id="estado-select"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
            value={selectedEstado}
            onChange={handleEstadoChange}
          >
            <option value="">Todos</option>
            <option value="2">Revisión</option>
            <option value="3">Corrección</option>
            <option value="4">Aprobado</option>
            <option value="5">Rechazado</option>
          </select>
        </div>
      </div>
  
      {/* Clientes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClientes.length > 0 ? (
          filteredClientes.map((cliente) => (
            <div
              key={cliente.idCre_SolicitudWeb}
              className={`relative p-6 bg-white rounded-lg shadow-lg transition-all duration-300 border-l-4 
                ${cliente.idEstadoVerificacionDocumental === 2 ? 'border-[#f1c40f]' : // Yellow
                cliente.idEstadoVerificacionDocumental === 3 ? 'border-[#f39c12]' : // Orange
                cliente.idEstadoVerificacionDocumental === 4 ? 'border-[#2d3689]' : // Blue
                'border-[#d0160e]'}`} // Red for "Rejected"
            >
              {/* Foto del cliente */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {cliente.Foto ? (
                    <img
                      src={cliente.Foto}
                      alt={`${cliente.PrimerNombre} ${cliente.ApellidoPaterno}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                      {cliente.PrimerNombre.charAt(0)}{cliente.ApellidoPaterno.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{cliente.PrimerNombre} {cliente.ApellidoPaterno}</h2>
                    <p className="text-gray-600 text-sm">{cliente.NumeroSolicitud}</p>
                  </div>
                </div>
  
                {/* Estado */}
                <p className={`text-sm font-semibold ${cliente.idEstadoVerificacionDocumental === 2 ? 'text-[#f1c40f]' :
                  cliente.idEstadoVerificacionDocumental === 3 ? 'text-[#f39c12]' :
                  cliente.idEstadoVerificacionDocumental === 4 ? 'text-[#2d3689]' :
                  'text-[#d0160e]'}`}>
                  {cliente.idEstadoVerificacionDocumental === 2 ? 'Revisión' :
                    cliente.idEstadoVerificacionDocumental === 3 ? 'Corrección' :
                    cliente.idEstadoVerificacionDocumental === 4 ? 'Aprobado' :
                    'Rechazado'}
                </p>
              </div>
  
              {/* Detalles */}
              <div className="mt-4">
                <p className="text-gray-600 text-sm flex items-center mb-2">
                  <NumbersIcon fontSize="small" />  {cliente.NumeroSolicitud}
                </p>
                <p className="text-gray-600 text-sm flex items-center mb-2">
                  <BadgeIcon fontSize="small" />  {cliente.Cedula}
                </p>
                <p className="text-gray-600 text-sm flex items-center mb-2">
                  <AlternateEmailIcon fontSize="small" />  {cliente.Email}
                </p>
                <p className="text-gray-600 text-sm flex items-center mb-2">
                  <PhoneIcon fontSize="small" />  {cliente.Celular}
                </p>
              </div>
  
              {/* Botón de detalles */}
              <button
                onClick={() => handleEyeClick(cliente)}
                className="mt-4 inline-block text-[#2d3689] hover:text-[#1a2a6c] font-semibold"
              >
                Ver detalles
              </button>
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
