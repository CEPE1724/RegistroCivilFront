import React, { useState, useEffect } from 'react';
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
import { TEChart } from 'tw-elements-react';

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

export function GestorTerrena() {
    // Estado para controlar la pestaña activa
    const { enqueueSnackbar } = useSnackbar();
    const [dato, setDato] = useState([]);
    const [laboralData, setLaboralData] = useState([]); //estado datos laborales
    // Estado para manejar las respuestas VF de cada fila de la pestaña datos laborales
    const [respuestaVFState, setRespuestaVFState] = useState({});
    // Función para manejar cambios en el campo Respuesta VF
    const handleRespuestaVFChange = (id, value) => {
        setRespuestaVFState((prevState) => ({
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

    const [value, setValue] = React.useState(0);
    // Función para manejar el cambio de pestaña
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [respVFDomicilio, setrespVFDomicilio] = useState("");  //estado respuesta VF domicilio

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                Verificación Terrena
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
                            display: 'none', // Ocultar linea debajo de la pestaña seleccionada 
                        },
                    }}
                >
                    <Tab label="Datos Básicos del Cliente" />
                    <Tab label="Datos Domiciliarios del Cliente" />
                    <Tab label="Datos Laborales del Cliente" />
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
                                    name="respuestaVF"
                                    label="Respuesta VF"
                                    value={respVFDomicilio}
                                    onChange={(e) => setrespVFDomicilio(e.target.value)}
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
                                label="Verificador Físico"
                                placeholder="Verificador Físico"
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
                            <TextField
                                label="ejemplo"
                                placeholder="ejemplo"
                                {...estiloTextField}
                            />
                        </Grid>
                    </TabContent>
                )}
                {/* Datos Laborales del Cliente */}
                {value === 2 && (
                    <Box>
                        { /* Tabla de datos laborales */}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Nombre o Razón Social de la Empresa</TableCell>
                                        <TableCell align="center">Actividad Económica</TableCell>
                                        <TableCell align="center">Número</TableCell>
                                        <TableCell align="center">Calle Principal</TableCell>
                                        <TableCell align="center">Calle Transversal</TableCell>
                                        <TableCell align="center">Referencia</TableCell>
                                        <TableCell align="center">Teléfono Domicilio</TableCell>
                                        <TableCell align="center">Teléfono Celular</TableCell>
                                        <TableCell align="center">Respuesta VF</TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {laboralData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell align="center" >{item.company.name}</TableCell>
                                            <TableCell align="center" >{item.company.bs}</TableCell>
                                            <TableCell align="center" >{item.address.suite}</TableCell>
                                            <TableCell align="center" >{item.address.street}</TableCell>
                                            <TableCell align="center" >{item.address.zipcode}</TableCell>
                                            <TableCell align="center" >{item.address.city}</TableCell>
                                            <TableCell align="center" >{item.phone}</TableCell>
                                            <TableCell align="center" >{item.phone}</TableCell>
                                            <TableCell>
                                                {/* Campo Respuesta VF */}
                                                <TextField
                                                    select
                                                    name={`respuestaVF-${item.id}`}
                                                    value={respuestaVFState[item.id] || ""}
                                                    onChange={(e) => handleRespuestaVFChange(item.id, e.target.value)}
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
            </Box>
        </div>
    );
}