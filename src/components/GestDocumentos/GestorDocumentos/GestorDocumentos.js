import { useState, useEffect, useRef } from "react";
import * as React from 'react';
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import { APIURL } from '../../../configApi/apiConfig';
import { useAuth } from '../../AuthContext/AuthContext';
import axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function GestorDocumentos({
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
    const { userData, userUsuario } = useAuth();
    const [files, setFiles] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const [view, setView] = useState(false);
    const [currentFileUrl, setCurrentFileUrl] = useState("");
    const modalRef = useRef(null);
    const [filePreviews, setFilePreviews] = useState({});
    const [open, setOpen] = React.useState(false);

    // Estado para mantener todos los documentos de la solicitud (tanto visibles como procesados)
    const [allDocuments, setAllDocuments] = useState([]);
    // Estado para mantener el estado de los documentos (aprobados, rechazados, pendientes)
    const [documentStatus, setDocumentStatus] = useState({});

    const [clientInfo, setClientInfo] = useState({
        id: "",
        nombre: "",
        cedula: "",
        fecha: "",
        almacen: "",
        foto: "",
        NumeroSolicitud: "",
        vendedor: "",
        consulta: "",
    });

    // Función para obtener TODOS los documentos (incluyendo aprobados y rechazados)
    const fetchAllDocuments = async () => {
        try {
            if (!clientInfo.id) return;

            // Obtenemos documentos con estado 2 (pendientes)
            const pendingUrl = APIURL.get_documentosEstado(clientInfo.id, 2);
            const pendingResponse = await axios.get(pendingUrl);

            // Obtenemos documentos con estado 3 (aprobados)
            const approvedUrl = APIURL.get_documentosEstado(clientInfo.id, 3);
            let approvedDocs = [];
            try {
                const approvedResponse = await axios.get(approvedUrl);
                if (approvedResponse.status === 200 && Array.isArray(approvedResponse.data)) {
                    approvedDocs = approvedResponse.data;
                }
            } catch (error) {
                console.log("No hay documentos aprobados o error al obtenerlos");
            }

            // Obtenemos documentos con estado 4 (rechazados)
            const rejectedUrl = APIURL.get_documentosEstado(clientInfo.id, 4);
            let rejectedDocs = [];
            try {
                const rejectedResponse = await axios.get(rejectedUrl);
                if (rejectedResponse.status === 200 && Array.isArray(rejectedResponse.data)) {
                    rejectedDocs = rejectedResponse.data;
                }
            } catch (error) {
                console.log("No hay documentos rechazados o error al obtenerlos");
            }

            // Combinamos todos los documentos
            const allDocs = [
                ...(Array.isArray(pendingResponse.data) ? pendingResponse.data : []),
                ...approvedDocs,
                ...rejectedDocs
            ];

            // Procesamos la información de todos los documentos
            const processedDocs = [];
            const docStatus = {};

            allDocs.forEach(doc => {
                const fileName = doc.RutaDocumento.split('/').pop();
                const docType = getTipoDocumento(doc.idTipoDocumentoWEB);

                processedDocs.push({
                    id: doc.idDocumentosSolicitudWeb,
                    name: fileName,
                    url: doc.RutaDocumento,
                    type: doc.idTipoDocumentoWEB,
                    typeName: docType,
                    estado: doc.idEstadoDocumento
                });

                // Guardamos el estado del documento
                docStatus[doc.idDocumentosSolicitudWeb] = doc.idEstadoDocumento;
            });

            setAllDocuments(processedDocs);
            setDocumentStatus(docStatus);

            // También actualizamos los archivos para mostrar en la interfaz (solo los pendientes)
            if (pendingResponse.status === 200 && Array.isArray(pendingResponse.data)) {
                const uploadedFiles = {};
                const previews = {};

                pendingResponse.data.forEach((file) => {
                    const sectionName = getTipoDocumento(file.idTipoDocumentoWEB);
                    if (!uploadedFiles[sectionName]) {
                        uploadedFiles[sectionName] = [];
                        previews[sectionName] = [];
                    }

                    // Extrae el nombre del archivo desde la ruta
                    const fileName = file.RutaDocumento.split('/').pop();
                    const fileUrl = file.RutaDocumento;

                    uploadedFiles[sectionName].push({
                        idDocumentosSolicitudWeb: file.idDocumentosSolicitudWeb,
                        name: fileName,
                        url: fileUrl,
                        type: fileUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                        idTipoDocumento: file.idTipoDocumentoWEB
                    });

                    previews[sectionName].push(fileUrl);
                });

                setFiles(uploadedFiles);
                setFilePreviews(previews);
            }
        } catch (error) {
            enqueueSnackbar("Error al obtener archivos.", { variant: "error" });
            console.error("Error al obtener archivos:", error);
        }
    };

    useEffect(() => {
        if (clientInfo.id) {
            fetchAllDocuments();

            // Intentar cargar estados guardados de localStorage si existen
            const savedDocStatus = localStorage.getItem(`docStatus_${clientInfo.id}`);
            if (savedDocStatus) {
                setDocumentStatus(JSON.parse(savedDocStatus));
            }
        }
    }, [clientInfo.id]);

    // API cambiar estado del documento
    const estadoDocumentos = async (idDocumentosSolicitudWeb, idEstadoDocumento) => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.patch_documentos(idDocumentosSolicitudWeb);
            const datos = {
                idEstadoDocumento: idEstadoDocumento,
            };

            const response = await axios.patch(url, datos, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                enqueueSnackbar("Datos enviados correctamente", { variant: "success" });

                // Actualizamos el estado del documento
                const updatedStatus = { ...documentStatus };
                updatedStatus[idDocumentosSolicitudWeb] = idEstadoDocumento;
                setDocumentStatus(updatedStatus);

                // Guardamos en localStorage
                localStorage.setItem(`docStatus_${clientInfo.id}`, JSON.stringify(updatedStatus));

                // Actualizamos la lista de archivos pendientes
                await fetchAllDocuments();
            } else {
                enqueueSnackbar("Error al enviar los datos", { variant: "error" });
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error.response?.data);
            enqueueSnackbar("Error al enviar los datos: " + error.response?.data?.message || error.message, { variant: "error" });
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Función rechazo de documento
    const handleRechazar = (idDocumentosSolicitudWeb) => {
        estadoDocumentos(idDocumentosSolicitudWeb, 4);
    };

    // Función aprobación de documento
    const handleAprobar = (idDocumentosSolicitudWeb) => {
        estadoDocumentos(idDocumentosSolicitudWeb, 3);
    };

    const getTipoDocumento = (id) => {
        const documentoIds = {
            1: "Buro Credito",
            2: "Copia De Cedula",
            3: "Contrato de Compra",
            4: "Declaracion",
            5: "Pagare a la Orden",
            6: "Tabla de amortizacion",
            7: "Gastos de cobranza",
            8: "Compromiso Lugar de pago",
            9: "Acta",
            10: "Consentimiento",
            11: "Autorización",
        };
        return documentoIds[id] || `Documento Tipo ${id}`;
    };

    // Obtener el color según estado del documento
    const getStatusColor = (docId) => {
        const status = documentStatus[docId];
        if (status === 3) return "text-green-500"; // Aprobado
        if (status === 4) return "text-red-500";   // Rechazado
        return "text-gray-300"; // Pendiente
    };

    // Obtener el estado en texto
    const getStatusText = (docId) => {
        const status = documentStatus[docId];
        if (status === 3) return "✓ Aprobado";
        if (status === 4) return "✗ Rechazado";
        return "• Pendiente";
    };

    useEffect(() => {
        if (location.state) {
            localStorage.setItem("clientInfo", JSON.stringify(location.state));
            setClientInfo(location.state);
        } else {
            const savedClientInfo = localStorage.getItem("clientInfo");
            if (savedClientInfo) {
                setClientInfo(JSON.parse(savedClientInfo));
            }
        }
    }, [location.state]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setView(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleView = (fileUrl) => {
        setCurrentFileUrl(fileUrl);
        setView(!view);
    };

    // Agrupar documentos por tipo
    const documentsByType = allDocuments.reduce((acc, doc) => {
        if (!acc[doc.typeName]) {
            acc[doc.typeName] = [];
        }
        acc[doc.typeName].push(doc);
        return acc;
    }, {});

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div
                className={`w-64 bg-[#2d3689] text-white ${isMenuOpen ? "block" : "hidden"} md:block transition-all duration-300 ease-in-out overflow-y-auto`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-100">Número de Solicitud: </h2>
                    <p>{clientInfo.NumeroSolicitud}</p>

                    {/* Lista de todos los documentos */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Documentos:</h3>
                        {Object.entries(documentsByType).map(([typeName, docs]) => (
                            <div key={typeName} className="mb-4">
                                <h4 className="text-white font-medium mb-1">{typeName}:</h4>
                                <ul className="pl-3 space-y-1">
                                    {docs.map(doc => (
                                        <li
                                            key={doc.id}
                                            className={`text-sm flex items-center justify-between ${getStatusColor(doc.id)}`}
                                        >
                                            <span className="truncate">{doc.name}</span>
                                            <span className="text-xs ml-1 whitespace-nowrap">{getStatusText(doc.id)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {allDocuments.length === 0 && (
                            <p className="text-sm text-gray-300">No hay documentos disponibles</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Toggle Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed top-6 left-6 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
                {isMenuOpen ? "❌" : "☰"}
            </button>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                <div className="w-full bg-white p-6 rounded-lg shadow-lg">
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

                    <div className="flex justify-center items-center mt-6 w-full">
                        <h2 className="text-2xl font-semibold text-center text-gray-800">
                            Documentos Subidos
                        </h2>
                        <Button variant="outlined" onClick={handleClickOpen}>
                            Modal 
                        </Button>
                    </div>

                    {/* Documentos pendientes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-6">
                        {Object.entries(files).map(([sectionName, sectionFiles]) => (
                            sectionFiles.map((file, index) => (
                                <div
                                    key={`${sectionName}-${index}`}
                                    className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200 hover:border-blue-500 transition duration-300"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                {sectionName || "Documento"}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {file.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <IconButton onClick={() => toggleView(file.url)}>
                                                <VisibilityIcon />
                                            </IconButton>

                                            <button
                                                type="button"
                                                name="rechazar"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRechazar(file.idDocumentosSolicitudWeb)}
                                            >
                                                ❌
                                            </button>
                                            <button
                                                type="button"
                                                name="aprobar"
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => handleAprobar(file.idDocumentosSolicitudWeb)}
                                            >
                                                ✅
                                            </button>

                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        {file.type === "application/pdf" ? (
                                            <object
                                                data={file.url}
                                                type="application/pdf"
                                                width="100%"
                                                height="200px"
                                                className="rounded-md"
                                                aria-label="Vista previa PDF"
                                            >
                                                <p>Vista previa no disponible</p>
                                            </object>
                                        ) : (
                                            <img
                                                src={file.url}
                                                alt="Vista previa archivo"
                                                className="w-full h-auto rounded-md"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ))}

                        {Object.keys(files).length === 0 && (
                            <div className="col-span-3 text-center py-10">
                                <p className="text-gray-500">No hay documentos pendientes para esta solicitud.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Vista previa */}
            {view && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div
                        ref={modalRef}
                        className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 relative">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-medium">Vista previa del documento</h3>
                            <button
                                onClick={() => toggleView("")}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ❌
                            </button>
                        </div>

                        <iframe
                            src={currentFileUrl}
                            className="w-full h-full"
                            title="Vista previa del archivo"
                        ></iframe>
                    </div>
                </div>
            )}

            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                        paper: {
                            component: 'form',
                            onSubmit: (event) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                const formJson = Object.fromEntries(formData.entries());
                                const email = formJson.email;
                                console.log(email);
                                handleClose();
                            },
                        },
                    }}
                >
                    <DialogTitle>Observaciones</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Subscribe</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

        </div>
    );
}