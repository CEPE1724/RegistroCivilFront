import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";
import {
  Grid,
  Paper,
  TextField,
  Grow,
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
        maxWidth: { xs: 350, sm: 1000 },
        padding: 3,
        margin: "0",
      }}
    >
      <Grid container spacing={1}>
        {children}
      </Grid>
    </Paper>
  </Grow>
);

const estiloTextField = {
  fullWidth: true,
  size: "small",
  margin: "dense",
  InputLabelProps: { shrink: true, style: { color: 'black' } },
  sx: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black',
      },
    },
    marginBottom: 1
  }
};

export function GestorOperadora() {
  // Estado para controlar la pestaña activa
  const { enqueueSnackbar } = useSnackbar();
  const [dato, setDato] = useState([]);
  const [laboralData, setLaboralData] = useState([]); //estado datos laborales
  // Estado para manejar las respuestas VT de cada fila de la pestaña datos laborales
  const [respuestaVTState, setRespuestaVTState] = useState({});

  // Función para manejar cambios en el campo Respuesta VT
  const handleRespuestaVTChange = (id, value) => {
    setRespuestaVTState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };


  useEffect(() => {
    fetchDato();
  }, []);

  const fetchDato = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = APIURL.getCreVerificacionTelefonica();
      const response = await axios.get(url,
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

  useEffect(() => {
    fetchLaboralData();
  }, []);

  const fetchLaboralData = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      setLaboralData(response.data);
    } catch (error) {
      enqueueSnackbar("Error fetching Laboral Data: " + error.message, {
        variant: "error",
      });
    }
  };


  // Validaciones
  const validateForm = () => {
    const {
      tipoReferencia,
      apellidoPaterno,
      apellidoMaterno,
      nombres,
      parentesco,
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
    if (!parentesco) {
      enqueueSnackbar("Seleccione el parentesco.", { variant: "error" });
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

  const [respVTDomicilio, setrespVTDomicilio] = useState("");  //estado respuesta VT domicilio
  // Estado para los campos de la pestaña "Referencias del Cliente"
  const [formData, setFormData] = useState({
    tipoReferencia: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    parentesco: "",
    telefonoDomicilio: "",
    telefonoCelular: "",
    respuestaVT: "",
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
    setDataList((prevData) => [...prevData, { ...formData, respuestaVT: "" },]);
    setFormData({
      tipoReferencia: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombres: "",
      parentesco: "",
      telefonoDomicilio: "",
      telefonoCelular: "",
      respuestaVT: "",
    });
  };

  // Limpiar los campos para agregar nuevos datos
  const handleAgregar = () => {
    setFormData({
      tipoReferencia: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombres: "",
      parentesco: "",
      telefonoDomicilio: "",
      telefonoCelular: "",
      respuestaVT: "",
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
                {...estiloTextField}
              />
              <TextField
                label="Fecha de Nacimiento"
                placeholder="Fecha de Nacimiento"
                {...estiloTextField}
              />
              {/* Tipo de Cliente */}
              <Grid>
                <TextField
                  name="tipoCliente"
                  label="Tipo de Cliente"
                  select
                  {...estiloTextField}
                >
                  <MenuItem value="" disabled>
                    Selecciona una opción
                  </MenuItem>
                  <MenuItem value="Recurrente">Recurrente</MenuItem>
                  <MenuItem value="Bancarizado A">Bancarizado A</MenuItem>
                  <MenuItem value="Bancarizado B">Bancarizado B</MenuItem>
                  <MenuItem value="No Bancarizado">No Bancarizado</MenuItem>
                  <MenuItem value="Credipoint">Credipoint</MenuItem>
                </TextField>
              </Grid>
              <TextField
                label="Solicitud"
                placeholder="Solicitud"
                {...estiloTextField}
              />
              <TextField
                label="Hora de Ingreso"
                placeholder="Hora de Ingreso"
                {...estiloTextField}
              />
              <TextField
                label="Verificador Físico"
                placeholder="Verificador Físico"
                {...estiloTextField}
              />
            </Grid>
            {/* Columna 2 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nombre Padre del Cliente"
                placeholder="Nombre Padre del Cliente"
                {...estiloTextField}
              />
              {/* Estado Civil */}
              <Grid>
                <TextField
                  name="Estadocivil"
                  label="Estado Civil"
                  select
                  {...estiloTextField}
                >
                  <MenuItem value="" disabled>
                    Selecciona una opción
                  </MenuItem>
                  <MenuItem value="Soltero">Soltero</MenuItem>
                  <MenuItem value="Casado">Casado</MenuItem>
                  <MenuItem value="Union libre">Union libre</MenuItem>
                  <MenuItem value="Divorciado">Divorciado</MenuItem>
                  <MenuItem value="Viudo">Viudo</MenuItem>
                </TextField>
              </Grid>
              <TextField
                label="Agencia"
                placeholder="Agencia"
                {...estiloTextField}
              />
              {/* Producto */}
              <Grid>
                <TextField
                  name="Producto"
                  label="Producto"
                  select
                  {...estiloTextField}
                >
                  <MenuItem value="" disabled>
                    Selecciona una opción
                  </MenuItem>
                  <MenuItem value="LED">LED</MenuItem>
                  <MenuItem value="Celular">Celular</MenuItem>
                  <MenuItem value="Refrigerador">Refrigerador</MenuItem>
                  <MenuItem value="Cocina">Cocina</MenuItem>
                  <MenuItem value="Computador">Computador</MenuItem>
                  <MenuItem value="Parlante">Parlante</MenuItem>
                </TextField>
              </Grid>
              <TextField
                label="Hora Fin de Proceso"
                placeholder="Hora Fin de Proceso"
                {...estiloTextField}
              />
              <TextField
                label="Tiempo Promesa"
                placeholder="Tiempo Promesa"
                {...estiloTextField}
              />
            </Grid>
            {/* Columna 3 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nombre Madre del Cliente"
                placeholder="Nombre Madre del Cliente"
                {...estiloTextField}
              />
              <TextField
                label="Cédula"
                placeholder="Cédula"
                {...estiloTextField}
              />
              <TextField
                label="Promoción Adicional"
                placeholder="Promoción Adicional"
                {...estiloTextField}
              />
              <TextField
                label="Usuario Ingresa"
                placeholder="Usuario Ingresa"
                {...estiloTextField}
              />
              <TextField
                label="Usuario Gestiona"
                placeholder="Usuario Gestiona"
                {...estiloTextField}
              />
              {/* Formalidad */}
              <Grid>
                <TextField
                  name="Formalidad"
                  label="Formalidad"
                  select
                  {...estiloTextField}
                >
                  <MenuItem value="" disabled>
                    Selecciona una opción
                  </MenuItem>
                  <MenuItem value="Asegurado">Asegurado</MenuItem>
                  <MenuItem value="Con RUC">Con RUC</MenuItem>
                  <MenuItem value="Informal">Informal</MenuItem>
                </TextField>
              </Grid>
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
                {...estiloTextField}
              />
              <TextField
                label="Referencia"
                placeholder="Referencia"
                {...estiloTextField}
              />
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <TextField
                  name="respuestaVT"
                  label="Respuesta VT"
                  value={respVTDomicilio}
                  onChange={(e) => setrespVTDomicilio(e.target.value)}
                  select
                  {...estiloTextField}
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
                style={{ marginTop: "4px" }} >Enviar</button>
            </Grid>
            {/* Columna 2 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Numero"
                placeholder="Numero"
                {...estiloTextField}
              />
              <TextField
                label="Teléfono Celular"
                placeholder="Teléfono Celular"
                {...estiloTextField}
              />
              <TextField
                label="Verificador Telefonico"
                placeholder="Verificador Telefonico"
                {...estiloTextField}
              />
            </Grid>
            {/* Columna 3 */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Calle Transversal"
                placeholder="Calle Transversal"
                {...estiloTextField}
              />
              <TextField
                label="Teléfono Domicilio"
                placeholder="Teléfono Domicilio"
                {...estiloTextField}
              />
            </Grid>
          </TabContent>
        )}

        {/* Datos Laborales del Cliente */}
        {value === 2 && (
          <Box>
            {/* Tabla de datos laborales */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre o Razón Social de la Empresa</TableCell>
                    <TableCell>Actividad Económica</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Calle Principal</TableCell>
                    <TableCell>Calle Transversal</TableCell>
                    <TableCell>Referencia</TableCell>
                    <TableCell>Teléfono Domicilio</TableCell>
                    <TableCell>Teléfono Celular</TableCell>
                    <TableCell>Respuesta VT</TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {laboralData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.company.name}</TableCell>
                      <TableCell>{item.company.bs}</TableCell>
                      <TableCell>{item.address.suite}</TableCell>
                      <TableCell>{item.address.street}</TableCell>
                      <TableCell>{item.address.zipcode}</TableCell>
                      <TableCell>{item.address.city}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>
                        {/* Campo Respuesta VT */}
                        <TextField
                          select
                          name={`respuestaVT-${item.id}`}
                          value={respuestaVTState[item.id] || ""}
                          onChange={(e) => handleRespuestaVTChange(item.id, e.target.value)}
                          fullWidth
                        >
                          {dato.length > 0 &&
                            dato.map((index) => (
                              <MenuItem key={index.Respuesta} value={index.Respuesta}>
                                {index.Respuesta}
                              </MenuItem>
                            ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        {/* Botón Enviar */}
                        <button
                          className="rounded-full bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition"
                          style={{ marginTop: "4px" }}>Enviar</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
                    select
                    {...estiloTextField}
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
                    placeholder="Apellido Paterno"
                    value={formData.apellidoPaterno}
                    onChange={handleInputChange}
                    {...estiloTextField}
                  />
                </Grid>

                {/* Apellido Materno */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="apellidoMaterno"
                    label="Apellido Materno"
                    placeholder="Apellido Materno"
                    value={formData.apellidoMaterno}
                    onChange={handleInputChange}
                    {...estiloTextField}
                  />
                </Grid>

                {/* Nombres */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="nombres"
                    label="Nombres"
                    placeholder="Nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    {...estiloTextField}
                  />
                </Grid>

                {/* Parentesco */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="parentesco"
                    label="Parentesco"
                    value={formData.parentesco}
                    onChange={handleInputChange}
                    displayEmpty
                    select
                    {...estiloTextField}
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
                    <MenuItem value="Compañero de trabajo">Compañero de trabajo</MenuItem>
                  </TextField>
                </Grid>
                {/* Teléfono Celular */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telefonoCelular"
                    type="number"
                    label="Teléfono Celular"
                    placeholder="Teléfono Celular"
                    value={formData.telefonoCelular}
                    onChange={handleInputChange}
                    {...estiloTextField}
                  />
                </Grid>
                {/* Teléfono Domicilio */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telefonoDomicilio"
                    type="number"
                    label="Teléfono Domicilio"
                    placeholder="Teléfono Domicilio"
                    value={formData.telefonoDomicilio}
                    onChange={handleInputChange}
                    {...estiloTextField}
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
                      placeholder="Respuesta VT"
                      value={formData.respuestaVT}
                      onChange={handleInputChange}
                      select
                      {...estiloTextField}
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
                style={{ marginTop: "4px" }}>Guardar</button>
              <button
                onClick={handleAgregar}
                className="rounded-full bg-gray-400 text-white px-6 py-2.5 hover:bg-gray-500 transition"
                style={{ marginTop: "4px" }}>Agregar</button>
              <button
                className="rounded-full bg-blue-600 text-white px-6 py-2.5 hover:bg-blue-700 transition"
                style={{ marginTop: "4px" }}>Enviar</button>
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
                    <TableCell>Parentesco</TableCell>
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
                      <TableCell>{data.parentesco}</TableCell>
                      <TableCell>{data.telefonoDomicilio}</TableCell>
                      <TableCell>{data.telefonoCelular}</TableCell>
                      <TableCell>{data.respuestaVT}</TableCell>{" "}
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