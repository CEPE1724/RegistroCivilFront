import React, { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from "notistack";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import WalletIcon from '@mui/icons-material/Wallet';

export function GestorTelefonico({ selectedItem, closeModal }) {

    const [showFields, setShowFields] = useState(false);
    const [errorFields, setErrorFields] = useState({ dato: false, tipoContacto: false, descripcion: false, fechaPago: false, valor: false });
    const { enqueueSnackbar } = useSnackbar();

    const cantCaracteres = (e) => {
        e.preventDefault();

        const dato = document.getElementById('dato') ? document.getElementById('dato').value : '';
        const tipoContacto = document.getElementById('tipoContacto') ? document.getElementById('tipoContacto').value : '';
        const descripcion = document.getElementById('descripcion') ? document.getElementById('descripcion').value : '';
        const fechaPago = document.getElementById('fechapago') ? document.getElementById('fechapago').value : '';
        const valor = document.getElementById('valor') ? document.getElementById('valor').value : '';

        // Verificar si algún campo no está seleccionado
        let errorFound = false;
        let newErrorFields = { dato: false, tipoContacto: false, descripcion: false, fechaPago: false, valor: false };

        if (!dato) {
            newErrorFields.dato = true;
            errorFound = true;
        }
        if (!tipoContacto) {
            newErrorFields.tipoContacto = true;
            errorFound = true;
        }
        if (!descripcion) {
            newErrorFields.descripcion = true;
            errorFound = true;
        }

        //verificar Fecha Pago y Valor
        if (descripcion === "opcion 9") {
            if (!fechaPago) {
                newErrorFields.fechaPago = true;
                errorFound = true;
            }
            if (!valor) {
                newErrorFields.valor = true;
                errorFound = true;
            }
        }

        setErrorFields(newErrorFields);

        //mensaje de error
        if (errorFound) {
            let missingField = '';
            if (newErrorFields.dato) missingField = 'Dato';
            if (newErrorFields.tipoContacto) missingField = 'Tipo Contacto';
            if (newErrorFields.descripcion) missingField = 'Descripcion';
            if (newErrorFields.fechaPago) missingField = 'Fecha Pago';
            if (newErrorFields.valor) missingField = 'Valor';

            enqueueSnackbar(`Seleccione una opción en ${missingField}`, { variant: "error" });
            return;
        }

        enqueueSnackbar("Datos Validados", { variant: "success" });
    };

    const handleDescripcion = (e) => {
        if (e.target.value === "opcion 9") {
            setShowFields(true);  // Mostrar si se selecciona opcion 9
        } else {
            setShowFields(false);  //Ocultar campos
        }
    };

    const handleFechaPago = () => {
        const fechaPago = document.getElementById('fechapago').value;
        if (fechaPago && fechaPago < minDate) {
            enqueueSnackbar("No se puede seleccionar esta fecha", { variant: "error" });
            document.getElementById('fechapago').value = ''; 
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                <h2 className="text-xl font-semibold">Detalles del Gestor</h2>
                <div className="mt-4 text-blue-950 grid grid-cols-2 gap-4 text-sm">
                    <p><strong><AccountCircleIcon /> Cliente:</strong> {selectedItem.Cliente}</p>
                    <p><strong><HomeIcon /> Direccion:</strong> {selectedItem.Direccion}</p>
                    <p><strong><FingerprintIcon /> Cedula:</strong> {selectedItem.Cedula}</p>
                    <p><strong><WalletIcon /> Cartera:</strong> {selectedItem.Cartera}</p>

                    <div>
                        <label htmlFor="dato" className={`block font-semibold ${errorFields.dato ? 'text-red-500' : ''}`}>
                            Dato {errorFields.dato && <span className="text-red-500">*</span>}
                        </label>
                        <select id="dato" name="dato" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Seleccione una opción</option>
                            <option value="opcion1">Opción 1</option>
                            <option value="opcion2">Opción 2</option>
                            <option value="opcion3">Opción 3</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tipoContacto" className={`block font-semibold ${errorFields.tipoContacto ? 'text-red-500' : ''}`}>
                            Tipo Contacto {errorFields.tipoContacto && <span className="text-red-500">*</span>}
                        </label>
                        <select id="tipoContacto" name="tipoContacto" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Seleccione una opción</option>
                            <option value="opcion 4">opcion 4</option>
                            <option value="opcion 5">opcion 5</option>
                            <option value="opcion 6">opcion 6</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="descripcion" className={`block font-semibold ${errorFields.descripcion ? 'text-red-500' : ''}`}>
                            Descripcion {errorFields.descripcion && <span className="text-red-500">*</span>}
                        </label>
                        <select id="descripcion" name="descripcion" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" onChange={handleDescripcion}>
                            <option value="">Seleccione una opción</option>
                            <option value="opcion 7">opcion 7</option>
                            <option value="opcion 8">opcion 8</option>
                            <option value="opcion 9">opcion 9</option>
                        </select>
                    </div>

                    {/* Mostrar estos campos si showFields es verdadero */}
                    {showFields && (
                        <>
                            <div>
                                <label htmlFor="fechaPago" className={`block font-semibold ${errorFields.fechaPago ? 'text-red-500' : ''}`}>
                                    Fecha Pago {errorFields.fechaPago && <span className="text-red-500">*</span>}
                                </label>
                                <input type="date" id="fechapago" name="fechapago" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min={minDate} onBlur={handleFechaPago} />
                            </div>
                            <div>
                                <label htmlFor="valor" className={`block font-semibold ${errorFields.valor ? 'text-red-500' : ''}`}>
                                    Valor {errorFields.valor && <span className="text-red-500">*</span>}
                                </label>
                                <input type="number" id="valor" name="valor" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min="1" onBlur={(e) => {
                                    if (e.target.value < 1) {
                                        enqueueSnackbar("El valor no puede ser menor a 1", { variant: "error" });
                                        e.target.value = 1;
                                    }
                                }} />
                            </div>
                        </>
                    )}

                    <div className="col-span-2">
                        <label htmlFor="observacion" className="block font-semibold">Observación</label>
                        <textarea id="observacion" name="observacion" rows="4" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder='Ingresa mínimo 10 caracteres'></textarea>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={(e) => {
                            const observacion = document.getElementById('observacion').value;
                            if (observacion.length < 10) {
                                enqueueSnackbar("Su observación debe tener al menos 10 caracteres", { variant: "error" });
                                return;
                            }
                            cantCaracteres(e);
                        }}
                        className="mr-4 group flex items-center justify-start w-11 h-11 bg-green-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
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
