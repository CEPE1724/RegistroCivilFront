import { useState, useEffect, useRef, use } from "react";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import CallIcon from "@mui/icons-material/Call";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import axios from "../../configApi/axiosConfig";
import { useAuth } from "../AuthContext/AuthContext";
import { fetchConsultaYNotifica, fechaHoraEcuador } from "../Utils";
import ModalConfirmacionRechazo from '../SolicitudGrande/Cabecera/ModalConfirmacionRechazo'; // Ajusta la ruta si es necesario
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ModalCorreccion from "../SolicitudGrande/Cabecera/ModalCorreccion";
import { UpdateTelefonica } from "../UpdateTelefonica";
import { Typography } from "@mui/material";
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
import PrintIcon from '@mui/icons-material/Print';
import { Icon } from "lucide-react";
import { set } from "react-hook-form";
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
  const [apiResponseData, setApiResponseData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [filePreviews, setFilePreviews] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [shouldReload, setShouldReload] = useState(false); // Indica si se debe recargar el componente
  const [soliParen, setSoliParen] = useState([])
  const [showModalCorrecion, setShowModalCorrecion] = useState(false);
  const [openConfirmModalAsig, setOpenConfirmModalAsig] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [idCre_VerificacionTelefonicaMaestro, setIdCre_VerificacionTelefonicaMaestro] = useState(null);
  const [showRechazoModal, setShowRechazoModal] = useState(false);
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
  const contactedDocs = tablaDatos.filter((doc) => doc.idEstadoOrigenTelefonica == 4 && doc.idEstadoGestns === 11); //numeros contactados que son referencia

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

  // 1. Cargar datos de cliente desde location o localStorage
  useEffect(() => {
    const locationClientInfo = location.state;

    if (locationClientInfo) {
      localStorage.setItem("clientInfo", JSON.stringify(locationClientInfo));
      setClientInfo(locationClientInfo);
    } else {
      const savedClientInfo = localStorage.getItem("clientInfo");
      if (savedClientInfo) {
        setClientInfo(JSON.parse(savedClientInfo));
      }
    }
  }, [location.state]);

  // 2. Cargar datos relacionados al cliente cuando esté listo
  useEffect(() => {
    if (!clientInfo.id) return;
    fetchData();
    fetchParentesco();
  }, [clientInfo.id, shouldReload]);

  // 3. Generar previews de archivos seleccionados
  useEffect(() => {
    const updatedPreviews = {};

    Object.entries(files).forEach(([field, fileList]) => {
      updatedPreviews[field] = fileList.map(file => URL.createObjectURL(file));
    });

    setFilePreviews(updatedPreviews);

    return () => {
      Object.values(updatedPreviews).flat().forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  // 4. Obtener datos de estado y datos generales una vez
  useEffect(() => {
    fetchDatoEstado();
    fetchDato();
  }, []);




  const origenMap = {
    1: "DOMICILIO # 1",
    2: "DOMICILIO # 2",
    3: "CELULAR TITULAR",
    4: "REFERENCIA",
    5: "CELULAR TRABAJO",
    6: "TELEFONO TRABAJO",
    7: "CELULAR NEGOCIO",
    8: "TELEFONO NEGOCIO",
    10: "JEFE INMEDIATO",
    11: "CAMBIO DE NÚMERO",
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

  const tienePermisocorreccion = clientInfo.permisos.some(
    (permiso) => permiso.Permisos === 'EDITAR TELEFONICA CORRECCION' && permiso.Activo
  );

  const handleGuardar = async (data) => {

    const Observacion = ` TELEFONO ACTUALIZADO ${data.Telefono} POR ${data.TelefonoOrigen}. NOTA: ${data.Observaciones}`;
    await fetchSaveDatosTrabajo(data);
    await fetchVerifTelfMaestr(data);
    await fecthUpdateVerifTelfMaestr(data);
    await fetchInsertarDatosCorreccion(6, Observacion);
    await fetchData();
    // Aquí puedes hacer una llamada a tu API o lógica adicional
  };

  const fetchSaveDatosTrabajo = async (data) => {
    try {
      const url = APIURL.puth_web_solicitudgrande_listadosolicitud(data.idWeb_SolicitudGrande);

      const response = await axios.patch(
        url,
        {
          [data.Campo]: data.Telefono
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Si todo sale bien
      enqueueSnackbar("Número actualizado correctamente.", {
        variant: "success",
      });
    } catch (error) {
      // Si ocurre algún error
      enqueueSnackbar("Error al guardar los datos del Dependiente.", {
        variant: "error",
      });
      console.error("Error al guardar los datos del Dependiente.", error);
    }
  };

  const fetchVerifTelfMaestr = async (data) => {
    try {

      const url = APIURL.post_VerificacionTelefonicaMaestro();
      await axios.post(url, {
        Telefono: data.Telefono,
        idEstadoOrigenTelefonica: data.idEstadoOrigenTelefonica,
        idCre_SolicitudWeb: data.idCre_SolicitudWeb,
        idWeb_SolicitudGrande: data.idWeb_SolicitudGrande,
        Observacion: data.Observacion,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente:", {
        errorResponse: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      throw new Error(`Error al guardar en VerificacionTelefonicaMaestro: ${error.message}`);
    }
  };
  const fecthUpdateVerifTelfMaestr = async (data) => {
    try {
      const url = APIURL.update_VerificacionTelefonicaMaestro(data.idCre_VerificacionTelefonicaMaestroOrigen);
      await axios.patch(url, {
        idEstadoOrigenTelefonica: 11
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error al actualizar los datos del cliente:", {
        errorResponse: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      throw new Error(`Error al actualizar en VerificacionTelefonicaMaestro: ${error.message}`);
    }
  };

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
        body: `Revisa la solicitud de crédito de 🧑‍💼 ${clientInfo.nombre} correspondiente a la solicitud  ${clientInfo.NumeroSolicitud} con CI. ${clientInfo.cedula}`,
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

  const handleCorreccion = async (observacion) => {
    await patchSolicitud(clientInfo.id, 7); // actualizar a correccion
    fetchInsertarDatosCorreccion(7, observacion);

    await fetchConsultaYNotifica(clientInfo?.id, clientInfo, {
      title: "¡Se envio a corregir la telefonica! ✍️📞",
      body: `Revisa la solicitud de crédito ${clientInfo.NumeroSolicitud} de 🧑‍💼 ${clientInfo.nombre} con CI ${clientInfo.cedula}
	 📅 Fecha: ${fechaHoraEcuador}`,
      type: "alert",
      empresa: "POINT",
      url: "",
      tipo: "vendedor",
    });
    navigate("/ListadoSolicitud", {
      replace: true,
    });
  };


  const handleRemove = async () => {
    rechazar();
    patchSolicitud(
      clientInfo.id,
      4 // Cambia el estado a "rechazado"
    );
    await fetchConsultaYNotifica(clientInfo.NumeroSolicitud, clientInfo, {
      title: "Se rechazo la verificación telefonica! 👀 ",
      body: `Revisa la solicitud de crédito 🧑‍💼 ${clientInfo.nombre} correspondiente a la solicitud  ${clientInfo.NumeroSolicitud} con CI. ${clientInfo.cedula}`,
      type: "alert",
      empresa: "POINT",
      url: "", // Opcional
      tipo: "vendedor",
    });
    navigate("/ListadoSolicitud", {
      replace: true,
    });
  }


  const handleConfirmRechazo = async (observacion) => {
    await rechazar(observacion);
    await patchSolicitud(
      clientInfo.id,
      4 // Cambia el estado a "rechazado"
    );
    await fetchConsultaYNotifica(clientInfo.NumeroSolicitud, clientInfo, {
      title: "Se rechazo la verificación telefonica! 👀 ",
      body: `Revisa la solicitud de crédito 🧑‍💼 ${clientInfo.nombre} correspondiente a la solicitud  ${clientInfo.NumeroSolicitud} con CI. ${clientInfo.cedula}`,
      type: "alert",
      empresa: "POINT",
      url: "",
      tipo: "vendedor",
    });
    setShowRechazoModal(false);
    navigate("/ListadoSolicitud", {
      replace: true,
    });
  };

  const titulares = tablaDatos.filter((item) => {
    const match = soliParen.find(p => p.Celular == item.Telefono);
    const nombreParentesco = match
      ? datoParentesco.find(d => d.idParentesco == match.idParentesco)?.Nombre
      : 'TITULAR';
    return nombreParentesco === 'TITULAR';
  });

  const countTitulares = titulares.length;
  const lengthTitulares = titulares.filter(item => item.idEstadoGestns === 11).length;

  const todosTitularesContactados = titulares.every(
    (item) => item.idEstadoGestns === 11 || item.idEstadoGestns === 13
  );
  const countTitularesEquivocados = titulares.filter(item => item.idEstadoGestns === 13).length;

  const puedeAprobar = contactedDocs.length >= 2 && (lengthTitulares === (countTitulares - countTitularesEquivocados)) && todosTitularesContactados;


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
  //Abrir modal
  const handleOpenDialog = async (index, item) => {
    const selectedItem = tablaDatos[index];
    setSelectedRow(item);
    const match = soliParen.find(p => p.Celular === item.Telefono);
    setSelectedRow({
      ...item,
      idParentesco: match ? match.idParentesco : ''
    });
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

  const fetchInsertarDatosCorreccion = async (tipo, observacion) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {
        idCre_SolicitudWeb: clientInfo.id,
        Tipo: 2,
        idEstadoVerificacionDocumental: tipo,
        Usuario: userData.Nombre,
        Telefono: observacion,
      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  const handleAsignar = async (observacion) => {
    await patchSolicitud(clientInfo.id, 2);
    fetchInsertarDatosCorreccion(2, observacion);

    await fetchConsultaYNotifica(clientInfo?.id, clientInfo, {
      title: "¡Se reasigno la verificacion telefonica! 📞",
      body: `Vuelve a revisar la solicitud de crédito ${clientInfo.NumeroSolicitud} de 🧑‍💼 ${clientInfo.nombre} con CI ${clientInfo.cedula}
	 📅 Fecha: ${fechaHoraEcuador}`,
      type: "alert",
      empresa: "CREDI",
      url: "",
      tipo: "analista-operador",
    });
    navigate("/ListadoSolicitud", {
      replace: true,
    });

  }

  const rechazar = async (observacion) => {
    if (clientInfo.id) {
      const url_estado = APIURL.post_createtiemposolicitudeswebDto();
      await axios.post(url_estado, {
        idCre_SolicitudWeb: clientInfo.id,
        Tipo: 2,
        idEstadoVerificacionDocumental: 4,
        Usuario: userData.Nombre,
        Telefono: observacion,
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

  const fetchParentesco = async () => {
    try {
      const response = await axios.get(APIURL.get_cre_referenciasclientesweb_id(clientInfo.id))
      setSoliParen(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de parentesco:", error);
      enqueueSnackbar("Error al obtener los datos de parentesco", { variant: "error" });
    }
  }

  const ModalActualizarTelefonica = (data, open) => {
    // Lógica para abrir el modal y pasar los datos
    setModalData(data);
    setModalOpen(open);

  };

  const ReporteTelefonicoButton = ({ solicitudId }) => {
    const handleDownloadPDF = () => {
      const url = `${APIURL.store_reports_phone_verification(solicitudId)}`;
      window.open(url, '_blank');
    };



    return (
      <Button
        variant="contained"
        startIcon={<PictureAsPdfIcon />}
        onClick={handleDownloadPDF}
        sx={{
          backgroundColor: '#2563eb', // Azul Tailwind 600
          '&:hover': { backgroundColor: '#1d4ed8' },
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: '600',
          px: 2,
          py: 1.5,
        }}
      >
        Ver Reporte
      </Button>
    );
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
                    ["Fecha", new Date(clientInfo.fecha).toLocaleString('es-EC', {
                      day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
                    })],
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
                    {puedeAprobar && tienePermisoValidar && clientInfo.idEstadoVerificacionTelefonica === 2 && (
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300 ease-in-out"
                      >
                        Aprobar
                      </button>
                    )}

                    {tienePermisoDenegar && clientInfo.idEstadoVerificacionTelefonica !== 4 && clientInfo.idEstadoVerificacionTelefonica !== 3 && clientInfo.idEstadoVerificacionTelefonica !== 7 && (
                      <button
                        onClick={() => setShowRechazoModal(true)}
                        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 ease-in-out"
                      >
                        Rechazar
                      </button>
                    )}

                    {clientInfo.idEstadoVerificacionTelefonica !== 4 && clientInfo.idEstadoVerificacionTelefonica !== 3 && clientInfo.idEstadoVerificacionTelefonica !== 7 && tienePermisocorreccion && (
                      <button
                        onClick={() => setShowModalCorrecion(true)}
                        className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out"
                      >
                        Corrección
                      </button>)}

                    {clientInfo.idEstadoVerificacionTelefonica == 7 && (userData.idGrupo == 1 || userData.idGrupo == 23) && (
                      <button
                        onClick={() => setOpenConfirmModalAsig(true)}
                        className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out"
                      >
                        Asignar
                      </button>)}
                    <button
                      onClick={() => navigate("/ListadoSolicitud", { replace: true })}
                      className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                    >
                      Regresar
                    </button>
                    {clientInfo.idEstadoVerificacionTelefonica === 3 && (
                      <ReporteTelefonicoButton solicitudId={clientInfo.id} />
                    )}

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
                    <th className="px-4 py-2 text-center font-bold">Parentesco</th>
                    <th className="px-4 py-2 text-center font-bold">Origen</th>
                    <th className="px-4 py-2 text-center font-bold">Fecha</th>
                    <th className="px-4 py-2 text-center font-bold">Telefono</th>
                    <th className="px-4 py-2 text-center font-bold">Estado</th>
                    <th className="px-4 py-2 text-center font-bold">....</th>
                    {(clientInfo.idEstadoVerificacionTelefonica == 7) && (<th className="px-4 py-2 text-center font-bold">Acción</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tablaDatos.map((item, index) => {
                    const match = soliParen.find(p => p.Celular == item.Telefono);
                    const nombreParentesco = match
                      ? datoParentesco.find(d => d.idParentesco == match.idParentesco)?.Nombre
                      : 'TITULAR';

                    const isVerde = item.idEstadoGestns === 11;
                    const isRojo = item.idEstadoGestns === 13;

                    return (

                      <tr
                        key={index}
                        className={`
                               ${isRojo ? "bg-red-300" : ""}
                               ${isVerde ? "bg-green-300" : ""}  hover:bg-gray-100 transition-colors duration-300`}
                      >
                        <td className="px-4 py-2 text-center">{index + 1}</td>
                        <td className="px-4 py-2 text-center">{item.idEstadoOrigenTelefonica === 4 ? item.Observacion : ""}</td>
                        <td className="px-4 py-2 text-center">{nombreParentesco}</td>
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
                        {(clientInfo.idEstadoVerificacionTelefonica === 7 && item.idEstadoOrigenTelefonica != 11) && (
                          <td className="px-4 py-2 text-center">
                            {(item.idEstadoGestns === 13 && nombreParentesco === 'TITULAR') && (
                              /* actualizar telefono*/
                              <IconButton
                                color="success"
                                aria-label="edit"
                                onClick={() => ModalActualizarTelefonica(item, true, tablaDatos)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          </td>
                        )}
                      </tr>)
                  })}
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
                  Verificación Telefónica de {selectedRow?.Observacion}{" "}
                  {selectedRow?.Telefono} - {selectedRow?.idParentesco ? datoParentesco.find(item => item.idParentesco === selectedRow.idParentesco)?.Nombre || 'Titular' : 'Titular'}
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
              {(selectedRow?.idEstadoGestns !== 11 && selectedRow?.idEstadoGestns !== 13) && tienePermisoGuardar && (clientInfo.idEstadoVerificacionTelefonica == 2)
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
        <ModalConfirmacionRechazo
          isOpen={showRechazoModal}
          onClose={() => setShowRechazoModal(false)}
          onConfirm={handleConfirmRechazo}
          solicitudData={clientInfo}
          mensajePrincipal="¿Está seguro de rechazar la verificación telefónica?"
        />
      </div>
      <ModalCorreccion
        isOpen={showModalCorrecion}
        onClose={() => setShowModalCorrecion(false)}
        onConfirm={handleCorreccion}
        solicitudData={clientInfo}
        Titulo='Enviar a Corrección'
        mensajePrincipal='¿Deseas solicitar una corrección para Telefónica?'
      />

      <ModalCorreccion
        isOpen={openConfirmModalAsig}
        onClose={() => setOpenConfirmModalAsig(false)}
        onConfirm={handleAsignar}
        solicitudData={clientInfo}
        Titulo='Enviar Verificacion'
        mensajePrincipal='¿Deseas volver a enviar a revisión la Telefónica?'
      />

      <UpdateTelefonica
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleGuardar}
        data={modalData}
        tablaDatos={tablaDatos}
      />

    </div>
  );
}
