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
    const [errorFields, setErrorFields] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);  // Estado de carga
    const [dato, setDato] = useState([]); // Estado de datos
    const [tipoContacto, setTipoContacto] = useState([]); // Estado de datos
    const [selectedDatos, setSelectedDatos] = useState(null); // Estado de datos
    const [SelectResultado, setSelectResultado] = useState([]); // Estado de datos

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    useEffect(() => {
        fetchDato();
    }, []); // Se llama una vez al montar el componente

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
            console.error("Error fetching gestores:", error);
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
            console.log(response.data.data);
            const tipoContactoData = Array.isArray(response.data.data)
            ? response.data.data
            : response.data.data ? [response.data.data] : [];  // Convertir a array si es un objeto
    
            setTipoContacto(tipoContactoData);
        } catch (error) {
            console.error("Error fetching gestores:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSelectResultado = async () => {
        setLoading(true);
        alert("")
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(APIURL.SelectTipoResultado(), {
                headers: {
                    'Content-Type': 'application/json',
                }, params: {
                    idCbo_EstadosTipocontacto: selectedDatos
                }
            });
            console.log(response.data.data);
            //setSelectResultado(response.data.data);
        } catch (error) {
            console.error("Error fetching gestores:", error);
        } finally {
            setLoading(false);
        }
    };

    // Manejar el cambio de selección en el primer combo
    const handleDatoChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedDatos(selectedValue);
        if (selectedValue) {
            console.log(selectedValue);
            fetchTipoContacto(selectedValue); // Llamar a la API para llenar el segundo combo cuando se selecciona una opción
        } else {
            setTipoContacto([]); // Limpiar el segundo combo si no se ha seleccionado nada en el primero
        }
    };
    const handleTipoContactoChange = (e) => {
        const selectedValue = e.target.value;
        setSelectResultado(selectedValue);
        if (selectedValue) {
            console.log(selectedValue);
            fetchSelectResultado(selectedValue); // Llamar a la API para llenar el segundo combo cuando se selecciona una opción
        } else {
            setSelectResultado([]); // Limpiar el segundo combo si no se ha seleccionado nada en el primero
        }
    };
    const handleInputChange = (e) => {
        if (e.target.value === "opcion 9") {
            setShowFields(true);
        } else {
            setShowFields(false);
        }
    };

    const handleFechaPago = () => {
        const fechaPago = document.getElementById('fechapago').value;
        if (fechaPago && fechaPago < minDate) {
            enqueueSnackbar("No se puede seleccionar esta fecha", { variant: "error" });
            document.getElementById('fechapago').value = '';
        }
    };

    const validateFields = () => {
        const fields = {
            dato: document.getElementById('dato')?.value,
            tipoContacto: document.getElementById('tipoContacto')?.value,
            descripcion: document.getElementById('descripcion')?.value,
            fechaPago: document.getElementById('fechapago')?.value,
            valor: document.getElementById('valor')?.value,
        };

        let errors = {};
        let isErrorFound = false;

        Object.keys(fields).forEach((field) => {
            if (!fields[field] && field !== "fechaPago" && field !== "valor") {
                errors[field] = true;
                isErrorFound = true;
            }
        });

        if (fields.descripcion === "opcion 9" && (!fields.fechaPago || !fields.valor)) {
            if (!fields.fechaPago) errors.fechaPago = true;
            if (!fields.valor) errors.valor = true;
            isErrorFound = true;
        }

        setErrorFields(errors);

        if (isErrorFound) {
            const missingField = Object.keys(errors)[0];
            enqueueSnackbar(`Seleccione una opción en ${FIELD_NAMES[missingField]}`, { variant: "error" });
        }

        return !isErrorFound;
    };

    const handleSubmit = (e) => {
        const observacion = document.getElementById('observacion').value;

        if (observacion.length < 10) {
            enqueueSnackbar("Su observación debe tener al menos 10 caracteres", { variant: "error" });
            return;
        }

        if (validateFields()) {
            enqueueSnackbar("Datos Validados", { variant: "success" });
        }
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
                        <label htmlFor="dato" className="block font-semibold">
                            Dato
                        </label>
                        <select
                            id="dato"
                            name="dato"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            onChange={handleDatoChange}
                            value={selectedDatos}
                        >
                            <option value="">Seleccione una opción</option>
                            {loading ? (
                                <option value="">Cargando...</option> // Muestra un mensaje mientras carga
                            ) : (
                                dato.map((item) => (
                                    <option key={item.idCbo_EstadoGestion} value={item.idCbo_EstadoGestion}>
                                        {item.Estado}
                                    </option>
                                ))
                            )}
                        </select>

                        {/* Segundo Combo (Tipo Contacto) */}
                        <label htmlFor="tipoContacto" className="block font-semibold mt-4">
                            Tipo de Contacto
                        </label>
                        <select
                            id="tipoContacto"
                            name="tipoContacto"
                            onChange={handleTipoContactoChange}
                            value={SelectResultado}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Seleccione una opción</option>
                            {loading ? (
                                <option value="">Cargando...</option> // Muestra un mensaje mientras carga
                            ) : (
                                tipoContacto.map((item) => (
                                    <option key={item.idCbo_EstadosTipocontacto} value={item.idCbo_EstadosTipocontacto}>
                                        {item.Estado}
                                    </option>
                                ))
                            )}
                        </select>
                        {/* tercer Combo (Tipo Contacto) */}
                        <label htmlFor="tipoContacto" className="block font-semibold mt-4">
                            Descripcion
                        </label>
                        <select
                            id="tipoResultados"
                            name="tipoResultados"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Seleccione una opción</option>
                            {loading ? (
                                <option value="">Cargando...</option> // Muestra un mensaje mientras carga
                            ) : (
                                SelectResultado.map((item) => (
                                    <option key={item.idCbo_ResultadoGestion} value={item.idCbo_ResultadoGestion}>
                                        {item.Resultado}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Reusable Input Select */}
                    {['dato', 'tipoContacto', 'descripcion'].map((field) => (
                        <div key={field} className="sm:col-span-2">
                            <label htmlFor={field} className={`block font-semibold ${errorFields[field] ? 'text-red-500' : ''}`}>
                                {FIELD_NAMES[field]} {errorFields[field] && <span className="text-red-500">*</span>}
                            </label>
                            <select
                                id={field}
                                name={field}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                onChange={field === 'descripcion' ? handleInputChange : null}
                            >
                                <option value="">Seleccione una opción</option>
                                {/* Add relevant options for each field */}
                                <option value="opcion1">Opción 1</option>
                                <option value="opcion2">Opción 2</option>
                                <option value="opcion3">Opción 3</option>
                            </select>
                        </div>
                    ))}

                    {/* Conditional Fields */}
                    {showFields && (
                        <>
                            <div className="sm:col-span-2">
                                <label htmlFor="fechaPago" className={`block font-semibold ${errorFields.fechaPago ? 'text-red-500' : ''}`}>
                                    Fecha Pago {errorFields.fechaPago && <span className="text-red-500">*</span>}
                                </label>
                                <input type="date" id="fechapago" name="fechapago" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min={minDate} onBlur={handleFechaPago} />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="valor" className={`block font-semibold ${errorFields.valor ? 'text-red-500' : ''}`}>
                                    Valor {errorFields.valor && <span className="text-red-500">*</span>}
                                </label>
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
                    {/* Save Button */}
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

                    {/* Close Button */}
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


