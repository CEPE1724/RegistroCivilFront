import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material'; // Utilizamos Paper para el fondo

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function GestorOperadora() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                Verificación Telefónica
            </h1>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Datos Basicos del Cliente" {...a11yProps(0)} />
                        <Tab label="Datos Domiciliarios del Cliente" {...a11yProps(1)} />
                        <Tab label="Datos Laborales del CLiente" {...a11yProps(2)} />
                        <Tab label="Referencias del Cliente" {...a11yProps(3)} />
                        <Tab label="Revision Documental" {...a11yProps(4)} />
                    </Tabs>
                </Box>

                {/* Datos Basicos del Cliente */}
                <CustomTabPanel value={value} index={0}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Paper sx={{ p: 4, width: '80%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                {/* Columna 1 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Nombres del Cliente" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Fecha de Nacimiento" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Tipo de Cliente" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Solicitud" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Cédula" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Hora de Ingreso" readOnly style={inputStyle} />
                                </Box>

                                {/* Columna 2 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Nombres del padre" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Nombre de la madre" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Estado civil del Cliente" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Promocion Adicional" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Producto" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Hora fin del proceso" readOnly style={inputStyle} />
                                </Box>

                                {/* Columna 3 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Agencia" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Usuario Ingresa" readOnly style={inputStyle} />
                                    <input type="text" placeholder="USuario Gestiona" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Verificador Fisico" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Formalidad" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Tiempo Promesa" readOnly style={inputStyle} />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </CustomTabPanel>

                {/* datos domiciliario cliente */}
                <CustomTabPanel value={value} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <Paper sx={{ p: 4, width: '80%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                {/* Columna 1 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Calle Principal" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Referencia" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Respuesta VT" readOnly style={inputStyle} />                                    
                                </Box>

                                {/* Columna 2 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Numero" readOnly style={inputStyle} />
                                </Box>

                                {/* Columna 3 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Calle Transversal" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Telefono Domicilio" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Telefono Celular" readOnly style={inputStyle} />                                
                                </Box>
                            </Box>                            
                        </Paper>
                    </Box>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <Paper sx={{ p: 4, width: '80%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                {/* Columna 1 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Nombre o razon de la empresa" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Calle Principal" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Referencia" readOnly style={inputStyle} /> 
                                    <input type="text" placeholder="Respuesta VT" readOnly style={inputStyle} />                                   
                                </Box>

                                {/* Columna 2 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Actividad Economica" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Numero" readOnly style={inputStyle} />
                                </Box>

                                {/* Columna 3 */}
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input type="text" placeholder="Calle Transversal" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Telefono Domicilio" readOnly style={inputStyle} />
                                    <input type="text" placeholder="Telefono Celular" readOnly style={inputStyle} />                                
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </CustomTabPanel>
                
                


            </Box>
        </div>
    );
}

// Estilo para los inputs
const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    textAlign: 'center',
};
