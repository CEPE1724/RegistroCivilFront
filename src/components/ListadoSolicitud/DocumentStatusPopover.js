import React from "react";
import { Popover, Box, Typography } from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import PhoneIcon from "@mui/icons-material/Phone";
import { green, blue, red, yellow, grey } from '@mui/material/colors';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

const DocumentStatusPopover = ({ open, anchorEl, onClose, clienteEstados }) => {

  const obtenerEstadoVerificacion = (estado) => {
    // Definir los estados según el Tipo de solicitud de crédito
    const estadosPorTipo = {
      1: { // Documental
        1: { label: "Pendiente", icon: <SupervisorAccountIcon />, color: grey[500] },
        2: { label: "Datos Cliente", icon: <BusinessIcon />, color: blue[500] },
        3: { label: "Domicilio", icon: <FolderIcon />, color: green[500] },
        4: { label: "Conyuge", icon: <PhoneIcon />, color: yellow[500] },
        5: { label: "Referencias", icon: <EventIcon />, color: red[500] },
        6: { label: "Negocios", icon: <EventIcon />, color: grey[600] },
        7: { label: "Dependiente", icon: <EventIcon />, color: blue[600] },
        8: { label: "Información De Crédito", icon: <EventIcon />, color: green[600] },
        9: { label: "Factores De Crédito", icon: <PhoneIcon />, color: yellow[600] },
        10: { label: "Completado", icon: <PhoneIcon />, color: green[500] },
      },
      2: { // Verificación
        1: { label: "Pendiente", icon: <SupervisorAccountIcon />, color: grey[500] },
        2: { label: "En Revisión", icon: <CheckCircleIcon />, color: green[500] },
        3: { label: "Aprobado", icon: <VerifiedIcon />, color: blue[500] },
        4: { label: "Rechazado", icon: <InfoIcon />, color: red[500] },
      },
      3: { // Procesos
        1: { label: "Procesos", icon: <SupervisorAccountIcon />, color: grey[500] },
        2: { label: "Revisión", icon: <SupervisorAccountIcon />, color: grey[500] },
        3: { label: "Corrección", icon: <SupervisorAccountIcon />, color: grey[500] },
        4: { label: "Aprobación", icon: <VerifiedIcon />, color: blue[500] },
        5: { label: "Rechazo", icon: <InfoIcon />, color: red[500] },
      }
    };

    // Buscar el estado correspondiente según el tipo de solicitud y estado
    return estadosPorTipo[estado.Tipo]?.[estado.idEstadoVerificacionDocumental] || { label: "Desconocido", icon: null, color: grey[500] };
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
          borderRadius: 12, // Alineación más suave
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Sombra más sutil
          border: "1px solid #e0e0e0", // Borde más suave
          padding: 2,
        },
      }}
    >
      <Box
        sx={{
          width: "400px", // Ancho un poco mayor para mayor espacio
          padding: 3,
          borderRadius: 12,
          backgroundColor: "#f8f9fa", // Color de fondo suave
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "500",
            color: "#333",
            marginBottom: 2,
            textAlign: "center", // Centrado de título
          }}
        >
          Historial de Revisión
        </Typography>

        {/* Línea de tiempo */}
        <Timeline position="alternate">
          {clienteEstados.map((estado) => {
            const { label, icon, color } = obtenerEstadoVerificacion(estado);

            return (
              <TimelineItem key={estado.idTiempoSolicitudesWeb}>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0', fontSize: '0.75rem', color: "#757575" }}
                >
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    {new Date(estado.FechaSistema).toLocaleString()}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: color }} />
                  <TimelineDot sx={{ bgcolor: color, borderRadius: '50%' }}>
                    {icon}
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: color }} />
                </TimelineSeparator>

                <TimelineContent sx={{ py: 2, px: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#616161",
                      fontSize: "0.8rem",
                    }}
                  >
                    {estado.Usuario}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Box>
    </Popover>
  );
};

export default DocumentStatusPopover;
