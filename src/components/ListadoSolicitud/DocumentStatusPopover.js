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
import { green, blue, red, yellow, grey, purple, orange, teal, amber } from '@mui/material/colors';
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
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FaceIcon from "@mui/icons-material/Face";
import ErrorIcon from "@mui/icons-material/Error";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


const DocumentStatusPopover = ({ open, anchorEl, onClose, clienteEstados }) => {

  const obtenerEstadoVerificacion = (estado) => {
    // Definir los estados según el Tipo de solicitud de crédito

    const estadosPorTipo = {
      1: { // Solicitud Grande
        1: { label: "Pendiente", icon: <SupervisorAccountIcon />, color: grey[500] },
        2: { label: "Datos Cliente", icon: <PersonIcon />, color: blue[500] },
        3: { label: "Domicilio", icon: <HomeIcon />, color: green[500] },
        4: { label: "Cónyuge", icon: <FavoriteIcon />, color: purple[300] },
        5: { label: "Referencias", icon: <ContactsIcon />, color: orange[500] },
        6: { label: "Negocios", icon: <StorefrontIcon />, color: teal[600] },
        7: { label: "Dependiente", icon: <ChildCareIcon />, color: blue[300] },
        8: { label: "Información de Crédito", icon: <CreditScoreIcon />, color: green[700] },
        9: { label: "Factores de Crédito", icon: <AssessmentIcon />, color: yellow[700] },
        10: { label: "Revisión", icon: <CheckCircleIcon />, color: blue[600] },
        11: { label: "Corrección", icon: <EditNoteIcon />, color: orange[600] },
        12: { label: "Aprobado", icon: <VerifiedIcon />, color: green[700] },
        13: { label: "Rechazado", icon: <BlockIcon />, color: red[600] },
        14: { label: "Foto", icon: <PhotoCameraIcon />, color: grey[700] },
        15: { label: "Creación de Prefactura", icon: <SettingsIcon />, color: grey[600] },
        16: { label: "Anulación de Prefactura", icon: <CancelIcon />, color: red[500] },
        17: { label: "Aprobación Prefactura", icon: <VerifiedIcon />, color: green[600] },
        18: { label: "Rechazo Prefactura", icon: <CancelIcon />, color: red[700] },
        19: { label: "Facturado", icon: <CheckCircleIcon />, color: green[800] },
        20: { label: "Verificación Facial Exitosa", icon: <FaceIcon />, color: green[600] },
        21: { label: "Verificación Facial Fallida", icon: <ErrorIcon />, color: red[600] },
        22: { label: "Creación de Cliente", icon: <PersonAddIcon />, color: yellow[600] },
        23: { label: "Por Caducidad", icon: <ErrorIcon />, color: orange[500] },
        24: { label: "Registro Duplicado", icon: <SearchIcon />, color: amber[700] },
        25: { label: "Excepción Domicilio", icon: <HomeIcon />, color: teal[500] },
        26: { label: "Actualizar Cuota/Cupo", icon: <AutorenewIcon />, color: orange[600] },


        /*11: "CORRECIÓN",
        12: "APROBADO",
        13: "RECHAZADO",*/
      },
      2: { // Telefónica
        1: { label: "No asignado", icon: <PersonOffIcon />, color: grey[500] },         // Sin operador asignado
        2: { label: "Asignado", icon: <PersonSearchIcon />, color: green[400] },        // Operador asignado
        3: { label: "Aprobado", icon: <CallMadeIcon />, color: green[600] },            // Llamada realizada y aprobada
        4: { label: "Rechazado", icon: <CallEndIcon />, color: red[500] },              // Rechazado tras contacto
        5: { label: "Gestionado", icon: <PhoneInTalkIcon />, color: blue[500] },        // Gestión realizada con llamada
        7: { label: "Corrección", icon: <EditNoteIcon />, color: orange[600] }          // Requiere corrección
      },

      3: { // Revisión Documental de Crédito
        1: {
          label: "Carga de Documentos",
          icon: <UploadFileIcon />,
          color: "rgb(117, 117, 117)" // grey[600] = #757575
        },
        2: {
          label: "En Revisión",
          icon: <FactCheckIcon />,
          color: "rgb(30, 136, 229)" // blue[600] = #1E88E5
        },
        3: {
          label: "Corrección",
          icon: <ReportProblemIcon />,
          color: "rgb(251, 140, 0)" // orange[600] = #FB8C00
        },
        4: {
          label: "Aprobado",
          icon: <CheckCircleIcon />,
          color: "rgb(56, 142, 60)" // green[700] = #388E3C
        },
        5: {
          label: "Rechazado",
          icon: <HighlightOffIcon />,
          color: "rgb(211, 47, 47)" // red[700] = #D32F2F
        }
      },

      4:  //Domicilio
      {
        1: {
          label: "Asignado",
          icon: <TwoWheelerIcon />,
          color: blue[600]   // Verde medio: indica que ya fue asignado y está en proceso
        },
        2: {
          label: "Aprobado",
          icon: <VerifiedIcon />,
          color: green[600]    // Azul más fuerte: aprobado, estado positivo
        },
        3: {
          label: "Reasignación Supervisor",
          icon: <SupervisorAccountIcon />,
          color: orange[800]  // Naranja fuerte: cambio manual por supervisor
        },
        4: {
          label: "Reasignación APP",
          icon: <AutorenewIcon />,
          color: orange[500]  // Naranja medio: reasignación automática
        },
        5: {
          label: "Rechazado",
          icon: <CancelIcon />,
          color: red[600]     // Rojo fuerte: claramente un estado negativo
        },
        6: {
          label: "Aprobación Verificación Física Analista",
          icon: <ThumbUpIcon />,
          color: green[800]    // Azul más fuerte: aprobado, estado positivo
        },
		7: {
          label: "Reasignado Verificador por Analista",
          icon: <AutorenewIcon />,
          color: orange[600]    
        }
      },

      5:  //Trabajo
      {
        1: {
          label: "Asignado",
          icon: <TwoWheelerIcon />,
          color: blue[600]
        },
        2: {
          label: "Aprobado",
          icon: <VerifiedIcon />,
          color: green[600]
        },
        3: {
          label: "Reasignación Supervisor",
          icon: <SupervisorAccountIcon />,
          color: orange[800]
        },
        4: {
          label: "Reasignación APP",
          icon: <AutorenewIcon />,
          color: orange[500]
        },
        5: {
          label: "Rechazado",
          icon: <CancelIcon />,
          color: red[600]
        },
        6: {
          label: "Aprobación Verificación Física Analista",
          icon: <ThumbUpIcon />,
          color: green[800]
        },
		7: {
          label: "Reasignado Verificador por Analista",
          icon: <AutorenewIcon />,
          color: orange[600]    
        }
      },

      6: { //// ESTADo
        1: { label: "Pre-Aprobado", icon: <SettingsIcon />, color: grey[500] },
        2: { label: "Aprobado", icon: <VerifiedIcon />, color: green[500] },
        3: { label: "Anulado", icon: <CancelIcon />, color: red[500] },
        4: { label: "Rechazado", icon: <BlockIcon />, color: red[700] },
        5: { label: "No Aplica", icon: <CancelIcon />, color: grey[700] },
        6: { label: "Facturado", icon: <CheckCircleIcon />, color: green[700] },
        7: { label: "Caducado", icon: <ErrorIcon />, color: orange[700] }
      },



      7: /// Resultado
      {
        0: { label: "No aplica", icon: <CancelIcon />, color: red[500] },
        1: { label: "APlica", icon: <VerifiedIcon />, color: blue[500] },
        2: { label: "NO TIENE DOCUMENTACIÓN COMPLETA", icon: <CancelIcon />, color: red[500] },
        3: { label: "CAMPO MALO", icon: <CancelIcon />, color: red[500] },
        4: { label: "MALAS REFERENCIAS", icon: <BlockIcon />, color: red[700] },
        5: { label: "NO CUMPLE POLÍTICA POINT", icon: <CancelIcon />, color: grey[700] },
        6: { label: "TIEMPO DE ESPERA", icon: <CancelIcon />, color: grey[700] },
        7: { label: "PRECIO ALTO", icon: <PersonOffIcon />, color: orange[700] },
        8: { label: "EN PROCESO", icon: <CheckCircleIcon />, color: green[600] },
        9: { label: "COMPRA EN EFECTIVO", icon: <InfoIcon />, color: blue[400] },
        10: { label: "CLIENTE SOLO PREGUNTO", icon: <SearchIcon />, color: amber[700] }


      },


      8: /// Resultado
      {
        1: { label: "CAMBIO", icon: <VerifiedIcon />, color: blue[500] },
        2: { label: "ASIGNADO", icon: <PersonIcon />, color: red[500] }

      },

      9: /// Resultado
      {
        1: { label: "CAMBIO", icon: <VerifiedIcon />, color: blue[500] }

      }

    };

    // Buscar el estado correspondiente según el tipo de solicitud y estado
    // Si no encuentra por idEstadoVerificacionDocumental, intenta por tipoVerificacion
    let estadoTipo = estadosPorTipo[estado.Tipo];
    let estadoObj = estadoTipo?.[estado.idEstadoVerificacionDocumental];

    // Si no encuentra, intenta con tipoVerificacion para tipo 5 (laboral)
    if (!estadoObj && estado.Tipo === 5 && typeof estado.tipoVerificacion !== "undefined") {
      estadoObj = estadoTipo?.[estado.tipoVerificacion];
    }

    return estadoObj || { label: "Desconocido", icon: null, color: grey[500] };
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
                    {(() => {
                      const esFoto = estado.Tipo === 1 && estado.idEstadoVerificacionDocumental === 14;
                      const esURL = estado.Telefono?.startsWith('http');

                      if (esFoto && esURL) {
                        return (
                          <Box>
                            <a
                              href={estado.Telefono}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#1976d2", textDecoration: "underline", fontSize: "0.75rem" }}
                            >
                              Ver imagen
                            </a>
                            <Box mt={1}>
                              <img
                                src={estado.Telefono}
                                alt="Foto"
                                style={{ maxWidth: "100px", borderRadius: "8px", border: "1px solid #ccc" }}
                              />
                            </Box>
                          </Box>
                        );
                      }

                      if ([8, 9, 1].includes(estado.Tipo)) {
                        return '' + (estado.Telefono || 'N/A');
                      }

                      return '' + (estado.Telefono || 'N/A');
                    })()}
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
