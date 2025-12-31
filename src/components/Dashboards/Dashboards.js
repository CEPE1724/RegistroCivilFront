import React, { useEffect, useState } from "react";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { APIURL } from "../../configApi/apiConfig";
import useBodegaUsuario from "../../hooks/useBodegaUsuario";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "../../configApi/axiosConfig";
import ModalAño from "./ModalAño";

export function Dashboards() {
  //mostrar/ocultar filtros
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Estado datos solicitudes
  const [solicitudesData, setSolicitudesData] = useState([]);

  // Filtro de tipo cliente
  const [tipoCliente, setTipoCliente] = useState([]);
  const [selectedTipoCliente, setSelectedTipoCliente] = useState("todos");

  // Estados para filtros de fecha
  const today = new Date().toISOString().split("T")[0];
  const date15DaysAgo = new Date();
  date15DaysAgo.setDate(date15DaysAgo.getDate() - 15);
  const date15DaysAgoStr = date15DaysAgo.toISOString().split("T")[0];

  const [fechaInicio, setFechaInicio] = useState(date15DaysAgoStr);
  const [fechaFin, setFechaFin] = useState(today);

  // Estados para filtros de bodega y vendedor
  const [selectedBodega, setSelectedBodega] = useState("todos");
  const [selectedVendedor, setSelectedVendedor] = useState("todos");
  const [vendedores, setVendedores] = useState([]);

  // Estados para filtro de estado
  const estadosOpciones = [
    { label: "Todos", value: "todos" },
    { label: "PRE-APROBADO", value: 1 },
    { label: "APROBADO", value: 2 },
    { label: "ANULADO", value: 3 },
    { label: "RECHAZADO", value: 4 },
    { label: "NO APLICA", value: 5 },
    { label: "FACTURADO", value: 6 },
    { label: "CADUCADO", value: 7 },
  ];
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  // Hooks
  const { data, fetchBodegaUsuario, listaVendedoresporBodega, vendedor } = useBodegaUsuario();
  const { userData } = useAuth();
  const bodegas = data || [];

  const [openModalAño, setOpenModalAño] = useState(false); 
  const STORAGE_KEY = `modal_feliz_anio_2026_visto_${userData?.Nombre}`;

  useEffect(() => {

    const hoy = new Date();
    const fechaObjetivo = new Date(2026, 0, 2); // 2 de enero de 2026
	//const fechaObjetivo = new Date(2025, 11, 31); // 2 de enero de 2026

    const yaVisto = localStorage.getItem(STORAGE_KEY);

    const esFechaCorrecta =
      hoy.toDateString() === fechaObjetivo.toDateString();

    if (esFechaCorrecta && !yaVisto) {
      setOpenModalAño(true);
    }
  }, [userData?.Nombre]);

  const cerrarModal = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpenModalAño(false);
  };

  // Función para validar fechas
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Cargar tipos de cliente 
  useEffect(() => {
    const fetchTipoCliente = async () => {
      try {
        const token = localStorage.getItem("token");
        const respTipoCliente = await axios.get(APIURL.getTipoCliente(), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (respTipoCliente.status === 200) {
          setTipoCliente(respTipoCliente.data);
        }
      } catch (error) {
        setTipoCliente([]);
      }
    };
    fetchTipoCliente();
  }, []);

  // Cargar bodegas
  useEffect(() => {
    if (userData?.idUsuario) {
      fetchBodega();
    }
  }, [userData]);

  // Cargar vendedores cuando cambia la bodega
  useEffect(() => {
    const fetchVendedores = async () => {
      if (selectedBodega && selectedBodega !== "todos") {
        const fecha = fechaInicio;
        const nivel = 0;
        await listaVendedoresporBodega(fecha, selectedBodega, nivel);
      } else {
        setVendedores([]);
      }
    };
    fetchVendedores();
  }, [selectedBodega, fechaInicio]);

  // Actualizar vendedores cuando cambia el resultado del hook
  useEffect(() => {
    setVendedores(vendedor || []);
    if (
      selectedVendedor !== "todos" &&
      vendedor &&
      !vendedor.some((v) => v.idPersonal === selectedVendedor)
    ) {
      setSelectedVendedor("todos");
    }
  }, [vendedor]);

  useEffect(() => {
    if (userData?.idGrupo == 23) {
      if (bodegas.length > 0) {
        const primeraBodega = bodegas[0].b_Bodega;
        setSelectedBodega(primeraBodega);
      }

      const vendedorAutorizado = vendedores.find(
        (v) => v.Codigo === userData.Nombre
      );
      if (vendedorAutorizado) {
        setSelectedVendedor(vendedorAutorizado.idPersonal);
      }
    }
  }, [userData?.idGrupo, bodegas, vendedores]);

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

  // Función obtener datos filtrados


  const fetchFilteredData = async () => {
    const bodegasIds = bodegas.map((bodega) => bodega.b_Bodega);
    let bodegasId = selectedBodega !== "todos" ? [selectedBodega] : bodegasIds;

    try {
      const token = localStorage.getItem("token");
      const params = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        bodega: bodegasId,
        estado: estadoFiltro === "todos" ? 0 : parseInt(estadoFiltro),
        idTipoCliente: selectedTipoCliente === "todos" ? 0 : parseInt(selectedTipoCliente),
      };
      let filtroVendedor = selectedVendedor && selectedVendedor !== "todos"
      if (selectedVendedor && selectedVendedor !== "todos") {
        filtroVendedor = selectedVendedor;
      }

      const response = await axios.post(APIURL.getCreSolicitudCredito(),

        {
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          bodega: bodegasId,
          estado: estadoFiltro === "todos" ? 0 : parseInt(estadoFiltro),
          idTipoCliente: selectedTipoCliente === "todos" ? 0 : parseInt(selectedTipoCliente),
          vendedor: filtroVendedor || 0
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );


      // Actualizar el estado con los datos recibidos
      if (response.data && response.data.data) {
        setSolicitudesData(response.data.data);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setSolicitudesData([]);
    }
  };

  // procesar datos por bodega
  const procesarDatosPorBodega = () => {
    const datosPorBodega = {};

    // Filtrar bodegas
    const bodegasFiltradas = selectedBodega === "todos"
      ? bodegas
      : bodegas.filter(bodega => bodega.b_Bodega.toString() === selectedBodega.toString());

    // Inicializar datos para cada bodega filtrada
    bodegasFiltradas.forEach(bodega => {
      datosPorBodega[bodega.b_Bodega] = {
        nombre: bodega.b_Nombre,
        totalSolicitudes: 0,
        preAprobadas: 0, 	// Total - No Aplica -- EN REALIDAD ES GESTIONADO
        preaprobadoReal: 0, // Estado 1
        noAplica: 0,     	// Estado 5
        aprobado: 0,     	// Estado 2
        rechazado: 0,    	// Estado 4
        facturadas: 0,   	// Estado 6
        caducadas: 0	  	// Estado 7
      };
    });

    // Procesar cada solicitud
    solicitudesData.forEach(solicitud => {
      const bodegaId = solicitud.Bodega;
      if (datosPorBodega[bodegaId]) {
        datosPorBodega[bodegaId].totalSolicitudes++;

        switch (solicitud.Estado) {
          case 1: // PRE APROBADO
            datosPorBodega[bodegaId].preaprobadoReal++;
            datosPorBodega[bodegaId].preAprobadas++;
            break;
          case 2: // APROBADO
            datosPorBodega[bodegaId].aprobado++;
            datosPorBodega[bodegaId].preAprobadas++;
            break;
          case 4: // RECHAZADO
            datosPorBodega[bodegaId].rechazado++;
            datosPorBodega[bodegaId].preAprobadas++;
            break;
          case 5: // NO APLICA
            datosPorBodega[bodegaId].noAplica++;
            break;
          case 6: // FACTURADO
            datosPorBodega[bodegaId].facturadas++;
            datosPorBodega[bodegaId].preAprobadas++;
            break;
          case 7: // CADUCADAS
            datosPorBodega[bodegaId].caducadas++;
            datosPorBodega[bodegaId].preAprobadas++;
            break;
          default: // Otros estados (3, etc.)
            datosPorBodega[bodegaId].preAprobadas++;
            break;
        }
      }
    });

    return Object.values(datosPorBodega);
  };

  // Función para procesar datos por segmento (Tipo Cliente)
  const procesarDatosPorSegmento = () => {
    const segmentosClientes = {
      0: "NO APLICA",
      1: "NO BANCARIZADO",
      2: "BANCARIZADO",
      3: "CREDI POINT NIVEL",
      4: "POINT MOVIL",
      5: "RECURRENTE",
      6: "BANCARIZADO A",
      7: "BANCARIZADO B",
      8: "BANCARIZADO C",
      9: "RECURRENTE A",
      10: "RECURRENTE B",
      11: "RECURRENTE C",
      12: "RECURRENTE MALO"
    };

    const datosPorSegmento = {};

    // Filtrar segmentos según la selección del tipo cliente
    const segmentosAMostrar = selectedTipoCliente === "todos"
      ? Object.keys(segmentosClientes)
      : [selectedTipoCliente.toString()];

    // Inicializar datos para cada segmento
    segmentosAMostrar.forEach(segmentoId => {
      datosPorSegmento[segmentoId] = {
        nombre: segmentosClientes[segmentoId] || `Segmento ${segmentoId}`,
        totalSolicitudes: 0,
        preAprobadas: 0, // Total - No Aplica -- EN REALIDAD ES GESTIONADO
        preaprobadoReal: 0, // Estado 1
        noAplica: 0,     // Estado 5
        aprobado: 0,     // Estado 2
        rechazado: 0,    // Estado 4
        facturadas: 0,   // Estado 6
        caducadas: 0	 // Estado 7
      };
    });

    // Procesar cada solicitud
    solicitudesData.forEach(solicitud => {
      const tipoClienteId = solicitud.TipoCliente || solicitud.idTipoCliente;

      if (datosPorSegmento[tipoClienteId]) {
        datosPorSegmento[tipoClienteId].totalSolicitudes++;

        switch (solicitud.Estado) {
          case 1: // PRE APROBADO
            datosPorSegmento[tipoClienteId].preaprobadoReal++;
            datosPorSegmento[tipoClienteId].preAprobadas++;
            break;
          case 2: // APROBADO
            datosPorSegmento[tipoClienteId].aprobado++;
            datosPorSegmento[tipoClienteId].preAprobadas++;
            break;
          case 4: // RECHAZADO
            datosPorSegmento[tipoClienteId].rechazado++;
            datosPorSegmento[tipoClienteId].preAprobadas++;
            break;
          case 5: // NO APLICA
            datosPorSegmento[tipoClienteId].noAplica++;
            break;
          case 6: // FACTURADO
            datosPorSegmento[tipoClienteId].facturadas++;
            datosPorSegmento[tipoClienteId].preAprobadas++;
            break;
          case 7: // CADUCADA
            datosPorSegmento[tipoClienteId].caducadas++;
            datosPorSegmento[tipoClienteId].preAprobadas++;
            break;
          default: // Otros estados (3, etc.)
            datosPorSegmento[tipoClienteId].preAprobadas++;
            break;
        }
      }
    });

    // Filtrar solo los segmentos que tienen datos o mostrar todos si selectedTipoCliente es "todos"
    const resultado = Object.values(datosPorSegmento);

    // Si hay un tipo de cliente específico seleccionado, mostrar solo ese
    // Si es "todos", mostrar solo los que tienen datos
    if (selectedTipoCliente === "todos") {
      return resultado.filter(segmento => segmento.totalSolicitudes > 0);
    }

    return resultado;
  };

  // Función para procesar datos por vendedor
  const procesarDatosPorVendedor = () => {
    const datosPorVendedor = {};

    // Solo procesar si hay una bodega específica seleccionada
    if (selectedBodega === "todos") {
      return [];
    }

    // Filtrar vendedores según la selección
    const vendedoresFiltrados = selectedVendedor === "todos"
      ? vendedores
      : vendedores.filter(vendedor => vendedor.idPersonal.toString() === selectedVendedor.toString());

    // Inicializar datos para cada vendedor filtrado
    vendedoresFiltrados.forEach(vendedor => {
      datosPorVendedor[vendedor.idPersonal] = {
        nombre: vendedor.Nombre || "No disponible",
        totalSolicitudes: 0,
        preAprobadas: 0, // Total - No Aplica -- EN REALIDAD ES GESTIONADO
        preaprobadoReal: 0, // Estado 1
        noAplica: 0,     // Estado 5
        aprobado: 0,     // Estado 2
        rechazado: 0,    // Estado 4
        facturadas: 0,   // Estado 6
        caducadas: 0	 // Estado 7
      };
    });

    // Procesar cada solicitud que corresponda a la bodega seleccionada
    solicitudesData.forEach(solicitud => {
      // Solo procesar solicitudes de la bodega seleccionada
      if (solicitud.Bodega.toString() === selectedBodega.toString()) {
        const vendedorId = solicitud.Vendedor || solicitud.idVendedor;

        if (datosPorVendedor[vendedorId]) {
          datosPorVendedor[vendedorId].totalSolicitudes++;

          switch (solicitud.Estado) {
            case 1: // PRE APROBADO
              datosPorVendedor[vendedorId].preaprobadoReal++;
              datosPorVendedor[vendedorId].preAprobadas++;
              break;
            case 2: // APROBADO
              datosPorVendedor[vendedorId].aprobado++;
              datosPorVendedor[vendedorId].preAprobadas++;
              break;
            case 4: // RECHAZADO
              datosPorVendedor[vendedorId].rechazado++;
              datosPorVendedor[vendedorId].preAprobadas++;
              break;
            case 5: // NO APLICA
              datosPorVendedor[vendedorId].noAplica++;
              break;
            case 6: // FACTURADO
              datosPorVendedor[vendedorId].facturadas++;
              datosPorVendedor[vendedorId].preAprobadas++;
              break;
            case 7: // CADUCADA
              datosPorVendedor[vendedorId].caducadas++;
              datosPorVendedor[vendedorId].preAprobadas++;
              break;
            default: // Otros estados (3, etc.)
              datosPorVendedor[vendedorId].preAprobadas++;
              break;
          }
        }
      }
    });

    return Object.values(datosPorVendedor);
  };

  // Función para calcular porcentajes
  const calcularPorcentajes = (datos) => {
    const totales = calcularTotales(datos);
    const total = totales.totalSolicitudes;

    if (total === 0) {
      return {
        preaprobadoReal: 0,
        preAprobadas: 0,
        noAplica: 0,
        aprobado: 0,
        rechazado: 0,
        facturadas: 0,
        caducadas: 0
      };
    }

    return {
      preAprobadas: ((totales.preAprobadas / total) * 100).toFixed(1),
      noAplica: ((totales.noAplica / total) * 100).toFixed(1),
      preaprobadoReal: ((totales.preaprobadoReal / totales.preAprobadas) * 100).toFixed(1),
      aprobado: ((totales.aprobado / totales.preAprobadas) * 100).toFixed(1),
      rechazado: ((totales.rechazado / totales.preAprobadas) * 100).toFixed(1),
      facturadas: ((totales.facturadas / totales.preAprobadas) * 100).toFixed(1),
      caducadas: ((totales.caducadas / totales.preAprobadas) * 100).toFixed(1)
    };
  };

  // Función para calcular totales
  const calcularTotales = (datos) => {
    return datos.reduce((total, item) => ({
      totalSolicitudes: total.totalSolicitudes + item.totalSolicitudes,
      preAprobadas: total.preAprobadas + item.preAprobadas,
      noAplica: total.noAplica + item.noAplica,
      preaprobadoReal: total.preaprobadoReal + item.preaprobadoReal,
      aprobado: total.aprobado + item.aprobado,
      rechazado: total.rechazado + item.rechazado,
      facturadas: total.facturadas + item.facturadas,
      caducadas: total.caducadas + item.caducadas
    }), {
      totalSolicitudes: 0,
      preAprobadas: 0,
      preaprobadoReal: 0,
      noAplica: 0,
      aprobado: 0,
      rechazado: 0,
      facturadas: 0,
      caducadas: 0
    });
  };

  // Ejecutar cuando cambien los filtros
  useEffect(() => {
    if (fechaInicio && fechaFin && bodegas.length > 0) {
      fetchFilteredData();
    }
  }, [fechaInicio, fechaFin, selectedBodega, estadoFiltro, bodegas, selectedVendedor, selectedTipoCliente]);

  // Handlers para cambios en los filtros
  const handleBodegaChange = (event) => {
    setSelectedBodega(event.target.value);
    setSelectedVendedor("todos");
  };

  const handleVendedorChange = (event) => {
    setSelectedVendedor(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header fijo con filtros colapsables */}
      <div className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Resumen rápido de fechas y botón de filtros */}
          <div className="flex flex-row flex-wrap items-center justify-between gap-2 text-xs text-gray-700 bg-blue-50 px-4 py-2 rounded-lg mb-2 relative">
            <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
              <span className="font-medium">Período:</span>
              <span className="bg-white px-2 py-0.5 rounded border">{fechaInicio}</span>
              <span>→</span>
              <span className="bg-white px-2 py-0.5 rounded border">{fechaFin}</span>
            </div>
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow ml-3"
              title={filtersVisible ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              style={{ height: '28px', position: 'relative', zIndex: 1 }}
            >
              {filtersVisible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              <span className="hidden sm:inline">{filtersVisible ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
            </button>
          </div>

          {/* Panel de filtros colapsable */}
          {filtersVisible && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              {/* Primera fila: Fechas, Bodega, Vendedor */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Fecha Inicio</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={fechaInicio}
                    onChange={(e) => {
                      const nuevaFechaInicio = e.target.value;
                      if (isValidDate(nuevaFechaInicio)) {
                        setFechaInicio(nuevaFechaInicio);
                      } else {
                        setFechaInicio(today);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Fecha Fin</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="bodega-select" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Bodega
                  </label>
                  <select
                    id="bodega-select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={selectedBodega}
                    onChange={handleBodegaChange}
                    disabled={userData?.idGrupo === 23}
                  >
                    <option value="todos">Todos</option>
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
                <div>
                  <label htmlFor="vendedor-select" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Buscar por Vendedor
                  </label>
                  <select
                    id="vendedor-select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={selectedVendedor}
                    onChange={handleVendedorChange}
                    disabled={selectedBodega === "todos" || vendedores.length === 0 || userData?.idGrupo === 23}
                  >
                    <option value="todos">Todos</option>
                    {vendedores.map((vendedor) => (
                      <option key={vendedor.idPersonal} value={vendedor.idPersonal}>
                        {`${vendedor.Nombre || ""}`.trim() || "No disponible"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Segunda fila: Tipo Cliente, Estado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="tipo-cliente-select" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Tipo Cliente
                  </label>
                  <select
                    id="tipo-cliente-select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={selectedTipoCliente}
                    onChange={e => setSelectedTipoCliente(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    {tipoCliente.map((tipo) => (
                      <option key={tipo.idTipoCliente} value={tipo.idTipoCliente}>{tipo.Nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Estado</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                  >
                    {estadosOpciones.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 py-6 space-y-6">
        {/* Tabla de solicitudes por bodega */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Solicitudes por Local</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Local
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Solicitudes<br />Ingresadas
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Gestionados
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    No Aplica
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Pre<br />Aprobados
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Aprobado
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Rechazado
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Facturadas
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    CADUCADAS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {procesarDatosPorBodega().map((bodega, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-100">
                      {bodega.nombre}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-semibold">
                        {bodega.totalSolicitudes}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-semibold">
                        {bodega.preAprobadas}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-red-100 text-red-800 rounded text-xs font-semibold">
                        {bodega.noAplica}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {bodega.preaprobadoReal}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        {bodega.aprobado}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-red-300 text-red-800 rounded text-xs font-semibold">
                        {bodega.rechazado}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-green-300 text-black-800 rounded text-xs font-semibold">
                        {bodega.facturadas}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-gray-300 text-black-800 rounded text-xs font-semibold">
                        {bodega.caducadas}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Fila de totales */}
                <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                    TOTAL
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).totalSolicitudes}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).preAprobadas}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 bg-red-200 text-red-900 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).noAplica}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 bg-blue-200 text-blue-900 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).preaprobadoReal}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 bg-green-200 text-green-900 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).aprobado}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 bg-red-300 text-red-900 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).rechazado}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 bg-green-200 text-green-900 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).facturadas}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                    <span className="inline-flex items-center justify-center w-10 h-6 bg-gray-200 text-gray-900 rounded text-xs font-bold">
                      {calcularTotales(procesarDatosPorBodega()).caducadas}
                    </span>
                  </td>
                </tr>

                {/* Fila de porcentajes */}
                <tr className="bg-blue-50 border-t border-gray-200">
                  <td className="px-6 py-2 whitespace-nowrap text-xs font-semibold text-blue-900">
                    PORCENTAJE
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    100%
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    {calcularPorcentajes(procesarDatosPorBodega()).preAprobadas}%
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    {calcularPorcentajes(procesarDatosPorBodega()).noAplica}%
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    {calcularPorcentajes(procesarDatosPorBodega()).preaprobadoReal}%
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    {calcularPorcentajes(procesarDatosPorBodega()).aprobado}%
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    {calcularPorcentajes(procesarDatosPorBodega()).rechazado}%
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    {calcularPorcentajes(procesarDatosPorBodega()).facturadas}%
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                    {calcularPorcentajes(procesarDatosPorBodega()).caducadas}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mensaje cuando no hay datos */}
          {solicitudesData.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <p className="text-lg">No hay datos disponibles para el período seleccionado</p>
              <p className="text-sm mt-2">Ajusta los filtros para ver los resultados</p>
            </div>
          )}
        </div>

        {/* Tabla de solicitudes por vendedor  */}
        {selectedBodega !== "todos" && vendedores.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white">
                Solicitudes por Vendedor - {bodegas.find(b => b.b_Bodega.toString() === selectedBodega.toString())?.b_Nombre}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Vendedor
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Solicitudes<br />Ingresadas
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Gestionados
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      No Aplica
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Pre Aprobado
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Aprobado
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Rechazado
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Facturadas
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                      Caducadas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {procesarDatosPorVendedor().map((vendedor, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-100">
                        {vendedor.nombre}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-semibold">
                          {vendedor.totalSolicitudes}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-semibold">
                          {vendedor.preAprobadas}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-red-100 text-red-800 rounded text-xs font-semibold">
                          {vendedor.noAplica}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                          {vendedor.preaprobadoReal}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-green-100 text-green-800 rounded text-xs font-semibold">
                          {vendedor.aprobado}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-red-300 text-red-800 rounded text-xs font-semibold">
                          {vendedor.rechazado}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-green-300 text-black-800 rounded text-xs font-semibold">
                          {vendedor.facturadas}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-gray-300 text-gray-800 rounded text-xs font-semibold">
                          {vendedor.caducadas}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* Fila de totales para vendedores */}
                  {procesarDatosPorVendedor().length > 0 && (
                    <>
                      <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                          TOTAL
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).totalSolicitudes}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).preAprobadas}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 bg-red-200 text-red-900 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).noAplica}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 bg-blue-200 text-blue-900 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).preaprobadoReal}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 bg-green-200 text-green-900 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).aprobado}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 bg-red-300 text-red-900 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).rechazado}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 bg-green-200 text-green-900 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).facturadas}
                          </span>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                          <span className="inline-flex items-center justify-center w-10 h-6 bg-gray-200 text-gray-900 rounded text-xs font-bold">
                            {calcularTotales(procesarDatosPorVendedor()).caducadas}
                          </span>
                        </td>
                      </tr>

                      {/* Fila de porcentajes para vendedores */}
                      <tr className="bg-green-50 border-t border-gray-200">
                        <td className="px-6 py-2 whitespace-nowrap text-xs font-semibold text-green-900">
                          PORCENTAJE
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          100%
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          {calcularPorcentajes(procesarDatosPorVendedor()).preAprobadas}%
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          {calcularPorcentajes(procesarDatosPorVendedor()).noAplica}%
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          {calcularPorcentajes(procesarDatosPorVendedor()).preaprobadoReal}%
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          {calcularPorcentajes(procesarDatosPorVendedor()).aprobado}%
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          {calcularPorcentajes(procesarDatosPorVendedor()).rechazado}%
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          {calcularPorcentajes(procesarDatosPorVendedor()).facturadas}%
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                          {calcularPorcentajes(procesarDatosPorVendedor()).caducadas}%
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mensaje cuando no hay datos de vendedores */}
            {procesarDatosPorVendedor().length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                <p className="text-lg">No hay datos de vendedores disponibles para esta bodega</p>
                <p className="text-sm mt-2">Verifica que existan vendedores registrados para el período seleccionado</p>
              </div>
            )}
          </div>
        )}

        {/* Tabla de solicitudes por segmento (Tipo Cliente) */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Solicitudes por Segmento</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Segmento
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Solicitudes<br />Ingresadas
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Gestionados
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    No Aplica
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Pre Aprobado
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Aprobado
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Rechazado
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Facturadas
                  </th>
                  <th className="px-6 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    CADUCADAS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {procesarDatosPorSegmento().map((segmento, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-100">
                      {segmento.nombre}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-semibold">
                        {segmento.totalSolicitudes}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-semibold">
                        {segmento.preAprobadas}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-red-100 text-red-800 rounded text-xs font-semibold">
                        {segmento.noAplica}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {segmento.preaprobadoReal}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        {segmento.aprobado}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-red-300 text-red-800 rounded text-xs font-semibold">
                        {segmento.rechazado}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-green-300 text-black-800 rounded text-xs font-semibold">
                        {segmento.facturadas}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-b border-gray-100">
                      <span className="inline-flex items-center justify-center w-10 h-6 bg-gray-300 text-black-800 rounded text-xs font-semibold">
                        {segmento.caducadas}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Fila de totales para segmentos */}
                {procesarDatosPorSegmento().length > 0 && (
                  <>
                    <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).totalSolicitudes}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).preAprobadas}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-red-200 text-red-900 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).noAplica}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-blue-200 text-blue-900 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).preaprobadoReal}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-green-200 text-green-900 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).aprobado}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-red-300 text-red-900 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).rechazado}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-green-200 text-green-900 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).facturadas}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                        <span className="inline-flex items-center justify-center w-10 h-6 bg-gray-200 text-gray-900 rounded text-xs font-bold">
                          {calcularTotales(procesarDatosPorSegmento()).caducadas}
                        </span>
                      </td>
                    </tr>

                    {/* Fila de porcentajes para segmentos */}
                    <tr className="bg-purple-50 border-t border-gray-200">
                      <td className="px-6 py-2 whitespace-nowrap text-xs font-semibold text-purple-900">
                        PORCENTAJE
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        100%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        {calcularPorcentajes(procesarDatosPorSegmento()).preAprobadas}%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        {calcularPorcentajes(procesarDatosPorSegmento()).noAplica}%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        {calcularPorcentajes(procesarDatosPorSegmento()).preaprobadoReal}%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        {calcularPorcentajes(procesarDatosPorSegmento()).aprobado}%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        {calcularPorcentajes(procesarDatosPorSegmento()).rechazado}%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        {calcularPorcentajes(procesarDatosPorSegmento()).facturadas}%
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs text-center font-semibold">
                        {calcularPorcentajes(procesarDatosPorSegmento()).caducadas}%
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Mensaje cuando no hay datos de segmentos */}
          {procesarDatosPorSegmento().length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <p className="text-lg">No hay datos de segmentos disponibles para el período seleccionado</p>
              <p className="text-sm mt-2">Ajusta los filtros para ver los resultados</p>
            </div>
          )}
        </div>
      </div>

	  <ModalAño openModalAño={openModalAño} setOpenModalAño={cerrarModal} />
    </div>
  );
}