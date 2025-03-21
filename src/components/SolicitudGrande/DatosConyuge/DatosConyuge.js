

import React, { useState, useEffect, forwardRef } from "react";
import { FaCalendarAlt, FaStore, FaUserAlt, FaUser, FaMapMarkerAlt, FaCog, FaPhoneAlt, FaTransgender, FaChild, FaUserGraduate, FaUserSecret, FaToolbox } from "react-icons/fa";
import { SelectField } from "../../Utils";
import { useSnackbar } from "notistack";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";
import {
    fetchTipoDocumento, fetchNacionalidad, fecthGenero
} from "../DatosCliente/apisFetch";

const DatosConyuge = forwardRef((props, ref) => {
    const { data } = props;
    console.log("conyuge data", data);
    const { enqueueSnackbar } = useSnackbar();
    const [dato, setDato] = useState([]);  //estados de nacionalidad
    const [datoDocumento, setDatoDocumento] = useState([]);  //estado tipo documento
    const [datoSexo, setDatoSexo] = useState([]);  //estado sexo
    const [datoNivelEducacion, setDatoNivelEducacion] = useState([]);  //estado nivel educacion
    const [nacionalidad, setNacionalidad ] = useState([]);  //estado nivel educacion
    const [datoProfesion, setDatoProfesion] = useState([]);  //estado profesion
    const [dataGenero, setGenero] = useState([]);  //estado genero
    //almacenar datos del formulario
    const [formData, setFormData] = useState({
        tipoDocumento: data.idTipoDocConyuge,
        apellidoPaterno: data.ApellidoPaternoConyuge,
        primerNombre: data.PrimerNombreConyuge,
        segundoNombre: data.SegundoNombreConyuge,
        numeroDocumento: data.CedulaConyuge,
        fechaNacimiento: data.FechaNacimientoConyuge,
        nacionalidad: data.idNacionalidadConyuge,
        sexo: data.idGeneroConyuge,
        nivelEducacion: data.idNivelEducacionConyuge,
        profesion: data.idProfesionConyuge,
    });

    //llamada api documento
    useEffect(() => {
        fetchTipoDocumento(enqueueSnackbar, setDatoDocumento);
        fetchNacionalidad(enqueueSnackbar, setNacionalidad);
        fecthGenero(enqueueSnackbar, setGenero);
    }, []);

    // api de sexo
    useEffect(() => {
        fetchDatosexo();
    }, []);

    const fetchDatosexo = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.getTiposexo();
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDatoSexo(response.data);
        } catch (error) {
            enqueueSnackbar("Error fetching Dato: " + error.message, {
                variant: "error",
            });
        }
    };

    //api nivel educacion
    useEffect(() => {
        fetchDatoNivelEducacion();
    }, []);

    const fetchDatoNivelEducacion = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.getNiveleducacion();
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDatoNivelEducacion(response.data);
        } catch (error) {
            enqueueSnackbar("Error fetching Dato: " + error.message, {
                variant: "error",
            });
        }
    };

    //api profesion 
    useEffect(() => {
        fetchDatoProfesion();
    }, []);

    const fetchDatoProfesion = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.getProfesion();
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDatoProfesion(response.data);
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
            enqueueSnackbar("El apellido paterno debe tener mínimo 3 caracteres", { variant: "error" });
            return;
        }
        if (formData.primerNombre.length < 3) {
            enqueueSnackbar("El primer nombre debe tener mínimo 3 caracteres", { variant: "error" });
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
        if (formData.nacionalidad === "" || formData.nacionalidad ==0 ) {
            enqueueSnackbar("La nacionalidad es requerida", { variant: "error" });
            return;
        }
        if (formData.sexo === "") {
            enqueueSnackbar("El sexo es requerido", { variant: "error" });
            return;
        }
        if (formData.nivelEducacion === "" || formData.nivelEducacion ==0 )
            {
            enqueueSnackbar("El nivel de educación es requerido", { variant: "error" });
            return;
        }
        if (formData.profesion === "" || formData.profesion ==0 )
             {
            enqueueSnackbar("La profesión es requerida", { variant: "error" });
            return;
        }
        enqueueSnackbar("Datos Guardados", { variant: "success" });
    };

    return (
        <div>
            {/* Primera Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">
                    <SelectField
                        label="tipoDocumento"
                        icon={<FaStore />}
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        options={datoDocumento}
                        name="tipoDocumento"
                    // error={formErrors.barrio}
                    />
                </div>

                {/* Apellido Paterno */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1 flex items-center">
                        <FaUserAlt className="mr-2 text-primaryBlue" />
                        Apellido Paterno(*)
                    </label>

                    <input
                        type="text"
                        className="solcitudgrande-style"
                        name="callePrincipal"
                        onChange={handleChange}
                        value={formData.apellidoPaterno}
                    />

                </div>
                {/* Primer Nombre */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1 flex items-center">
                        <FaUserAlt className="mr-2 text-primaryBlue" />
                        Primer Nombre(*)
                    </label>
                    <input
                        type="text"
                        className="solcitudgrande-style"
                        name="primerNombre"
                        onChange={handleChange}
                        value={formData.primerNombre}
                    />

                </div>
                {/* Segundo Nombre */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1 flex items-center">
                        <FaUserAlt className="mr-2 text-primaryBlue" />
                        Segundo Nombre(*)
                    </label>
                    <input
                        type="text"
                        className="solcitudgrande-style"
                        name="segundoNombre"
                        onChange={handleChange}
                        value={formData.segundoNombre}
                    />
                </div>
            </div>
            {/* Segunda fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Numero Documento */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1 flex items-center">
                        <FaUserAlt className="mr-2 text-primaryBlue" />
                        N. Documento(*)
                    </label>
                    <input
                        type="text"
                        className="solcitudgrande-style"
                        name="numeroDocumento"
                        onChange={handleChange}
                        value={formData.numeroDocumento}
                    />
                </div>
                {/* Fecha Nacimiento */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1 flex items-center">
                        <FaUserAlt className="mr-2 text-primaryBlue" />
                        F. Nacimiento(*)
                    </label>
                    <input
                        name="fechaNacimiento"
                        type="date"
                        className="solcitudgrande-style"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                    />
                </div>
                {/* Nacionalidad */}
                <div className="flex flex-col">
                  
                    <SelectField
                        label="Nacionalidad"
                        icon={<FaStore />}
                        value={formData.nacionalidad}
                        onChange={handleChange}
                        options={nacionalidad}
                        name="nacionalidad"
                    // error={formErrors.barrio}
                    />

                </div>
                {/* Sexo */}
                <div className="flex flex-col">
                <SelectField
                        label="Sexo(*)"
                        icon={<FaStore />}
                        value={formData.sexo}
                        onChange={handleChange}
                        options={dataGenero}
                        name="sexo"
                    />
                </div>
            </div>
            {/* Tercera fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Nivel Educacion */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Nivel Educacion(*)</label>
                    <select
                        name="nivelEducacion"
                        className="p-2 border rounded"
                        value={formData.nivelEducacion}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {datoNivelEducacion.map((opcion) => (
                            <option key={opcion.idNivelEducacion} value={opcion.idNivelEducacion}>
                                {opcion.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Profesion */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Profesión(*)</label>
                    <select
                        name="profesion"
                        className="p-2 border rounded"
                        value={formData.profesion}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {datoProfesion.map((opcion) => (
                            <option key={opcion.idProfesion} value={opcion.idProfesion}>
                                {opcion.Nombre}
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
});

export default DatosConyuge;