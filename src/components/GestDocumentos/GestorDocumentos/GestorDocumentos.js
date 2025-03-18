import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
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
    const [filePreviews, setFilePreviews] = useState({});

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
    console.log("clientInfo", clientInfo);
    console.log("datos api", APIURL.get_documentos(clientInfo.id));
    
        const fetchUploadedFiles = async () => {
            try {
                const response = await axios.get(`${APIURL.get_documentos(clientInfo.id)}`);

                if (response.status === 200 && Array.isArray(response.data)) {
                    const uploadedFiles = {};
                    const previews = {};

                    response.data.forEach((file) => {
                        const sectionName = getTipoDocumento(file.idTipoDocumentoWEB);
                        if (!uploadedFiles[sectionName]) {
                            uploadedFiles[sectionName] = [];
                            previews[sectionName] = [];
                        }

                        // Extrae el nombre del archivo desde la ruta
                        const fileName = file.RutaDocumento.split('/').pop();
                        const fileUrl = file.RutaDocumento;

                        uploadedFiles[sectionName].push({
                            idDocumentosSolicitudWeb: file.idDocumentosSolicitudWeb, // Añadimos el ID del documento
                            name: fileName,
                            url: fileUrl,
                            type: fileUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                        });

                        previews[sectionName].push(fileUrl);
                    });

                    setFiles(uploadedFiles);
                    setFilePreviews(previews);
                }
            } catch (error) {
                enqueueSnackbar("Error al obtener archivos subidos.", { variant: "error" });
                console.error("Error al obtener archivos:", error);
            }
        };

        useEffect(() => {
        if (clientInfo.id) {
            fetchUploadedFiles();
        }
    }, [clientInfo.id]);

    //api cambiar estado del documento
    const estadoDocumentos = async (idDocumentosSolicitudWeb, idEstadoDocumento) => {
        try {
            const token = localStorage.getItem("token");
            const url = APIURL.patch_documentos(idDocumentosSolicitudWeb);
            const datos = {
                idEstadoDocumento: idEstadoDocumento, // Enviar el nuevo estado
            };

            const response = await axios.patch(url, datos, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status == 200) {
                enqueueSnackbar("Datos enviados correctamente", { variant: "success" });
                await fetchUploadedFiles();
            } else {
                enqueueSnackbar("Error al enviar los datos 1", { variant: "error" });
            }
        } catch (error) {
            console.error("Error al enviar los datos 2:", error.response?.data);
            enqueueSnackbar("Error al enviar los datos: " + error.response?.data?.message || error.message, { variant: "error" });
        }
    };

    // Función rechazo de documento
    const handleRechazar = (idDocumentosSolicitudWeb) => {
        estadoDocumentos(idDocumentosSolicitudWeb, 4);
    };

    // Función aprobación de documento
    const handleAprobar = (idDocumentosSolicitudWeb) => {
        estadoDocumentos(idDocumentosSolicitudWeb, 2);
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

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div
                className={`w-64 bg-[#2d3689] text-white ${isMenuOpen ? "block" : "hidden"
                    } md:block transition-all duration-300 ease-in-out`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-100">Número de Solicitud: </h2>
                    <p>{clientInfo.NumeroSolicitud}</p>
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

                    {/* Documentos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-6">
                        {Object.entries(files).map(([sectionName, sectionFiles]) => (
                            sectionFiles.map((file, index) => (
                                console.log("imagen url", file.url),
                                <div
                                    key={`${sectionName}-${index}`}
                                    className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200 hover:border-blue-500 transition duration-300"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                {file.name || "Documento"}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {sectionName}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
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
                                <p className="text-gray-500">No hay documentos disponibles para esta solicitud.</p>
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
        </div>
    );
}