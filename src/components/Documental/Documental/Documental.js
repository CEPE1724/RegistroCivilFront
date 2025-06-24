import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import { APIURL } from "../../../configApi/apiConfig";
import uploadFile from "../../../hooks/uploadFile";
import { useAuth } from "../../AuthContext/AuthContext";
import axios from "../../../configApi/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Importar icono de usuario
import { HistorialObservacionesModal } from "../HistorialObservacionesModal";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material"; // Asegúrate de tener MUI o usar tu propio modal
import { get, set } from "react-hook-form";
import { fetchConsultaYNotifica, fechaHoraEcuador } from "../../Utils";

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
  const { userData, userUsuario, idMenu } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [files, setFiles] = useState({});
  const [activeTab, setActiveTab] = useState("Copia De Cedula");
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
  const [isUploading, setIsUploading] = useState(false);
  const [refreshFiles, setRefreshFiles] = useState(false);
  const [completedFields2, setCompletedFields2] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [observaciones, setObservaciones] = useState([]);
  const [notificacionEnviada, setNotificacionEnviada] = useState(false);

  const patchSolicitud = async (idSolicitud) => {
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        {
          idEstadoVerificacionSolicitud: 10,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", {
          variant: "success",
        });
        navigate("/ListadoSolicitud", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", {
        variant: "error",
      });
    }
  };

  const handleConfirm = async () => {
    setIsModalOpen(false); // Cierra el modal
    patchsolicitudWeb();
    fetchConsultaYNotifica(id, userUsuario, {
      title: "¡Documentos listos para revisar! 🔍",
      body: `¡Hola! Ya puedes verificar todos documentos de la solicitud ${NumeroSolicitud} de ${nombre}.¡Gracias! 😀
		   📅 Fecha: ${fechaHoraEcuador}`,
      type: "success",
      empresa: "CREDI",
      url: "",
      tipo: "analista",
    });

    if (showOnlyCorrections) {
      try {
        // 1️⃣ Enviar PATCH a la API para actualizar el estado de los documentos
        const response = await axios.patch(APIURL.patch_cancelados(id), {
          idEstadoDocumento: 6, // Enviar el estado 6 en el cuerpo del PATCH
        });

        if (response.status === 200) {
          enqueueSnackbar("Documentos cancelados correctamente.", {
            variant: "success",
          });

          setRefreshFiles((prev) => !prev); // Esto recarga los archivos en el useEffect
        }
      } catch (error) {
        enqueueSnackbar("Error al cancelar los documentos.", {
          variant: "error",
        });
        console.error("Error en la actualización:", error);
        return; // Evitamos seguir si hay error en la API
      }
    }
  };

  const [newCompletedFields, setCompletedFields] = useState([]);
  const [corrections, setCorrections] = useState(new Set());
  const [showOnlyCorrections, setShowOnlyCorrections] = useState(false);

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
    idEstadoVerificacionDocumental: "",
  });
  const [filePreviews, setFilePreviews] = useState({});
  const [filesToCorrect, setFilesToCorrect] = useState([]);
  const [initialTabSet, setInitialTabSet] = useState(false);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const response = await axios.get(
          APIURL.get_documentos(
            clientInfo.id,
            clientInfo.idEstadoVerificacionDocumental
          )
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          const uploadedFiles = {};
          const previews = {};
          const completed = new Set();
          const corrections = new Set(); // Para almacenar las secciones con documentos con idEstadoDocumento === 4

          response.data.forEach((file) => {
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

              estado: file.idEstadoDocumento,
            });

            previews[sectionName].push(fileUrl);

            if (file.idEstadoDocumento >= 4) {
            //  alert(`El campo ${sectionName} está en corrección.`);
              corrections.add(sectionName); // Agrupa en "Campos a Corregir" si estado === 4
            } else {
              //alert(`El campo ${sectionName} no está en corrección.`);
              // si sectionname es respaldo # 1 no entre
              if (sectionName !== "Respaldo 1" &&
                sectionName !== "Respaldo 2" &&
                sectionName !== "Respaldo 3" &&
                sectionName !== "Respaldo 4" &&
                sectionName !== "Respaldo 5" &&
                sectionName !== "Respaldo 6" &&
                sectionName !== "Respaldo 7" &&
                sectionName !== "Respaldo 8" &&
                sectionName !== "Respaldo 9" &&
                sectionName !== "Respaldo 10")
                completed.add(sectionName); // Agrupa en "Campos Completados" si estado < 4
            }
          });
          console.log("Archivos subidos:", completed);
          setFiles(uploadedFiles);
          setFilePreviews(previews);
          setCompletedFields2([...completed]);
          setFilesToCorrect([...corrections]); // Actualizamos los campos a corregir

          const newCompletedFields = Object.keys(uploadedFiles);
          setCompletedFields(newCompletedFields);

          // Solo setear activeTab la primera vez

          const [firstCorrection] = Array.from(corrections);

          if (!initialTabSet && firstCorrection) {
            setActiveTab(firstCorrection);
            setInitialTabSet(true);
          }

          if (corrections.size > 0) {
            setShowOnlyCorrections(true); // Mostrar solo las correcciones
          } else {
            setShowOnlyCorrections(false); // Mostrar todo si no hay correcciones
          }
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
  }, [clientInfo.id, refreshFiles]); // Se ejecuta cuando el ID del cliente cambia

  const getTipoDocumento = (id) => {
    const documentoIds = {
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
      ///13: "Croquis",   //Foto del Cliente
      14: "Servicio Basico",   //Croquis
      15: "Foto del Cliente Firmando",
      16: "Respaldo 1", // Respaldo 1
      17: "Respaldo 2", // Respaldo 2
      18: "Respaldo 3", // Respaldo 3
      19: "Respaldo 4", // Respaldo 4
      20: "Respaldo 5", // Respaldo 5
      21: "Respaldo 6", // Respaldo 6
      22: "Respaldo 7", // Respaldo 7
      23: "Respaldo 8", // Respaldo 8
      24: "Respaldo 9", // Respaldo 9
      25: "Respaldo 10", // Respaldo 10
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

  const calculateProgress = () => {
    if (showOnlyCorrections) {
      // Modo Correcciones: Progreso basado SOLO en las secciones con estado 4
      if (!filesToCorrect.length) return 0; // Evita dividir por 0

      const totalCorrections = filesToCorrect.length; // Secciones a corregir
      const completedCorrections = completedFields2.filter((field) =>
        filesToCorrect.includes(field)
      ).length;

      return (completedCorrections / totalCorrections) * 100;
    } else {
      // Modo Normal: Progreso basado en los 11 campos totales
      const totalFields = 14;
      const completedFieldsCount = completedFields2.length;

      return (completedFieldsCount / totalFields) * 100;
    }
  };

  const patchsolicitudWeb = async () => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();
      const response = await axios.patch(
        APIURL.patch_solicitudweb(clientInfo.id)
      );
      await axios.patch(APIURL.update_soliciutd_telefonica(clientInfo.id, 2));
      await axios.post(url, {
        idCre_SolicitudWeb: clientInfo.id,
        Tipo: 3,
        idEstadoVerificacionDocumental: 2,
        Usuario: userData.Nombre,
      });
      if (response.status === 200) {
        enqueueSnackbar("Solicitud actualizada correctamente.", {
          variant: "success",
        });
        navigate("/ListadoSolicitud", {
          replace: true,
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
    if (
      files[field] &&
      files[field].length > 0 &&
      clientInfo.idEstadoVerificacionDocumental === 1
    ) {
      // Si ya hay un archivo, muestra un mensaje de error
      enqueueSnackbar(
        `Ya tienes un archivo cargado en el campo "${field}". Primero debes eliminarlo antes de cargar uno nuevo.`,
        { variant: "error" }
      );
      return; // No permite cargar más archivos si ya existe uno
    }

    if (showOnlyCorrections) {
      // Verifica si la sección está en los campos a corregir y si ya existen archivos con estado 5 cargados en esa sección
      const filesWithState5 = files[activeTab]?.some(
        (file) => file.estado !== 5
      );

      ///alert (filesWithState5)// Verifica si hay archivos con estado 5

      if (filesToCorrect.includes(activeTab) && filesWithState5) {
        enqueueSnackbar(
          "No puedes subir archivos en este campo hasta que se corrijan los documentos pendientes.",
          { variant: "error" }
        );
        setIsUploading(false); // Detén el proceso de carga
        return; // No permite cargar más archivos
      }
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

    if (id) {
      try {
        // 1️⃣ Enviar PATCH a la API para actualizar el estado del documento
        const response = await axios.patch(APIURL.patch_documentos(id), {
          idEstadoDocumento: 5, // 👈 Aquí estableces el nuevo estado en la base de datos
        });

        if (response.status === 200) {
          enqueueSnackbar("Documento eliminado correctamente.", {
            variant: "success",
          });

          setRefreshFiles((prev) => !prev); // Esto recarga los archivos en el useEffect
        }
      } catch (error) {
        enqueueSnackbar("Error al eliminar el documento en la BD.", {
          variant: "error",
        });
        console.error("Error en la actualización:", error);
        return; // ❌ Evitamos seguir eliminando localmente si hay error en la API
      }
    }

    // 2️⃣ Eliminar el archivo del estado local, ya sea que tenga ID o no
    setFiles((prevFiles) => {
      if (!prevFiles[field] || prevFiles[field].length === 0) return prevFiles;

      const updatedFiles = { ...prevFiles };
      updatedFiles[field] = updatedFiles[field].filter((_, i) => i !== index);

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
  };

  const toggleView = () => {
    setView(!view);
  };

  const verificarDocumento = async (idCreSolicitudWeb, tipoDocumento) => {
    try {
      const response = await axios.get(
        APIURL.getCheckDocumento(idCreSolicitudWeb, tipoDocumento)
      );
      return response.data; // Devolverá `true` o `false`
    } catch (error) {
      console.error("Error al verificar el documento:", error);
      return false;
    }
  };

  const getNumeroDocumento = (nombre) => {
    const documentoIds = {
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
      12: "Foto del Cliente",   //Servicio Basico
      ///13: "Croquis",   //Foto del Cliente
      14: "Servicio Basico",   //Croquis
      15: "Foto del Cliente Firmando",
      16: "Respaldo 1", // Respaldo 1
      17: "Respaldo 2", // Respaldo 2
      18: "Respaldo 3", // Respaldo 3
      19: "Respaldo 4", // Respaldo 4
      20: "Respaldo 5", // Respaldo 5
      21: "Respaldo 6", // Respaldo 6
      22: "Respaldo 7", // Respaldo 7
      23: "Respaldo 8", // Respaldo 8
      24: "Respaldo 9", // Respaldo 9
      25: "Respaldo 10", // Respaldo 10
    };

    // Buscamos la clave (número) correspondiente al nombre
    const id = Object.keys(documentoIds).find(
      (key) => documentoIds[key] === nombre
    );

    return id ? Number(id) : null; // Convertimos a número si existe, sino retornamos null
  };

  const fetchObservaciones = async () => {
    const numeroActivetab = getNumeroDocumento(activeTab);
    try {
      const response = await axios.get(
        APIURL.get_observaciones(clientInfo.id, numeroActivetab)
      );
      setObservaciones(response.data);
      setHistory(true);
    } catch (error) {
      console.error("Error al obtener las observaciones:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const tipoDocumento = getNumeroDocumento(activeTab);
    const documentoExiste = await verificarDocumento(
      clientInfo.id,
      tipoDocumento
    );

    if (documentoExiste.exists) {
      enqueueSnackbar("Ya existe un documento cargado para este campo.", {
        variant: "error",
      });
      setIsUploading(false); // Ocultar modal si hay error
      return;
    }

    if (!files[activeTab] || files[activeTab].length === 0) {
      enqueueSnackbar(
        `Por favor, selecciona un archivo para el campo ${activeTab}`,
        { variant: "error" }
      );
      setIsUploading(false);
      return;
    }
    if (showOnlyCorrections) {
      // Verificar que exista al menos un archivo físico (sin URL) en el campo activo
      const hasPhysicalFile = files[activeTab]?.some((file) => !file?.url);
      if (!hasPhysicalFile) {
        enqueueSnackbar("Por favor sube un archivo .", { variant: "error" });
        setIsUploading(false); // Detener el proceso de subida
        return;
      }
    }

    // Verificar que la observación sea opcional, pero si está presente, debe tener al menos 10 caracteres
    const observacionElement = document.querySelector(
      'textarea[name="observacion"]'
    );
    if (
      observacionElement &&
      observacion[activeTab] &&
      observacion[activeTab].length > 0 &&
      observacion[activeTab].length < 10
    ) {
      enqueueSnackbar(
        "Si proporcionas una observación, debe tener al menos 10 caracteres para este campo.",
        { variant: "error" }
      );
      setIsUploading(false);
      return;
    }

    try {
      // Subir archivo y obtener la URL

      let response;

      const getFile = (tab) => {
        // Busca el archivo físico (sin URL)
        return files[tab]?.find((file) => !file?.url); // Si no tiene URL, es un archivo físico
      };

      if (clientInfo.idEstadoVerificacionDocumental === 1) {
        const fileToUpload = getFile(activeTab); // Obtén el archivo físico de la sección activa
        if (fileToUpload) {
          const observacionText = observacionElement
            ? observacion[activeTab] || ""
            : "";
          response = await uploadFile(
            fileToUpload,
            clientInfo.almacen,
            clientInfo.cedula,
            clientInfo.NumeroSolicitud,
            activeTab, // Mandamos el texto del tab
            observacionText
          );
        }
      }

      if (clientInfo.idEstadoVerificacionDocumental === 3) {
        const fileToUpload = getFile(activeTab); // Obtén el archivo físico de la sección activa
        if (fileToUpload) {
          const observacionText = observacionElement
            ? observacion[activeTab] || ""
            : "";
          response = await uploadFile(
            fileToUpload,
            clientInfo.almacen,
            clientInfo.cedula,
            clientInfo.NumeroSolicitud,
            activeTab, // Mandamos el texto del tab
            observacionText
          );
        }
      }

      const documentoIds = {
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
        "Foto del Cliente": 12,
        ///Croquis: 13,
        "Servicio Basico": 14,
        "Foto del Cliente Firmando": 15,
        "Respaldo 1": 16,
        "Respaldo 2": 17,
        "Respaldo 3": 18,
        "Respaldo 4": 19,
        "Respaldo 5": 20,
        "Respaldo 6": 21,
        "Respaldo 7": 22,
        "Respaldo 8": 23,
        "Respaldo 9": 24,
        "Respaldo 10": 25,
      };

      const idTipoDocumentoWEB = documentoIds[activeTab] || null; // Si no encuentra, asigna null o un valor por defecto

      // Verifica que la respuesta contenga la URL del archivo
      if (response && response.url) {
        const urlArchivo = response.url;

        // validar que lso campso esten llenos
        if (!idTipoDocumentoWEB) {
          enqueueSnackbar("Error al obtener el ID del tipo de documento.", {
            variant: "error",
          });
          return;
        }

        // Crear el payload con los datos para la API
        const observacionText = observacionElement
          ? observacion[activeTab] || ""
          : "";
        const payload = {
          idCre_SolicitudWeb: clientInfo.id,
          idTipoDocumentoWEB: idTipoDocumentoWEB, // C
          RutaDocumento: urlArchivo, // URL del archivo subido
          Observacion: observacionText, // Observación recibida
          Usuario: userData.Nombre,
          IdUsuario: userData.idUsuario,
        };

        // Verifica el payload antes de enviarlo

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
          setRefreshFiles((prev) => !prev);
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
    } finally {
      setIsUploading(false);
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
    "Servicio Basico",
    "Foto del Cliente",
   /// "Croquis",
    "Foto del Cliente Firmando",
    "Respaldo 1",
    "Respaldo 2",
    "Respaldo 3",
    "Respaldo 4",
    "Respaldo 5",
    "Respaldo 6",
    "Respaldo 7",
    "Respaldo 8",
    "Respaldo 9",
    "Respaldo 10",
  ];

  const completedFields = menuItems.filter(
    (field) => files[field] && files[field].length > 0
  );

  const pendingFields = menuItems.filter(
    (field) => !(files[field] && files[field].length > 0)
  );

  const laboralYDomicilioAprobados = async (id) => {
    try {
      const response = await axios.get(APIURL.getVerificacionTresDocumentos(id));
      return response.data.allThreeDocsApproved; // true o false
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  useEffect(() => {
    async function checkYEnviar() {
      const claveLocal = `notificacion_enviada_${id}`;
      const yaEnviada = localStorage.getItem(claveLocal) === "true";

      if (yaEnviada || notificacionEnviada) return;

      const aprobados = await laboralYDomicilioAprobados(id);
      if (aprobados) {
        await fetchConsultaYNotifica(id, userUsuario, {
          title: "¡Documentos para revisar! 🔍",
          body: `¡Hola! Ya puedes verificar los primeros  documentos de la solicitud ${NumeroSolicitud} ( foto del cliente y servicios básicos) de ${nombre}. ¡Gracias! 😀
		   📅 Fecha: ${fechaHoraEcuador}`,
          type: "success",
          empresa: "POINT",
          url: "",
          tipo: "analista",
        });
        localStorage.setItem(claveLocal, "true");
      }
    }

    checkYEnviar();

  }, [files, notificacionEnviada]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`w-64 bg-white text-gray-800 shadow-lg ${isMenuOpen ? "block" : "hidden"
          } md:block transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 space-y-6">
          {/* Progreso de Archivos */}
          <div>
            <label className="block text-sm font-semibold text-gray-500">
              Progreso de Archivos
            </label>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {Math.round(calculateProgress())}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="rounded-full h-2 transition-all duration-500 ease-in-out"
                style={{
                  width: `${calculateProgress()}%`,
                  backgroundColor: getProgressBarColor(),
                }}
              ></div>
            </div>

            {calculateProgress() === 100 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-500 text-sm text-white py-2 px-4 rounded shadow hover:bg-green-600 transition-transform duration-300 transform hover:scale-105"
                >
                  Enviar verificación
                </button>
              </div>
            )}
          </div>

          {showOnlyCorrections ? (
            // Mostrar solo los tabs con documentos en estado 4
            <div>
              <h3 className="text-sm font-medium text-red-500">
                Campos a Corregir
              </h3>
              <ul className="mt-2 space-y-1">
                {filesToCorrect.map((item) => {
                  const fileCount =
                    files[item]?.filter((file) => !file?.url).length || 0;
                  const isSelected = activeTab === item;

                  return (
                    <li key={item}>
                      <a
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveTab(item);
                        }}
                        className={`flex justify-between items-center text-sm py-2 px-3 rounded-lg transition-all duration-200
                ${isSelected && completedFields2.includes(item)
                            ? "bg-green-600 text-white shadow-lg"
                            : isSelected
                              ? "bg-red-600 text-white shadow-lg"
                              : completedFields2.includes(item)
                                ? "text-green-600 hover:bg-green-100 hover:text-green-800"
                                : "text-red-600 hover:bg-red-100 hover:text-red-800"
                          }`}
                      >
                        {item}
                        {fileCount > 0 && (
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${isSelected
                              ? "bg-white text-red-600"
                              : "bg-red-500 text-white"
                              }`}
                          >
                            {`+${fileCount}`}
                          </span>
                        )}
                        {completedFields2.includes(item) && (
                          <span className="ml-2 text-green-500 font-bold">
                            ✓
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              {/* Campos Pendientes */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Campos Pendientes
                </h3>
                <ul className="mt-2 space-y-1">
                  {pendingFields.map((item) => {
                    const fileCount = files[item]?.length || 0;
                    const isSelected = activeTab === item;

                    return (
                      <li key={item}>
                        <a
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            setActiveTab(item);
                          }}
                          className={`flex justify-between items-center text-sm py-2 px-3 rounded-lg transition-all duration-200
                  ${isSelected
                              ? "bg-blue-600 text-white shadow-lg"
                              : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                            }`}
                        >
                          {item}
                          {fileCount > 0 && (
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${isSelected
                                ? "bg-white text-blue-600"
                                : "bg-green-500 text-white"
                                }`}
                            >
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
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Campos Completados
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {completedFields.map((item) => {
                      const fileCount = files[item]?.length || 0;
                      const isSelected = activeTab === item;

                      return (
                        <li key={item}>
                          <a
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();
                              setActiveTab(item);
                            }}
                            className={`flex justify-between items-center text-sm py-2 px-3 rounded-lg transition-all duration-200
                    ${isSelected
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-600 hover:bg-blue-100 hover:text-blue-800"
                              }`}
                          >
                            {item}
                            <div className="flex items-center">
                              {fileCount > 0 && (
                                <span
                                  className={`text-xs font-bold px-2 py-1 rounded-full ${isSelected
                                    ? "bg-white text-blue-600"
                                    : "bg-green-500 text-white"
                                    }`}
                                >
                                  {`+${fileCount}`}
                                </span>
                              )}
                              {completedFields2.includes(item) && (
                                <span className="ml-2 text-green-500 font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
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
      <div className="flex-1 p-2 bg-white">
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {clientInfo.foto !== null && clientInfo.foto !== "prueba" ? (
                <img
                  src={clientInfo.foto}
                  alt="Foto del cliente"
                  className="w-80 h-80 md:w-64 md:h-64 object-cover border-4 border-gray-300 rounded-lg"
                />
              ) : (
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
              )}

              <div className="md:w-3/4 mt-2 pl-4 bg-white shadow-lg rounded-lg p-1 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base leading-relaxed pl-10">
                  {[
                    ["Número de Solicitud", clientInfo.NumeroSolicitud],
                    ["Nombre", clientInfo.nombre],
                    ["Cédula", clientInfo.cedula],
                    ["Fecha", new Date(clientInfo.fecha).toLocaleString('es-EC', {
                      day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
                    })],
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
                <div className="flex justify-end items-center mt-8 w-full">
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                    onClick={() => navigate("/ListadoSolicitud", { replace: true })}>
                    Regresar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {clientInfo.idEstadoVerificacionDocumental === 3 && (
            <div className="flex justify-center items-center mt-8 w-full">
              {/* Documentos Subidos */}

              <div className=" pb-4 pt-5 md:absolute md:right-11 ">
                <button
                  onClick={fetchObservaciones}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  Historial Observaciones
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filePreviews[activeTab]?.length > 0 &&
              filePreviews[activeTab]?.map((previewUrl, index) => {
                const file = files[activeTab]?.[index];
                if (file?.estado !== 5) {
                  // Verifica si el estado es diferente de 5
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-md shadow-md border border-gray-200 hover:border-blue-500 transition duration-300 flex flex-col"
                      style={{ height: '70vh', width: '70vw' }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {file?.name || "Sin nombre"}
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

                      <div className="flex-1 overflow-hidden">
                        <object
                          data={previewUrl}
                          type="application/pdf"
                          className="w-full h-full rounded-md"
                          aria-label="Vista previa PDF"
                        >
                          <p>Vista previa no disponible</p>
                        </object>
                      </div>
                    </div>
                  );
                }
                return null; // Si el estado es 5, no se renderiza nada
              })}
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

            <div className="ml-4 md:absolute md:right-11">
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
                      accept=".pdf,.png,.jpg,.jpeg"
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

      {/* Modal para mostrar el chat de observaciones */}
      <HistorialObservacionesModal
        history={history}
        setHistory={setHistory}
        observaciones={observaciones}
      />

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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">
              ¿Estás seguro de enviar los documentos a verificación?
            </h2>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mb-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-lg font-semibold text-gray-700">
              Subiendo archivo...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
