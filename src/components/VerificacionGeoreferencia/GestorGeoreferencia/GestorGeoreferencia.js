import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import axios from "axios";
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
    IconButton,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { APIURL } from "../../../configApi/apiConfig";

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
export function GestorGeoreferencia() {

    const [cedula, setCedula] = useState("");  // Estado para manejar el texto de la cédula
    const [estado, setEstado] = useState("");  // Estado para el campo de estado
    const [tipo, setTipo] = useState("");  // Estado para el campo de tipo
    const [datos, setDatos] = useState([]);

    // Estado para controlar la pestaña activa 
    const { enqueueSnackbar } = useSnackbar();

    const handleCedulaChange = () => {
        // Llamar a la API solo cuando se haga clic en el ícono
        if (!cedula) {
            enqueueSnackbar("Por favor ingrese una cédula", { variant: "warning" });
            return;
        }
        console.log('Cédula ingresada:', cedula);  // Ver el valor de la cédula ingresada
        fetchCedula(cedula);  // Llamar a la función para hacer la solicitud a la API con la cédula
    };

    const fetchCedula = async (cedula) => {
        if (!cedula) return; // Evitar la llamada a la API si la cédula está vacía
        try {
            const response = await axios.get(APIURL.getCoordenadasprefactura(), {
                params: { cedula }  // Pasar la cédula como parámetro de la solicitud
            });

            if (response.status === 200) { 
                const filteredData = response.data.filter(d => d.cedula === cedula);  // Filtrar los datos para la cédula correspondiente
                if (filteredData.length > 0) {
                    setDatos(filteredData);  // Establecer los datos en el estado
                } else {
                    enqueueSnackbar("No se encontraron datos para esta cédula", { variant: "warning" });
                    setDatos([]);  // Limpiar los datos si no se encuentran
                }
            } else {
                enqueueSnackbar("Error al obtener los datos", { variant: "error" });
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Hubo un error al hacer la solicitud", { variant: "error" });
        }
    };




    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
            {/* Título */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                GeoReferencia
            </h1>

            {/* Contenido */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Columnas */}
                    <TabContent>
                        <Grid container spacing={2}>
                            {/* Cedula */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="Cedula"
                                    label="Cedula"
                                    placeholder="Cedula"
                                    onChange={(e) => setCedula(e.target.value)}
                                    {...estiloTextField}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={handleCedulaChange}
                                                aria-label="search"
                                                edge="end"
                                                size="small"
                                            >
                                                <SearchIcon fontSize="small" />
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>
                            {/* Fecha Inicio */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="Fecha Inicio"
                                    type="date"
                                    label="Fecha Inicio"
                                    {...estiloTextField}
                                />
                            </Grid>
                            {/* Fecha Fin */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="Fecha Fin"
                                    label="Fecha Fin"
                                    type="date"
                                    {...estiloTextField}
                                />
                            </Grid>
                            {/* Estado */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="estado"
                                    label="Estado"
                                    placeholder="Estado"
                                    value={estado}
                                    {...estiloTextField}

                                />
                            </Grid>
                            {/* Tipo */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="tipo"
                                    label="Tipo"
                                    placeholder="Tipo"
                                    value={tipo}
                                    {...estiloTextField}
                                />
                            </Grid>
                            {/* Botón Visualizar */}
                            <Grid item xs={12} sm={4} container alignItems="center">
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "100%",
                                    }}
                                >
                                    <button
                                        className="rounded-full bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 transition"
                                        style={{
                                            height: "42px",
                                            alignSelf: "center",
                                        }}
                                    >
                                        Visualizar
                                    </button>
                                </Box>
                            </Grid>
                            {/* Latitud */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="latitud"
                                    label="Latitud"
                                    placeholder="Latitud"
                                    {...estiloTextField}
                                />
                            </Grid>
                            {/* Longitud */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="longitud"
                                    label="Longitud"
                                    placeholder="Longitud"
                                    {...estiloTextField}
                                />
                            </Grid>
                            {/* Ubicación */}
                            <Grid item xs={12} sm={4} container alignItems="center">
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%",
                                }}
                                >
                                    <button
                                        className="rounded-full bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 transition"
                                        style={{
                                            height: "42px",
                                            alignSelf: "center",
                                        }}
                                    >
                                        Ubicación
                                    </button>
                                </Box>
                            </Grid>
                        </Grid>

                    </TabContent>
                    {/* Tabla de datos */}
                    <TableContainer
                        component={Paper}
                        sx={{ marginTop: 3, width: "100%" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cedula</TableCell>
                                    <TableCell>Latitud</TableCell>
                                    <TableCell>Longitud</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Tipo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {datos.length > 0 ? (
                                    datos.map((item) => (
                                        <TableRow key={item.idCoordenadasPrefactura}>
                                            <TableCell>{item.cedula}</TableCell>
                                            <TableCell>{item.latitud}</TableCell>
                                            <TableCell>{item.longitud}</TableCell>
                                            <TableCell>{item.iEstado }</TableCell>
                                            <TableCell>{item.Tipo }</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No se encontraron datos</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </div>
    );
}