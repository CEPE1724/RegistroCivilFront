import React, { useState, useEffect } from "react";
import CallIcon from '@mui/icons-material/Call';
import { useSnackbar } from "notistack";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from "@mui/material";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";

import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";

export function Referencias() {

    const { enqueueSnackbar } = useSnackbar();
    const [datoParentesco, setDatoParentesco] = useState([]);  //estado parentesco
    const [datoProvincia, setDatoProvincia] = useState([]);    //estado provincias
    const [datoCanton, setDatoCanton] = useState([]);          //estado cantones
    const [idToTextMap, setIdToTextMap] = useState({});   //estado para mapear IDs a textos de api parentesco
    const [idToTextMapProvincia, setIdToTextMapProvincia] = useState({});   //IDs a textos provincias
    const [idToTextMapCanton, setIdToTextMapCanton] = useState({});   //IDs a textos cantones
    const [view, setView] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [tablaModal, setTablaModal] = useState([]);   //estado datos tabla modal
    const [datoEstado, setDatoEstado] = useState([]);  //estado para api estado
    const [idToTextMapEstado, setIdToTextMapEstado] = useState({});   //estado para mapear IDs a textos de api estado

    //almacenar datos del formulario
    const [formData, setFormData] = useState({
        parentesco: "",
        apellidoPaterno: "",
        primerNombre: "",
        segundoNombre: "",
        provincia: "",
        canton: "",
        celular: "",
    });

    //almacenar datos modal
    const [formDataModal, setFormDataModal] = useState({
        contactoEfectivo: "",
        estado: "",
        observaciones: "",
    });

    //api parentesco
    useEffect(() => {
        fetchDato();
    }, []);

    const fetchDato = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.getParentesco();
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDatoParentesco(response.data);

            //objeto para mapear IDs a textos
            const idToTextMap = {};
            response.data.forEach(item => {
                idToTextMap[item.idParentesco] = item.Nombre;
            });
            setIdToTextMap(idToTextMap); // Guardar el objeto en el estado
        } catch (error) {
            enqueueSnackbar("Error fetching Dato: " + error.message, {
                variant: "error",
            });
        }
    };

    //api provincias
    useEffect(() => {
        fetchDatoProvincia();
    }, []);

    const fetchDatoProvincia = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.getProvincias();
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDatoProvincia(response.data);
            //objeto para mapear IDs a textos
            const idToTextMapProvincia = {};
            response.data.forEach(item => {
                idToTextMapProvincia[item.idProvincia] = item.Nombre;
            });
            setIdToTextMapProvincia(idToTextMapProvincia); // Guardar el objeto en el estado
        } catch (error) {
            enqueueSnackbar("Error fetching Dato: " + error.message, {
                variant: "error",
            });
        }
    }

    //api cantones
    useEffect(() => {
        if (formData.provincia) {
            fetchDatoCanton(formData.provincia);
        } 
    }, [formData.provincia]);  // Dependencia

    const fetchDatoCanton = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.getCantones(id);
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDatoCanton(response.data);
            //objeto para mapear IDs a textos
            const newMapping = { ...idToTextMapCanton };
            response.data.forEach(item => {
                newMapping[item.idCanton] = item.Nombre;
            });
            setIdToTextMapCanton(newMapping); // Guardar el objeto en el estado
        } catch (error) {
            enqueueSnackbar("Error fetching Dato: " + error.message, {
                variant: "error",
            });
        }
    }

    //api estado
    useEffect(() => {
        fetchDatoEstado();
    }, []);

    const fetchDatoEstado = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.getEstadoReferencia();
            const response = await axios.get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDatoEstado(response.data);
            //objeto para mapear IDs a textos
            const idToTextMapEstado = {};
            response.data.forEach(item => {
                idToTextMapEstado[item.idEstadoGestns] = item.DESCRIPCION;
            });
            setIdToTextMapEstado(idToTextMapEstado); // Guardar el objeto en el estado
        } catch (error) {
            enqueueSnackbar("Error fetching Dato: " + error.message, {
                variant: "error",
            });
        }
    }

    //api enviar datos modal

    const enviarDatosModal = async (datos) => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.post_creVerificacionTelefonica(); // URL de la API

            const response = await axios.post(url, datos, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status == 201) {
                enqueueSnackbar("Datos enviados correctamente", { variant: "success" });
            } else {
                enqueueSnackbar("Error al enviar los datos 1", { variant: "error" });
            }
        } catch (error) {
            console.error("Error al enviar los datos 2:", error.response?.data);
            enqueueSnackbar("Error al enviar los datos: " + error.response?.data?.message || error.message, { variant: "error" });
        }
    };


    //almacenar datos tabla
    const [tablaDatos, setTablaDatos] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "provincia") {
            setFormData(prev => ({
                ...prev,
                provincia: value,
                canton: ""  // Resetear cantón al cambiar provincia
            }));
            return;
        }

        if (name === "apellidoPaterno" || name === "primerNombre" || name === "segundoNombre") {
            // Solo letras
            const filteredValue = value.replace(/[^A-Za-z]/g, '');
            setFormData({ ...formData, [name]: filteredValue });
        } else if (name === "celular") {
            // Solo números
            const filteredValue = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
            setFormData({ ...formData, [name]: filteredValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleChangeModal = (e) => {
        const { name, value } = e.target;

        if (name === "observaciones") {
            // Eliminar espacios en blanco al inicio, pero permitirlos hacia la derecha
            const trimmedValue = value.trimStart();
            setFormDataModal({ ...formDataModal, [name]: trimmedValue });
        } else if (name === "contactoEfectivo") {
            // Eliminar espacios al inicio y permitir solo letras 
            const trimmedValue = value.trimStart(); // Elimina espacios al inicio
            const filteredValue = trimmedValue.replace(/[^A-Za-z\s]/g, ""); // Permite letras y espacios
            setFormDataModal({ ...formDataModal, [name]: filteredValue });
        }
        else {
            setFormDataModal({ ...formDataModal, [name]: value });
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
            celular: "",
        });
    };

    const handleLimpiarModal = () => {
        setFormDataModal({
            contactoEfectivo: "",
            estado: "",
            observaciones: "",
        });
    };

    const handleAgregar = () => {
        // Validar campos
        if (formData.parentesco === "") {
            enqueueSnackbar("Parentesco es requerido", { variant: "error" });
            return;
        }
        if (formData.apellidoPaterno.length < 3) {
            enqueueSnackbar("Apellido Paterno es requerido", { variant: "error" });
            return;
        }
        if (formData.primerNombre.length < 3) {
            enqueueSnackbar("Primer Nombre es requerido", { variant: "error" });
            return;
        }
        if (formData.provincia === "") {
            enqueueSnackbar("Provincia es requerido", { variant: "error" });
            return;
        }
        if (formData.canton === "") {
            enqueueSnackbar("Cantón es requerido", { variant: "error" });
            return;
        }
        if (formData.celular.length < 10) {
            enqueueSnackbar("Celular debe tener 10 dígitos", { variant: "error" });
            return;
        }
        const celularExistente = tablaDatos.some((row) => row.celular === formData.celular);
        if (celularExistente) {
            enqueueSnackbar("El celular ya existe", { variant: "error" });
            return;
        }
        const newReferencia = { ...formData };
        setTablaDatos(prevDatos => [...prevDatos, newReferencia]);
        const currentCantonId = formData.canton;
        const currentProvinciaId = formData.provincia;
        setFormData({
            parentesco: "",
            apellidoPaterno: "",
            primerNombre: "",
            segundoNombre: "",
            provincia: "",
            canton: "",
            celular: "",
        });
        if (currentProvinciaId) {
            fetchDatoCanton(currentProvinciaId);
        }

        //setTablaDatos([...tablaDatos, formData]);
        enqueueSnackbar("Datos Guardados", { variant: "success" });
        //handleLimpiar();  Limpia el formulario para agregar otro registro
    };

    const handleOpenDialog = (index) => {
        setSelectedRow(tablaDatos[index]);
        setView(true);
    };

    const handleCloseDialog = () => {
        setView(false);
        setSelectedRow(null);
    };

    // Obtener fecha y hora actual
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Formato YYYY-MM-DD HH:mm:ss
    };

    const handleGuardarModal = () => {
        if (formDataModal.contactoEfectivo.length < 5) {
            enqueueSnackbar("Contacto Efectivo es requerido", { variant: "error" });
            return;
        }
        if (!formDataModal.estado) {
            enqueueSnackbar("Estado es requerido", { variant: "error" });
            return;
        }
        if (formDataModal.observaciones.length < 10) {
            enqueueSnackbar("Observaciones son requeridas (Mínimo 10 caracteres)", { variant: "error" });
            return;
        }
        //objeto de datos que se enviará a la API
        const datosParaEnviar = {
            Fecha: getCurrentDateTime(), // Fecha 
            Telefono: selectedRow.celular, // Celular 
            Contacto: formDataModal.contactoEfectivo, // Contacto efectivo
            idParentesco: Number(selectedRow.parentesco), // parentesco/referencia
            idEstadoGestns: Number(formDataModal.estado), // estado
            Observaciones: formDataModal.observaciones, // Observaciones
            ClienteGarante: false, // Valor por defecto
            Origen: 1, // Valor por defecto
            idCre_Solicitud: 1, // Valor por defecto 
            Estado: true, // Valor por defecto
            NotasDelSistema: "Notas del sistema", // Valor por defecto
            Usuario: "Usuario", // Valor por defecto
            Indice: 1, // Valor por defecto
            Web: 1, // Valor por defecto
        };
        console.log("Datos a enviar:", datosParaEnviar);

        // Enviar los datos a la API
        enviarDatosModal(datosParaEnviar);

        // Guardar el registro para mostrar los datos en la tabla del modal
        const nuevoRegistro = {
            fecha: datosParaEnviar.Fecha,
            celularMod: datosParaEnviar.Telefono,
            contactoEfectivo: datosParaEnviar.Contacto,
            referencia: idToTextMap[selectedRow.parentesco],
            estado: datosParaEnviar.idEstadoGestns,
            observaciones: formDataModal.observaciones,
        };
        /*
        const nuevoRegistro = {
            fecha: getCurrentDateTime(),
            celularMod: selectedRow.celular,
            contactoEfectivo: formData.contactoEfectivo,
            referencia: idToTextMap[selectedRow.parentesco],
            referenciaId: selectedRow.parentesco,
            estado: formData.estado,
            observaciones: formData.observaciones,
        }; */
        console.log(nuevoRegistro);
        setTablaModal([...tablaModal, nuevoRegistro]);
        enqueueSnackbar("Registro Guardado", { variant: "success" });
        handleLimpiarModal();
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Parentesco */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Parentesco(*)</label>
                    <select
                        name="parentesco"
                        className="p-2 border rounded"
                        value={formData.parentesco}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {datoParentesco.map((opcion) => (
                            <option key={opcion.idParentesco} value={opcion.idParentesco}>
                                {opcion.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Apellido Paterno */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Apellido Paterno(*)</label>
                    <input
                        type="text"
                        name="apellidoPaterno"
                        autocomplete="off"
                        placeholder="Apellido Paterno"
                        className="p-2 border rounded"
                        value={formData.apellidoPaterno}
                        onChange={handleChange}
                        pattern="[A-Za-z]+"
                        title="Solo se permiten letras"
                    />
                </div>
                {/* Primer Nombre */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Primer Nombre(*)</label>
                    <input
                        type="text"
                        name="primerNombre"
                        autocomplete="off"
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
                        autocomplete="off"
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
                    <label className="text-lightGrey text-xs mb-2">Provincia(*)</label>
                    <select
                        name="provincia"
                        className="p-2 border rounded"
                        value={formData.provincia}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {datoProvincia.map((opcion) => (
                            <option key={opcion.idProvincia} value={opcion.idProvincia}>
                                {opcion.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Canton */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Cantón(*)</label>
                    <select
                        name="canton"
                        className="p-2 border rounded"
                        value={formData.canton}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una opción</option>
                        {datoCanton.map((opcion) => (
                            <option key={opcion.idCanton} value={opcion.idCanton}>
                                {opcion.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Celular */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Celular(*)</label>
                    <input
                        type="text"
                        name="celular"
                        autocomplete="off"
                        placeholder="Celular"
                        className="p-2 border rounded"
                        value={formData.celular}
                        onChange={handleChange}
                        maxLength="10"
                        pattern="\d{10}"
                    />
                </div>
                {/* Botones */}
                <div className="flex items-center justify-center">
                    <button onClick={handleAgregar} className="p-2 bg-blue-500 text-white rounded mr-2">
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
                                <th className="px-4 py-2 text-center font-bold">Cantón</th>
                                <th className="px-4 py-2 text-center font-bold">Celular</th>
                                <th className="px-4 py-2 text-center font-bold">....</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Tabla Referencias */}
                            {tablaDatos.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-center">{idToTextMap[row.parentesco]}</td>
                                    <td className="px-4 py-2 text-center">{row.apellidoPaterno}</td>
                                    <td className="px-4 py-2 text-center">{row.primerNombre}</td>
                                    <td className="px-4 py-2 text-center">{row.segundoNombre}</td>
                                    <td className="px-4 py-2 text-center">{idToTextMapProvincia[row.provincia]}</td>
                                    <td className="px-4 py-2 text-center">{idToTextMapCanton[row.canton]}</td>
                                    <td className="px-4 py-2 text-center">{row.celular}</td>
                                    <td className="px-4 py-2 text-center">
                                        <IconButton color="primary" aria-label="call" onClick={() => handleOpenDialog(index)}>
                                            <CallIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={view} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle className="text-xl font-bold">
                    Verificación Telefonica
                </DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <div>
                            {/* Datos */}
                            <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
                                {/*primer columna */}
                                <div className="md:w-1/3">
                                    <div className="grid grid-cols-1 gap-y-4 text-base leading-relaxed">
                                        <div className="flex items-center gap-2">
                                            <PersonIcon className="text-blue-500" fontSize="medium" />
                                            <p>
                                                {selectedRow.primerNombre}{" "}
                                                {selectedRow.segundoNombre}{" "}
                                                {selectedRow.apellidoPaterno}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="text-blue-500" fontSize="medium" />
                                            <p className="font-semibold">Teléfono:</p>
                                            <p>{selectedRow.celular}</p>
                                        </div>

                                    </div>
                                </div>

                                {/*segunda columna */}
                                <div className="md:w-1/3">
                                    <div className="grid grid-cols-1 gap-y-4 text-base leading-relaxed">
                                        <div className="flex items-center gap-2">
                                            <EventIcon className="text-blue-500" fontSize="medium" />
                                            <p className="font-semibold">Fecha:</p>
                                            <p>{getCurrentDateTime()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <SupervisorAccountIcon
                                                className="text-blue-500"
                                                fontSize="medium"
                                            />
                                            <p className="font-semibold">Referencia:</p>
                                            <p>{idToTextMap[selectedRow.parentesco]}</p>
                                        </div>
                                    </div>
                                </div>
                                {/*tercera columna */}
                                <div className="md:w-1/3">
                                    <div className="grid grid-cols-1 gap-y-4 text-base leading-relaxed">
                                        {/* estado */}
                                        <div className="flex flex-col">
                                            <label className="text-lightGrey text-xs mb-2">Estado(*)</label>
                                            <select
                                                name="estado"
                                                className="p-2 border rounded"
                                                value={formDataModal.estado}
                                                onChange={handleChangeModal}
                                            >
                                                <option value="">Seleccione una opción</option>
                                                {datoEstado.map((opcion) => (
                                                    <option key={opcion.idEstadoGestns} value={opcion.idEstadoGestns}>
                                                        {opcion.DESCRIPCION}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-lightGrey text-xs mb-2">Contacto Efectivo(*)</label>
                                            <input
                                                type="text"
                                                name="contactoEfectivo"
                                                autocomplete="off"
                                                placeholder="Contacto Efectivo"
                                                className="p-2 border rounded"
                                                value={formDataModal.contactoEfectivo}
                                                onChange={handleChangeModal}
                                                pattern="[A-Za-z]+"
                                                title="Solo se permiten letras"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*  Observaciones */}
                            <div className="mt-6">
                                <label className="text-lightGrey text-xs mb-2">Observaciones(*)</label>
                                <textarea
                                    name="observaciones"
                                    rows="3"
                                    placeholder="Ingrese observaciones"
                                    className="w-full p-2 border rounded"
                                    value={formDataModal.observaciones}
                                    onChange={handleChangeModal}
                                ></textarea>
                            </div>

                            {/* Tabla Modal */}
                            <div className="mt-6">
                                <h3 className="text-lg font-bold mb-2">Registros Guardados</h3>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Fecha</TableCell>
                                                <TableCell>Celular</TableCell>
                                                <TableCell>Contacto</TableCell>
                                                <TableCell>Referencia</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Observaciones</TableCell>
                                                <TableCell>Notas del Sistema</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tablaModal.map((registro, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{registro.fecha}</TableCell>
                                                    <TableCell>{registro.celularMod}</TableCell>
                                                    <TableCell>{registro.contactoEfectivo}</TableCell>
                                                    <TableCell>{registro.referencia}</TableCell>
                                                    <TableCell>{idToTextMapEstado[registro.estado]}</TableCell>
                                                    <TableCell>{registro.observaciones}</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleGuardarModal} color="primary">
                        Guardar
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
