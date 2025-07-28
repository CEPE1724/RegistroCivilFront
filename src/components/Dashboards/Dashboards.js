import React, { useEffect, useState } from "react";
import {
  MonetizationOn,
  People,
  ShoppingCart,
  ConfirmationNumber,
  Visibility,
  VisibilityOff,
  Close,
} from "@mui/icons-material";
import { Doughnut, Bar, Radar, PolarArea } from "react-chartjs-2";
import { Bar as BarChart, PolarArea as PolarChart } from "react-chartjs-2";
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
    // Si el tooltip está visible, no dibujar el total
    if (chart.tooltip && chart.tooltip.opacity > 0) {
      return;
    }
    const { ctx, chartArea } = chart;
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    ctx.save();
    ctx.font = 'bold 18px Arial';
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

export function Dashboards() {

  // Estado para el gráfico PolarArea de solicitudes por tipo de cliente
  const [polarTipoClienteData, setPolarTipoClienteData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#059669', '#6b7280', '#dc2626', '#a21caf', '#f472b6', '#22d3ee', '#fbbf24'
        ],
      },
    ],
  });

  // Estado para productos y radar chart
  const [filtersVisible, setFiltersVisible] = useState(false);
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
    labels: ["PRE-APROBADO", "APROBADO", "ANULADO", "RECHAZADO", "NO APLICA", "FACTURADO"],
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
        // --- PolarArea Chart: solicitudes por tipo de cliente ---
        const tipoClienteCounts = {};
        response.data.data.forEach((item) => {
          if (item.idTipoCliente) {
            tipoClienteCounts[item.idTipoCliente] = (tipoClienteCounts[item.idTipoCliente] || 0) + 1;
          }
        });
        const polarLabels = tipoCliente
          .filter(tc => tc.idTipoCliente !== undefined && tc.Nombre)
          .map(tc => tc.Nombre);
        const polarValues = tipoCliente
          .filter(tc => tc.idTipoCliente !== undefined && tc.Nombre)
          .map(tc => tipoClienteCounts[tc.idTipoCliente] || 0);
        const polarColors = polarLabels.map((_, i) => [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#059669', '#6b7280', '#dc2626', '#a21caf', '#f472b6', '#22d3ee', '#fbbf24'
        ][i % 12]);
        setPolarTipoClienteData({
          labels: polarLabels,
          datasets: [
            {
              data: polarValues,
              backgroundColor: polarColors,
            },
          ],
        });
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
          doughnutLabels = ["PRE-APROBADO", "APROBADO", "ANULADO", "RECHAZADO", "NO APLICA", "FACTURADO"];
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


  const estadoItems = [
    {
      label: "PRE-APROBADO",
      value: doughnutData.datasets[0].data[0] || 0,
      styles: {
        bg: "bg-blue-50",
        border: "border-blue-100",
        dot: "bg-blue-500",
        text: "text-blue-700",
        value: "text-blue-800",
      },
    },
    {
      label: "APROBADO",
      value: doughnutData.datasets[0].data[1] || 0,
      styles: {
        bg: "bg-green-50",
        border: "border-green-100",
        dot: "bg-green-500",
        text: "text-green-700",
        value: "text-green-800",
      },
    },
    {
      label: "ANULADO",
      value: doughnutData.datasets[0].data[2] || 0,
      styles: {
        bg: "bg-gray-50",
        border: "border-gray-200",
        dot: "bg-gray-500",
        text: "text-gray-700",
        value: "text-gray-800",
      },
    },
    {
      label: "RECHAZADO",
      value: doughnutData.datasets[0].data[3] || 0,
      styles: {
        bg: "bg-red-50",
        border: "border-red-100",
        dot: "bg-red-500",
        text: "text-red-700",
        value: "text-red-800",
      },
    },
    {
      label: "NO APLICA",
      value: doughnutData.datasets[0].data[4] || 0,
      styles: {
        bg: "bg-yellow-50",
        border: "border-yellow-100",
        dot: "bg-yellow-500",
        text: "text-yellow-700",
        value: "text-yellow-800",
      },
    },
    {
      label: "FACTURADO",
      value: doughnutData.datasets[0].data[5] || 0,
      styles: {
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        value: "text-emerald-800",
      },
    },
  ];


  // ✅ Modificar este useEffect para que solo se ejecute cuando todo esté listo
  useEffect(() => {
    // Solo llamar a fetchSolicitudes si las fechas son válidas Y las bodegas están cargadas
    if (fechaInicio && fechaFin && bodegas.length > 0) {
      fetchSolicitudes();
    }
  }, [fechaInicio, fechaFin, selectedBodega, estadoFiltro, bodegas, selectedVendedor, selectedTipoCliente, selectedTipoEncuesta]);
  {/* Select de tipo encuesta */ }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header fijo con filtros colapsables */}

      <div className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Resumen rápido de fechas y botón de filtros en la misma fila */}
          <div className="flex flex-row flex-wrap items-center justify-between gap-2 text-xs text-gray-700 bg-blue-50 px-4 py-2 rounded-lg mb-2 relative">
            {/* Filtros activos y periodo a la izquierda */}
            <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
              <span className="font-medium">Período:</span>
              <span className="bg-white px-2 py-0.5 rounded border">{fechaInicio}</span>
              <span>→</span>
              <span className="bg-white px-2 py-0.5 rounded border">{fechaFin}</span>
              {/* Mostrar filtros activos */}
              {selectedBodega !== 'todos' && (
                <span className="bg-white text-blue-800 px-2 py-0.5 rounded-full font-medium flex flex-row-reverse items-center mr-1 border border-blue-200 shrink-0" style={{ minHeight: '28px', position: 'relative' }}>
                  <button
                    className="static bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-full p-0.5 flex items-center justify-center ml-2"
                    style={{ width: '16px', height: '16px', fontSize: '12px', lineHeight: '12px', marginLeft: '8px' }}
                    onClick={() => setSelectedBodega('todos')}
                    tabIndex={0}
                    aria-label="Quitar filtro bodega"
                  >
                    <Close style={{ fontSize: '12px' }} />
                  </button>
                  Bodega: {
                    (() => {
                      const bodegaObj = bodegas.find(b => String(b.b_Bodega) === String(selectedBodega));
                      return bodegaObj ? bodegaObj.b_Nombre : selectedBodega;
                    })()
                  }
                </span>
              )}
              {selectedVendedor !== 'todos' && vendedores.length > 0 && (
                <span className="bg-white text-green-800 px-2 py-0.5 rounded-full font-medium flex flex-row-reverse items-center mr-1 border border-green-200 shrink-0" style={{ minHeight: '28px', position: 'relative' }}>
                  <button
                    className="static bg-green-200 hover:bg-green-300 text-green-700 rounded-full p-0.5 flex items-center justify-center ml-2"
                    style={{ width: '16px', height: '16px', fontSize: '12px', lineHeight: '12px', marginLeft: '8px' }}
                    onClick={() => setSelectedVendedor('todos')}
                    tabIndex={0}
                    aria-label="Quitar filtro vendedor"
                  >
                    <Close style={{ fontSize: '12px' }} />
                  </button>
                  Vendedor: {vendedores.find(v => v.idPersonal == selectedVendedor)?.Nombre || selectedVendedor}
                </span>
              )}
              {selectedTipoCliente !== 'todos' && (
                <span className="bg-white text-purple-800 px-2 py-0.5 rounded-full font-medium flex flex-row-reverse items-center mr-1 border border-purple-200 shrink-0" style={{ minHeight: '28px', position: 'relative' }}>
                  <button
                    className="static bg-purple-200 hover:bg-purple-300 text-purple-700 rounded-full p-0.5 flex items-center justify-center ml-2"
                    style={{ width: '16px', height: '16px', fontSize: '12px', lineHeight: '12px', marginLeft: '8px' }}
                    onClick={() => setSelectedTipoCliente('todos')}
                    tabIndex={0}
                    aria-label="Quitar filtro tipo cliente"
                  >
                    <Close style={{ fontSize: '12px' }} />
                  </button>
                  Tipo Cliente: {tipoCliente.find(tc => tc.idTipoCliente == selectedTipoCliente)?.Nombre || selectedTipoCliente}
                </span>
              )}
              {selectedTipoEncuesta !== 'todos' && (
                <span className="bg-white text-yellow-800 px-2 py-0.5 rounded-full font-medium flex flex-row-reverse items-center mr-1 border border-yellow-200 shrink-0" style={{ minHeight: '28px', position: 'relative' }}>
                  <button
                    className="static bg-yellow-200 hover:bg-yellow-300 text-yellow-700 rounded-full p-0.5 flex items-center justify-center ml-2"
                    style={{ width: '16px', height: '16px', fontSize: '12px', lineHeight: '12px', marginLeft: '8px' }}
                    onClick={() => setSelectedTipoEncuesta('todos')}
                    tabIndex={0}
                    aria-label="Quitar filtro tipo encuesta"
                  >
                    <Close style={{ fontSize: '12px' }} />
                  </button>
                  Tipo Encuesta: {tipoEncuesta.find(te => te.idCompraEncuesta == selectedTipoEncuesta)?.Descripcion || selectedTipoEncuesta}
                </span>
              )}
              {estadoFiltro !== 'todos' && (
                <span className="bg-white text-gray-800 px-2 py-0.5 rounded-full font-medium flex flex-row-reverse items-center mr-1 border border-gray-300 shrink-0" style={{ minHeight: '28px', position: 'relative' }}>
                  <button
                    className="static text-gray-700 rounded-full p-0.5 flex items-center justify-center ml-2 hover:bg-gray-100"
                    style={{ width: '16px', height: '16px', fontSize: '12px', lineHeight: '12px', marginLeft: '8px', background: 'none' }}
                    onClick={() => setEstadoFiltro('todos')}
                    tabIndex={0}
                    aria-label="Quitar filtro estado"
                  >
                    <Close style={{ fontSize: '12px' }} />
                  </button>
                  Estado: {(() => {
                    const estado = estadosOpciones.find(e => e.value == estadoFiltro);
                    return estado ? estado.label : estadoFiltro;
                  })()}
                </span>
              )}
            </div>
            {/* Botón de filtros fijo a la derecha */}
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
                {/* Input Fecha Inicio */}
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
                {/* Input Fecha Fin */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Fecha Fin</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                {/* Select de bodegas */}
                <div>
                  <label htmlFor="bodega-select" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Bodega
                  </label>
                  <select
                    id="bodega-select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                <div>
                  <label htmlFor="vendedor-select" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Buscar por Vendedor
                  </label>
                  <select
                    id="vendedor-select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Select de tipo cliente */}
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
                {/* Select de tipo encuesta */}
                <div>
                  <label htmlFor="tipo-encuesta-select" className="block text-gray-700 font-semibold mb-2 text-sm">
                    Tipo Encuesta
                  </label>
                  <select
                    id="tipo-encuesta-select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
      <div className="px-6 py-6">
        {/* Sección de tarjetas métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


          {/* Vendedores involucrados */}
          <div className="bg-white p-3 rounded-lg shadow border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Vendedores involucrados</p>
                <h2 className="text-xl font-bold text-gray-900">{uniqueVendedores}</h2>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <People className="text-green-600 text-lg" />
              </div>
            </div>
          </div>

          {/* Total solicitudes */}
          <div className="bg-white p-3 rounded-lg shadow border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Número de solicitudes de crédito
                </p>
                <h2 className="text-xl font-bold text-gray-900">{totalSolicitudes}</h2>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <MonetizationOn className="text-blue-600 text-lg" />
              </div>
            </div>
          </div>

          {/* Total aprobadas vs rechazadas */}
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200 hover:shadow-lg transition-shadow col-span-1 sm:col-span-2">
            <p className="text-sm font-semibold text-gray-700 mb-4">Facturados vs Rechazadas</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {estadoItems.map((item, index) => (
                <div
                  key={index}
                  className={`text-center p-3 rounded-lg ${item.styles.bg} ${item.styles.border} shadow-sm`}
                >
                  <div className="flex items-center justify-center mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.styles.dot} mr-2`}></span>
                    <span className={`text-xs font-medium ${item.styles.text}`}>{item.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${item.styles.value}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Sección de gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Número de solicitudes de crédito por Almacén</h3>
            <div className="h-80">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                      grid: { display: false }
                    },
                    y: {
                      stacked: true,
                      grid: { color: '#f3f4f6' }
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Solicitudes de crédito por Estado</h3>
            <div className="h-80 flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Gráficos adicionales en fila inferior: día de la semana, productos más solicitados y situación laboral */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Día de la semana */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Solicitudes por Día de la Semana</h3>
            <div className="h-64">
              <Bar
                data={barDiasSemanaData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
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
                      grid: { display: false }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Cantidad',
                      },
                      beginAtZero: true,
                      grid: { color: '#f3f4f6' },
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Productos más solicitados */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Productos más solicitados</h3>
            <div className="h-64">
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
                      grid: { color: '#f3f4f6' },
                      pointLabels: {
                        font: { size: 12 },
                      },
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Situación Laboral */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Situación Laboral</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center w-full justify-center">
                <div style={{ width: 140, height: 140, position: 'relative', zIndex: 0 }}>
                  <Doughnut
                    data={doughnutSituacionLaboralData}
                    options={{
                      maintainAspectRatio: false,
                      cutout: '60%',
                      borderWidth: 8,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          xPadding: 16,
                          yPadding: 8,
                          padding: 12,
                          caretPadding: 10,
                          displayColors: true,
                          boxWidth: 16,
                          boxHeight: 16,
                          boxPadding: 10,
                          callbacks: {},
                          // Para Chart.js v3+, usar 'padding' y 'caretPadding'
                          padding: 12,
                          caretPadding: 10,
                        },
                      },
                      elements: {
                        arc: {
                          borderWidth: 8,
                          borderColor: '#fff',
                          spacing: 4,
                        },
                      },
                    }}
                    plugins={[
                      // Modifica el plugin para el texto central para que tenga zIndex bajo
                      {
                        ...doughnutCenterText,
                        beforeDraw: (chart) => {
                          if (doughnutCenterText && doughnutCenterText.beforeDraw) {
                            // Llama el original pero baja el z-index del texto central
                            const ctx = chart.ctx;
                            ctx.save();
                            ctx.globalCompositeOperation = 'destination-over';
                            doughnutCenterText.beforeDraw(chart);
                            ctx.restore();
                          }
                        }
                      }
                    ]}
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

        {/* Fila separada para el gráfico PolarArea de tipo de cliente */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Solicitudes por Tipo de Cliente</h3>
            <div className="h-80 flex items-center justify-center">
              <PolarArea
                data={polarTipoClienteData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    },
                    tooltip: {
                      enabled: true,
                    },
                  },
                  scales: {
                    r: {
                      angleLines: { display: true },
                      suggestedMin: 0,
                      grid: { color: '#f3f4f6' },
                      pointLabels: {
                        font: { size: 14 },
                      },
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

