import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";

export function DatosConyuge() {

    const { enqueueSnackbar } = useSnackbar();
    const [dato, setDato] = useState([]);
    //almacenar datos del formulario
    const [formData, setFormData] = useState({
        tipoDocumento: "",
        apellidoPaterno: "",
        primerNombre: "",
        segundoNombre: "",
        numeroDocumento: "",
        fechaNacimiento: "",
        nacionalidad: "",
        sexo: "",
        nivelEducacion: "",
        profesion: "",
    });

    //llamada api
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "apellidoPaterno" || name === "primerNombre" || name === "segundoNombre") {
            // Solo letras
            const filteredValue = value.replace(/[^A-Za-z]/g, '');
            setFormData({ ...formData, [name]: filteredValue });
        } else if (name === "fechaNacimiento") {
            // Validar que el usuario sea mayor de edad
            const fechaNacimiento = new Date(value);
            const hoy = new Date();
            const edadMinima = new Date(hoy.setFullYear(hoy.getFullYear() - 18));

            if (fechaNacimiento > edadMinima) {
                enqueueSnackbar("Debe ser mayor de edad", { variant: "error" });
                return;
            }
            setFormData({ ...formData, [name]: value });
        } else
            setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAgregar = () => {
        // Validar campos
        if (formData.tipoDocumento === "") {
            enqueueSnackbar("El tipo de documento es requerido", { variant: "error" });
            return;
        }
        if (formData.apellidoPaterno.length < 3) {
            enqueueSnackbar("El apellido paterno es requerido", { variant: "error" });
            return;
        }
        if (formData.primerNombre.length < 3) {
            enqueueSnackbar("El primer nombre es requerido", { variant: "error" });
            return;
        }
        if (formData.numeroDocumento.length < 10) {
            enqueueSnackbar("Ingrese un número de documento valido", { variant: "error" });
            return;
        }
        if (formData.fechaNacimiento === "") {
            enqueueSnackbar("La fecha de nacimiento es requerida", { variant: "error" });
            return;
        }
        if (formData.nacionalidad === "") {
            enqueueSnackbar("La nacionalidad es requerida", { variant: "error" });
            return;
        }
        if (formData.sexo === "") {
            enqueueSnackbar("El sexo es requerido", { variant: "error" });
            return;
        }
        if (formData.nivelEducacion === "") {
            enqueueSnackbar("El nivel de educación es requerido", { variant: "error" });
            return;
        }
        if (formData.profesion === "") {
            enqueueSnackbar("La profesión es requerida", { variant: "error" });
            return;
        }
        enqueueSnackbar("Datos Guardados", { variant: "success" });
    };

    return (
        <div>
            {/* Primera Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Tipo Documento */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Tipo Documento</label>
                    <select
                        name="tipoDocumento"
                        className="p-2 border rounded"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {dato.map((opcion) => (
                            <option key={opcion.idCre_VerificacionTelefonicaWeb} value={opcion.idCre_VerificacionTelefonicaWeb}>
                                {opcion.Respuesta}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Apellido Paterno */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Apellido Paterno</label>
                    <input
                        name="apellidoPaterno"
                        type="text"
                        placeholder="Apellido Paterno"
                        className="p-2 border rounded"
                        value={formData.apellidoPaterno}
                        onChange={handleChange}
                    />
                </div>
                {/* Primer Nombre */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Primer Nombre</label>
                    <input
                        name="primerNombre"
                        type="text"
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
                        name="segundoNombre"
                        type="text"
                        placeholder="Segundo Nombre"
                        className="p-2 border rounded"
                        value={formData.segundoNombre}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {/* Segunda fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Numero Documento */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">N. Documento</label>
                    <input
                        name="numeroDocumento"
                        type="number"
                        placeholder="N. Documento"
                        className="p-2 border rounded"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                    />
                </div>
                {/* Fecha Nacimiento */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">F. Nacimiento</label>
                    <input
                        name="fechaNacimiento"
                        type="date"
                        className="p-2 border rounded"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                    />
                </div>
                {/* Nacionalidad */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Nacionalidad</label>
                    <select
                        name="nacionalidad"
                        className="p-2 border rounded"
                        value={formData.nacionalidad}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {dato.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.Respuesta}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Sexo */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Sexo</label>
                    <select
                        name="sexo"
                        className="p-2 border rounded"
                        value={formData.sexo}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {dato.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.Respuesta}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Tercera fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Nivel Educacion */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Nivel Educacion</label>
                    <select
                        name="nivelEducacion"
                        className="p-2 border rounded"
                        value={formData.nivelEducacion}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {dato.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.Respuesta}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Profesion */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Profesión</label>
                    <select
                        name="profesion"
                        className="p-2 border rounded"
                        value={formData.profesion}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {dato.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.Respuesta}
                            </option>
                        ))}
                    </select>
                </div>
                {/* boton guardar */}
                <button onClick={handleAgregar} className="p-2 bg-blue-500 text-white rounded mr-2">
                    Agregar
                </button>
            </div>
        </div>
    )
}
