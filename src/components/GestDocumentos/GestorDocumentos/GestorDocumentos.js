import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { APIURL } from '../../../configApi/apiConfig';
import { useAuth } from '../../AuthContext/AuthContext';
import axios from "axios";

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
    const confirmModalRef = useRef(null);
    const [filePreviews, setFilePreviews] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Estados para el modal de confirmación
    const [confirmAction, setConfirmAction] = useState(null); // 'aprobar' o 'rechazar'
    const [currentDocId, setCurrentDocId] = useState(null);  // ID del documento
    const [observacion, setObservacion] = useState("");
    const [observaciones, setObservaciones] = useState({}); // Para almacenar las observaciones por documento
    const [allDocuments, setAllDocuments] = useState([]); // Estado para mantener todos los documentos de la solicitud
    const [documentStatus, setDocumentStatus] = useState({});

    const [currentIndex, setCurrentIndex] = useState(0);  // Estado para el carrusel
    const [flatFiles, setFlatFiles] = useState([]);  // Array de los archivos para el carrusel
    console.log("flatFiles", flatFiles);

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

    // Función para obtener todos los documentos
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
                const allFiles = [];

                pendingResponse.data.forEach((file) => {
                    const sectionName = getTipoDocumento(file.idTipoDocumentoWEB);
                    if (!uploadedFiles[sectionName]) {
                        uploadedFiles[sectionName] = [];
                        previews[sectionName] = [];
                    }

                    // Extrae el nombre del archivo desde la ruta
                    const fileName = file.RutaDocumento.split('/').pop();
                    const fileUrl = file.RutaDocumento;
                    const fileObj = {
                        idDocumentosSolicitudWeb: file.idDocumentosSolicitudWeb,
                        name: fileName,
                        url: fileUrl,
                        type: 'application/pdf',
                        idTipoDocumento: file.idTipoDocumentoWEB,
                        sectionName: sectionName
                    };

                    uploadedFiles[sectionName].push(fileObj);
                    previews[sectionName].push(fileUrl);

                    // Agregar al array plano para el carrusel
                    allFiles.push(fileObj);
                });

                setFiles(uploadedFiles);
                setFilePreviews(previews);
                setFlatFiles(allFiles);

                // Reiniciar el índice del carrusel cuando cambian los archivos
                setCurrentIndex(0);
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

            // Cargar observaciones guardadas
            const savedObservaciones = localStorage.getItem(`observaciones_${clientInfo.id}`);
            if (savedObservaciones) {
                setObservaciones(JSON.parse(savedObservaciones));
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
                // Guardamos la observación
                const updatedObservaciones = { ...observaciones };
                updatedObservaciones[idDocumentosSolicitudWeb] = observacion;
                setObservaciones(updatedObservaciones);

                // Guardamos en localStorage
                localStorage.setItem(`observaciones_${clientInfo.id}`, JSON.stringify(updatedObservaciones));

                // Mensaje según la acción
                const accion = idEstadoDocumento === 3 ? "aprobado" : "rechazado";
                enqueueSnackbar(`Documento ${accion} correctamente`, { variant: "success" });

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

    //api enviar datos modal    
    const enviarObservacion = async (datos) => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.post_observaciones();

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

    const handleEnviarObservacion = () => {
        //objeto que se enviara a la api  
        const datosObserv = {
            idCre_SolicitudWeb: clientInfo.id,
            idDocumentosSolicitudWeb: currentDocId.idDocumentosSolicitudWeb,
            idUsuario: null,
            Observacion: String(observacion),
            TipoUsuario: 1,
            Usuario: "Dan",
            idTipoDocumentoWEB: currentDocId.idTipoDocumento,
            Fecha: new Date(),
        };
        enviarObservacion(datosObserv);
    };

    // Función para mostrar el modal de confirmación
    const openConfirmModal = (file, action) => {
        setCurrentDocId(file);
        setConfirmAction(action);
        setObservacion(""); // Limpiar la observación anterior
        setShowConfirmModal(true);
    };

    // Función para confirmar la acción
    const handleConfirmAction = () => {
        // Validar si es necesaria la observación
        if (confirmAction === 'rechazar' && !observacion.trim()) {
            enqueueSnackbar("La observación es obligatoria al rechazar un documento", { variant: "error" });
            return;
        }

        // Ejecutar la acción correspondiente
        if (confirmAction === 'aprobar') {
            estadoDocumentos(currentDocId.idDocumentosSolicitudWeb, 3);
            if (observacion.trim()) {
                handleEnviarObservacion();
            }
        } else if (confirmAction === 'rechazar') {
            estadoDocumentos(currentDocId.idDocumentosSolicitudWeb, 4);
            handleEnviarObservacion();
        }

        // Cerrar el modal
        setShowConfirmModal(false);
    };

    // Función para cancelar la acción
    const handleCancelAction = () => {
        setShowConfirmModal(false);
        setObservacion("");
    };

    // Funciones actualizadas para abrir el modal antes de ejecutar la acción
    const handleRechazar = (file) => {
        openConfirmModal(file, 'rechazar');
    };

    const handleAprobar = (file) => {
        openConfirmModal(file, 'aprobar');
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

    // Efecto para detectar clicks fuera del modal de confirmación
    useEffect(() => {
        const handleClickOutsideConfirm = (event) => {
            if (confirmModalRef.current && !confirmModalRef.current.contains(event.target)) {
                setShowConfirmModal(false);
            }
        };

        if (showConfirmModal) {
            document.addEventListener("mousedown", handleClickOutsideConfirm);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideConfirm);
        };
    }, [showConfirmModal]);

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

    // Funciones para el carrusel
    const nextSlide = () => {
        if (flatFiles.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flatFiles.length);
    };

    const prevSlide = () => {
        if (flatFiles.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flatFiles.length) % flatFiles.length);
    };

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
                    </div>

                    {/* Carrusel de documentos */}
                    <div className="mt-8 mb-6">
                        {flatFiles.length > 0 ? (
                            <div className="relative">
                                {/* Indicador de documento actual */}
                                <div className="text-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Documento {currentIndex + 1} de {flatFiles.length} - {flatFiles[currentIndex].sectionName}
                                    </span>
                                </div>

                                {/* Contenedor carrusel */}
                                <div className="flex items-center">
                                    {/* Botón Anterior */}
                                    <button
                                        onClick={prevSlide}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-md mr-4 focus:outline-none"
                                        aria-label="Documento anterior"
                                    >
                                        <ArrowBackIosIcon fontSize="small" />
                                    </button>

                                    {/* Documento actual */}
                                    <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-lg border border-gray-200 relative h-screen flex flex-col">
                                        {/* Botones */}
                                        <div className="absolute top-2 right-2 flex items-center gap-1 z-10 bg-white bg-opacity-70 p-1 rounded-md">
                                            <IconButton onClick={() => toggleView(flatFiles[currentIndex].url)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <button
                                                type="button"
                                                name="rechazar"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRechazar(flatFiles[currentIndex])}
                                            >
                                                ❌
                                            </button>
                                            <button
                                                type="button"
                                                name="aprobar"
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => handleAprobar(flatFiles[currentIndex])}
                                            >
                                                ✅
                                            </button>
                                        </div>

                                        {/* Información del documento */}
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {flatFiles[currentIndex].sectionName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{flatFiles[currentIndex].name}</p>
                                        </div>

                                        {/* Vista previa del documento */}
                                        <div className="w-full flex-1 flex items-center justify-center">
                                            <object
                                                data={flatFiles[currentIndex].url}
                                                type="application/pdf"
                                                width="100%"
                                                height="100%"
                                                className="rounded-md"
                                                aria-label="Vista previa PDF"
                                            >
                                                <p>Vista previa no disponible</p>
                                            </object>
                                        </div>
                                    </div>

                                    {/* Botón Siguiente */}
                                    <button
                                        onClick={nextSlide}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-md ml-4 focus:outline-none"
                                        aria-label="Documento siguiente"
                                    >
                                        <ArrowForwardIosIcon fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
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

            {/* Modal de confirmación */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div
                        ref={confirmModalRef}
                        className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-md relative"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-medium text-gray-900">
                                {confirmAction === 'aprobar' ? 'Aprobar Documento' : 'Rechazar Documento'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {confirmAction === 'aprobar'
                                    ? ''
                                    : 'Explique el motivo del rechazo.'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="observacion" className="block text-sm font-medium text-gray-700 mb-1">
                                Observación {confirmAction === 'rechazar' && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                                id="observacion"
                                rows="4"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder={confirmAction === 'aprobar'
                                    ? "Observación (opcional)"
                                    : "Observación (obligatorio)"}
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                onClick={handleCancelAction}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 text-white rounded-md ${confirmAction === 'aprobar'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                onClick={handleConfirmAction}
                            >
                                {confirmAction === 'aprobar' ? 'Aprobar' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}