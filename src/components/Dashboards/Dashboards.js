import React, { useEffect, useState } from "react";
import { MonetizationOn, People, ShoppingCart, ConfirmationNumber } from "@mui/icons-material";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { APIURL } from '../../configApi/apiConfig';
import axios from "axios";
import { TextField, Grid, Box, Typography, Paper, Button } from "@mui/material";
import { DatePicker } from '@mui/lab';


Chart.register(...registerables);


// Datos para las tarjetas
const stats = [
  { label: "Numero de solicitudes de credito", value: "$30,000", icon: <MonetizationOn />, growth: "+4.4%" },
  { label: "USERS", value: "50,021", icon: <People />, growth: "+2.6%" },
  { label: "ORDERS", value: "45,021", icon: <ShoppingCart />, growth: "+3.1%" },
  { label: "TICKETS", value: "20,516", icon: <ConfirmationNumber />, growth: "+3.1%" },
];

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
          fechaInicio,  // Pasamos las fechas como parámetros
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
    <Box sx={{ p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

          {/* Sección de filtro de fechas */}
 {/* Sección de filtros */}
 <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            label="Fecha Inicio"
            variant="outlined"
            fullWidth
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            label="Fecha Fin"
            variant="outlined"
            fullWidth
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => fetchSolicitudes(fechaInicio, fechaFin)}
          >
            Filtrar
          </Button>
        </Grid>
      </Grid>


      {/* Sección de tarjetas */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle2">Número de solicitudes de crédito</Typography>
              <Typography variant="h6">{totalSolicitudes}</Typography> {/* Aquí se muestra el total */}
              <Typography color="green">+4.4%</Typography>
            </Box>
            <Box sx={{ fontSize: 30 }}><MonetizationOn /></Box>
          </Paper>
        </Grid>

        {/* Otras tarjetas (Usuarios, Órdenes, Tickets) */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle2">USERS</Typography>
              <Typography variant="h6">50,021</Typography>
              <Typography color="green">+2.6%</Typography>
            </Box>
            <Box sx={{ fontSize: 30 }}><People /></Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle2">ORDERS</Typography>
              <Typography variant="h6">45,021</Typography>
              <Typography color="green">+3.1%</Typography>
            </Box>
            <Box sx={{ fontSize: 30 }}><ShoppingCart /></Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle2">TICKETS</Typography>
              <Typography variant="h6">20,516</Typography>
              <Typography color="green">+3.1%</Typography>
            </Box>
            <Box sx={{ fontSize: 30 }}><ConfirmationNumber /></Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Sección de gráficos */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Bar Chart</Typography>
            <Bar data={{ labels: ["Jan", "Feb", "Mar"], datasets: [{ label: "Sales", data: [10, 20, 30], backgroundColor: "#007bff" }] }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Doughnut Chart</Typography>
            <Doughnut data={doughnutData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}