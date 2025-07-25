import React, { useEffect, useState } from "react";
import {
  MonetizationOn,
  People,
  ShoppingCart,
  ConfirmationNumber,
} from "@mui/icons-material";
import { Doughnut, Bar, Radar } from "react-chartjs-2";
import { Bar as BarChart } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { APIURL } from "../../configApi/apiConfig";
import useBodegaUsuario from "../../hooks/useBodegaUsuario";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "../../configApi/axiosConfig";
Chart.register(...registerables);
// Leyenda personalizada para el gráfico de situación laboral
function SituacionLaboralLegend({ labels, colors }) {
  return (
    <div className="flex flex-col items-start ml-6">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center mb-2">
          <span
            className="inline-block w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: colors[i], border: '2px solid #fff', boxShadow: '0 0 2px #888' }}
          ></span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      ))}
    </div>
  );
}
// Plugin para mostrar el total en el centro del doughnut
const doughnutCenterText = {
  id: 'doughnutCenterText',
  afterDraw: (chart) => {
    if (chart.config.type !== 'doughnut') return;
    const { ctx, chartArea } = chart;
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    ctx.save();
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Total: ${total}`,
      (chartArea.left + chartArea.right) / 2,
      (chartArea.top + chartArea.bottom) / 2
    );
    ctx.restore();
  }
};

// ...existing code...

// ...existing code...

export function Dashboards() {

  // Estado para productos y radar chart
  const [productos, setProductos] = useState([]);
  const [radarData, setRadarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Productos más solicitados",
        data: [],
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "#3b82f6",
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
      },
    ],
  });

  // Estado para opciones de situación laboral y datos del gráfico
  const [situacionLaboralOpts, setSituacionLaboralOpts] = useState([]);
  const [doughnutSituacionLaboralData, setDoughnutSituacionLaboralData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  // Filtro de tipo cliente
  const [tipoCliente, setTipoCliente] = useState([]);
  const [selectedTipoCliente, setSelectedTipoCliente] = useState("todos");

  // Filtro de tipo encuesta
  const [tipoEncuesta, setTipoEncuesta] = useState([]);
  const [selectedTipoEncuesta, setSelectedTipoEncuesta] = useState("todos");

  // Obtener productos al montar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await axios.get(APIURL.get_Productos(), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (resp.status === 200) {
          setProductos(resp.data);
        }
      } catch (error) {
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  // Obtener opciones de situación laboral al montar
  useEffect(() => {
    const fetchSituacionLaboral = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await axios.get(APIURL.getActividadEconominasituacionLaboral(), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (resp.status === 200) {
          setSituacionLaboralOpts(resp.data);
        }
      } catch (error) {
        setSituacionLaboralOpts([]);
      }
    };
    fetchSituacionLaboral();
  }, []);

  // Obtener tipos de cliente al montar
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

  // Obtener tipos de encuesta al montar
  useEffect(() => {
    const fetchTipoEncuesta = async () => {
      try {
        const token = localStorage.getItem("token");
        const respTipoEncuesta = await axios.get(APIURL.get_TipoConsulta(), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (respTipoEncuesta.status === 200) {
          setTipoEncuesta(respTipoEncuesta.data);
        }
      } catch (error) {
        setTipoEncuesta([]);
      }
    };
    fetchTipoEncuesta();
  }, []);

  const estadosOpciones = [
    { label: "Todos", value: "todos" },
    { label: "PRE-APROBADO", value: 1 },
    { label: "APROBADO", value: 2 },
    { label: "ANULADO", value: 3 },
    { label: "RECHAZADO", value: 4 },
    { label: "NO APLICA", value: 5 },
    { label: "FACTURADO", value: 6 },
    { label: "RECHAZADO-LN", value: 7 },
  ];
  const [estadoFiltro, setEstadoFiltro] = useState("todos");



  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Expresión regular para el formato YYYY-MM-DD
    if (!regex.test(dateString)) return false; // Si el formato no coincide, es inválido

    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Verifica si la fecha es válida
  };

  const [uniqueVendedores, setUniqueVendedores] = useState(0);

  const today = new Date().toISOString().split("T")[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
const [doughnutData, setDoughnutData] = useState({
  labels: ["PRE-APROBADO", "APROBADO", "ANULADO", "RECHAZADO", "NO APLICA", "FACTURADO", "RECHAZADO-LN"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: ["#3b82f6", "#10b981", "#6b7280", "#ef4444", "#f59e0b", "#059669", "#dc2626"], // ✅ Colores más representativos
    },
  ],
});

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Solicitudes por Bodega",
        data: [],
        backgroundColor: "#007bff",
      },
    ],
  });

  // Estado para el gráfico de solicitudes por día de la semana
  const [barDiasSemanaData, setBarDiasSemanaData] = useState({
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    datasets: [
      {
        label: "Solicitudes por Día de la Semana",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#6366f1",
          "#059669",
          "#6b7280",
        ],
      },
    ],
  });
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);

  // Filtro de vendedor
  const [selectedVendedor, setSelectedVendedor] = useState("todos");
  const [vendedores, setVendedores] = useState([]);

// ✅ Agregar estas líneas para el rango de 15 días
const date15DaysAgo = new Date();
date15DaysAgo.setDate(date15DaysAgo.getDate() - 15);
const date15DaysAgoStr = date15DaysAgo.toISOString().split("T")[0];

// ✅ Cambiar estos estados
const [fechaInicio, setFechaInicio] = useState(date15DaysAgoStr); // Cambiar de today a date15DaysAgoStr
const [fechaFin, setFechaFin] = useState(today);
  const [selectedBodega, setSelectedBodega] = useState("todos");
  const { data, loading, error, fetchBodegaUsuario, listaVendedoresporBodega, vendedor } = useBodegaUsuario();
  const { userData, idMenu } = useAuth();

  

  const [bodegass, setBodegass] = useState([]);

  const bodegas = data || [];  // Safely access the bodegas data



  useEffect(() => {
    if (userData && userData.idUsuario) {
      fetchBodega(); // Llamar a la API para obtener las bodegas
    }
  }, [userData]);

  // Cargar vendedores cuando cambia la bodega o la fecha
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
    // Si el vendedor seleccionado ya no está, resetear
    if (
      selectedVendedor !== "todos" &&
      vendedor &&
      !vendedor.some((v) => v.idPersonal === selectedVendedor)
    ) {
      setSelectedVendedor("todos");
    }
  }, [vendedor]);

  const handleBodegaChange = (event) => {
    setSelectedBodega(event.target.value);
    setSelectedVendedor("todos");
  };

  const handleVendedorChange = (event) => {
    setSelectedVendedor(event.target.value);
  };

  const fetchBodega = async () => {
    const userId = userData.idUsuario;
    const idTipoFactura = 43;
    const fecha = new Date().toISOString();
    const recibeConsignacion = true;

    try {
      await fetchBodegaUsuario(userId, idTipoFactura, fecha, recibeConsignacion);
      setBodegass(data);
    } catch (err) {
      console.error("Error al obtener los datos de la bodega:", err);
    }
  };

  const bodegasIds = bodegas.map((bodega) => bodega.b_Bodega); // Obtener los IDs de las bodegas

  const fetchSolicitudes = async () => {
    let bodegasId = [];
    try {
      if (selectedBodega !== "todos") {
        bodegasId = [selectedBodega];
      } else {
        bodegasId = bodegasIds;
      }
      const token = localStorage.getItem("token");
      const params = {
        limit: 100,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        bodega: bodegasId,
        estado: estadoFiltro === "todos" ? 0 : parseInt(estadoFiltro),
        idTipoCliente: selectedTipoCliente === "todos" ? 0 : parseInt(selectedTipoCliente),
        idCompraEncuesta: selectedTipoEncuesta === "todos" ? 0 : parseInt(selectedTipoEncuesta),
      };
      // Si hay filtro de vendedor, agregarlo
      if (selectedVendedor && selectedVendedor !== "todos") {
        params.vendedor = selectedVendedor;
      }
      const response = await axios.get(APIURL.getCreSolicitudCredito(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      if (response.status === 200) {
        // --- Pie Situacion Laboral ---
        // Contar por idSituacionLaboral
        const counts = {};
        response.data.data.forEach((item) => {
          if (item.idSituacionLaboral) {
            counts[item.idSituacionLaboral] = (counts[item.idSituacionLaboral] || 0) + 1;
          }
        });
        // Mapear a formato Doughnut
        const labels = situacionLaboralOpts.map(opt => opt.Descripcion);
        const data = situacionLaboralOpts.map(opt => counts[opt.idSituacionLaboral] || 0);
        // Colores generados automáticamente
        const baseColors = [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#059669', '#6b7280', '#dc2626', '#a21caf', '#f472b6', '#22d3ee', '#fbbf24'
        ];
        const backgroundColor = labels.map((_, i) => baseColors[i % baseColors.length]);
        setDoughnutSituacionLaboralData({
          labels,
          datasets: [
            {
              data,
              backgroundColor,
            },
          ],
        });
        // --- Radar Chart: productos más solicitados ---
        // Mapear productos a su cantidad en solicitudes
        const productosCount = {};
        response.data.data.forEach((item) => {
          if (item.idProductos) {
            productosCount[item.idProductos] = (productosCount[item.idProductos] || 0) + 1;
          }
        });
        // Ordenar productos por cantidad y tomar los top N (ej: 6)
        const topN = 6;
        const productosOrdenados = Object.entries(productosCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, topN);
        const radarLabels = productosOrdenados.map(([id]) => {
          const prod = productos.find((p) => p.idCre_ProductoSolicitud === Number(id));
          return prod ? prod.Producto : `Producto ${id}`;
        });
        const radarValues = productosOrdenados.map(([_, count]) => count);
        setRadarData({
          labels: radarLabels,
          datasets: [
            {
              label: "Productos más solicitados",
              data: radarValues,
              backgroundColor: "rgba(59,130,246,0.2)",
              borderColor: "#3b82f6",
              pointBackgroundColor: "#3b82f6",
              pointBorderColor: "#fff",
            },
          ],
        });
        const estadoCounts = {
          PENDIENTE: 0,
          APROBADO: 0,
          ANULADO: 0,
          RECHAZADO: 0,
          NO_APLICA: 0,
          FACTURADO: 0,
          RECHAZADO_LN: 0,
        };
        const totalRecords = response.data.total;
        setTotalSolicitudes(totalRecords);
        const bodegaCounts = {};
        const bodegaEstadoCounts = {};
        const vendedoresSet = new Set();

        // Agrupación por día de la semana
        const diasSemana = [0, 0, 0, 0, 0, 0, 0]; // Lunes a Domingo

        response.data.data.forEach((item) => {
          if (item.Estado === 1) estadoCounts.PENDIENTE++;
          else if (item.Estado === 2) estadoCounts.APROBADO++;
          else if (item.Estado === 3) estadoCounts.ANULADO++;
          else if (item.Estado === 4) estadoCounts.RECHAZADO++;
          else if (item.Estado === 5) estadoCounts.NO_APLICA++;
          else if (item.Estado === 6) estadoCounts.FACTURADO++;
          else if (item.Estado === 7) estadoCounts.RECHAZADO_LN++;
          if (item.idVendedor) {
            vendedoresSet.add(item.idVendedor);
          }
          const bodegaId = item.Bodega;
          if (bodegaCounts[bodegaId]) {
            bodegaCounts[bodegaId]++;
          } else {
            bodegaCounts[bodegaId] = 1;
          }
          if (!bodegaEstadoCounts[bodegaId]) {
            bodegaEstadoCounts[bodegaId] = {
              PENDIENTE: 0,
              APROBADO: 0,
              ANULADO: 0,
              RECHAZADO: 0,
              NO_APLICA: 0,
              FACTURADO: 0,
              RECHAZADO_LN: 0,
            };
          }
          if (item.Estado === 1) bodegaEstadoCounts[bodegaId].PENDIENTE++;
          else if (item.Estado === 2) bodegaEstadoCounts[bodegaId].APROBADO++;
          else if (item.Estado === 3) bodegaEstadoCounts[bodegaId].ANULADO++;
          else if (item.Estado === 4) bodegaEstadoCounts[bodegaId].RECHAZADO++;
          else if (item.Estado === 5) bodegaEstadoCounts[bodegaId].NO_APLICA++;
          else if (item.Estado === 6) bodegaEstadoCounts[bodegaId].FACTURADO++;
          else if (item.Estado === 7) bodegaEstadoCounts[bodegaId].RECHAZADO_LN++;

          // Agrupar por día de la semana
          if (item.Fecha) {
            const fechaObj = new Date(item.Fecha);
            let dia = fechaObj.getDay(); // 0=Domingo, 1=Lunes, ...
            dia = dia === 0 ? 6 : dia - 1; // Convertir a 0=Lunes, 6=Domingo
            diasSemana[dia]++;
          }
        });
        setUniqueVendedores(vendedoresSet.size);
        let doughnutLabels = [];
        let doughnutValues = [];
        let doughnutColors = [];
        if (estadoFiltro === "todos") {
          doughnutLabels = ["PRE-APROBADO", "APROBADO", "ANULADO", "RECHAZADO", "NO APLICA", "FACTURADO", "RECHAZADO-LN"];
          doughnutValues = [
            estadoCounts.PENDIENTE,
            estadoCounts.APROBADO,
            estadoCounts.ANULADO,
            estadoCounts.RECHAZADO,
            estadoCounts.NO_APLICA,
            estadoCounts.FACTURADO,
            estadoCounts.RECHAZADO_LN,
          ];
          doughnutColors = ["#3b82f6", "#10b981", "#6b7280", "#ef4444", "#f59e0b", "#059669", "#dc2626"];
        } else {
          const estadoSeleccionado = estadosOpciones.find(e => e.value == estadoFiltro);
          if (estadoSeleccionado) {
            doughnutLabels = [estadoSeleccionado.label];
            doughnutValues = [totalRecords];
            const colorMap = {
              1: "#3b82f6",
              2: "#10b981",
              3: "#6b7280",
              4: "#ef4444",
              5: "#f59e0b",
              6: "#059669",
              7: "#dc2626",
            };
            doughnutColors = [colorMap[estadoFiltro]];
          }
        }
        setDoughnutData({
          labels: doughnutLabels,
          datasets: [
            {
              data: doughnutValues,
              backgroundColor: doughnutColors,
            },
          ],
        });
        const bodegaLabels = Object.keys(bodegaCounts).map((codigo) => {
          const bodegaEncontrada = bodegas.find((b) => b.b_Bodega === Number(codigo));
          return bodegaEncontrada ? bodegaEncontrada.b_Nombre : `Bodega ${codigo}`;
        });
        const estadosParaBarras = [
          { key: 'PENDIENTE', label: 'PRE-APROBADO', color: '#3b82f6' },
          { key: 'APROBADO', label: 'APROBADO', color: '#10b981' },
          { key: 'ANULADO', label: 'ANULADO', color: '#6b7280' },
          { key: 'RECHAZADO', label: 'RECHAZADO', color: '#ef4444' },
          { key: 'NO_APLICA', label: 'NO APLICA', color: '#f59e0b' },
          { key: 'FACTURADO', label: 'FACTURADO', color: '#059669' },
          { key: 'RECHAZADO_LN', label: 'RECHAZADO-LN', color: '#dc2626' },
        ];
        const datasets = estadosParaBarras.map(estado => ({
          label: estado.label,
          data: Object.keys(bodegaCounts).map(bodegaId =>
            bodegaEstadoCounts[bodegaId] ? bodegaEstadoCounts[bodegaId][estado.key] : 0
          ),
          backgroundColor: estado.color,
        }));
        setBarData({
          labels: bodegaLabels,
          datasets: datasets,
        });

        // Actualizar gráfico de barras por día de la semana
        setBarDiasSemanaData({
          labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
          datasets: [
            {
              label: "Solicitudes por Día de la Semana",
              data: diasSemana,
              backgroundColor: [
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#6366f1",
                "#059669",
                "#6b7280",
              ],
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ✅ Modificar este useEffect para que solo se ejecute cuando todo esté listo
  useEffect(() => {
    // Solo llamar a fetchSolicitudes si las fechas son válidas Y las bodegas están cargadas
    if (fechaInicio && fechaFin && bodegas.length > 0) {
      fetchSolicitudes();
    }
  }, [fechaInicio, fechaFin, selectedBodega, estadoFiltro, bodegas, selectedVendedor, selectedTipoCliente, selectedTipoEncuesta]);
      {/* Select de tipo encuesta */}
      <div className="w-full md:w-1/4">
        <label htmlFor="tipo-encuesta-select" className="block text-gray-700 font-semibold mb-1">
          Tipo Encuesta
        </label>
        <select
          id="tipo-encuesta-select"
          className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTipoEncuesta}
          onChange={e => setSelectedTipoEncuesta(e.target.value)}
        >
          <option value="todos">Todos</option>
          {tipoEncuesta.map((tipo) => (
            <option key={tipo.idCompraEncuesta} value={tipo.idCompraEncuesta}>{tipo.Descripcion}</option>
          ))}
        </select>
      </div>

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Sección de filtros */}
      {/* Primera fila: Fechas, Bodega, Vendedor */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Input Fecha Inicio */}
        <div className="w-full md:w-1/4">
          <label className="block text-gray-700 font-semibold mb-1">Fecha Inicio</label>
          <input
            type="date"
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {/* Input Fecha Fin */}
        <div className="w-full md:w-1/4">
          <label className="block text-gray-700 font-semibold mb-1">Fecha Fin</label>
          <input
            type="date"
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        {/* Select de bodegas */}
        <div className="w-full md:w-1/4">
          <label htmlFor="bodega-select" className="block text-gray-700 font-semibold mb-1">
            Bodega
          </label>
          <select
            id="bodega-select"
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedBodega}
            onChange={handleBodegaChange}
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
        {/* Select de vendedores */}
        <div className="w-full md:w-1/4">
          <label htmlFor="vendedor-select" className="block text-gray-700 font-semibold mb-1">
            Buscar por Vendedor
          </label>
          <select
            id="vendedor-select"
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedVendedor}
            onChange={handleVendedorChange}
            disabled={selectedBodega === "todos" || vendedores.length === 0}
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

      {/* Segunda fila: Tipo Cliente, Tipo Encuesta, Estado */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
        {/* Select de tipo cliente */}
        <div className="w-full md:w-1/4">
          <label htmlFor="tipo-cliente-select" className="block text-gray-700 font-semibold mb-1">
            Tipo Cliente
          </label>
          <select
            id="tipo-cliente-select"
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTipoCliente}
            onChange={e => setSelectedTipoCliente(e.target.value)}
          >
            <option value="todos">Todos</option>
            {tipoCliente.map((tipo) => (
              <option key={tipo.idTipoCliente} value={tipo.idTipoCliente}>{tipo.Nombre}</option>
            ))}
          </select>
        </div>
        {/* Select de tipo encuesta */}
        <div className="w-full md:w-1/4">
          <label htmlFor="tipo-encuesta-select" className="block text-gray-700 font-semibold mb-1">
            Tipo Encuesta
          </label>
          <select
            id="tipo-encuesta-select"
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTipoEncuesta}
            onChange={e => setSelectedTipoEncuesta(e.target.value)}
          >
            <option value="todos">Todos</option>
            {tipoEncuesta.map((tipo) => (
              <option key={tipo.idCompraEncuesta} value={tipo.idCompraEncuesta}>{tipo.Descripcion}</option>
            ))}
          </select>
        </div>
        {/* Select de estado */}
        <div className="w-full md:w-1/4">
          <label className="block text-gray-700 font-semibold mb-1">Estado</label>
          <select
            className="w-full p-2 border-2 border-gray-300 rounded-md"
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

      {/* Sección de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bt-6 mt-6">
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Número de solicitudes de crédito
              </p>
              <h2 className="text-xl font-semibold">{totalSolicitudes}</h2>
            </div>
            <div className="text-4xl text-blue-600">
              <MonetizationOn />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Vendedores involucrados </p>
              <h2 className="text-xl font-semibold">{uniqueVendedores}</h2>
            </div>
            <div className="text-4xl text-green-500">
              <People />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-2 rounded shadow-md min-h-0 flex flex-col items-center" style={{ minHeight: 0, height: '320px', maxHeight: '340px' }}>
          <h3 className="text-lg font-semibold mb-2">Número de solicitudes de crédito por Almacen </h3>
          <div className="w-full h-full flex-1 flex items-center justify-center">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
              }}
              height={220}
            />
          </div>
        </div>
        <div className="bg-white p-2 rounded shadow-md min-h-0 flex flex-col items-center" style={{ minHeight: 0, height: '320px', maxHeight: '340px' }}>
          <h3 className="text-lg font-semibold mb-2">Solicitudes de crédito por Estado</h3>
          <div className="w-full h-full flex-1 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} height={220} />
          </div>
        </div>
      </div>

      {/* Gráficos adicionales en fila inferior: día de la semana, productos más solicitados y situación laboral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-2 rounded shadow-md min-h-0 flex flex-col items-center" style={{ minHeight: 0, height: '320px', maxHeight: '340px' }}>
          <h3 className="text-lg font-semibold mb-2">Solicitudes por Día de la Semana</h3>
          <div className="w-full h-full flex-1 flex items-center justify-center">
            <BarChart
              data={barDiasSemanaData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Día de la Semana',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Cantidad',
                    },
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
              height={220}
            />
          </div>
        </div>
        <div className="bg-white p-2 rounded shadow-md min-h-0 flex flex-col items-center" style={{ minHeight: 0, height: '320px', maxHeight: '340px' }}>
          <h3 className="text-lg font-semibold mb-2">Productos más solicitados </h3>
          <div className="w-full h-full flex-1 flex items-center justify-center">
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                scales: {
                  r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    pointLabels: {
                      font: { size: 14 },
                    },
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
              height={220}
            />
          </div>
        </div>
        <div className="bg-white p-2 rounded shadow-md min-h-0 flex flex-col items-center" style={{ minHeight: 0, height: '320px', maxHeight: '340px' }}>
          <h3 className="text-lg font-semibold mb-2">Situación Laboral</h3>
          <div className="w-full h-full flex-1 flex items-center justify-center">
            <div className="flex items-center w-full justify-center">
              <div style={{ width: 180, height: 180, position: 'relative' }}>
                <Doughnut
                  data={doughnutSituacionLaboralData}
                  options={{
                    maintainAspectRatio: false,
                    cutout: '70%',
                    borderWidth: 8,
                    plugins: {
                      legend: { display: false },
                    },
                    elements: {
                      arc: {
                        borderWidth: 8,
                        borderColor: '#fff',
                        spacing: 4,
                      },
                    },
                  }}
                  plugins={[doughnutCenterText]}
                />
              </div>
              <SituacionLaboralLegend
                labels={doughnutSituacionLaboralData.labels}
                colors={doughnutSituacionLaboralData.datasets[0].backgroundColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

