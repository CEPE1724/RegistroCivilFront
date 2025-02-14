//import React from 'react';

//export function GestorOperadora() {


    /* funciones*/

//    return (
//        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen overflow-auto">
//            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
//                Verificación Telefónica
//            </h1>
//        </div>
//    );
//}

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

                {/* Datos Basicos del Cliente) */}
                <CustomTabPanel value={value} index={0}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center', // Altura mínima para mostrar el contenido
                        }}
                    >
                        <Paper sx={{ p: 4, width: '80%', textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input
                                        type="text"
                                        placeholder="Nombres del Cliente"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Fecha de Nacimiento"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tipo de Cliente"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Solicitud"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cédula"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Hora de Ingreso"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                </Box>
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input
                                        type="text"
                                        placeholder="Nombres del padre del Cliente"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nombre de la madre del Cliente"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Estado civil del Cliente"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Promocion Adicional"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Producto"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Hora fin del proceso"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                </Box>
                                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <input
                                        type="text"
                                        placeholder="Agencia"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Usuario Ingresa"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="USuario Gestiona"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Verificador Fisico"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Formalidad"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tiempo Promesa"
                                        readOnly
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', textAlign: 'center' }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ mt: 4 }}>
                            </Box>
                        </Paper>
                    </Box>
                </CustomTabPanel>

                {/* Pestaña 2 */}
                <CustomTabPanel value={value} index={1}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px', // Altura mínima para mostrar el contenido
                        }}
                    >
                        <Paper sx={{ p: 4, width: '80%', textAlign: 'center' }}>
                            <h2>Pantalla 2</h2>                        
                        </Paper>
                    </Box>
                </CustomTabPanel>

                {/* Pestaña 3 */}
                <CustomTabPanel value={value} index={2}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px', // Altura mínima para mostrar el contenido
                        }}
                    >
                        <Paper sx={{ p: 4, width: '80%', textAlign: 'center' }}>
                            <h2>Pantalla 3</h2>                            
                        </Paper>
                    </Box>
                </CustomTabPanel>
            </Box>
        </div>
    );
}
