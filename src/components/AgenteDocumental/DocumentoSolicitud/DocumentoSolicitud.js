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
import axios from "../../../configApi/axiosConfig";
export function DocumentoSolicitud() {
  const { data, loading, error, listaVendedoresporBodega , fetchBodegaUsuario, vendedor , analista , listadoAnalista } = useBodegaUsuario();
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientesList, setClientesList] = useState([]);
  const [selectedBodega, setSelectedBodega] = useState("todos");
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10); // You can set the limit here, or make it dynamic
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();
  const [selectedEstado, setSelectedEstado] = useState("");
  const [analistaSelected, setAnalistaSelected] = useState("todos");
    const [dataBodega, setDataBodega] = useState([]);
    const today = new Date().toISOString().split("T")[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
  const [estado, setEstado] = useState("todos");

  const [selectedVendedor, setSelectedVendedor] = useState("todos");
  const bodegas = data || [];  // Safely access the bodegas data

  const analistas = analista || []; // Safely access the analistas data
  const vendedores = vendedor || []; // Safely access the vendedores data

  const [selectDeshabilitado, setSelectDeshabilitado] = useState(false);
const [fechaInicio, setFechaInicio] = useState(today);
  const [fechaFin, setFechaFin] = useState(today);


  const estadosOpciones = [
    { label: "Todos", value: "todos" },
    { label: "PROCESO", value: 1 },
    { label: "REVISIÓN", value: 2 },
    { label: "CORRECIÓN", value: 3 },
    { label: "APROBACION", value: 4 },
    { label: "RECHAZAR", value: 5 },
  ];



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

  useEffect(() => {
    if (userData?.Nombre && analistas?.length > 0) {
      const analistaCoincidente = analistas.find((a) => {
        const nombreAnalista = a.Nombre?.toLowerCase().trim();
        const nombreUser = userData.Nombre?.toLowerCase().trim();
        return nombreAnalista === nombreUser;
      });

      if (analistaCoincidente) {
        setAnalistaSelected(analistaCoincidente.idUsuario);
        setSelectDeshabilitado(true); // 👈 desactiva edición
      } else {
        setSelectDeshabilitado(false); // por si no hay coincidencia
      }
    }
  }, [userData?.Nombre, analistas]);


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
  const handleAnalistaChange = (event) => {
    setAnalistaSelected(event.target.value);
  };

  const handleVendedorChange = (event) => {
    setSelectedVendedor(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBodega(); // Fetch the bodega data
       await fecthAnalista() 
       //// await fetchClientes();
         // Fetch the client data based on the selected filters
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
      }
    };

    fetchData();
  }, [selectedBodega, searchTerm, offset, limit , analistaSelected ]); // Rerun the fetch on these changes

  useEffect(() => {
    if (dataBodega.length > 0 && userData?.idUsuario) {
      fetchSolicitudes();
    }
  }, [dataBodega, selectedBodega, selectedVendedor, analistaSelected , estado]);

  const fetchBodega = async () => {
    const userId = userData.idUsuario;
    const idTipoFactura = 43;
    const fecha = new Date().toISOString();
    const recibeConsignacion = true;

    try {
      await fetchBodegaUsuario(userId, idTipoFactura, fecha, recibeConsignacion);
    } catch (err) {
      console.error("Error al obtener los datos de la bodega:", err);
    }
  };


  const bodegasIds = bodegas.map((bodega) => bodega.b_Bodega); // Obtener los IDs de las bodegas

  // Fetch clients from the API based on filters
  /*const fetchClientes = async () => {

    let bodegasId = [];

    if (selectedBodega !== "todos") {
      // Si selectedBodega tiene un valor específico, tomarlo como un array
      bodegasId = [selectedBodega];
    } else {
      // Si es "todos", se puede pasar un array vacío o la lógica que desees
      bodegasId = bodegasIds; // Aquí se asigna el array de bodegas
    }


    const filterParams = {
      limit,
      offset,
      Filtro: searchTerm,
     // fechaInicio: fechaInicio,
     // fechaFin: fechaFin,
      bodega: bodegasId,
      //estado: estado === "todos" ? 0 : estado,
      // vendedor: selectedVendedor === "todos" ? 0 : selectedVendedor,
      analista: analistaSelected === "todos" ? 0 : analistaSelected,
     
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
  };*/



  const fetchSolicitudes = async () => {
    let bodegasId = [];
  
    if ( dataBodega.length === 0) return;
  

    
    if (selectedBodega !== "todos") {
      bodegasId = [selectedBodega];
    } else {
      bodegasId = bodegasIds;
    }
  
    try {
      const token = localStorage.getItem("token");
    ///  const offset = (currentPage - 1) * itemsPerPage;
  
      const response = await axios.get(APIURL.getCreSolicitudCredito(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: limit,
          offset: offset,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          bodega: bodegasId,
          estado: estado === "todos" ? 0 : estado,
          vendedor: selectedVendedor === "todos" ? 0 : selectedVendedor,
          analista: analistaSelected === "todos" ? 0 : analistaSelected,
        },
      });
       // Enriquecer cada cliente con datos del vendedor
    
      const result = response.data;
  
      if (result && result.data) {
        // Adaptar aquí igual que antes:
        const filteredClientes = result.data.filter(
          (cliente) => cliente.idEstadoVerificacionDocumental > 1
        );
  
        setClientesList(filteredClientes);
        setTotalCount(result.Total); // O `result.total` si tu backend ahora manda el total real
      } else {
        setClientesList([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };

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


  {/*Select fecha inicio */}
        <div className="sm:w-full">
          <label htmlFor="fecha-inicio" className="block text-gray-700 font-semibold mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            id="fecha-inicio"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        {/* Select fecha fin */}
        <div className="sm:w-full">
          <label htmlFor="fecha-fin" className="block text-gray-700 font-semibold mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            id="fecha-fin"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        {/*Select fecha fin */}

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
              <option value="todos">todos</option>
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


      
        {/* Buscador de Clientes 
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
        </div>*/}
  
        {/* Select de Estado */}
        <div className="sm:w-full">
          <label className="block text-gray-700 font-semibold mb-2">Estados:</label>
          <select
            id="estado-select"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            label="Estado"

          >
          {estadosOpciones.map((estado) => (
            <option key={estado.value} value={estado.value}>
              {estado.label}
            </option>
          ))}
          </select>
        </div>


       {/* Select Analista */}

        <div className="sm:w-full">
          <label className="block text-gray-700 font-semibold mb-2">Analista:</label>
          <select
            id="analista-select"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
            value={analistaSelected}
            onChange={handleAnalistaChange}
            disabled={selectDeshabilitado} //  solo si hubo match

          >
            <option value="">Todos</option>
            {analistas.map((vendedor) => (
                  <option key={vendedor.idUsuario} value={vendedor.idUsuario}>
                  {vendedor.Nombre?.trim() || "No disponible"}
                  </option>
                ))
              }
          </select>
      </div>


    {/* Select Vendedor */}
      <div className="sm:w-full">
          <label className="block text-gray-700 font-semibold mb-2">Vendedor:</label>
          <select
            id="vendedor-select"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d3689]"
            value={selectedVendedor}
            onChange={handleVendedorChange}
          >
            <option value="">Todos</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor.idPersonal} value={vendedor.idPersonal}>
                {`${vendedor.Nombre || ""}`.trim() || "No disponible"}
                </option>
            ))}
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
