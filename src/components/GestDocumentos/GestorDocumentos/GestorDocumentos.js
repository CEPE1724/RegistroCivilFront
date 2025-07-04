import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { APIURL } from '../../../configApi/apiConfig';
import { useAuth } from '../../AuthContext/AuthContext';
import axios from "../../../configApi/axiosConfig";
import { useNavigate } from "react-router-dom";
import { fetchConsultaYNotifica, fechaHoraEcuador } from "../../Utils";
import ModalConfirmacionRechazo from '../../SolicitudGrande/Cabecera/ModalConfirmacionRechazo'; // Ajusta la ruta si es necesario
import { GoogleMapModal } from "../../ListadoSolicitud/DomicilioModal"
import jsPDF from "jspdf";

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
    estadoVerifD,
}) {
    const { userData, userUsuario, idMenu } = useAuth();
    const [files, setFiles] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const [view, setView] = useState(false);
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
    const [showApproveAllButton, setShowApproveAllButton] = useState(false); // Mostrar botón de aprobar 
    const [showRevisionButton, setShowRevisionButton] = useState(false); // Mostrar botón de revisión
    // estados para el modal global
    const [showGlobalConfirmModal, setShowGlobalConfirmModal] = useState(false);
    const [globalConfirmAction, setGlobalConfirmAction] = useState(null);
    const globalConfirmModalRef = useRef(null);
  const GOOGLE_MAPS_API_KEY = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";

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
        estadoVerifD: "",
    });

    // mostrar botones
    useEffect(() => {
        if (allDocuments.length > 0) {
            const filteredDocs = allDocuments.filter(doc => doc.type >= 1 && doc.type <= 15 || doc.type > 25);
            if (filteredDocs.length > 0) {
                const allReviewed = filteredDocs.every(doc => doc.estado === 3 || doc.estado === 4);
                if (allReviewed) {
                    // si todos los documentos estan aprobados
                    const allApproved = filteredDocs.every(doc => doc.estado === 3);
                    setShowApproveAllButton(allApproved);
                    // si algún documento está en corrección
                    const hasRejectedDocs = filteredDocs.some(doc => doc.estado === 4);
                    setShowRevisionButton(hasRejectedDocs);
                } else {
                    setShowApproveAllButton(false);
                    setShowRevisionButton(false);
                }

            }
        }
    }, [allDocuments]);


    ///funcion para el croquis 

    const fetchCroquisCoords = async (tipo) => {
        try {
            // tipo: 1 = domicilio, 2 = laboral
            const response = await axios.get(APIURL.getCoordenadasId(clientInfo.id, tipo));
            if (response.data && response.data[0]) {
				const lat = response.data[0].latitud;
				const lng = response.data[0].longitud;
                setMapLat(lat);
                setMapLng(lng);
                setMapTitle(tipo === 1 ? "Croquis Domicilio" : "Croquis Laboral");
                setShowMapModal(true);
            } else {
                enqueueSnackbar("No hay coordenadas registradas para este croquis.", { variant: "warning" });
            }
        } catch (error) {
            enqueueSnackbar("Error al obtener coordenadas", { variant: "error" });
        }
    };

    const [showMapModal, setShowMapModal] = useState(false);
    const [mapLat, setMapLat] = useState(null);
    const [mapLng, setMapLng] = useState(null);
	console.log(mapLat, mapLng)
    const [mapTitle, setMapTitle] = useState(""); // Para saber cuál croquis se está mostrando
    // Función para obtener todos los documentos
    const fetchAllDocuments = async () => {
        try {
            if (!clientInfo.id) return;

            // Obtenemos documentos con estado 2 (pendientes)
            const pendingUrl = APIURL.get_documentosEstado(clientInfo.id, 2);
            let pendingDocs = [];
            try {
                const pendingResponse = await axios.get(pendingUrl);
                if (pendingResponse.status === 200 && Array.isArray(pendingResponse.data)) {
                    pendingDocs = pendingResponse.data;
                }
            } catch (error) {
                console.log("No hay documentos pendientes o error al obtenerlos");
            }

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
                ...pendingDocs,
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

            // todos los documentos para el carrusel
            const uploadedFiles = {};
            const previews = {};
            const allFiles = [];

            // Procesar todos los documentos para la interfaz
            allDocs.forEach((file) => {
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
                    sectionName: sectionName,
                    estado: file.idEstadoDocumento
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

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    //api actualizar estado de solicitudWeb
    const updateEstadoVerificacion = async (idEstadoVerificacionDocumental) => {
        try {
            const url = APIURL.update_soliciutd_telefonica(clientInfo.id, idEstadoVerificacionDocumental);

            const response = await axios.patch(url);

            if (response.status === 200) {
                // Mensaje de éxito con el estado actualizado
                const url_estado = APIURL.post_createtiemposolicitudeswebDto();
                await axios.post(url_estado, {

                    idCre_SolicitudWeb: clientInfo.id,
                    Tipo: 3,
                    idEstadoVerificacionDocumental: idEstadoVerificacionDocumental,
                    Usuario: userData.Nombre,
                });

                const estadoTexto = {
                    3: "Enviado para corrección",
                    4: "Aprobados",
                    5: "Rechazados"
                }[idEstadoVerificacionDocumental] || "Actualizado";

                enqueueSnackbar(`Documentos ${estadoTexto}`, {
                    variant: "success",
                });
            } else {
                enqueueSnackbar("Error al actualizar la solicitud.", {
                    variant: "error",
                });
            }
        } catch (error) {
            enqueueSnackbar("Error al actualizar la solicitud.", {
                variant: "error",
            });
            console.error("Error al actualizar la solicitud:", error);
        }
    };
    ///para el rechazo 
    const updateEstadoVerificacionrechazo = async (idEstadoVerificacionDocumental, observacionModal) => {

        try {
            const url = APIURL.update_soliciutd_telefonica(clientInfo.id, idEstadoVerificacionDocumental);

            const response = await axios.patch(url);
            console.log("porque no esta imrpiendo 0")
            if (response.status === 200) {
                // Mensaje de éxito con el estado actualizado
                const url_estado = APIURL.post_createtiemposolicitudeswebDto();
                await axios.post(url_estado, {

                    idCre_SolicitudWeb: clientInfo.id,
                    Tipo: 3,
                    idEstadoVerificacionDocumental: idEstadoVerificacionDocumental,
                    Usuario: userData.Nombre,
                    Telefono: observacionModal
                });

                const estadoTexto = {
                    3: "Enviado para corrección",
                    4: "Aprobados",
                    5: "Rechazados"
                }[idEstadoVerificacionDocumental] || "Actualizado";

                enqueueSnackbar(`Documentos ${estadoTexto}`, {
                    variant: "success",
                });
            } else {
                enqueueSnackbar("Error al actualizar la solicitud.", {
                    variant: "error",
                });
            }
        } catch (error) {
            enqueueSnackbar("Error al actualizar la solicitud.", {
                variant: "error",
            });
            console.error("Error al actualizar la solicitud:", error);
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
            Usuario: userData.Nombre,
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
            enqueueSnackbar("Por favor ingrese una observación", { variant: "error" });
            return;
        }

        // Ejecutar la acción correspondiente
        if (confirmAction === 'aprobar') {
            estadoDocumentos(currentDocId.idDocumentosSolicitudWeb, 3);
            if (observacion.trim()) {
                handleEnviarObservacion();
            }
        } else if (confirmAction === 'rechazar') {
            if (observacion.length < 1) {
                enqueueSnackbar("La observación debe tener al menos 10 caracteres", { variant: "error" });
                return;
            }
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
            //   1: "Buro Credito",
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
            12: "Foto del Cliente",  //Servicio Basico
            13: "Foto Casa",  //Foto del Cliente
            14: "Servicio Basico",  //Croquis
            15: "Foto del Cliente Firmando",
            16: "Respaldo 1",
            17: "Respaldo 2",
            18: "Respaldo 3",
            19: "Respaldo 4",
            20: "Respaldo 5",
            21: "Respaldo 6",
            22: "Respaldo 7",
            23: "Respaldo 8",
            24: "Respaldo 9",
            25: "Respaldo 10",
			26: "Foto Trabajo"
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

    // título según el estado del documento actual
    const getCurrentDocumentStatusTitle = () => {
        if (flatFiles.length === 0) return "Documentos Subidos";

        const currentDocument = flatFiles[currentIndex];
        switch (currentDocument.estado) {
            case 3:
                return "Documento Aprobado";
            case 4:
                return "Documento Rechazado";
            default:
                return "Documento Pendiente";
        }
    };

    //color según el estado del documento actual
    const getCurrentDocumentStatusClass = () => {
        if (flatFiles.length === 0) return "text-gray-800";

        const currentDocument = flatFiles[currentIndex];
        switch (currentDocument.estado) {
            case 3:
                return "text-green-600";
            case 4:
                return "text-red-600";
            default:
                return "text-gray-800";
        }
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

    // botones de acción según el estado del documento
    const renderActionButtons = (document) => {
        //habilitar botones cuando estadoVerifD = 2
        if (clientInfo.estadoVerifD === 2) {
            if (document.idTipoDocumento >= 1 && document.idTipoDocumento <= 15 || document.idTipoDocumento > 25) {
                switch (document.estado) {
                    case 2: // Pendiente - mostrar ambos botones
                        return (
                            <>
                                <button
                                    type="button"
                                    name="rechazar"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRechazar(document)}
                                >
                                    ❌
                                </button>
                                <button
                                    type="button"
                                    name="aprobar"
                                    className="text-green-500 hover:text-green-700"
                                    onClick={() => handleAprobar(document)}
                                >
                                    ✅
                                </button>
                            </>
                        );
                    case 3: // Aprobado - mostrar solo rechazar
                        return (
                            <button
                                type="button"
                                name="rechazar"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRechazar(document)}
                            >
                                ❌
                            </button>
                        );
                    case 4: // Rechazado - mostrar solo aprobar
                        return (
                            <button
                                type="button"
                                name="aprobar"
                                className="text-green-500 hover:text-green-700"
                                onClick={() => handleAprobar(document)}
                            >
                                ✅
                            </button>
                        );
                    default:
                        return null;
                }
            }
        } else {
            return null;
        }
    };

    // detectar clicks fuera del modal global
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (globalConfirmModalRef.current && !globalConfirmModalRef.current.contains(event.target)) {
                setShowGlobalConfirmModal(false);
            }
        };
        if (showGlobalConfirmModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showGlobalConfirmModal]);

    // abrir modal global
    const openGlobalConfirmModal = (action) => {
        setGlobalConfirmAction(action);
        setShowGlobalConfirmModal(true);
    };

    // Función para manejar la acción global
    const handleGlobalConfirmAction = () => {
        setShowGlobalConfirmModal(false);

        // Actualizar estado de todo el documento
        switch (globalConfirmAction) {
            case 'rechTodo':
                updateEstadoVerificacion(5);
                fetchConsultaYNotifica(clientInfo.id, clientInfo, {
                    title: "¡Documentos rechazados! 🚫",
                    body: `¡Hola! Todos los documentos de la solicitud ${clientInfo.NumeroSolicitud} de ${clientInfo.nombre} fueron rechazados ☹️. Por favor, revisa los comentarios y da seguimiento al caso. ¡Gracias!
					Fecha: ${fechaHoraEcuador}`,
                    type: "success",
                    empresa: "CREDI",
                    url: "",
                    tipo: "vendedor",
                });
                navigate("/ListadoSolicitud", { replace: true });
                break;
            case 'aprobTodo':
                updateEstadoVerificacion(4);
                fetchConsultaYNotifica(clientInfo.id, clientInfo, {
                    title: "¡Documentos aprobados! 🎉",
                    body: `¡Excelente noticia! Todos los documentos de la solicitud ${clientInfo.NumeroSolicitud} de ${clientInfo.nombre} han sido revisados y aprobados 📂. Ya puedes avanzar al siguiente paso del proceso. ¡Gracias!
					Fecha: ${fechaHoraEcuador}`,
                    type: "success",
                    empresa: "CREDI",
                    url: "",
                    tipo: "vendedor",
                });
                navigate("/ListadoSolicitud", { replace: true });
                break;
            case 'revTodo':
                updateEstadoVerificacion(3);
                fetchConsultaYNotifica(clientInfo.id, clientInfo, {
                    title: "¡Documentos enviados a corrección! ✏️",
                    body: `¡Hola! Algunos documentos de la solicitud ${clientInfo.NumeroSolicitud} de ${clientInfo.nombre} fueron enviados a corrección ⚠️. Revisa los comentarios para realizar los ajustes necesarios. ¡Gracias!
					Fecha: ${fechaHoraEcuador}`,
                    type: "success",
                    empresa: "CREDI",
                    url: "",
                    tipo: "vendedor",
                });
                navigate("/ListadoSolicitud", { replace: true });
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div
                className={`w-64 bg-[#2d3689] text-white ${isMenuOpen ? "block" : "hidden"} md:block transition-all duration-300 ease-in-out overflow-y-auto`}
            >
                <div className="p-6 fixed top-0 left-0 w-full h-full bg-white z-40 overflow-y-auto
  				transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:h-auto md:w-auto md:bg-transparent md:z-auto`}">
                    {clientInfo.estadoVerifD === 2 && (
                        <div>
                            <button name="rechTodo"
                                className="bg-red-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-red-700 transition duration-300 mb-3"
                                onClick={() => openGlobalConfirmModal('rechTodo')}
                            >
                                Rechazar
                            </button>
                            {showApproveAllButton && (
                                <button
                                    name="aprobTodo"
                                    className="bg-green-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-green-700 transition duration-300 mb-3"
                                    onClick={() => openGlobalConfirmModal('aprobTodo')}
                                >
                                    Aprobar
                                </button>
                            )}
                            {showRevisionButton && (
                                <button
                                    name="revTodo"
                                    className="bg-gray-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-gray-700 transition duration-300"
                                    onClick={() => openGlobalConfirmModal('revTodo')}
                                >
                                    Corrección
                                </button>
                            )}
                        </div>
                    )}
                    {/* Lista de todos los documentos */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Documentos:</h3>
                        {Object.entries(documentsByType).map(([typeName, docs]) => (
                            <div key={typeName} className="mb-4">
                                <h4
                                    className="text-white font-medium mb-1 cursor-pointer hover:underline"
                                    onClick={() => {
                                        const index = flatFiles.findIndex(file => file.sectionName === typeName);
                                        if (index !== -1) {
                                            setCurrentIndex(index);
                                            setIsMenuOpen(false);
                                        }
                                    }}
                                >
                                    {typeName}:
                                </h4>
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
                        {/* Croquis tabs */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Croquis:</h3>
                            <button
                                className="w-full py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700 transition mb-2"
                                onClick={() => {
                                    fetchCroquisCoords(1); // 1 = domicilio
                                    setIsMenuOpen(false);
                                }}
                            >
                                Croquis Domicilio
                            </button>
                            <button
                                className="w-full py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-700 transition"
                                onClick={() => {
                                    fetchCroquisCoords(2); // 2 = laboral
                                    setIsMenuOpen(false);
                                }}
                            >
                                Croquis Laboral
                            </button>
                        </div>
                        {allDocuments.length === 0 && (
                            <p className="text-sm text-gray-300">No hay documentos disponibles</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Toggle Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed top-12 left-6 z-50 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
                {isMenuOpen ? "❌" : "☰"}
            </button>

            {/* Main Content */}
            <div className="flex-1 p-3 md:p-6 bg-white">
                <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-lg">
                    <div className="mb-4 md:mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                            {clientInfo.foto.length < 30 ? (
                                <div className="w-80 h-80 md:w-64 md:h-64 flex items-center justify-center bg-gray-100 border-4 border-gray-300 rounded-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-24 w-24 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center">
                                    <img
                                        src={clientInfo.foto}
                                        alt="Foto del cliente"
                                        className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover border-4 border-gray-300 rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="flex-1 mt-4 md:mt-6 px-2 md:px-4 bg-white shadow-lg rounded-lg p-4 md:p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 text-sm md:text-base leading-relaxed">
                                    {[
                                        ["Número Solicitud", clientInfo.NumeroSolicitud],
                                        ["Nombre", clientInfo.nombre],
                                        ["Cédula", clientInfo.cedula],
                                        ["Fecha", formatDate(clientInfo.fecha)],
                                        ["Vendedor", clientInfo.vendedor],
                                        ["Tipo de consulta", clientInfo.consulta],
                                        ["Almacén", clientInfo.almacen],
                                    ].map(([label, value], idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 md:gap-4">
                                            <p className="font-semibold text-gray-700 whitespace-nowrap">{label}:</p>
                                            <p className="text-gray-500 break-words">{value || "-"}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4 md:mt-6">
                                    <button
                                        name="aprobTodo"
                                        className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300 mb-3"
                                        onClick={() => navigate("/ListadoSolicitud", { replace: true })}
                                    >
                                        Regresar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-4 md:mt-6 w-full">
                        <h2 className={`text-xl md:text-2xl font-semibold text-center ${getCurrentDocumentStatusClass()}`}>
                            {getCurrentDocumentStatusTitle()}
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
                                    <span className={`ml-2 text-sm font-medium ${flatFiles[currentIndex].estado === 3 ? "text-green-600" :
                                        flatFiles[currentIndex].estado === 4 ? "text-red-600" :
                                            "text-gray-500"}`}>
                                        {flatFiles[currentIndex].estado === 3 ? "(Aprobado)" :
                                            flatFiles[currentIndex].estado === 4 ? "(Rechazado)" :
                                                "(Pendiente)"}
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
                                    <div className={`flex-1 bg-gray-50 p-6 rounded-lg shadow-lg border ${flatFiles[currentIndex].estado === 3 ? "border-green-300" :
                                        flatFiles[currentIndex].estado === 4 ? "border-red-300" :
                                            "border-gray-200"} relative md:h-screen flex flex-col`}>

                                        {/* Estado visual del documento */}
                                        {flatFiles[currentIndex].estado === 3 && (
                                            <div className="absolute top-0 left-0 w-full bg-green-100 text-green-800 py-1 px-4 text-center font-medium">
                                                ✅ Este documento esta aprobado ✅
                                            </div>
                                        )}
                                        {flatFiles[currentIndex].estado === 4 && (
                                            <div className="absolute top-0 left-0 w-full bg-red-100 text-red-800 py-1 px-4 text-center font-medium">
                                                ❌ Este documento esta rechazado ❌
                                            </div>
                                        )}

                                        {/* Botones */}
                                        <div className="absolute top-2 right-2 flex items-center gap-3 z-10 bg-grey-50 bg-opacity-70 p-3 rounded-md">
                                            {renderActionButtons(flatFiles[currentIndex])}
                                        </div>

                                        {/* Información del documento */}
                                        <div className="mb-4 mt-8">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {flatFiles[currentIndex].sectionName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{flatFiles[currentIndex].name}</p>
                                        </div>

                                        {/* Vista previa del documento */}
                                        {flatFiles[currentIndex].sectionName === "Croquis" ? (
                                            // No mostrar nada, el modal ya se abrirá por el menú lateral
                                            <div className="w-full flex-1 flex items-center justify-center">
                                                <p className="text-gray-400">Selecciona otro documento o cierra el mapa.</p>
                                            </div>
                                        ) : (
                                            <div className="w-full flex-1 flex items-center justify-center">
                                                <object
                                                    data={flatFiles[currentIndex].url}
                                                    type="application/pdf"
                                                    className="w-full h-full rounded-md"
                                                    aria-label="Vista previa PDF"
                                                >
                                                    <p>Vista previa no disponible</p>
                                                </object>
                                            </div>
                                        )}
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
                                    : 'Seleccione el motivo del rechazo.'}
                            </p>
                        </div>

                        <div className="mb-4">
                            {confirmAction === 'rechazar' && (<label htmlFor="observacion" className="block text-sm font-medium text-gray-700 mb-1">
                                Observación {confirmAction === 'rechazar' && <span className="text-red-500">*</span>}
                            </label>)}
                            {confirmAction === 'rechazar' && (<select id="observacion" value={observacion} onChange={(e) => setObservacion(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Seleccione un motivo</option>
                                <option value="Firmas Inconformes">Firmas Inconformes</option>
                                <option value="Documento Errado">Documento Errado</option>
                                <option value="Documento Sin Firmas">Documento sin Firmas</option>
                                <option value="Documento con Datos Incorrectos">Documento con Datos Incorrectos</option>
                            </select>)}
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



            {showMapModal && mapLat && mapLng && (
                <GoogleMapModal
                    lat={mapLat}
                    lng={mapLng}
                    title={mapTitle}
                    apiKey={GOOGLE_MAPS_API_KEY}
                    onClose={() => setShowMapModal(false)}
                />
            )}
            {/* Modal global */}
            {showGlobalConfirmModal && (
                globalConfirmAction === 'rechTodo' ? (
                    <ModalConfirmacionRechazo
                        isOpen={true}
                        onClose={() => setShowGlobalConfirmModal(false)}
                        onConfirm={(observacionModal) => {
                            setShowGlobalConfirmModal(false);
                            console.log("onConfirm del ModalConfirmacionRechazo:", observacionModal);
                            // Aquí va la lógica de rechazo global:
                            updateEstadoVerificacionrechazo(5, observacionModal);

                            fetchConsultaYNotifica(clientInfo.id, clientInfo, {
                                title: "¡Documentos rechazados! 🚫",
                                body: `¡Hola! Todos los documentos de la solicitud ${clientInfo.NumeroSolicitud} de ${clientInfo.nombre} fueron rechazados ☹️. Por favor, revisa los comentarios y da seguimiento al caso. ¡Gracias!
                    Fecha: ${fechaHoraEcuador}`,
                                type: "success",
                                empresa: "CREDI",
                                url: "",
                                tipo: "vendedor",
                            });
                            navigate("/ListadoSolicitud", { replace: true });
                        }}
                        solicitudData={clientInfo}
                        mensajePrincipal="¿Está seguro de que desea rechazar todos los documentos?"
                    />
                ) : (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div
                            ref={globalConfirmModalRef}
                            className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-md relative"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-medium text-gray-900">
                                    {globalConfirmAction === 'aprobTodo'
                                        ? 'Aprobar Todos los Documentos'
                                        : 'Enviar Todos los Documentos a Corrección'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    {globalConfirmAction === 'aprobTodo'
                                        ? '¿Está seguro de que desea aprobar todos los documentos?'
                                        : '¿Está seguro de que desea enviar todos los documentos a corrección?'}
                                </p>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    onClick={() => setShowGlobalConfirmModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className={`px-4 py-2 text-white rounded-md ${globalConfirmAction === 'aprobTodo'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gray-600 hover:bg-gray-700'
                                        }`}
                                    onClick={handleGlobalConfirmAction}
                                >
                                    {globalConfirmAction === 'aprobTodo'
                                        ? 'Aprobar'
                                        : 'Corrección'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}