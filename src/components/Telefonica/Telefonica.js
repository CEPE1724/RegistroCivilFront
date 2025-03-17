import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import CallIcon from '@mui/icons-material/Call';
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from "@mui/icons-material/Event";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import axios from "axios";
import { APIURL } from "../../configApi/apiConfig";
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

export function TelefonicaList({
    id,
    NumeroSolicitud,
    nombre,
    cedula,
    fecha,
    almacen,
    foto,
    vendedor,
    consulta,
}) {
    const [files, setFiles] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const navigate = useNavigate();
    const [clientInfo, setClientInfo] = useState({
        id: null,
        nombre: "",
        cedula: "",
        fecha: "",
        almacen: "",
        foto: "",
        NumeroSolicitud: "",
        vendedor: "",
        consulta: "",
    });
    const [filePreviews, setFilePreviews] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);

    console.log("clientInfo", clientInfo);

    //almacenar datos modal
    const [formDataModal, setFormDataModal] = useState({
        contactoEfectivo: "",
        estado: "",
        referencia: "",
        observaciones: "",
    });
    const [view, setView] = useState(false);
    const [tablaDatos, setTablaDatos] = useState([]);  //almacenar datos tabla
    const [tablaModal, setTablaModal] = useState([]);   //estado datos tabla modal
    const [datoEstado, setDatoEstado] = useState([]);  //estado para api Estado
    const [idToTextMapEstado, setIdToTextMapEstado] = useState({});   //estado para mapear IDs a textos de api Estado
    const [datoParentesco, setDatoParentesco] = useState([]);  //estado parentesco
    const [idToTextMap, setIdToTextMap] = useState({});   //estado para mapear IDs a textos de api parentesco

    //Abrir modal
    const handleOpenDialog = (index) => {
        //setSelectedRow(tablaDatos[index]);
        setView(true);
    };
    //Cerrar modal
    const handleCloseDialog = () => {
        setView(false);
        setSelectedRow(null);
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

    const handleLimpiarModal = () => {
        setFormDataModal({
            contactoEfectivo: "",
            estado: "",
            referencia: "",
            observaciones: "",
        });
    };

    const handleGuardarModal = () => {
        if (!formDataModal.referencia) {
            enqueueSnackbar("Referencia es requerida", { variant: "error" });
            return;
        }
        if (!formDataModal.estado) {
            enqueueSnackbar("Estado es requerido", { variant: "error" });
            return;
        }
        if (formDataModal.contactoEfectivo.length < 5) {
            enqueueSnackbar("Contacto Efectivo es requerido", { variant: "error" });
            return;
        }
        if (formDataModal.observaciones.length < 10) {
            enqueueSnackbar("Observaciones son requeridas (Mínimo 10 caracteres)", { variant: "error" });
            return;
        }
        //objeto de datos que se enviará a la API
        const datosParaEnviar = {
            Fecha: clientInfo.fecha, // Fecha 
            Telefono: clientInfo.cedula, // Celular 
            Contacto: formDataModal.contactoEfectivo, // Contacto efectivo
            idParentesco: Number(formDataModal.referencia), // parentesco/referencia
            idEstadoGestns: Number(formDataModal.estado), // estado
            Observaciones: formDataModal.observaciones, // Observaciones
            ClienteGarante: false, // Valor por defecto
            Origen: 1, // Valor por defecto
            idCre_SolicitudWeb: 1, // Valor por defecto 
            Estado: true, // Valor por defecto
            NotasDelSistema: "Notas del sistema", // Valor por defecto
            Usuario: "Usuario", // Valor por defecto
            Indice: 1, // Valor por defecto
            Web: 1, // Valor por defecto
            Nuevo: true, // Valor por defecto           
        };
        console.log("Datos a enviar:", datosParaEnviar);

        // Enviar los datos a la API
        enviarDatosModal(datosParaEnviar);

        // Guardar el registro para mostrar los datos en la tabla del modal
        const nuevoRegistro = {
            fecha: datosParaEnviar.Fecha,
            celularMod: datosParaEnviar.Telefono,
            contactoEfectivo: datosParaEnviar.Contacto,
            referencia: datosParaEnviar.idParentesco,
            estado: datosParaEnviar.idEstadoGestns,
            observaciones: datosParaEnviar.Observaciones,
        };
        console.log(nuevoRegistro);
        setTablaModal([...tablaModal, nuevoRegistro]);
        enqueueSnackbar("Registro Guardado", { variant: "success" });
        handleLimpiarModal();
    };

    useEffect(() => {
        if (location.state) {
            // Si hay datos en `location.state`, los guardamos en localStorage
            localStorage.setItem("clientInfo", JSON.stringify(location.state));
            setClientInfo(location.state);
        } else {
            // Si no hay datos en `location.state`, intentamos recuperar de localStorage
            const savedClientInfo = localStorage.getItem("clientInfo");
            if (savedClientInfo) {
                setClientInfo(JSON.parse(savedClientInfo));
            }
        }
    }, [location.state]);


    useEffect(() => {
        // Actualiza la información del cliente cuando cambie location.state
        // Optimiza la vista previa de los archivos seleccionados
        const updatedFilePreviews = {};
        Object.keys(files).forEach((field) => {
            updatedFilePreviews[field] = files[field].map((file) => {
                if (file.type === "application/pdf") {
                    // Crea URL para vista previa de archivos PDF
                    return URL.createObjectURL(file);
                }
                // Si no es PDF, puede que quieras otra lógica para imágenes o diferentes tipos de archivo
                return URL.createObjectURL(file);
            });
        });

        setFilePreviews(updatedFilePreviews);

        // Cleanup: Elimina las URLs de los archivos cuando el componente se desmonte o cambie
        return () => {
            Object.values(updatedFilePreviews).forEach((previewUrls) =>
                previewUrls.forEach((url) => URL.revokeObjectURL(url))
            );
        };
    }, [location.state, files]); // Se ejecuta cuando 'location.state' o 'files' cambian

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

    //api referencias
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

    //api enviar datos modal        
    const enviarDatosModal = async (datos) => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.post_creSolicitudVerificacionTelefonica(); // URL de la API

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

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                <div className="w-full bg-white p-6 rounded-lg shadow-lg">
                    {/* Información del cliente */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {clientInfo.foto && (
                                <div className="flex justify-center items-center md:w-1/4">
                                    <img
                                        src={clientInfo.foto}
                                        alt="Foto del cliente"
                                        className="w-80 h-80 md:w-64 md:h-64 object-cover border-4 border-gray-300 rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="md:w-3/4 mt-6 pl-4 bg-white shadow-lg rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base leading-relaxed pl-10">
                                    {[
                                        ["Número de Solicitud", clientInfo.NumeroSolicitud],
                                        ["Nombre", clientInfo.nombre],
                                        ["Cédula", clientInfo.cedula],
                                        ["Fecha", clientInfo.fecha],
                                        ["Vendedor", clientInfo.vendedor],
                                        ["Tipo de consulta", clientInfo.consulta],
                                        ["Almacén", clientInfo.almacen],
                                    ].map(([label, value], idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <p className="font-semibold text-gray-700">{label}:</p>
                                            <p className="text-gray-500">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Tabla */}
                    <div className="p-6 bg-gray-50 min-h-screen overflow-auto">
                        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 text-center font-bold">#</th>
                                        <th className="px-4 py-2 text-center font-bold">Origen</th>
                                        <th className="px-4 py-2 text-center font-bold">Fecha</th>
                                        <th className="px-4 py-2 text-center font-bold">Telefono</th>
                                        <th className="px-4 py-2 text-center font-bold">....</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Tabla Referencias */}
                                    <tr >
                                        <td className="px-4 py-2 text-center">1</td>
                                        <td className="px-4 py-2 text-center">Domicilio</td>
                                        <td className="px-4 py-2 text-center">{clientInfo.fecha}</td>
                                        <td className="px-4 py-2 text-center">0912345678</td>
                                        <td className="px-4 py-2 text-center">
                                            <IconButton color="primary" aria-label="call" onClick={() => handleOpenDialog()}>
                                                <CallIcon />
                                            </IconButton>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Modal */}
                    <Dialog open={view} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                        <DialogTitle className="text-xl font-bold">
                            Verificación Telefonica de {clientInfo.nombre}
                        </DialogTitle>
                        <DialogContent dividers>
                            {clientInfo && (
                                <div>
                                    {/* Datos */}
                                    <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
                                        {/*primer columna */}
                                        <div className="md:w-1/3">
                                            <div className="grid grid-cols-1 gap-y-4 text-base leading-relaxed">
                                                {/* Nombre*/}
                                                <div className="flex items-center gap-2">
                                                    <PersonIcon className="text-blue-500" fontSize="medium" />
                                                    <p>{clientInfo.nombre}</p>
                                                </div>
                                                {/* Cedula */}
                                                <div className="flex items-center gap-2">
                                                    <ArticleIcon className="text-blue-500" fontSize="medium" />
                                                    <p className="font-semibold">Cedula:</p>
                                                    <p>{clientInfo.cedula}</p>
                                                </div>

                                            </div>
                                        </div>

                                        {/*segunda columna */}
                                        <div className="md:w-1/3">
                                            <div className="grid grid-cols-1 gap-y-4 text-base leading-relaxed">
                                                {/* Fecha */}
                                                <div className="flex items-center gap-2">
                                                    <EventIcon className="text-blue-500" fontSize="medium" />
                                                    {/* <p className="font-semibold">Fecha:</p> */}
                                                    <p>{clientInfo.fecha}</p>
                                                </div>
                                                {/* Referencia */}
                                                <div className="flex flex-col">
                                                    <label className="text-lightGrey text-xs mb-2 font-semibold">Referencia(*)</label>
                                                    <select
                                                        name="referencia"
                                                        className="p-2 border rounded"
                                                        value={formDataModal.referencia}
                                                        onChange={handleChangeModal}
                                                    >
                                                        <option value="">Seleccione una opción</option>
                                                        {datoParentesco.map((opcion) => (
                                                            <option key={opcion.idParentesco} value={opcion.idParentesco}>
                                                                {opcion.Nombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {/*tercera columna */}
                                        <div className="md:w-1/3">
                                            <div className="grid grid-cols-1 gap-y-4 text-base leading-relaxed">
                                                {/* estado */}
                                                <div className="flex flex-col">
                                                    <label className="text-lightGrey text-xs mb-2 font-semibold">Estado(*)</label>
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
                                                {/* Contacto Efectivo */}
                                                <div className="flex flex-col">
                                                    <label className="text-lightGrey text-xs mb-2 font-semibold">Contacto Efectivo(*)</label>
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
                                        <label className="text-lightGrey text-xs mb-2 font-semibold">Observaciones(*)</label>
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
                                                            <TableCell>{idToTextMap[registro.referencia]}</TableCell>
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
            </div>
        </div>
    );
}
