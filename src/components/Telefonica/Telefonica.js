import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import CallIcon from "@mui/icons-material/Call";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import axios from "../../configApi/axiosConfig";
import { useAuth } from "../AuthContext/AuthContext";
import { fetchConsultaYNotifica } from "../Utils";


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
  const { userData, idMenu } = useAuth();
  const [files, setFiles] = useState({});
  const [apiResponseData, setApiResponseData] = useState([]); // Nuevo estado para almacenar la respuesta de la API

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
    idEstadoVerificacionTelefonica: "",
    permisos: [],
  });
  const [
    idCre_VerificacionTelefonicaMaestro,
    setIdCre_VerificacionTelefonicaMaestro,
  ] = useState(null);

  const [filePreviews, setFilePreviews] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [shouldReload, setShouldReload] = useState(false); // Indica si se debe recargar el componente

  const origenMap = {
    1: "DOMICILIO # 1",
    2: "DOMICILIO # 2",
    3: "CELULAR TITULAR",
    4: "REFERENCIA",
    5: "CELULAR TRABAJO",
    6: "TELEFONO TRABAJO",
    7: "CELULAR NEGOCIO",
    8: "TELEFONO NEGOCIO",
  };

  const EstadoMap = {
    0: "PENDIENTE",
    11: "OK, TODO CONFIRMADO",
    12: "NO CONTESTA",
    13: "NÚMERO EQUIVOCADO",
    14: "NO QUIERE SER REFERENCIA",
    15: "MALAS REFERENCIAS",
  };




  const tienePermisoDenegar = clientInfo.permisos.some(
    (permiso) => permiso.Permisos === 'EDITAR TELEFONICA DENEGAR' && permiso.Activo
  );

  const tienePermisoValidar = clientInfo.permisos.some(
    (permiso) => permiso.Permisos === 'EDITAR TELEFONICA VERIFICAR ' && permiso.Activo
  );

  const tienePermisoGuardar = clientInfo.permisos.some(
    (permiso) => permiso.Permisos === 'EDITAR TELEFONICA GUARDAR' && permiso.Activo
  );


  const handleSubmit = async () => {
    const todosContactados = tablaDatos.filter(
      (item) => item.idEstadoGestns === 11
    ).length;

    if (todosContactados >= 2) {
      enqueueSnackbar("Enviado para validar", { variant: "success" });

      const url_estado = APIURL.post_createtiemposolicitudeswebDto();
      await axios.post(url_estado, {
        idCre_SolicitudWeb: clientInfo.id,
        Tipo: 2,
        idEstadoVerificacionDocumental: 3,
        Usuario: userData.Nombre,
        Telefono: ``,
      });

      patchSolicitud(
        clientInfo.id,
        3 // Cambia el estado a "En Validación"
      );
      await fetchConsultaYNotifica(clientInfo.id, clientInfo, {
        title: "Se aprobo la verificacion telefonica! 👀 ",
        body: `Revisa la solicitud de crédito de 🧑‍💼 ${clientInfo.nombre} correspondiente a la solicitud  ${clientInfo.NumeroSolicitud}`,
        type: "alert",
        empresa: "CREDI",
        url: "", // Opcional
        tipo: "vendedor",
      });
      navigate("/ListadoSolicitud", {
        replace: true,
      });

    } else {
      enqueueSnackbar("No todos los registros están en estado 'Contactado'.", {
        variant: "error",
      });
    }
  };

  const handleRemove = async () => {
    rechazar();
    patchSolicitud(
      clientInfo.id,
      4 // Cambia el estado a "rechazado"
    );
      await fetchConsultaYNotifica(clientInfo.NumeroSolicitud, clientInfo, {
          title: "Se rechazo la verificación telefonica! 👀 ",
          body: `Revisa la solicitud de crédito 🧑‍💼 ${clientInfo.nombre} correspondiente a la solicitud  ${clientInfo.NumeroSolicitud}`,
          type: "alert",
          empresa: "POINT",
          url: "", // Opcional
          tipo: "vendedor",
        });
    navigate("/ListadoSolicitud", {
      replace: true,
    });
  }



  //almacenar datos modal
  const [formDataModal, setFormDataModal] = useState({
    contactoEfectivo: "",
    estado: "",
    referencia: "",
    observaciones: "",
  });
  const [view, setView] = useState(false);
  const [tablaDatos, setTablaDatos] = useState([]); //almacenar datos tabla
  const [tablaModal, setTablaModal] = useState([]); //estado datos tabla modal
  const [datoEstado, setDatoEstado] = useState([]); //estado para api Estado
  const [idToTextMapEstado, setIdToTextMapEstado] = useState({}); //estado para mapear IDs a textos de api Estado
  const [datoParentesco, setDatoParentesco] = useState([]); //estado parentesco
  const [idToTextMap, setIdToTextMap] = useState({}); //estado para mapear IDs a textos de api parentesco
  const contactedDocs = tablaDatos.filter((doc) => doc.idEstadoGestns === 11);
  const resultContactedDocs = contactedDocs.length >= 2 ? contactedDocs : [];
  useEffect(() => {
    if (clientInfo.id) {
      // Llamada a la API para obtener los datos
      const fetchData = async () => {
        try {
          const response = await axios.get(
            APIURL.getCreVerificacionTelefonicaMaestro(clientInfo.id)
          );
          setTablaDatos(response.data);
        } catch (error) {
          console.error("Error al obtener los datos de la API", error);
        }
      };


      fetchData();

    }
  }, [clientInfo.id, shouldReload]);

  //Abrir modal
  const handleOpenDialog = async (index, item) => {
    const selectedItem = tablaDatos[index];
    setSelectedRow(item);
    const idCre_VerificacionTelefonicaMaestro =
      selectedItem.idCre_VerificacionTelefonicaMaestro;

    // Validación del ID
    if (
      !idCre_VerificacionTelefonicaMaestro ||
      isNaN(idCre_VerificacionTelefonicaMaestro) ||
      idCre_VerificacionTelefonicaMaestro <= 0
    ) {
      console.error(
        "El idCre_VerificacionTelefonicaMaestro no es válido:",
        idCre_VerificacionTelefonicaMaestro
      );
      return;
    }

    setIdCre_VerificacionTelefonicaMaestro(idCre_VerificacionTelefonicaMaestro);

    try {
      // Llamada a la API
      const response = await fetchSearchCreSolicitudVerificacionTelefonica(
        clientInfo.id,
        idCre_VerificacionTelefonicaMaestro
      );

      if (response.status === 200) {
        // Mejor que solo `response.ok`
        const data = response.data; // Axios devuelve la data en `response.data`

        setApiResponseData(data); // Almacena los datos en el estado correctamente
      } else {
        console.error("Error en la API, código de estado:", response.status);
      }
    } catch (error) {
      console.error("Error al llamar la API:", error);
    }

    setView(true); // Abre el modal
  };

  const fetchSearchCreSolicitudVerificacionTelefonica = async (
    id,
    idCre_VerificacionTelefonicaMaestro
  ) => {
    try {
      const token = localStorage.getItem("token");
      const url = APIURL.getSearchCreSolicitudVerificacionTelefonica(
        id,
        idCre_VerificacionTelefonicaMaestro
      );

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response; // Retorna directamente la respuesta de Axios
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  //Cerrar modal
  const handleCloseDialog = () => {
    setShouldReload(true); // Establece que el componente debe recargarse
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
    } else {
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


  const patchSolicitud = async (idSolicitud, estado) => {
    try {
      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        {
          idEstadoVerificacionTelefonica: estado,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", { variant: "success" });
        navigate("/ListadoSolicitud", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", { variant: "error" });
    }
  };

  const rechazar = async () => {
    if (clientInfo.id) {
      const url_estado = APIURL.post_createtiemposolicitudeswebDto();
      await axios.post(url_estado, {
        idCre_SolicitudWeb: clientInfo.id,
        Tipo: 2,
        idEstadoVerificacionDocumental: 4,
        Usuario: userData.Nombre,
        //selectedRow.Telefono+"-"+selectedRow.Contacto,
      }
      );
    }
  }

  const handleGuardarModal = async () => {
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
      enqueueSnackbar("Observaciones son requeridas (Mínimo 10 caracteres)", {
        variant: "error",
      });
      return;
    }

    const datosParaEnviar = {
      Fecha: clientInfo.fecha.toUpperCase(),
      Telefono: selectedRow.Telefono.toUpperCase(),
      Contacto: formDataModal.contactoEfectivo.toUpperCase(),
      idParentesco: Number(formDataModal.referencia),
      idEstadoGestns: Number(formDataModal.estado),
      Observaciones: formDataModal.observaciones.toUpperCase(),
      ClienteGarante: false,
      Origen: 1,
      idCre_SolicitudWeb: clientInfo.id,
      Estado: true,
      NotasDelSistema: "NOTAS DEL SISTEMA",
      Usuario: userData.Nombre,
      Indice: 1,
      Web: 1,
      Nuevo: true,
      idCre_VerificacionTelefonicaMaestro: idCre_VerificacionTelefonicaMaestro,
    };

    try {
      // Llamada para guardar los datos
      await enviarDatosModal(datosParaEnviar);

      setShouldReload((prevState) => !prevState);
      // Crear nuevo registro para mostrar en la tabla
      const nuevoRegistro = {
        fecha: datosParaEnviar.Fecha,
        celularMod: datosParaEnviar.Telefono,
        contactoEfectivo: datosParaEnviar.Contacto,
        referencia: datosParaEnviar.idParentesco,
        estado: datosParaEnviar.idEstadoGestns,
        observaciones: datosParaEnviar.Observaciones,
      };

      setTablaModal([...tablaModal, nuevoRegistro]);
      enqueueSnackbar("Registro Guardado", { variant: "success" });




      // **Recargar datos de la API** después de guardar
      await fetchSearchCreSolicitudVerificacionTelefonica(
        clientInfo.id,
        idCre_VerificacionTelefonicaMaestro
      )
        .then(async (response) => {
          if (response.status === 200) {
            setApiResponseData(response.data); // Actualizar los datos con los nuevos datos desde la API

            const url_estado = APIURL.post_createtiemposolicitudeswebDto();
            await axios.post(url_estado, {
              idCre_SolicitudWeb: clientInfo.id,
              Tipo: 2,
              idEstadoVerificacionDocumental: 5,
              Usuario: userData.Nombre,
              Telefono: `${selectedRow.Telefono}-${idToTextMapEstado[nuevoRegistro.estado]
                }`, //selectedRow.Telefono+"-"+selectedRow.Contacto,
            });
          }
        })
        .catch((error) => console.error("Error al actualizar datos:", error));

      handleLimpiarModal(); // Limpiar el modal después de guardar
      handleCloseDialog(); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      enqueueSnackbar("Error al guardar los datos", { variant: "error" });
    }
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
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDatoEstado(response.data);
      //objeto para mapear IDs a textos
      const idToTextMapEstado = {};
      response.data.forEach((item) => {
        idToTextMapEstado[item.idEstadoGestns] = item.DESCRIPCION;
      });
      setIdToTextMapEstado(idToTextMapEstado); // Guardar el objeto en el estado
    } catch (error) {
      enqueueSnackbar("Error fetching Dato: " + error.message, {
        variant: "error",
      });
    }
  };

  //api referencias
  useEffect(() => {
    fetchDato();
  }, []);

  const fetchDato = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = APIURL.getParentesco();
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDatoParentesco(response.data);

      //objeto para mapear IDs a textos
      const idToTextMap = {};
      response.data.forEach((item) => {
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
      enqueueSnackbar(
        "Error al enviar los datos: " + error.response?.data?.message ||
        error.message,
        { variant: "error" }
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6 bg-white overflow-x-hidden">
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          {/* Información del cliente */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-6 Pr-6">
              {clientInfo.foto !== null && clientInfo.foto !== "prueba" ? (
                <img
                  src={clientInfo.foto}
                  alt="Foto del cliente"
                  className="w-80 h-80 md:w-64 md:h-64 object-cover border-4 border-gray-300 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
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

              <div className="md:w-3/4 mt-6 pl-4 bg-white shadow-xl rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base leading-relaxed">
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
                      <p className="font-semibold text-gray-800">{label}:</p>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-4 items-center">
                    {resultContactedDocs.length >= 2 && tienePermisoValidar && clientInfo.idEstadoVerificacionTelefonica !== 3 && (
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300 ease-in-out"
                      >
                        Aprobar
                      </button>
                    )}

                    {tienePermisoDenegar && clientInfo.idEstadoVerificacionTelefonica !== 4 && clientInfo.idEstadoVerificacionTelefonica !== 3 && (
                      <button
                        onClick={handleRemove
                        }
                        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 ease-in-out"
                      >
                        Rechazar
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/ListadoSolicitud", { replace: true })}
                      className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                    >
                      Regresar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="p-6 bg-gray-50 min-h-screen overflow-hidden">
            <div className="w-full overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
              <table className="w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-center font-bold">#</th>
                    <th className="px-4 py-2 text-center font-bold">Nombre</th>
                    <th className="px-4 py-2 text-center font-bold">Origen</th>
                    <th className="px-4 py-2 text-center font-bold">Fecha</th>
                    <th className="px-4 py-2 text-center font-bold">Telefono</th>
                    <th className="px-4 py-2 text-center font-bold">Estado</th>
                    <th className="px-4 py-2 text-center font-bold">....</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaDatos.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-center">{index + 1}</td>
                      <td className="px-4 py-2 text-center">{item.idEstadoOrigenTelefonica === 4 ? item.Observacion : ""}</td>
                      {/* Mostrar origen como Estacion */}
                      <td className="px-4 py-2 text-center">
                        {origenMap[item.idEstadoOrigenTelefonica] ||
                          "Desconocido"}
                      </td>{" "}
                      {/* Formatear la fecha para que se muestre de forma legible */}
                      <td className="px-4 py-2 text-center">
                        {new Date(item.Fecha).toLocaleString()}{" "}
                        {/* Formatea la fecha */}
                      </td>
                      {/* Mostrar teléfono */}
                      <td className="px-4 py-2 text-center">{item.Telefono}</td>
                      <td className="px-4 py-2 text-center">
                        {EstadoMap[item.idEstadoGestns] || "Desconocido"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <IconButton
                          color="primary"
                          aria-label="call"
                          onClick={() => handleOpenDialog(index, item)}
                        >
                          <CallIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Modal */}
          <Dialog
            open={view}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle className="text-lg font-semibold border-b py-4 px-6 bg-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PersonIcon className="text-blue-500" fontSize="medium" />
                <span>
                  Verificación Telefónica de {clientInfo?.nombre}{" "}
                  {selectedRow?.Telefono}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <EventIcon className="text-blue-500" fontSize="medium" />
                <span className="text-sm">
                  {new Date(clientInfo.fecha).toLocaleDateString()}
                </span>
              </div>
            </DialogTitle>

            <DialogContent dividers className="p-6 bg-white">
              {clientInfo && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Primera columna */}
                  <div className="col-span-3">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Referencia */}
                      <div className="flex-1">
                        <label class="text-xs font-medium mb-1 flex items-center">
                          Referencia (*)
                        </label>
                        <select
                          class="solcitudgrande-style"
                          name="referencia"
                          value={formDataModal.referencia}
                          onChange={handleChangeModal}
                        >
                          <option value="">Seleccione una opción</option>
                          {datoParentesco.map((opcion) => (
                            <option
                              key={opcion.idParentesco}
                              value={opcion.idParentesco}
                            >
                              {opcion.Nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Estado */}
                      <div className="flex-1">
                        <label class="text-xs font-medium mb-1 flex items-center">
                          Estado (*)
                        </label>
                        <select
                          class="solcitudgrande-style"
                          name="estado"
                          value={formDataModal.estado}
                          onChange={handleChangeModal}
                        >
                          <option value="">Seleccione una opción</option>
                          {datoEstado.map((opcion) => (
                            <option
                              key={opcion.idEstadoGestns}
                              value={opcion.idEstadoGestns}
                            >
                              {opcion.DESCRIPCION}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Contacto Efectivo */}
                      <div className="flex-1">
                        <label class="text-xs font-medium mb-1 flex items-center">
                          Contacto Efectivo (*)
                        </label>
                        <input
                          class="solcitudgrande-style"
                          type="text"
                          name="contactoEfectivo"
                          placeholder="Contacto Efectivo"
                          value={formDataModal.contactoEfectivo}
                          onChange={handleChangeModal}
                          pattern="[A-Za-z]+"
                          title="Solo se permiten letras"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="col-span-3">
                    <label class="text-xs font-medium mb-1 flex items-center">
                      Observaciones (*)
                    </label>
                    <textarea
                      class="solcitudgrande-style"
                      name="observaciones"
                      rows="3"
                      placeholder="Ingrese observaciones"
                      value={formDataModal.observaciones}
                      onChange={handleChangeModal}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Tabla Modal */}
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3 text-gray-700">
                  Registros Guardados
                </h3>
                <div className="overflow-x-auto">
                  <TableContainer
                    component={Paper}
                    className="shadow-md rounded-md border border-gray-300"
                  >
                    <Table className="table-fixed">
                      <TableHead>
                        <TableRow className="bg-gray-200 text-white h-12">
                          <TableCell className="text-white font-semibold text-sm px-4 py-2 w-32">
                            Fecha
                          </TableCell>
                          <TableCell className="text-white font-semibold text-sm px-4 py-2 w-40">
                            Celular
                          </TableCell>
                          <TableCell className="text-white font-semibold text-sm px-4 py-2 w-40">
                            Contacto
                          </TableCell>
                          <TableCell className="text-white font-semibold text-sm px-4 py-2 w-32">
                            Referencia
                          </TableCell>
                          <TableCell className="text-white font-semibold text-sm px-4 py-2 w-28">
                            Estado
                          </TableCell>
                          <TableCell className="text-white font-semibold text-sm px-4 py-2 w-60">
                            Observaciones
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiResponseData.map((registro, index) => (
                          <TableRow key={index} className="hover:bg-gray-100">
                            <TableCell className="text-sm px-4 py-2">
                              {new Date(registro.Fecha).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm px-4 py-2">
                              {registro.Telefono}
                            </TableCell>
                            <TableCell className="text-sm px-4 py-2 whitespace-normal break-words ">
                              {registro.Contacto}
                            </TableCell>
                            <TableCell className="text-sm px-4 py-2 whitespace-normal break-words ">
                              {idToTextMap[registro.idParentesco]}
                            </TableCell>
                            <TableCell className="text-sm px-4 py-2">
                              {idToTextMapEstado[registro.idEstadoGestns]}
                            </TableCell>

                            {/* Aquí está el ajuste */}
                            <TableCell className="text-sm px-4 py-2 max-w-[200px] whitespace-normal break-words">
                              {registro.Observaciones}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </DialogContent>

            <DialogActions className="bg-gray-100 py-3 px-6">
              {selectedRow?.idEstadoGestns !== 11 && tienePermisoGuardar
                && (
                  <Button
                    onClick={handleGuardarModal}
                    color="primary"
                    variant="contained"
                  >
                    Guardar
                  </Button>
                )}
              <Button
                onClick={handleCloseDialog}
                color="secondary"
                variant="outlined"
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
