import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Paper,
  TextField,
  Grow,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Contenido de cada pestaña
const TabContent = ({ children }) => (
  <Grow in={true} timeout={300}>
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: { xs: 350, sm: 900 },
        padding: 3,
        margin: "0 auto",
      }}
    >
      <Grid container spacing={1}>
        {children}
      </Grid>
    </Paper>
  </Grow>
);

export function GestorOperadora() {
  // Estado para controlar la pestaña activa
  const { enqueueSnackbar } = useSnackbar();
  const [dato, setDato] = useState([]);
  useEffect(() => {
    fetchDato();
  }, []);

  const fetchDato = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://192.168.5.248:3008/api/v1/cre-verificacion-telefonica",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDato(response.data);
    } catch (error) {
      enqueueSnackbar("Error fetching Dato: " + error.message, {
        variant: "error",
      });
    }
  };

  // Llamar a la API cuando el componente se monte

  // Validaciones
  const validateForm = () => {
    const {
      tipoReferencia,
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      parentezco,
      telefonoDomicilio,
      telefonoCelular,
    } = formData;
    if (!tipoReferencia) {
      enqueueSnackbar("Seleccione el tipo de referencia.", {
        variant: "error",
      });
      return false;
    }
    if (apellidoPaterno.length < 5) {
      enqueueSnackbar("El apellido paterno debe tener al menos 5 caracteres.", {
        variant: "error",
      });
      return false;
    }
    if (apellidoMaterno.length < 5) {
      enqueueSnackbar("El apellido materno debe tener al menos 5 caracteres.", {
        variant: "error",
      });
      return false;
    }
    if (nombres.length < 5) {
      enqueueSnackbar("Los nombres deben tener al menos 5 caracteres.", {
        variant: "error",
      });
      return false;
    }
    if (!parentezco) {
      enqueueSnackbar("Seleccione el parentezco.", { variant: "error" });
      return false;
    }
    if (!/^[0-9]{10,}$/.test(telefonoDomicilio)) {
      enqueueSnackbar(
        "El teléfono de domicilio debe tener al menos 10 dígitos.",
        { variant: "error" }
      );
      return false;
    }
    if (!/^[0-9]{10,}$/.test(telefonoCelular)) {
      enqueueSnackbar("El teléfono celular debe tener al menos 10 dígitos.", {
        variant: "error",
      });
      return false;
    }
    if (!formData.respuestaVT) {
      enqueueSnackbar("Seleccione una opción para la respuesta VT.", {
        variant: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleGuardar();
    }
  };

  const [value, setValue] = React.useState(0);

  // Función para manejar el cambio de pestaña
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Estado para los campos de la pestaña "Referencias del Cliente"
  const [formData, setFormData] = useState({
    tipoReferencia: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    parentezco: "",
    telefonoDomicilio: "",
    telefonoCelular: "",
    respuestaVT: "", // Campo adicional para la tabla
  });

  // Estado para almacenar los datos guardados en la tabla
  const [dataList, setDataList] = useState([]);

  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Guardar datos en la tabla
  const handleGuardar = () => {
    setDataList((prevData) => [...prevData, formData]);
    setFormData({
      tipoReferencia: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombres: "",
      parentezco: "",
      telefonoDomicilio: "",
      telefonoCelular: "",
      respuestaVT: "", // Campo adicional para la tabla
    });
  };

  // Limpiar los campos para agregar nuevos datos
  const handleAgregar = () => {
    setFormData({
      tipoReferencia: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombres: "",
      parentezco: "",
      telefonoDomicilio: "",
      telefonoCelular: "",
      respuestaVT: "", // Campo adicional para la tabla
    });
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
      {/* Título */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Verificación Telefónica
      </h1>

      {/* Pestañas */}
      <Box
        sx={{
          maxWidth: { xs: 320, sm: 700 },
          bgcolor: "background.paper",
          margin: "0 auto",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={true}
          aria-label="scrollable prevent tabs example"
          sx={{
            '& .Mui-selected': {
              backgroundColor: '#2D3689', // Color fondo de pestaña seleccionada
              color: 'white !important', // Color letras de pestaña seleccionada
            },
            '& .MuiTabs-indicator': {
              display: 'none', // Oculta línea debajo de la pestaña seleccionada
            },
          }}
        >
          <Tab label="Datos Básicos del Cliente" />
          <Tab label="Datos Domiciliarios del Cliente" />
          <Tab label="Datos Laborales del Cliente" />
          <Tab label="Referencias del Cliente" />
        </Tabs>
      </Box>

      {/* Contenido pestañas */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        {/* Datos Básicos del Cliente */}
        {value === 0 && (
          <TabContent>
            {/* Columna 1 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nombres del Cliente"
                placeholder="Nombres del Cliente"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black', // Cambia el color del borde cuando no está enfocado
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Fecha de Nacimiento"
                placeholder="Fecha de Nacimiento"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Tipo de Cliente"
                placeholder="Tipo de Cliente"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Solicitud"
                placeholder="Solicitud"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Cédula"
                placeholder="Cédula"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Hora de Ingreso"
                placeholder="Hora de Ingreso"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
            </Grid>

            {/* Columna 2 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nombre Padre del Cliente"
                placeholder="Nombre Padre del Cliente"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Nombre Madre del Cliente"
                placeholder="Nombre Madre del Cliente"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Estado Civil"
                placeholder="Estado Civil"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Promoción Adicional"
                placeholder="Promoción Adicional"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Producto"
                placeholder="Producto"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Hora Fin de Proceso"
                placeholder="Hora Fin de Proceso"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
            </Grid>

            {/* Columna 3 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Agencia"
                placeholder="Agencia"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Usuario Ingresa"
                placeholder="Usuario Ingresa"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Usuario Gestiona"
                placeholder="Usuario Gestiona"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Verificador Físico"
                placeholder="Verificador Físico"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Formalidad"
                placeholder="Formalidad"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Tiempo Promesa"
                placeholder="Tiempo Promesa"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
            </Grid>
          </TabContent>
        )}

        {/* Datos Domiciliarios del Cliente */}
        {value === 1 && (
          <TabContent>
            {/* Columna 1 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Calle Principal"
                placeholder="Calle Principal"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Referencia"
                placeholder="Referencia"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />

              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <TextField
                  name="respuestaVT"
                  label="Respuesta VT"
                  value={formData.respuestaVT}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  margin="dense"
                  InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                  select

                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                      },
                    }, marginBottom: 1
                  }} // Ajustar el tamaño del campo

                >
                  <MenuItem value="" disabled>
                    Selecciona una opción
                  </MenuItem>
                  {dato.length > 0 &&
                    dato.map((index) => (
                      <MenuItem
                        key={index.idCre_VerificacionTelefonicaWeb}
                        value={index.idCre_VerificacionTelefonicaWeb}
                      >
                        {index.Respuesta}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
              <button
                className="rounded-full bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition"
                style={{ marginTop: "4px" }} // Alineación vertical
              >
                Enviar
              </button>
            </Grid>
            {/* Columna 2 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Numero:"
                placeholder="Numero"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Teléfono Celular"
                placeholder="Teléfono Celular"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
            </Grid>

            {/* Columna 3 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Calle Transversal"
                placeholder="Calle Transversal"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Teléfono Domicilio"
                placeholder="Teléfono Domicilio"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
            </Grid>
          </TabContent>
        )}

        {/* Datos Laborales del Cliente */}
        {value === 2 && (
          <TabContent>
            {/* Columna 1 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nombre o Razón Social de la Empresa"
                placeholder="Nombre o Razón Social de la Empresa"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Calle Principal"
                placeholder="Calle Principal"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Teléfono Celular"
                placeholder="Teléfono Celular"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />

              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <TextField
                  name="respuestaVT"
                  label="Respuesta VT"
                  value={formData.respuestaVT}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  select
                  sx={{ marginRight: 1, width: "335px" }}
                >
                  <MenuItem value="" disabled>
                    Selecciona una opción
                  </MenuItem>
                  {dato.length > 0 &&
                    dato.map((index) => (
                      <MenuItem
                        key={index.idCre_VerificacionTelefonicaWeb}
                        value={index.idCre_VerificacionTelefonicaWeb}
                      >
                        {index.Respuesta}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>

            </Grid>

            {/* Columna 2 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Actividad Económica"
                placeholder="Actividad Económica"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Numero"
                placeholder="Numero"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Teléfono Domicilio"
                placeholder="Teléfono Domicilio"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
            </Grid>

            {/* Columna 3 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Calle Transversal"
                placeholder="Calle Transversal"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <TextField
                label="Referencia"
                placeholder="Referencia"
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black',
                    },
                  }, marginBottom: 1
                }}
              />
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <TextField
                  label="Respuesta VT"
                  placeholder="Respuesta VT"
                  fullWidth
                  size="small"
                  margin="dense"
                  InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                  select
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'black',
                      },
                    }, marginBottom: 1
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecciona una opción
                  </MenuItem>
                  <MenuItem value="Opción 1">Opción 1</MenuItem>
                  <MenuItem value="Opción 2">Opción 2</MenuItem>
                  <MenuItem value="Opción 3">Opción 3</MenuItem>
                </TextField>
              </Box>
            </Grid>
            <button
              className="rounded-full bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition"
              style={{ marginTop: "4px" }} // Alineación vertical
            >Enviar</button>
          </TabContent>
        )}

        {/* Referencias del Cliente */}
        {value === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Columnas con campos */}
            <TabContent>
              <Grid container spacing={2}>
                {/* Tipo de Referencia */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="tipoReferencia"
                    label="Tipo de Referencia"
                    value={formData.tipoReferencia}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                    select
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                        },
                      }, marginBottom: 1
                    }}
                  >
                    <MenuItem value="" disabled>
                      Selecciona una opción
                    </MenuItem>
                    <MenuItem value="Familiar">Familiar</MenuItem>
                    <MenuItem value="Amistad">Amistad</MenuItem>
                  </TextField>
                </Grid>

                {/* Apellido Paterno */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="apellidoPaterno"
                    label="Apellido Paterno"
                    value={formData.apellidoPaterno}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                        },
                      }, marginBottom: 1
                    }}
                  />
                </Grid>

                {/* Apellido Materno */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="apellidoMaterno"
                    label="Apellido Materno"
                    value={formData.apellidoMaterno}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                        },
                      }, marginBottom: 1
                    }}
                  />
                </Grid>

                {/* Nombres */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="nombres"
                    label="Nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                        },
                      }, marginBottom: 1
                    }}
                  />
                </Grid>

                {/* Parentezco */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="parentezco"
                    label="Parentezco"
                    value={formData.parentezco}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    displayEmpty
                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                    select
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                        },
                      }, marginBottom: 1
                    }}
                  >
                    <MenuItem value="" disabled>
                      Selecciona una opción
                    </MenuItem>
                    <MenuItem value="Padre/Madre">Padre/Madre</MenuItem>
                    <MenuItem value="Hermano/Hermana">Hermano/Hermana</MenuItem>
                    <MenuItem value="Tío/Tía">Tío/Tía</MenuItem>
                    <MenuItem value="Primo/Prima">Primo/Prima</MenuItem>
                    <MenuItem value="Abuela/Abuelo">Abuela/Abuelo</MenuItem>
                    <MenuItem value="Hija/Hijo">Hija/Hijo</MenuItem>
                    <MenuItem value="Amiga/Amigo">Amiga/Amigo</MenuItem>
                  </TextField>
                </Grid>
                {/* Teléfono Celular */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telefonoCelular"
                    label="Teléfono Celular"
                    value={formData.telefonoCelular}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                        },
                      }, marginBottom: 1
                    }}
                    inputProps={{
                      inputMode: 'numeric', // Activa el teclado numérico en dispositivos móviles
                      pattern: '[0-9]*', // Acepta solo números
                    }}
                  />
                </Grid>
                {/* Teléfono Domicilio */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telefonoDomicilio"
                    label="Teléfono Domicilio"
                    value={formData.telefonoDomicilio}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    margin="dense"
                    InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                        },
                      }, marginBottom: 1
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <TextField
                      name="respuestaVT"
                      label="Respuesta VT"
                      value={formData.respuestaVT}
                      onChange={handleInputChange}
                      fullWidth
                      size="small"
                      margin="dense"
                      InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                      select
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'black',
                          },
                        }, marginBottom: 1
                      }}
                    >
                      <MenuItem value="" disabled>
                        Selecciona una opción
                      </MenuItem>
                      {dato.length > 0 &&
                        dato.map((index) => (
                          <MenuItem
                            key={index.idCre_VerificacionTelefonicaWeb}
                            value={index.idCre_VerificacionTelefonicaWeb}
                          >
                            {index.Respuesta}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </Grid>
              </Grid>
            </TabContent>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleSubmit}
                className="rounded-full bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition"
                style={{ marginTop: "4px" }}>
                Guardar
              </button>

              <button
                onClick={handleAgregar}
                className="rounded-full bg-gray-400 text-white px-6 py-2.5 hover:bg-gray-500 transition"
                style={{ marginTop: "4px" }}>
                Agregar
              </button>

              <button
                className="rounded-full bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition"
                style={{ marginTop: "4px" }}>
                Enviar
              </button>
            </Box>

            {/* Tabla de datos guardados */}
            <TableContainer
              component={Paper}
              sx={{ marginTop: 3, width: "100%" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo de Referencia</TableCell>
                    <TableCell>Apellido Paterno</TableCell>
                    <TableCell>Apellido Materno</TableCell>
                    <TableCell>Nombres</TableCell>
                    <TableCell>Parentezco</TableCell>
                    <TableCell>Teléfono Celular</TableCell>
                    <TableCell>Teléfono Domicilio</TableCell>
                    <TableCell>Respuesta VT</TableCell>{" "}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataList.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.tipoReferencia}</TableCell>
                      <TableCell>{data.apellidoPaterno}</TableCell>
                      <TableCell>{data.apellidoMaterno}</TableCell>
                      <TableCell>{data.nombres}</TableCell>
                      <TableCell>{data.parentezco}</TableCell>
                      <TableCell>{data.telefonoDomicilio}</TableCell>
                      <TableCell>{data.telefonoCelular}</TableCell>
                      <TableCell>{data.respuestaVT}</TableCell>{" "}
                      {/* Mostrar Respuesta VT */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </div>
  );
}