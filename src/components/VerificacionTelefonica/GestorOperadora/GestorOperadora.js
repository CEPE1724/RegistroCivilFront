import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Grid, Paper, TextField, Grow, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel } from '@mui/material';

export function GestorOperadora() {
    // Estado para controlar la pestaña activa
    const [value, setValue] = React.useState(0);

    // Función para manejar el cambio de pestaña
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Contenido de cada pestaña
    const TabContent = ({ children }) => (
        <Grow in={true} timeout={300}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: { xs: 350, sm: 900 }, padding: 3, margin: '0 auto' }}>
                <Grid container spacing={1}>
                    {children}
                </Grid>
            </Paper>
        </Grow>
    );


    // Estado para los campos de la pestaña "Referencias del Cliente" 
    const [formData, setFormData] = useState({
        tipoReferencia: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        nombres: '',
        parentezco: '',
        telefonoDomicilio: '',
        telefonoCelular: '',
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
            tipoReferencia: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            nombres: '',
            parentezco: '',
            telefonoDomicilio: '',
            telefonoCelular: '',
        });
    };

    // Limpiar los campos para agregar nuevos datos
    const handleAgregar = () => {
        setFormData({
            tipoReferencia: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            nombres: '',
            parentezco: '',
            telefonoDomicilio: '',
            telefonoCelular: '',
        });
    };



    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
            {/* Título */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                Verificación Telefónica
            </h1>

            {/* Pestañas */}
            <Box sx={{ maxWidth: { xs: 320, sm: 700 }, bgcolor: 'background.paper', margin: '0 auto' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons={true}
                    aria-label="scrollable prevent tabs example"
                    centered
                >
                    <Tab label="Datos Básicos del Cliente" />
                    <Tab label="Datos Domiciliarios del Cliente" />
                    <Tab label="Datos Laborales del Cliente" />
                    <Tab label="Referencias del Cliente" />
                </Tabs>
            </Box>

            {/* Contenido pestañas */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                {/* Datos Básicos del Cliente */}
                {value === 0 && (
                    <TabContent>
                        {/* Columna 1 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Nombres del Cliente" placeholder="Nombres del Cliente" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Fecha de Nacimiento" placeholder="Fecha de Nacimiento" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Tipo de Cliente" placeholder="Tipo de Cliente" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Solicitud" placeholder="Solicitud" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Cédula" placeholder="Cédula" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Hora de Ingreso" placeholder="Hora de Ingreso" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>

                        {/* Columna 2 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Nombre Padre del Cliente" placeholder="Nombre Padre del Cliente" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Nombre Madre del Cliente" placeholder="Nombre Madre del Cliente" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Estado Civil" placeholder="Estado Civil" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Promoción Adicional" placeholder="Promoción Adicional" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Producto" placeholder="Producto" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Hora Fin de Proceso" placeholder="Hora Fin de Proceso" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>

                        {/* Columna 3 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Agencia" placeholder="Agencia" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Usuario Ingresa" placeholder="Usuario Ingresa" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Usuario Gestiona" placeholder="Usuario Gestiona" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Verificador Físico" placeholder="Verificador Físico" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Formalidad" placeholder="Formalidad" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Tiempo Promesa" placeholder="Tiempo Promesa" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>
                    </TabContent>
                )}

                {/* Datos Domiciliarios del Cliente */}
                {value === 1 && (
                    <TabContent>
                        {/* Columna 1 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Calle Principal" placeholder="Calle Principal" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Referencia" placeholder="Referencia" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Respuesta VT" placeholder="Respuesta VT" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>

                        {/* Columna 2 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Numero:" placeholder="Numero" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>

                        {/* Columna 3 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Calle Transversal" placeholder="Calle Transversal" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Teléfono Domicilio" placeholder="Teléfono Domicilio" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Teléfono Celular" placeholder="Teléfono Celular" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>
                    </TabContent>
                )}

                {/* Datos Laborales del Cliente */}
                {value === 2 && (
                    <TabContent>
                        {/* Columna 1 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Nombre o Razón Social de la Empresa" placeholder="Nombre o Razón Social de la Empresa" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Calle Principal" placeholder="Calle Principal" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Referencia" placeholder="Referencia" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Respuesta VT" placeholder="Respuesta VT" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>

                        {/* Columna 2 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Actividad Económica" placeholder="Actividad Económica" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Numero" placeholder="Numero" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>

                        {/* Columna 3 */}
                        <Grid item xs={12} sm={4}>
                            <TextField label="Calle Transversal" placeholder="Calle Transversal" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Teléfono Domicilio" placeholder="Teléfono Domicilio" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                            <TextField label="Teléfono Celular" placeholder="Teléfono Celular" fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" InputLabelProps={{ shrink: true }} sx={{ marginBottom: 1 }} />
                        </Grid>
                    </TabContent>
                )}

                {/* Referencias del Cliente */}
                {value === 3 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Columnas con campos */}
                        <TabContent>
                            <Grid container spacing={1}>
                                {/* Tipo de Referencia */}
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>Tipo de Referencia</InputLabel>
                                    <Select
                                        name="tipoReferencia"
                                        value={formData.tipoReferencia}
                                        onChange={handleInputChange}
                                        fullWidth
                                        size="small"
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Tipo de Referencia' }}
                                        sx={{ marginBottom: 1 }}
                                    >
                                        <MenuItem value="" disabled>
                                            Selecciona una opción
                                        </MenuItem>
                                        <MenuItem value="Familiar">Familiar</MenuItem>
                                        <MenuItem value="Amistad">Amistad</MenuItem>                                        
                                    </Select>
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
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ marginBottom: 1 }}
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
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ marginBottom: 1 }}
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
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ marginBottom: 1 }}
                                    />
                                </Grid>

                                {/* Parentezco */}
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>Parentezco</InputLabel>
                                    <Select
                                        name="parentezco"
                                        value={formData.parentezco}
                                        onChange={handleInputChange}
                                        fullWidth
                                        size="small"
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Parentezco' }}
                                        sx={{ marginBottom: 1 }}
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
                                    </Select>
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
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ marginBottom: 1 }}
                                    />
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
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ marginBottom: 1 }}
                                    />
                                </Grid>
                            </Grid>
                        </TabContent>

                        {/*Guardar y Agregar */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
                            <Button variant="contained" onClick={handleGuardar}>
                                Guardar
                            </Button>
                            <Button variant="outlined" onClick={handleAgregar}>
                                Agregar
                            </Button>
                        </Box>

                        {/* Tabla datos guardados */}
                        <TableContainer component={Paper} sx={{ marginTop: 3, width: '100%' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tipo de Referencia</TableCell>
                                        <TableCell>Apellido Paterno</TableCell>
                                        <TableCell>Apellido Materno</TableCell>
                                        <TableCell>Nombres</TableCell>
                                        <TableCell>Parentezco</TableCell>
                                        <TableCell>Teléfono Domicilio</TableCell>
                                        <TableCell>Teléfono Celular</TableCell>
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
