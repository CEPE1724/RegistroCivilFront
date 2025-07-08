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
  labels: ["PRE-APROBADO", "APROBADO", "ANULADO", "RECHAZADO", "NO APLICA", "FACTURADO", "RECHAZADO-LN"], // ✅ Cambiar aquí
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0], // ✅ Agregar más ceros
      backgroundColor: ["#007bff", "#00c853", "#ffab00", "#ff3d00", "#9c27b0", "#4caf50", "#f44336"], // ✅ Agregar más colores
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

  useEffect(() => {
    if (bodegas.length > 0 && fechaInicio && fechaFin) {
      fetchSolicitudes();
    }
  }, [bodegas, fechaInicio, fechaFin]);

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

  const fetchSolicitudes = async (fechaInicio, fechaFin, bodega) => {
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
      
      // Construir parámetros igual que en ListadoSolicitud
      const params = {
        limit: 100,
        fechaInicio,
        fechaFin,
        bodega: bodegasId,
        estado: estadoFiltro === "todos" ? 0 : parseInt(estadoFiltro), // Convertir a número
      };
      
      // Agregar timestamp para identificar cada llamada
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Parámetros enviados a la API:`, params);
      console.log(`[${timestamp}] Estado filtro actual:`, estadoFiltro);
      console.log(`[${timestamp}] Tipo de estadoFiltro:`, typeof estadoFiltro);
      console.log(`[${timestamp}] Valor de estado en params:`, params.estado);
      console.log(`[${timestamp}] Fechas:`, { fechaInicio, fechaFin });
      console.log(`[${timestamp}] Bodegas:`, bodegasId);
      
      const response = await axios.get(APIURL.getCreSolicitudCredito(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      if (response.status === 200) {
        console.log(`[${timestamp}] Respuesta de la API:`, response.data);
        console.log(`[${timestamp}] Total de registros:`, response.data.total);
        console.log(`[${timestamp}] Datos recibidos:`, response.data.data);
        console.log(`[${timestamp}] Cantidad de datos:`, response.data.data.length);

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

        const bodegaCounts = {}; // Aseguramos que siempre está definido
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
          doughnutColors = ["#007bff", "#00c853", "#ffab00", "#ff3d00", "#9c27b0", "#4caf50", "#f44336"];
        } else {
          // Mostrar solo el estado filtrado
          const estadoSeleccionado = estadosOpciones.find(e => e.value == estadoFiltro);
          if (estadoSeleccionado) {
            doughnutLabels = [estadoSeleccionado.label];
            doughnutValues = [totalRecords]; // Usar el total de registros
            // Asignar el color correspondiente según el estado
            const colorMap = {
              1: "#007bff", // PRE-APROBADO
              2: "#00c853", // APROBADO
              3: "#ffab00", // ANULADO
              4: "#ff3d00", // RECHAZADO
              5: "#9c27b0", // NO APLICA
              6: "#4caf50", // FACTURADO
              7: "#f44336", // RECHAZADO-LN
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


        const bodegaValues = Object.values(bodegaCounts);


        setBarData({
          labels: bodegaLabels,
          datasets: [
            {
              label: "Solicitudes por Bodega",
              data: bodegaValues,
              backgroundColor: "#007bff",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };








  useEffect(() => {
    // Solo llamar a fetchSolicitudes si las fechas son válidas Y las bodegas están cargadas
    if (fechaInicio && fechaFin && bodegas.length > 0) {
      fetchSolicitudes(fechaInicio, fechaFin);
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
          <h3 className="text-xl font-semibold mb-4">Detalles grafico de barras</h3>

          <Bar data={barData} />

        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Detallaes diagrama de pastel</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
