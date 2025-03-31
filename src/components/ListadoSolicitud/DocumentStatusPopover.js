import React from "react";
import { Popover, Box, Typography } from "@mui/material";

const DocumentStatusPopover = ({ open, anchorEl, onClose, clienteEstados, estadoColores }) => {

  const obtenerEstadoVerificacion = (estado) => {
    // Definir los estados según el Tipo
    const estadosPorTipo = {
      1: { 1: "Pendiente", 2: "Cliente", 3: "Domicilio", 4: "Conyuge" , 5: "Referencias" , 6:"Negocios" , 7: "Dependiente" , 8:"Informacion De Credito" ,9: "Factores De Credito" , 10:"Completado" }, // Tipo 1: Documental
      2: { 1: "Pendiente", 2: "En Revisión", 3: "Aprobado", 4: "Rechazado" }, // Tipo 2: Otra categoría
      3: { 1: "Proceso", 2: "Revision", 3: "Correcion", 4: "Aprobacion" , 5:"Rechazar "}, // Tipo 3: Otro caso
    };
  
    // Buscar el estado correspondiente según Tipo e idEstadoVerificacionDocumental
    return estadosPorTipo[estado.Tipo]?.[estado.idEstadoVerificacionDocumental] || "Desconocido";
  };
  
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        sx: {
          borderRadius: 8,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #dcdcdc",
          padding: 2,
        },
      }}
    >
      <Box
        sx={{
          width: "350px",
          padding: 2,
          borderRadius: 8,
          backgroundColor: "#f7f9fb",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#2d3689",
            marginBottom: 1,
          }}
        >
          Historial de Revisión 
        </Typography>

        <Box sx={{ marginTop: 2 }}>
          {clienteEstados.map((estado) => (
            <Box
              key={estado.idTiempoSolicitudesWeb}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                padding: "10px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box
                sx={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: estadoColores[estado.idEstadoVerificacionDocumental],
                  marginRight: "10px",
                }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#333" }}>
                  {obtenerEstadoVerificacion(estado)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#777" }}>
                  <strong>Fecha:</strong> {new Date(estado.FechaSistema).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "#777" }}>
                  <strong>Revisado por:</strong> {estado.Usuario}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Popover>
  );
};

export default DocumentStatusPopover;
