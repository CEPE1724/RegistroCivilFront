import React, { useEffect, useState } from "react";
import {
  MonetizationOn,
  People,
  ShoppingCart,
  ConfirmationNumber,
} from "@mui/icons-material";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { APIURL } from "../../configApi/apiConfig";
import useBodegaUsuario from "../../hooks/useBodegaUsuario";
import { useAuth } from "../AuthContext/AuthContext";

import axios from "../../configApi/axiosConfig";
Chart.register(...registerables);

export function Dashboards() {

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
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);

// ✅ Agregar estas líneas para el rango de 15 días
const date15DaysAgo = new Date();
date15DaysAgo.setDate(date15DaysAgo.getDate() - 15);
const date15DaysAgoStr = date15DaysAgo.toISOString().split("T")[0];

// ✅ Cambiar estos estados
const [fechaInicio, setFechaInicio] = useState(date15DaysAgoStr); // Cambiar de today a date15DaysAgoStr
const [fechaFin, setFechaFin] = useState(today);
  const [selectedBodega, setSelectedBodega] = useState("todos");
  const { data, loading, error, fetchBodegaUsuario } = useBodegaUsuario();
  const { userData, idMenu } = useAuth();

  

  const [bodegass, setBodegass] = useState([]);

  const bodegas = data || [];  // Safely access the bodegas data


  useEffect(() => {
    if (userData && userData.idUsuario) {
      fetchBodega(); // Llamar a la API para obtener las bodegas
    }
  }, [userData]);

  const handleBodegaChange = (event) => {
    setSelectedBodega(event.target.value);
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
      // Si selectedBodega es "todos", pasar un array vacío (esto también se puede ajustar según el comportamiento deseado)
      if (selectedBodega !== "todos") {
        // Si selectedBodega tiene un valor específico, tomarlo como un array
        bodegasId = [selectedBodega];
      } else {
        // Si es "todos", se puede pasar un array vacío o la lógica que desees
        bodegasId = bodegasIds; // Aquí se asigna el array de bodegas
      }

      const token = localStorage.getItem("token");
      
      // ✅ Usar siempre fechaInicio y fechaFin del estado, no parámetros
      const params = {
        limit: 100,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        bodega: bodegasId,
        estado: estadoFiltro === "todos" ? 0 : parseInt(estadoFiltro),
      };
      
      // Agregar timestamp para identificar cada llamada
      const timestamp = new Date().toISOString();
      
      const response = await axios.get(APIURL.getCreSolicitudCredito(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      if (response.status === 200) {

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

        const bodegaCounts = {}; // Para contar total por bodega
        const bodegaEstadoCounts = {}; // Para contar por bodega y estado
        const vendedoresSet = new Set(); // Para contar vendedores únicos

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
          
          // Contamos las solicitudes por bodega
          const bodegaId = item.Bodega;
          if (bodegaCounts[bodegaId]) {
            bodegaCounts[bodegaId]++;
          } else {
            bodegaCounts[bodegaId] = 1;
          }

          // Contamos por bodega y estado para el gráfico de barras
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
        });

        setUniqueVendedores(vendedoresSet.size); // Guardamos la cantidad de vendedores únicos

        // Si hay un filtro de estado específico, ajustar los datos del gráfico circular
        let doughnutLabels = [];
        let doughnutValues = [];
        let doughnutColors = [];

        if (estadoFiltro === "todos") {
          // Mostrar todos los estados
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
          doughnutColors = ["#3b82f6", "#10b981", "#6b7280", "#ef4444", "#f59e0b", "#059669", "#dc2626"]; // ✅ Colores más representativos
        } else {
          // Mostrar solo el estado filtrado
          const estadoSeleccionado = estadosOpciones.find(e => e.value == estadoFiltro);
          if (estadoSeleccionado) {
            doughnutLabels = [estadoSeleccionado.label];
            doughnutValues = [totalRecords]; // Usar el total de registros
            // Asignar el color correspondiente según el estado
            const colorMap = {
              1: "#3b82f6", // PRE-APROBADO (azul)
              2: "#10b981", // APROBADO (verde esmeralda)
              3: "#6b7280", // ANULADO (gris)
              4: "#ef4444", // RECHAZADO (rojo)
              5: "#f59e0b", // NO APLICA (amarillo/naranja)
              6: "#059669", // FACTURADO (verde oscuro)
              7: "#dc2626", // RECHAZADO-LN (rojo oscuro)
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
        
        // Crear datos para el gráfico de barras apiladas
        const bodegaLabels = Object.keys(bodegaCounts).map((codigo) => {
          const bodegaEncontrada = bodegas.find((b) => b.b_Bodega === Number(codigo));
          return bodegaEncontrada ? bodegaEncontrada.b_Nombre : `Bodega ${codigo}`;
        });

        // Crear datasets para cada estado
        const estadosParaBarras = [
          { key: 'PENDIENTE', label: 'PRE-APROBADO', color: '#3b82f6' }, // ✅ Azul
          { key: 'APROBADO', label: 'APROBADO', color: '#10b981' }, // ✅ Verde esmeralda
          { key: 'ANULADO', label: 'ANULADO', color: '#6b7280' }, // ✅ Gris
          { key: 'RECHAZADO', label: 'RECHAZADO', color: '#ef4444' }, // ✅ Rojo
          { key: 'NO_APLICA', label: 'NO APLICA', color: '#f59e0b' }, // ✅ Amarillo/naranja
          { key: 'FACTURADO', label: 'FACTURADO', color: '#059669' }, // ✅ Verde oscuro
          { key: 'RECHAZADO_LN', label: 'RECHAZADO-LN', color: '#dc2626' }, // ✅ Rojo oscuro
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
  }, [fechaInicio, fechaFin, selectedBodega, estadoFiltro, bodegas]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Sección de filtros */}
      {/* Contenedor de los filtros y botón alineados en una sola fila */}
      <div className="flex flex-col md:flex-row items-center gap-4">

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

        {/* Input Fecha Inicio */}
        <div className="w-full md:w-1/4">
          <label className="block text-gray-700 font-semibold mb-1">Fecha Inicio</label>
          <input
            type="date"
            className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fechaInicio}
            onChange={(e) => {
              const nuevaFechaInicio = e.target.value;

              // Validar que la fecha de inicio sea válida
              if (isValidDate(nuevaFechaInicio)) {
                setFechaInicio(nuevaFechaInicio);
              } else {
                // Si la fecha es inválida, se asigna la fecha de hoy
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Detalles gráfico de barras</h3>
          <Bar 
            data={barData} 
            options={{
              responsive: true,
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
          />
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Detalles diagrama de pastel</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

