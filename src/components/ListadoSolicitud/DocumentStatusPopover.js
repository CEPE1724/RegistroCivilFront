import React from "react";
import { Popover, Box, Typography } from "@mui/material";

const DocumentStatusPopover = ({ open, anchorEl, onClose, clienteEstados, estadoColores }) => {
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
                  {estado.idEstadoVerificacionDocumental === 1 && "Revisión"}
                  {estado.idEstadoVerificacionDocumental === 2 && "Corrección"}
                  {estado.idEstadoVerificacionDocumental === 3 && "Aprobado"}
                  {estado.idEstadoVerificacionDocumental === 4 && "Finalizado"}
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
