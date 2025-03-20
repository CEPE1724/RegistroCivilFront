import React, { useEffect, useState } from "react";
import { MonetizationOn, People, ShoppingCart, ConfirmationNumber } from "@mui/icons-material";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { APIURL } from '../../configApi/apiConfig';
import axios from "axios";

Chart.register(...registerables);

export function Dashboards() {
  const [doughnutData, setDoughnutData] = useState({
    labels: ["Pendiente", "Aprobado", "Anulado", "Rechazado"],
    datasets: [{ data: [0, 0, 0, 0], backgroundColor: ["#007bff", "#00c853", "#ffab00", "#ff3d00"] }],
  });

  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchSolicitudes = async (fechaInicio, fechaFin) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(APIURL.getCreSolicitudCredito(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 100,
          fechaInicio,
          fechaFin
        },
      });

      if (response.status === 200) {
        const estadoCounts = { PENDIENTE: 0, APROBADO: 0, ANULADO: 0, RECHAZADO: 0 };
        const totalRecords = response.data.total;
        setTotalSolicitudes(totalRecords); 

        response.data.data.forEach((item) => {
          if (item.Estado === 1) estadoCounts.PENDIENTE++;
          else if (item.Estado === 2) estadoCounts.APROBADO++;
          else if (item.Estado === 3) estadoCounts.ANULADO++;
          else if (item.Estado === 4) estadoCounts.RECHAZADO++;
        });

        setDoughnutData({
          labels: ["Pendiente", "Aprobado", "Anulado", "Rechazado"],
          datasets: [
            {
              data: [estadoCounts.PENDIENTE, estadoCounts.APROBADO, estadoCounts.ANULADO, estadoCounts.RECHAZADO],
              backgroundColor: ["#007bff", "#00c853", "#ffab00", "#ff3d00"],
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Solo llamar a fetchSolicitudes si las fechas son válidas
    if (fechaInicio && fechaFin) {
      fetchSolicitudes(fechaInicio, fechaFin);
    }
  }, [fechaInicio, fechaFin]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Sección de filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <input
            type="date"
            className="p-2 w-full rounded border border-gray-300"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            className="p-2 w-full rounded border border-gray-300"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={() => fetchSolicitudes(fechaInicio, fechaFin)}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filtrar
          </button>
        </div>
      </div>

      {/* Sección de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Número de solicitudes de crédito</p>
              <h2 className="text-xl font-semibold">{totalSolicitudes}</h2>
              <p className="text-green-500">+4.4%</p>
            </div>
            <div className="text-4xl text-blue-600"><MonetizationOn /></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">USERS</p>
              <h2 className="text-xl font-semibold">50,021</h2>
              <p className="text-green-500">+2.6%</p>
            </div>
            <div className="text-4xl text-green-500"><People /></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">ORDERS</p>
              <h2 className="text-xl font-semibold">45,021</h2>
              <p className="text-green-500">+3.1%</p>
            </div>
            <div className="text-4xl text-orange-500"><ShoppingCart /></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">TICKETS</p>
              <h2 className="text-xl font-semibold">20,516</h2>
              <p className="text-green-500">+3.1%</p>
            </div>
            <div className="text-4xl text-red-500"><ConfirmationNumber /></div>
          </div>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Bar Chart</h3>
          <Bar data={{ labels: ["Jan", "Feb", "Mar"], datasets: [{ label: "Sales", data: [10, 20, 30], backgroundColor: "#007bff" }] }} />
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Doughnut Chart</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
