import React from "react";
import { Popover, Box, Typography } from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green, blue, red, yellow, grey } from '@mui/material/colors';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ContactsIcon from "@mui/icons-material/Contacts";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import { PhoneCallback } from "@mui/icons-material";


const DocumentStatusPopover = ({ open, anchorEl, onClose, clienteEstados }) => {

  const obtenerEstadoVerificacion = (estado) => {
    // Definir los estados según el Tipo de solicitud de crédito
    const estadosPorTipo = {
      1: { // Documental
        1: { label: "Pendiente", icon: <SupervisorAccountIcon />, color: grey[500] },
			2: { label: "Datos Cliente", icon: <PersonIcon />, color: blue[500] },
			3: { label: "Domicilio", icon: <HomeIcon />, color: green[500] },
			4: { label: "Conyuge", icon: <FavoriteIcon />, color: yellow[500] },
			5: { label: "Referencias", icon: <ContactsIcon />, color: red[500] },
			6: { label: "Negocios", icon: <StorefrontIcon />, color: grey[600] },
			7: { label: "Dependiente", icon: <ChildCareIcon />, color: blue[600] },
			8: { label: "Información De Crédito", icon: <CreditScoreIcon />, color: green[600] },
			9: { label: "Factores De Crédito", icon: <AssessmentIcon />, color: yellow[600] },
			10: { label: "Completado", icon: <CheckCircleIcon />, color: green[500] },
        11: { label: "Corrección", icon: <EventIcon />, color: red[500] },
        12: { label: "Aprobado", icon: <VerifiedIcon />, color: blue[500] },
        13: { label: "Rechazado", icon: <InfoIcon />, color: red[500] },
        
        
        
        /*11: "CORRECIÓN",
        12: "APROBADO",
        13: "RECHAZADO",*/
      },
      2: { // Verificación
      1: { label: "No asginado", icon: <SupervisorAccountIcon />, color: grey[500] },
			2: { label: "Asignado", icon: <SearchIcon />, color: green[500] },
			3: { label: "Aprobado", icon: <VerifiedIcon />, color: blue[500] },
			4: { label: "Rechazado", icon: <CancelIcon />, color: red[500] },
      5: { label: "Gestionado", icon: <PhoneCallback />, color: grey[500] },
      },
      3: { // Procesos
        1: { label: "Procesos", icon: <SettingsIcon />, color: grey[500] },
			2: { label: "Revisión", icon: <VisibilityIcon />, color: grey[500] },
			3: { label: "Corrección", icon: <EditIcon />, color: grey[500] },
			4: { label: "Aprobación", icon: <VerifiedIcon />, color: blue[500] },
			5: { label: "Rechazo", icon: <CancelIcon />, color: red[500] },
      },
      4:
      {
       1: { label: "Pendiente", icon: <SettingsIcon />, color: grey[500] },

      },

      5: 
      {
         1: { label: "Pendiente", icon: <SettingsIcon />, color: grey[500] },

      },

      6: { //// ESTADo
        2 : { label: "Aprobado", icon: <VerifiedIcon />, color: blue[500] },
        4:{label: "REchazado" , icon: <CancelIcon/> , color: red[500]},
  

       },



      7: /// Resultado
      {
        0: { label: "No aplica", icon: <CancelIcon />, color: red[500] },
        1: { label: "APlica", icon: <VerifiedIcon />, color: blue[500] }

      } ,


       8: /// Resultado
      {
        1: { label: "CAMBIO", icon: <VerifiedIcon />, color: blue[500] }

      } ,

       9: /// Resultado
      {
        1: { label: "CAMBIO", icon: <VerifiedIcon />, color: blue[500] }

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

                   <Typography sx={{ fontSize: '0.8rem' }}>
  {([8, 9].includes(estado.Tipo))
    ? '' + (estado.Telefono || 'N/A')
    : 'asignado a ' + (estado.Telefono || 'N/A')}
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
