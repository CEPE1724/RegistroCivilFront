import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import { APIURL } from "../../configApi/apiConfig";
import uploadFile from "../../hooks/uploadFile";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material"; // Asegúrate de tener MUI o usar tu propio modal
import { get } from "react-hook-form";

export function Documental({
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
  console.log("userData", userData);

  console.log("userUsuario", userUsuario);
  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState("Buro Credito");
  const [showFileInput, setShowFileInput] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [view, setView] = useState(false);
  const [observacion, setObservacion] = useState({});
  const modalRef = useRef(null);
  const [history, setHistory] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

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

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await axios.get(
          `${APIURL.get_documentos(clientInfo.id)}`
        );

        console.log("Respuesta API Documentos:", response.data);
        if (response.status === 200 && Array.isArray(response.data)) {
          const uploadedFiles = {};
          const previews = {};

          response.data.forEach((file) => {
            console.log("Archivo recibido:", file); // ✅ Verificar estructura de cada archivo

            const sectionName = getTipoDocumento(file.idTipoDocumentoWEB);
            if (!uploadedFiles[sectionName]) {
              uploadedFiles[sectionName] = [];
              previews[sectionName] = [];
            }

            // Extrae el nombre del archivo desde la ruta
            const fileName = file.RutaDocumento.split("/").pop();
            const fileUrl = file.RutaDocumento;

            uploadedFiles[sectionName].push({
              idDocumentoSolicitudWeb: file.idDocumentosSolicitudWeb,
              name: fileName,
              url: fileUrl,
              type: fileUrl.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
            });

            previews[sectionName].push(fileUrl);
          });

          setFiles(uploadedFiles);
          setFilePreviews(previews);
        }
      } catch (error) {
        enqueueSnackbar("Error al obtener archivos subidos.", {
          variant: "error",
        });
        console.error("Error al obtener archivos:", error);
      }
    };

    if (clientInfo.NumeroSolicitud) {
      fetchUploadedFiles();
    }
  }, [clientInfo.id]);

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
    return documentoIds[id] || null;
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
    const updatedFilePreviews = {};

    Object.keys(files).forEach((field) => {
      updatedFilePreviews[field] = files[field].map((file) => {
        if (file instanceof File || file instanceof Blob) {
          return URL.createObjectURL(file); // Si es un archivo local, crea una URL
        }
        return file.url || file; // Si es una URL desde la API, úsala directamente
      });
    });

    setFilePreviews(updatedFilePreviews);

    // Cleanup: liberar URLs de archivos locales cuando el componente se desmonta
    return () => {
      Object.values(updatedFilePreviews).forEach((previewUrls) =>
        previewUrls.forEach((url) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        })
      );
    };
  }, [files]);
  // Se ejecuta cuando 'location.state' o 'files' cambian

  /* useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowFileInput(false);
        setView(false);

      }
    };

    // Agregar el event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); */

  const calculateProgress = () => {
    const totalFields = menuItems.length;
    const completedFields = menuItems.filter(
      (field) => files[field] && files[field].length > 0
    ).length;
    return (completedFields / totalFields) * 100;
  };

  const getProgressBarColor = () => {
    const progress = calculateProgress();
    if (progress < 50) return "#FF0000";
    if (progress < 80) return "#FF9800";
    return "#4CAF50";
  };

  const handleFileChange = (e, field) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) {
      enqueueSnackbar("No se ha seleccionado ningún archivo.", {
        variant: "error",
      });
      return;
    }

    // Verifica si ya hay un archivo cargado en el campo activo
    if (files[field] && files[field].length > 0) {
      // Si ya hay un archivo, muestra un mensaje de error
      enqueueSnackbar(
        `Ya tienes un archivo cargado en el campo "${field}". Primero debes eliminarlo antes de cargar uno nuevo.`,
        { variant: "error" }
      );
      return; // No permite cargar más archivos si ya existe uno
    }

    // Si no hay archivo, se puede agregar el nuevo archivo
    setFiles((prevFiles) => ({
      ...prevFiles,
      [field]: [...(prevFiles[field] || []), ...selectedFiles],
    }));
    setShowFileInput(false);
  };

  const handleOpenDeleteConfirmation = (field, index) => {
    const file = files[field][index]; // Obtenemos el archivo seleccionado
    console.log("Archivo seleccionado para eliminar:", file); // ✅ Verificar que tiene idDocumentoSolicitudWeb

    setFileToDelete({
      field,
      index,
      id: file.idDocumentoSolicitudWeb, // ✅ Asegúrate de que se esté pasando bien
    });

    setShowConfirmDeleteModal(true);
  };

  // Función para cerrar el modal de confirmación de eliminación
  const closeDeleteConfirmation = () => {
    setFileToDelete(null);
    setShowConfirmDeleteModal(false);
  };

  // Función para eliminar archivo
  const handleRemoveFile = async () => {
    if (!fileToDelete) return;

    const { field, index, id } = fileToDelete; // ✅ Extraemos el ID
    console.log(fileToDelete);
    try {
      // 1️⃣ Enviar PATCH a la API para actualizar el estado del documento
      const response = await axios.patch(APIURL.patch_documentos(id), {
        idEstadoDocumento: 4, // 👈 Aquí estableces el nuevo estado en la base de datos
      });

      if (response.status === 200) {
        enqueueSnackbar("Documento eliminado correctamente.", {
          variant: "success",
        });

        // 2️⃣ Eliminar el archivo del estado local
        setFiles((prevFiles) => {
          if (!prevFiles[field] || prevFiles[field].length === 0)
            return prevFiles;

          const updatedFiles = { ...prevFiles };
          updatedFiles[field] = updatedFiles[field].filter(
            (_, i) => i !== index
          );

          if (updatedFiles[field].length === 0) {
            delete updatedFiles[field];
          }

          return updatedFiles;
        });

        setFilePreviews((prevPreviews) => {
          if (!prevPreviews[field] || prevPreviews[field].length === 0)
            return prevPreviews;

          const updatedPreviews = { ...prevPreviews };
          updatedPreviews[field] = updatedPreviews[field].filter(
            (_, i) => i !== index
          );

          if (updatedPreviews[field].length === 0) {
            delete updatedPreviews[field];
          }

          return updatedPreviews;
        });

        closeDeleteConfirmation(); // Cerrar el modal después de la eliminación
      }
    } catch (error) {
      enqueueSnackbar("Error al eliminar el documento.", { variant: "error" });
      console.error("Error en la actualización:", error);
    }
  };

  const toggleView = () => {
    setView(!view);
  };

 

  const verificarDocumento = async (idCreSolicitudWeb, tipoDocumento) => {
    try {
      const response = await axios.get(APIURL.getCheckDocumento(idCreSolicitudWeb, tipoDocumento));
      console.log("Respuesta del backend:", response.data);
      return response.data; // Devolverá `true` o `false`
    } catch (error) {
      console.error("Error al verificar el documento:", error);
      return false;
    }
  };

  const getNumeroDocumento = (nombre) => {
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

    // Buscamos la clave (número) correspondiente al nombre
    const id = Object.keys(documentoIds).find(key => documentoIds[key] === nombre);

    return id ? Number(id) : null; // Convertimos a número si existe, sino retornamos null
};


  const handleSubmit = async (e) => {
    e.preventDefault();    
    const tipoDocumento = getNumeroDocumento(activeTab);
    const documentoExiste = await verificarDocumento(clientInfo.id, tipoDocumento);
    console.log(documentoExiste)

    if (documentoExiste) { // Si es true, significa que ya hay un documento
      enqueueSnackbar("Ya existe un documento cargado para este campo.", {
        variant: "error",
      });
      return;
    }
    // Validar archivos y observación por cada sección
    if (!files[activeTab] || files[activeTab].length === 0) {
      enqueueSnackbar(
        `Por favor, selecciona un archivo para el campo ${activeTab}`,
        { variant: "error" }
      );
      return;
      
    } else if (!observacion[activeTab] || observacion[activeTab].length < 10) {
      enqueueSnackbar(
        "La observación debe tener al menos 10 caracteres para este campo.",
        { variant: "error" }
      );
      return;
    }

    try {
      // Subir archivo y obtener la URL
      const response = await uploadFile(
        files[activeTab][0],
        clientInfo.almacen,
        clientInfo.cedula,
        clientInfo.NumeroSolicitud,
        activeTab, // Mandamos el texto del tab
        observacion[activeTab]
      );

      const documentoIds = {
        "Buro Credito": 1,
        "Copia De Cedula": 2,
        "Contrato de Compra": 3,
        Declaracion: 4,
        "Pagare a la Orden": 5,
        "Tabla de amortizacion": 6,
        "Gastos de cobranza": 7,
        "Compromiso Lugar de pago": 8,
        Acta: 9,
        Consentimiento: 10,
        Autorización: 11,
      };

      const idTipoDocumentoWEB = documentoIds[activeTab] || null; // Si no encuentra, asigna null o un valor por defecto

      // Verifica que la respuesta contenga la URL del archivo
      if (response && response.url) {
        const urlArchivo = response.url;
        console.log("URL del archivo subido:", urlArchivo);
        // validar que lso campso esten llenos
        if (!idTipoDocumentoWEB) {
          enqueueSnackbar("Error al obtener el ID del tipo de documento.", {
            variant: "error",
          });
          return;
        }

        // Crear el payload con los datos para la API
        const payload = {
          idCre_SolicitudWeb: clientInfo.id,
          idTipoDocumentoWEB: idTipoDocumentoWEB, // Cambié a 2, ya que en el ejemplo de Postman usas 2
          RutaDocumento: urlArchivo, // URL del archivo subido
          Observacion: observacion[activeTab], // Observación recibida
        };

        // Verifica el payload antes de enviarlo
        console.log("Payload a enviar:", payload);
        const apiResponse = await axios.post(
          APIURL.post_documentos(),
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // Comprobar que la respuesta sea exitosa
        if (
          apiResponse.status === 201 ||
          apiResponse.data?.status === "success"
        ) {
          enqueueSnackbar("Documento guardado correctamente en la BD.", {
            variant: "success",
          });
          setShowFileInput(false);
        } else {
          enqueueSnackbar(
            "Error al guardar el documento en la BD. " +
              apiResponse.data?.message || "",
            { variant: "error" }
          );
        }
      } else {
        enqueueSnackbar("Error al subir el archivo. Inténtalo de nuevo.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error en la solicitud. Inténtalo de nuevo.", {
        variant: "error",
      });
      console.error("Error:", error);
    }
  };

  const handleSubmitUpFile = (e) => {
    e.preventDefault();

    const inputElement = document.querySelector(`input[name="${activeTab}"]`);

    if (!inputElement || inputElement.files.length === 0) {
      enqueueSnackbar(`Por favor, selecciona un archivo para poder subirlo`, {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Archivo subido correctamente.", { variant: "success" });
      setShowFileInput(false);
    }
  };

  const menuItems = [
    "Buro Credito",
    "Copia De Cedula",
    "Contrato de Compra",
    "Declaracion",
    "Pagare a la Orden",
    "Tabla de amortizacion",
    "Gastos de cobranza",
    "Compromiso Lugar de pago",
    "Acta",
    "Consentimiento",
    "Autorización",
  ];

  const completedFields = menuItems.filter(
    (field) => files[field] && files[field].length > 0
  );

  const pendingFields = menuItems.filter(
    (field) => !(files[field] && files[field].length > 0)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`w-64 bg-[#2d3689] text-white ${
          isMenuOpen ? "block" : "hidden"
        } md:block transition-all duration-300 ease-in-out`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-100">Menú</h2>

          {/* Progreso de Archivos */}
          <div className="mt-6">
            <div className="relative pt-1">
              <label className="block text-sm font-semibold text-gray-300">
                Progreso de Archivos
              </label>
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-medium text-gray-300">
                  {Math.round(calculateProgress())}%
                </span>
              </div>
              <div className="flex mb-2">
                <div
                  className="w-full bg-gray-200 rounded-full h-2.5"
                  style={{
                    backgroundColor: getProgressBarColor(),
                    width: `${calculateProgress()}%`,
                  }}
                ></div>
              </div>
              {calculateProgress() === 100 && (
                <div className="flex justify-center mt-6">
                  <button className="bg-green-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">
                    Funcionalidad Nueva
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Campos Pendientes */}
          <div className="mt-6">
            <h3 className="text-lg text-gray-300 font-semibold">
              Campos Pendientes
            </h3>
            <ul className="mt-4 space-y-4">
              {pendingFields.map((item) => {
                const fileCount = files[item] ? files[item].length : 0;
                return (
                  <li key={item}>
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault(); // Evita que el navegador cambie la URL
                        setActiveTab(item);
                      }}
                      className={`block text-gray-300 hover:text-white py-2 px-4 rounded-md transition-all duration-200 ease-in-out ${
                        activeTab === item ? "bg-gray-700" : "hover:bg-gray-600"
                      }`}
                    >
                      {item}
                      {fileCount > 0 && (
                        <span className="text-white px-2 ml-2 bg-green-500 rounded-full text-xs font-bold">
                          {`+${fileCount}`}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Campos Completados */}
          {completedFields.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg text-gray-300 font-semibold">
                Campos Completados
              </h3>
              <ul className="mt-4 space-y-4">
                {completedFields.map((item) => {
                  const fileCount = files[item] ? files[item].length : 0;
                  return (
                    <li key={item}>
                      <a
                        href="#"
                        onClick={(event) => {
                          event.preventDefault(); // Evita que el navegador cambie la URL
                          setActiveTab(item);
                        }}
                        className={`block text-gray-300 hover:text-white py-2 px-4 rounded-md transition-all duration-200 ease-in-out ${
                          activeTab === item
                            ? "bg-gray-700"
                            : "hover:bg-gray-600"
                        }`}
                      >
                        {item}
                        {fileCount > 0 && (
                          <span className="text-white px-2 ml-2 bg-green-500 rounded-full text-xs font-bold">
                            {`+${fileCount}`}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
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
            {/* Documentos Subidos */}
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Documentos Subidos
            </h2>

            <div className="absolute right-11">
              <button
                onClick={() => setHistory(true)}
                className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
              >
                Historial Observaciones
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filePreviews[activeTab]?.length > 0 &&
              filePreviews[activeTab]?.map((previewUrl, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200 hover:border-blue-500 transition duration-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {files[activeTab]?.[index]?.name || "Sin nombre"}
                    </span>

                    <div className="flex items-center gap-2">
                      <IconButton onClick={toggleView}>
                        <VisibilityIcon />
                      </IconButton>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDeleteConfirmation(activeTab, index)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ❌
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {files[activeTab][index]?.type === "application/pdf" ? (
                      <object
                        data={previewUrl}
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
                        src={previewUrl}
                        alt="Vista previa archivo"
                        className="w-full h-auto rounded-md"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Observación */}
          <div className="mb-6">
            <label className="text-lg font-medium text-gray-700">
              Observación
            </label>
            <textarea
              name="observacion"
              value={observacion[activeTab] || ""}
              onChange={(e) =>
                setObservacion((prev) => ({
                  ...prev,
                  [activeTab]: e.target.value,
                }))
              }
              rows="4"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Escribe una observación aquí..."
            ></textarea>
            {observacion[activeTab] && observacion[activeTab].length < 10 && (
              <p className="text-red-500 text-sm mt-2">
                La observación debe tener al menos 10 caracteres.
              </p>
            )}
          </div>

          <div className="flex justify-center items-center mt-6 w-full">
            <button
              onClick={() => setShowFileInput(true)}
              class="cursor-pointer relative after:content-['subir_archivos'] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-700 w-11 h-11 rounded-full bg-[#2563eb] flex items-center justify-center duration-300 hover:rounded-md hover:w-36 hover:h-10 group/button overflow-hidden active:scale-90"
            >
              <svg
                class="w-7 h-7 fill-white delay-50 duration-200 group-hover/button:-translate-y-12 sm:w-20 sm:h-20"
                stroke="#000000"
                stroke-width="2"
                viewBox="-3.84 -3.84 31.68 31.68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                transform="rotate(0)"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="0.1"
                    d="M17.8284 6.82843C18.4065 7.40649 18.6955 7.69552 18.8478 8.06306C19 8.4306 19 8.83935 19 9.65685L19 17C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 21 16.8856 21 15 21H9C7.11438 21 6.17157 21 5.58579 20.4142C5 19.8284 5 18.8856 5 17L5 7C5 5.11438 5 4.17157 5.58579 3.58579C6.17157 3 7.11438 3 9 3H12.3431C13.1606 3 13.5694 3 13.9369 3.15224C14.3045 3.30448 14.5935 3.59351 15.1716 4.17157L17.8284 6.82843Z"
                    fill="#f7f7f7"
                  ></path>
                  <path
                    d="M17.8284 6.82843C18.4065 7.40649 18.6955 7.69552 18.8478 8.06306C19 8.4306 19 8.83935 19 9.65685L19 17C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 21 16.8856 21 15 21H9C7.11438 21 6.17157 21 5.58579 20.4142C5 19.8284 5 18.8856 5 17L5 7C5 5.11438 5 4.17157 5.58579 3.58579C6.17157 3 7.11438 3 9 3H12.3431C13.1606 3 13.5694 3 13.9369 3.15224C14.3045 3.30448 14.5935 3.59351 15.1716 4.17157L17.8284 6.82843Z"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12 11L12 16"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M14.5 13.5L9.5 13.5"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
            </button>

            <div className="absolute right-11">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
              >
                Enviar archivos
              </button>
            </div>
          </div>
        </div>

        {/* Modal de subir archivo */}
        {showFileInput && (
          <div
            ref={modalRef}
            className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Subir Nuevo Documento
                </h2>
                <button
                  onClick={() => setShowFileInput(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ❌
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-lg font-medium text-gray-700">
                    {activeTab}
                  </label>
                  <label className="mt-2 p-3 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition">
                    <span className="text-gray-500 mr-2">📁</span>
                    <span className="text-gray-600">Subir archivo</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, activeTab)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSubmitUpFile}
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Vista previa */}
      {view && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 relative"
          >
            <button
              onClick={toggleView}
              className="absolute top-2 right-2 text-lg"
            >
              ❌
            </button>
            <iframe
              src={filePreviews[activeTab] && filePreviews[activeTab][0]}
              className="w-full h-full"
              title="Vista previa del archivo"
            ></iframe>
          </div>
        </div>
      )}

      {/* Historial de Observaciones */}

      {history && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-semibold mb-4">
              Historial de Observaciones
            </h2>
            <p>Aquí va el historial de observaciones...</p>
            <button
              onClick={() => setHistory(false)}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-red-700 transition duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showConfirmDeleteModal && (
        <Dialog open={showConfirmDeleteModal} onClose={closeDeleteConfirmation}>
          <DialogTitle>Confirmación de Eliminación</DialogTitle>
          <DialogContent>
            <p>¿Estás seguro de que deseas eliminar este archivo?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteConfirmation} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleRemoveFile} color="secondary">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
