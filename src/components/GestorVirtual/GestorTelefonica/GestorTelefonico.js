import React, { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from "notistack";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import WalletIcon from '@mui/icons-material/Wallet';
import axios from 'axios';
import { APIURL } from '../../../configApi/apiConfig';


const FIELD_NAMES = {
    dato: 'Dato',
    tipoContacto: 'Tipo Contacto',
    descripcion: 'Descripción',
    fechaPago: 'Fecha Pago',
    valor: 'Valor',
};

export function GestorTelefonico({ selectedItem, closeModal }) {
    const [showFields, setShowFields] = useState(false);
    const [errorFields, setErrorFields] = useState({ dato: false, tipoContacto: false, tipoResultados: false, fechaPago: false, valor: false});
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [dato, setDato] = useState([]);
    const [tipoContacto, setTipoContacto] = useState([]);
    const [selectResultado, setSelectResultado] = useState([]);
    const [selectedDato, setSelectedDato] = useState(""); // Estado para el primer combo
    const [selectedTipoContacto, setSelectedTipoContacto] = useState(""); // Estado para el segundo combo
    const [selectedDescripcion, setSelectedDescripcion] = useState(""); // Estado para el tercer combo

    const handleFechaPago = () => {
        const fechaPago = document.getElementById('fechapago').value;
        if (fechaPago && fechaPago < minDate) {
            enqueueSnackbar("Fecha de Pago no valida", { variant: "error" });
            document.getElementById('fechapago').value = ''; 
        }}

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    useEffect(() => {
        fetchDato();
        }, []);

    const fetchDato = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(APIURL.SelectDato(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            setDato(response.data.data);
        } catch (error) {
            console.error("Error fetching Dato:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTipoContacto = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(APIURL.SelectTipoContacto(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    idCbo_EstadoGestion: id
                }
            });
            const tipoContactoData = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data ? [response.data.data] : [];
            setTipoContacto(tipoContactoData);
        } catch (error) {
            console.error("Error fetching Tipo Contacto:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSelectResultado = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(APIURL.SelectTipoResultado(), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    idCbo_EstadosTipocontacto: id
                }
            });
            const selectResultadoData = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data ? [response.data.data] : [];
            setSelectResultado(selectResultadoData);
        } catch (error) {
            console.error("Error fetching Select Resultado:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDatoChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedDato(selectedValue); // Actualiza el valor del primer combo
        setSelectedTipoContacto(""); // Limpiar el segundo combo al cambiar el primer combo
        setSelectResultado([]); // Limpiar el tercer combo
        if (selectedValue) {
            fetchTipoContacto(selectedValue); // Llamar a la API para llenar el segundo combo
        } else {
            setTipoContacto([]); // Limpiar el segundo combo si no hay selección
        }
    };

    const handleTipoContactoChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedTipoContacto(selectedValue); // Actualiza el valor del segundo combo
        setSelectedDescripcion(""); // Limpiar el tercer combo al cambiar el segundo
        setSelectResultado([]); // Limpiar el tercer combo
        if (selectedValue) {
            fetchSelectResultado(selectedValue); // Llamar a la API para llenar el tercer combo
        } else {
            setSelectResultado([]); // Limpiar el tercer combo si no hay selección
        }
    };

    const handleDescripcionChange = (e) => {
        setSelectedDescripcion(e.target.value); // Actualiza el valor del tercer combo
        if (e.target.value == 39 || e.target.value == 54 || e.target.value == 69) {
            setShowFields(true); // Mostrar los campos condicionales si el valor es 1
        } else {
            setShowFields(false); // Ocultar los campos condicionales si el valor no es 1
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dato = document.getElementById('dato') ? document.getElementById('dato').value : '';
        const tipoContacto = document.getElementById('tipoContacto') ? document.getElementById('tipoContacto').value : '';
        const descripcion = document.getElementById('tipoResultados') ? document.getElementById('tipoResultados').value : '';
        const valor = document.getElementById('valor') ? document.getElementById('valor').value : '';
        const observacion = document.getElementById('observacion').value;
        const fechaPago = document.getElementById('fechapago') ? document.getElementById('fechapago').value : '';

        //alertas modal
        if(!dato) {
            enqueueSnackbar("Seleccione los Datos ", { variant: "error" });
            return;
        }
        if(!tipoContacto) {
            enqueueSnackbar("Seleccione el Tipo Contacto", { variant: "error" });
            return
        }
        if(!descripcion) {
            enqueueSnackbar("Seleccione la Descripción", { variant: "error" });
            return;
        } 
        if (observacion.length < 10) {
            enqueueSnackbar("Ingresa mínimo 10 caracteres", { variant: "error" });
            return;
        }
          
        if (showFields){
            if(!fechaPago) {
                enqueueSnackbar("Seleccione la Fecha Pago", { variant: "error" });
                return;
            }
            if(!valor) {
                enqueueSnackbar("Seleccione el Valor Pago", { variant: "error" });
                return;
            }
        }

        // Si todas las validaciones estan bien
        enqueueSnackbar("Formulario guardado exitosamente", { variant: "success" });  
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold">Detalles del Gestor</h2>
                <div className="mt-2 text-blue-950 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 text-sm">
                    <p><strong><AccountCircleIcon /> Cliente:</strong> {selectedItem.Cliente}</p>
                    <p><strong><HomeIcon /> Dirección:</strong> {selectedItem.Direccion}</p>
                    <p><strong><FingerprintIcon /> Cédula:</strong> {selectedItem.Cedula}</p>
                    <p><strong><WalletIcon /> Cartera:</strong> {selectedItem.Cartera}</p>

                    <div className="sm:col-span-2">
                        <label htmlFor="dato" className="block font-semibold">Dato</label>
                        <select
                            id="dato"
                            name="dato"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={handleDatoChange}
                            value={selectedDato} // Usar el estado adecuado para el primer combo
                        >
                            <option value="">Seleccione una opción</option>
                            {loading ? (
                                <option value="">Cargando...</option>
                            ) : (
                                dato.map((item) => (
                                    <option key={item.idCbo_EstadoGestion} value={item.idCbo_EstadoGestion}>
                                        {item.Estado}
                                    </option>
                                ))
                            )}
                        </select>

                        {/* Segundo Combo: Tipo de Contacto */}
                        <label htmlFor="tipoContacto" className="block font-semibold mt-4">Tipo de Contacto</label>
                        <select
                            id="tipoContacto"
                            name="tipoContacto"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={handleTipoContactoChange}
                            value={selectedTipoContacto} // Usar el estado adecuado para el segundo combo
                        >
                            <option value="">Seleccione una opción</option>
                            {loading ? (
                                <option value="">Cargando...</option>
                            ) : (
                                tipoContacto.map((item) => (
                                    <option key={item.idCbo_EstadosTipocontacto} value={item.idCbo_EstadosTipocontacto}>
                                        {item.Estado}
                                    </option>
                                ))
                            )}
                        </select>

                        {/* Tercer Combo: Descripción */}
                        <label htmlFor="tipoResultados" className="block font-semibold mt-4">Descripción</label>
                        <select
                            id="tipoResultados"
                            name="tipoResultados"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={selectedDescripcion} // Usar el estado adecuado para el tercer combo
                            onChange={handleDescripcionChange}
                        >
                            <option value="">Seleccione una opción</option>
                            {loading ? (
                                <option value="">Cargando...</option>
                            ) : (
                                selectResultado.map((item) => (
                                    <option key={item.idCbo_ResultadoGestion} value={item.idCbo_ResultadoGestion}>
                                        {item.Resultado}
                                    </option>
                                    
                                )
                           )
                            )}                          
                        </select>                        
                    </div>

                    {/* Conditional Fields */}
                    {showFields && (
                        <>
                            <div className="sm:col-span-2">
                                <label htmlFor="fechaPago" className={`block font-semibold ${errorFields.fechaPago ? 'text-red-500' : ''}`}>
                                    Fecha Pago</label>
                                <input type="date" id="fechapago" name="fechapago" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min={minDate} onBlur={handleFechaPago} />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="valor" className={`block font-semibold ${errorFields.valor ? 'text-red-500' : ''}`}>
                                    Valor</label>
                                <input
                                    type="number"
                                    id="valor"
                                    name="valor"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    min="1"
                                    onBlur={(e) => {
                                        if (e.target.value < 1) {
                                            enqueueSnackbar("El valor no puede ser menor a 1", { variant: "error" });
                                            e.target.value = 1;
                                        }
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <div className="sm:col-span-2">
                        <label htmlFor="observacion" className="block font-semibold">Observación</label>
                        <textarea
                            id="observacion"
                            name="observacion"
                            rows="4"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Ingresa mínimo 10 caracteres"
                        ></textarea>
                    </div>
                </div>

                <div className="mt-6 flex justify-end flex-wrap gap-2">
                    <button
                        onClick={handleSubmit}
                        className="group flex items-center justify-start w-11 h-11 bg-green-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                    >
                        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                            <SaveIcon className="text-white" />
                        </div>
                        <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            Guardar
                        </div>
                    </button>

                    <button
                        onClick={closeModal}
                        className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                    >
                        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                            <LogoutIcon className="text-white" />
                        </div>
                        <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            Salir
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
