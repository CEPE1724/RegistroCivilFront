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
    Tooltip,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from "@mui/material";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";

import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import StoreIcon from "@mui/icons-material/Store";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";

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
        } else {
            setDatoCanton([]);  // Limpiar cantones si no hay provincia
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
            const idToTextMapCanton = {};
            response.data.forEach(item => {
                idToTextMapCanton[item.idCanton] = item.Nombre;
            });
            setIdToTextMapCanton(idToTextMapCanton); // Guardar el objeto en el estado
        } catch (error) {
            enqueueSnackbar("Error fetching Dato: " + error.message, {
                variant: "error",
            });
        }
    }


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
            enqueueSnackbar("Canton es requerido", { variant: "error" });
            return;
        }
        if (formData.celular.length < 10) {
            enqueueSnackbar("Celular debe tener 10 dígitos", { variant: "error" });
            return;
        }
        setTablaDatos([...tablaDatos, formData]);
        console.log(formData);
        enqueueSnackbar("Datos Guardados", { variant: "success" });
        // Limpiar el formulario después de agregar
        handleLimpiar();
    };

    const handleOpenDialog = (row) => {
        setSelectedRow(row);
        setView(true);
    };

    const handleCloseDialog = () => {
        setView(false);
        setSelectedRow(null);
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
                    <label className="text-lightGrey text-xs mb-2">Canton(*)</label>
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
                    <button onClick={handleOpenDialog} className="p-2 bg-blue-500 text-white rounded">
                        ver
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

            {/* Dialog */}
            <Dialog open={view} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle className="text-xl font-bold">
                    Detalles de la Solicitud
                </DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
                            {/* Datos */}
                            <div className="md:w-2/3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-base leading-relaxed">

                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
