import React, { useState, useEffect } from "react";
import CallIcon from '@mui/icons-material/Call';
import { useSnackbar } from "notistack";
import {
    IconButton,
} from "@mui/material";

export function Referencias() {

    const { enqueueSnackbar } = useSnackbar();

    //almacenar datos del formulario
    const [formData, setFormData] = useState({
        parentesco: "",
        apellidoPaterno: "",
        primerNombre: "",
        segundoNombre: "",
        provincia: "",
        canton: "",
        celular: ""
    });

    //almacenar datos tabla
    const [tablaDatos, setTablaDatos] = useState([]);

    const optParentesco = [
        { value: 1, label: "Madre" },
        { value: 2, label: "Padre" },
    ];
    const optProvincia = [
        { value: 0, label: "Pichincha" },
        { value: 1, label: "provincia 1" },
        { value: 2, label: "provincia 2" }
    ];
    const optCanton = [
        { value: 0, label: "Quito" },
        { value: 1, label: "canton 1" },
        { value: 2, label: "Canton 2" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Filtrar las entradas según el campo
        if (name === "apellidoPaterno" || name === "primerNombre" || name === "segundoNombre") {
            // Solo letras y espacios
            const filteredValue = value.replace(/[^A-Za-z]/g, '');
            setFormData({
                ...formData,
                [name]: filteredValue
            });
        } else if (name === "celular") {
            // Solo números
            const filteredValue = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
            setFormData({
                ...formData,
                [name]: filteredValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleLimpiar = () => {
        setFormData({
            parentesco: "",
            apellidoPaterno: "",
            primerNombre: "",
            segundoNombre: "",
            provincia: "",
            canton: "",
            celular: ""
        });
    };

    const handleAgregar = () => {
        // Validar campos
        if (formData.parentesco === "") {
            enqueueSnackbar("Parentesco es requerido", { variant: "error" });
            return;
        }
        if (formData.apellidoPaterno === "") {
            enqueueSnackbar("Apellido Paterno es requerido", { variant: "error" });
            return;
        }
        if (formData.primerNombre === "") {
            enqueueSnackbar("Primer Nombre es requerido", { variant: "error" });
            return;
        }
        if (formData.segundoNombre === "") {
            enqueueSnackbar("Segundo Nombre es requerido", { variant: "error" });
            return;
        }
        if (formData.provincia === "") {
            enqueueSnackbar("Provincia es requerido", { variant: "error" });
            return;
        }
        if (formData.canton === "") {
            enqueueSnackbar("Canton es requerido", { variant: "error" });
            return;
        }
        if (formData.celular.length < 10) {
            enqueueSnackbar("Celular debe tener 10 dígitos", { variant: "error" });
            return;
        }
        setTablaDatos([...tablaDatos, formData]);
        enqueueSnackbar("Datos Guardados", { variant: "success" });
        // Limpiar el formulario después de agregar
        handleLimpiar();
    };

    // Funciones para obtener etiquetas de Parentesco, Provincia y Canton
    const getLabel = (value, array) => {
        const found = array.find(option => option.value == value);
        return found ? found.label : "";
    };

    return (
        <div>
            <h1>Referencias</h1>
            {/* Primera Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Parentesco */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Parentesco</label>
                    <select
                        name="parentesco"
                        className="p-2 border rounded"
                        value={formData.parentesco}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {optParentesco.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Apellido Paterno */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Apellido Paterno</label>
                    <input
                        type="text"
                        name="apellidoPaterno"
                        placeholder="Apellido Paterno"
                        className="p-2 border rounded"
                        value={formData.apellidoPaterno}
                        onChange={handleChange}
                        pattern="[A-Za-z]+"
                        title="Solo se permiten letras y espacios"
                    />
                </div>
                {/* Primer Nombre */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Primer Nombre</label>
                    <input
                        type="text"
                        name="primerNombre"
                        placeholder="Primer Nombre"
                        className="p-2 border rounded"
                        value={formData.primerNombre}
                        onChange={handleChange}
                    />
                </div>
                {/* Segundo Nombre */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Segundo Nombre</label>
                    <input
                        type="text"
                        name="segundoNombre"
                        placeholder="Segundo Nombre"
                        className="p-2 border rounded"
                        value={formData.segundoNombre}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {/* Segunda fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Provincia */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Provincia</label>
                    <select
                        name="provincia"
                        className="p-2 border rounded"
                        value={formData.provincia}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {optProvincia.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Canton */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Canton</label>
                    <select
                        name="canton"
                        className="p-2 border rounded"
                        value={formData.canton}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {optCanton.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Celular */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Celular</label>
                    <input
                        type="text"
                        name="celular"
                        placeholder="Celular"
                        className="p-2 border rounded"
                        value={formData.celular}
                        onChange={handleChange}
                        maxLength="10"
                        pattern="\d{10}"
                    />
                </div>
                {/* Botones */}
                <div>
                    <button onClick={handleAgregar} className="p-2 bg-blue-500 text-white rounded">
                        Agregar
                    </button>

                    <button onClick={handleLimpiar} className="p-2 bg-blue-500 text-white rounded">
                        Limpiar
                    </button>
                </div>
            </div>
            {/* Tabla */}
            <div className="p-6 bg-gray-50 min-h-screen overflow-auto">
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-center font-bold">Parentesco</th>
                                <th className="px-4 py-2 text-center font-bold">Apellido Paterno</th>
                                <th className="px-4 py-2 text-center font-bold">Primer Nombre</th>
                                <th className="px-4 py-2 text-center font-bold">Segundo Nombre</th>
                                <th className="px-4 py-2 text-center font-bold">Provincia</th>
                                <th className="px-4 py-2 text-center font-bold">Canton</th>
                                <th className="px-4 py-2 text-center font-bold">Celular</th>
                                <th className="px-4 py-2 text-center font-bold">....</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tablaDatos.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-center">{getLabel(row.parentesco, optParentesco)}</td>
                                    <td className="px-4 py-2 text-center">{row.apellidoPaterno}</td>
                                    <td className="px-4 py-2 text-center">{row.primerNombre}</td>
                                    <td className="px-4 py-2 text-center">{row.segundoNombre}</td>
                                    <td className="px-4 py-2 text-center">{getLabel(row.provincia, optProvincia)}</td>
                                    <td className="px-4 py-2 text-center">{getLabel(row.canton, optCanton)}</td>
                                    <td className="px-4 py-2 text-center">{row.celular}</td>
                                    <td className="px-4 py-2 text-center">
                                        <IconButton color="primary" aria-label="call">
                                            <CallIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
