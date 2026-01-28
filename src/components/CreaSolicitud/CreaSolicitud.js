import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from "notistack";
import { APIURL } from "../../configApi/apiConfig";
import axios from "../../configApi/axiosConfig";
import useBodegaUsuario from "../../hooks/useBodegaUsuario";
import { useAuth } from "../AuthContext/AuthContext";
import { SolicitudExitosa } from "../MensajeSolicitudExitosa/SolicitudExitosa";
import { getSocket, connectToServer } from "../../socket/socket-client";
import { ModalProgreso } from './ModalProgreso';
import payjoy from '../../img/payjoy.png';

export function CreaSolicitud ({currentStep, setCurrentStep })  {
    const navigate = useNavigate();
    const { userData, userUsuario } = useAuth();
    const { data, fetchBodegaUsuario } = useBodegaUsuario();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        bodega: '',
        tipoConsulta: '',
        cedula: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        primerNombre: '',
        segundoNombre: '',
        fechaNacimiento: '',
        edad: '',
        situacionLaboral: '',
        celular: '',
        email: '',
        actividadEconomica: '',
        estabilidadLaboral: '',
        tiempoVivienda: '',
        producto: '',
        terminosCondiciones: false,
        politicasPrivacidad: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [socketConnecting, setSocketConnecting] = useState(false);
    const [mensajeExitoso, setMensajeExitoso] = useState(false);
    const [soliExistente, setSoliExistente] = useState(null);
    const [solicitudActiva, setSolicitudActiva] = useState(false);
    const [datosPersonalesVisible, setDatosPersonalesVisible] = useState(false);

    // Estados para progreso asíncrono
    const [modalProgreso, setModalProgreso] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [fase, setFase] = useState('INICIADO');
    const [mensajeProgreso, setMensajeProgreso] = useState('');
    const [estadoProceso, setEstadoProceso] = useState(''); // PROCESANDO, COMPLETADO, ERROR
    const [idSolicitudCreada, setIdSolicitudCreada] = useState(null);
    const [resultadoSolicitud, setResultadoSolicitud] = useState(null);

    // Estados para modales de resultado
    const [modalAprobado, setModalAprobado] = useState(false);
    const [modalRechazado, setModalRechazado] = useState(false);
    const [datosSolicitudFinal, setDatosSolicitudFinal] = useState(null);
    const [soliGrande, setSoliGrande] = useState(null);
    const [creSoliWeb, setCreSoliWeb] = useState(null);

    const [dataBodega, setDataBodega] = useState([]);
    const [tipoConsulta, setTipoConsulta] = useState([]);
    const [actividadLaboral, setActividadLaboral] = useState([]);
    const [ActEconomina, setActEconomina] = useState([]);
    const [estabilidadLaboral, setEstabilidadLaboral] = useState([]);
    const [tiempoVivienda, setTiempoVivienda] = useState([]);
    const [Afiliado, setAfiliado] = useState(false);
    const [Jubilado, setJubilado] = useState(false);

    // Productos fijos
    const productos = [
        { value: 1, label: "COMBOS" },
        { value: 2, label: "LAVADORA" },
        { value: 3, label: "MOVILIDAD" },
        { value: 4, label: "PORTATIL" },
        { value: 5, label: "REFRIGERADOR" },
        { value: 6, label: "TELEVISOR" },
        { value: 8, label: "IPHONE" },
    ];

    // Fetch Bodegas
    const fetchBodega = async () => {
        const userId = userData?.idUsuario;
        const idTipoFactura = 43;
        const fecha = new Date().toISOString();
        const recibeConsignacion = true;
        try {
            await fetchBodegaUsuario(userId, idTipoFactura, fecha, recibeConsignacion);
        } catch (err) {
            console.error("Error al obtener datos de la bodega:", err);
            enqueueSnackbar("Error al cargar los datos de bodega", { variant: "error", preventDuplicate: true });
        }
    };

    // Fetch Tipo de Consulta
    const fetchTipoConsulta = async () => {
        try {
            const token = '';
            const response = await axios.get(APIURL.get_TipoConsulta(), {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Cache": "no-store",
                },
            });
            // Excluir idCompraEncuesta = 11
            const filtrados = response.data.filter(item => item.idCompraEncuesta !== 11);
            const ordenados = filtrados.sort((a, b) => a.Descripcion.localeCompare(b.Descripcion, 'es', { sensitivity: 'base' }));
            setTipoConsulta(ordenados);
        } catch (error) {
            console.error("Error al obtener tipo de consulta", error);
            setTipoConsulta([]);
        }
    };

    // Fetch Estabilidad Laboral y Tiempo de Vivienda
    const fetchEstabilidadLaboral = async () => {
        try {
            const response = await axios.get(APIURL.getEstabilidadLaboral(), {
                headers: { method: "GET", cache: "no-store" },
            });
            setEstabilidadLaboral(response.data);
            setTiempoVivienda(response.data);
        } catch (error) {
            console.error("Error al obtener estabilidad laboral", error);
            enqueueSnackbar("Error al cargar estabilidad laboral", { variant: "error", preventDuplicate: true });
            setEstabilidadLaboral([]);
            setTiempoVivienda([]);
        }
    };

    // Fetch Actividad Laboral (Situación Laboral)
    const fetchActividadLaboral = async () => {
        try {
            const response = await axios.get(APIURL.getActividadEconominasituacionLaboral(), {
                headers: { method: "GET", cache: "no-store" },
            });

            // Filtrar si Afiliado es false
            const datosFiltrados = response.data.filter(item => {
                if (!Afiliado) {
                    return item.idSituacionLaboral !== 1;
                }
                return true;
            });

            setActividadLaboral(datosFiltrados);
        } catch (error) {
            console.error("Error al obtener actividad laboral", error);
            setActividadLaboral([]);
        }
    };

    // Fetch Actividad Económica
    const fetchActEconomina = async (idSituacionLaboral) => {
        try {
            if (!idSituacionLaboral) return;

            const response = await axios.get(APIURL.get_cre_actividadeconomina(idSituacionLaboral), {
                headers: { method: "GET", cache: "no-store" },
            });

            let datosFiltrados = [];

            if (Jubilado && idSituacionLaboral == 1) {
                datosFiltrados = response.data.filter(item => item.idActEconomica === 301);
            } else {
                datosFiltrados = response.data.filter(item => item.idActEconomica !== 301);
            }

            setActEconomina(datosFiltrados);
        } catch (error) {
            console.error("Error al obtener actividad económica", error);
            setActEconomina([]);
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchEstabilidadLaboral();
        fetchTipoConsulta();
        fetchBodega();
    }, []);

    // Actualizar actividad laboral cuando cambia Afiliado
    useEffect(() => {
        fetchActividadLaboral();
    }, [Afiliado]);

    // Procesar datos de bodegas
    useEffect(() => {
        if (data && data.length > 0) {
            setDataBodega(data);
        }
    }, [data]);

    // Funciones de validación de listas negras
    const comprobTelf = async (telefono) => {
        try {
            const url = APIURL.validarTelefono(telefono);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error al validar el teléfono:", error);
            return false;
        }
    };

    const comprobcedula = async (cedula) => {
        try {
            const url = APIURL.validarCedula(cedula);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error al validar la cédula:", error);
            return false;
        }
    };

    const comprobEmail = async (email) => {
        try {
            const url = APIURL.validarEmail(email);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error al validar el email:", error);
            return false;
        }
    };

    // Consultar datos por cédula (API Cogno)
    const fecthDatosCogno = async (cedula) => {
        try {
            const url = APIURL.validarCedulaCognos(cedula);  // URL para obtener datos de Cogno
            const response = await axios.get(url);
            if (response.data) {
                return response.data;  // Devuelve los datos si la respuesta es exitosa
            }
            throw new Error("No se encontraron datos para la cédula proporcionada");
        } catch (error) {
            console.error("Error al obtener datos de Cogno:", error.message);
            throw error;  // Lanzar el error para manejarlo más tarde
        }
    };

    const verificarCedulaBodega = async (cedula) => {
        try {
            const response = await axios.get(APIURL.verificarRegistroSolicitud(cedula));
            setSoliExistente(response.data.solicitud);
            return response.data.existe === true;
        } catch (error) {
            console.error("Error al verificar existencia de solicitud:", error);
            return false;
        }
    };

    const handleCedulaBlur = async (e) => {
        const cedula = e.target.value.trim();
        if (cedula.length === 10) {
            await handleValidarCedula();
        }
    };

    const handleValidarCedula = async () => {
        const cedula = formData.cedula.trim();

        if (cedula.length !== 10) {
            enqueueSnackbar("La cédula debe tener 10 dígitos", { variant: "warning" });
            return;
        }

        setLoading(true);

        try {
            // Primero verificamos si existe una solicitud activa
            const existeSolicitud = await verificarCedulaBodega(cedula);
            if (existeSolicitud) {
                setSolicitudActiva(true);
                setLoading(false);
                return;
            }

            // Si no existe solicitud activa, procedemos a consultar datos de Cognos
            const datosCogno = await fecthDatosCogno(cedula);

            if (datosCogno.codigo === "OK") {
                // Actualizar estados de afiliado y jubilado PRIMERO
                const esAfiliado = datosCogno.afiliado || false;
                const esJubilado = datosCogno.jubilado || false;

                setAfiliado(esAfiliado);
                setJubilado(esJubilado);
                setDatosPersonalesVisible(true); // Mostrar campos personales

                // Actualizar formulario con datos recibidos
                setFormData(prev => ({
                    ...prev,
                    primerNombre: datosCogno.primerNombre || '',
                    segundoNombre: datosCogno.segundoNombre || '',
                    apellidoPaterno: datosCogno.apellidoPaterno || '',
                    apellidoMaterno: datosCogno.apellidoMaterno || '',
                    fechaNacimiento: datosCogno.fechaNacimiento || '',
                    edad: datosCogno.edad || '',
                    cedula: datosCogno.identificacion || cedula,
                    situacionLaboral: '',
                    actividadEconomica: ''
                }));

                // Cargar actividad laboral basada en si es afiliado o no
                // El useEffect se dispara automáticamente cuando cambia Afiliado

                enqueueSnackbar("Datos cargados correctamente", { variant: "success" });
            } else {
                // No se encontraron datos - mostrar modal
                setMensajeExitoso(true);
            }
        } catch (error) {
            // Error al obtener datos - mostrar modal
            setMensajeExitoso(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Si se modifica la cédula y tiene menos de 10 dígitos, ocultar campos y limpiar datos
        if (name === 'cedula') {
            if (value.length < 10) {
                setDatosPersonalesVisible(false);
                // Limpiar datos personales
                setFormData(prev => ({
                    ...prev,
                    apellidoPaterno: '',
                    apellidoMaterno: '',
                    primerNombre: '',
                    segundoNombre: '',
                    fechaNacimiento: '',
                    edad: '',
                    situacionLaboral: '',
                    celular: '',
                    email: '',
                    actividadEconomica: '',
                    estabilidadLaboral: '',
                    tiempoVivienda: '',
                    producto: '',
                    terminosCondiciones: false,
                    politicasPrivacidad: false
                }));
            }
        }

        // Si cambia la situación laboral, cargar actividades económicas
        if (name === 'situacionLaboral' && value) {
            fetchActEconomina(value);
            setFormData(prev => ({
                ...prev,
                actividadEconomica: '' // Limpiar actividad económica al cambiar situación
            }));
        }
    };

    const validateForm = async () => {
        const newErrors = {};

        if (!formData.bodega) newErrors.bodega = 'Selecciona por favor una bodega';
        if (!formData.tipoConsulta) newErrors.tipoConsulta = 'Debes seleccionar un Tipo de Consulta.';

        // Validar cédula
        if (!formData.cedula) {
            newErrors.cedula = 'Ingresa 10 dígitos de la cédula';
        } else if (formData.cedula.length !== 10) {
            newErrors.cedula = 'Ingresa 10 dígitos de la cédula';
        } else if (!/^\d{10}$/.test(formData.cedula)) {
            newErrors.cedula = 'Debe ser un número de 10 dígitos';
        } else {
            // Validar si está en lista negra
            const resCedula = await comprobcedula(formData.cedula);
            if (resCedula === 1) {
                newErrors.cedula = `La cédula ${formData.cedula} se encuentra en la lista negra`;
            }
        }

        // Validar apellido paterno
        if (!formData.apellidoPaterno) {
            newErrors.apellidoPaterno = 'Revisa el apellido debe tener al menos 2 caracteres';
        } else if (formData.apellidoPaterno.trim().length < 2) {
            newErrors.apellidoPaterno = 'Revisa el apellido debe tener al menos 2 caracteres';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.apellidoPaterno)) {
            newErrors.apellidoPaterno = 'Solo se permiten letras y espacios';
        }

        // Validar apellido materno (opcional pero si se llena debe ser válido)
        if (formData.apellidoMaterno && formData.apellidoMaterno.trim().length > 0) {
            if (formData.apellidoMaterno.trim().length < 2) {
                newErrors.apellidoMaterno = 'Debe tener al menos 2 caracteres o dejar en blanco';
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.apellidoMaterno)) {
                newErrors.apellidoMaterno = 'Solo se permiten letras y espacios';
            }
        }

        // Validar primer nombre
        if (!formData.primerNombre) {
            newErrors.primerNombre = 'Revisa el nombre debe tener al menos 2 caracteres';
        } else if (formData.primerNombre.trim().length < 2) {
            newErrors.primerNombre = 'Revisa el nombre debe tener al menos 2 caracteres';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.primerNombre)) {
            newErrors.primerNombre = 'Solo se permiten letras y espacios';
        }

        // Validar segundo nombre (opcional pero si se llena debe ser válido)
        if (formData.segundoNombre && formData.segundoNombre.trim().length > 0) {
            if (formData.segundoNombre.trim().length < 2) {
                newErrors.segundoNombre = 'Debe tener al menos 2 caracteres o dejar en blanco';
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.segundoNombre)) {
                newErrors.segundoNombre = 'Solo se permiten letras y espacios';
            }
        }

        // Validar celular
        if (!formData.celular) {
            newErrors.celular = 'El celular debe tener 10 dígitos';
        } else if (formData.celular.length !== 10 || !/^\d{10}$/.test(formData.celular)) {
            newErrors.celular = 'Debe ser un número de 10 dígitos';
        } else {
            // Validar si está en lista negra
            const resTelf = await comprobTelf(formData.celular);
            if (resTelf === 1) {
                newErrors.celular = `El teléfono ${formData.celular} se encuentra en la lista negra`;
            }
        }

        // Validar email (opcional pero si se llena debe ser válido)
        if (formData.email && formData.email.trim().length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Correo inválido';
            } else {
                // Validar si está en lista negra
                const resEmail = await comprobEmail(formData.email);
                if (resEmail === 1) {
                    newErrors.email = `El email ${formData.email} se encuentra en la lista negra`;
                }
            }
        }

        if (!formData.situacionLaboral) newErrors.situacionLaboral = 'Selecciona por favor la situación laboral';
        if (!formData.actividadEconomica) newErrors.actividadEconomica = 'Selecciona por favor la actividad económica';
        if (!formData.estabilidadLaboral) newErrors.estabilidadLaboral = 'Debes seleccionar una opción en Estabilidad Laboral.';
        if (!formData.tiempoVivienda) newErrors.tiempoVivienda = 'Debes seleccionar una opción en Tiempo de Vivienda.';
        if (!formData.producto) newErrors.producto = 'Por favor selecciona un producto';

        if (!formData.terminosCondiciones) newErrors.terminosCondiciones = 'Debes aceptar los términos y condiciones.';
        if (!formData.politicasPrivacidad) newErrors.politicasPrivacidad = 'Debes aceptar las políticas.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        const isValid = await validateForm();
        setLoading(false);

        if (!isValid) {

            enqueueSnackbar("Por favor corrige los errores en el formulario", { variant: "error" });
            return;
        }

        // Generar UUID único para idempotencia
        const idempotencyKey = uuidv4();

        try {
            // 1. Conectar WebSocket y esperar a que esté realmente conectado
            let socket = getSocket();

            // ✅ SOLUCIÓN: Esperar explícitamente a que el socket esté conectado
            if (!socket || !socket.connected) {
                const token = localStorage.getItem('token');
     

                // Mostrar indicador de conexión
                setSocketConnecting(true);

                try {
                    // Ahora connectToServer retorna una Promise que se resuelve cuando está conectado
                    socket = await connectToServer(token);

                    // Verificar que realmente se conectó
                    if (!socket.connected) {
                        throw new Error('No se pudo establecer conexión WebSocket');
                    }
                    
                } finally {
                    // Ocultar indicador de conexión
                    setSocketConnecting(false);
                }
            }

            // 2. Configurar listeners de WebSocket (ahora socket está garantizado conectado)
            socket.off('solicitud-progreso'); // Limpiar listeners previos
            socket.off('solicitud-web-completada');
            socket.off('solicitud-web-error');

            socket.on('solicitud-progreso', (data) => {

                if (data.idSolicitud === idSolicitudCreada || !idSolicitudCreada) {
                    setProgreso(data.progreso || 0);
                    setFase(data.fase || 'PROCESANDO');
                    setMensajeProgreso(data.mensaje || '');
                }
            });

            socket.on('solicitud-web-completada', (data) => {

                if (data.idSolicitud === idSolicitudCreada || !idSolicitudCreada) {
                    // Cancelar timeout si existe
                    if (window.solicitudTimeoutId) {
                        clearTimeout(window.solicitudTimeoutId);
                        window.solicitudTimeoutId = null;
                    }

                    setEstadoProceso('COMPLETADA');
                    setProgreso(100);
                    setFase('COMPLETADO');
                    setResultadoSolicitud(data);
                    setDatosSolicitudFinal(data);
                    
                    // Establecer datos para los modales
                    setSoliGrande(data.soliGrande || data);
                    setCreSoliWeb(data.creSoliWeb || data);

                    // Cerrar modal de progreso después de 1 segundo
                    setTimeout(() => {
                        setModalProgreso(false);

                        // Verificar si fue aprobada o rechazada
                        const esAprobada = data.estado === 'APROBADA' ||
                            data.estado === 1 ||
                            data.estadoSolicitud === 'APROBADA' ||
                            data.aprobado === true;

                        if (esAprobada) {
                            // Mostrar modal de aprobación
                            setModalAprobado(true);
                        } else {
                            // Mostrar modal de rechazo
                            setModalRechazado(true);
                        }
                    }, 1000);
                }
            });

            socket.on('solicitud-web-error', (data) => {
                console.error('❌ Error en solicitud:', data);
                if (data.idSolicitud === idSolicitudCreada || !idSolicitudCreada) {
                    setEstadoProceso('ERROR');
                    setMensajeProgreso(data.error || 'Error al procesar la solicitud');

                    setTimeout(() => {
                        setModalProgreso(false);
                        enqueueSnackbar(data.error || "Error al procesar la solicitud", { variant: "error" });
                    }, 3000);
                }
            });

            // Agregar listener genérico para ver todos los eventos
            socket.onAny((eventName, ...args) => {
                console.log('🔔 Evento WebSocket recibido:');
            });

            // 3. Preparar datos para enviar (formato compatible con backend)
            const IdVendedor = userUsuario?.idPersonal || userData?.idPersonal;
            const situacion = Number(formData.situacionLaboral);

            // Determinar bAfiliado y bTieneRuc según situación laboral
            let bAfiliado = false;
            let bTieneRuc = false;

            if (situacion === 1) {
                bAfiliado = true;
                bTieneRuc = false;
            } else if (situacion === 2) {
                bAfiliado = false;
                bTieneRuc = false;
            } else if (situacion === 5) {
                bAfiliado = false;
                bTieneRuc = true;
            }

            const solicitudData = {
                idempotencyKey, // UUID para idempotencia
                Foto: 'prueba', // Valor temporal mientras se maneja la carga
                Bodega: Number(formData.bodega),
                idVendedor: IdVendedor,
                idCompraEncuesta: Number(formData.tipoConsulta),
                Cedula: formData.cedula,
                ApellidoPaterno: formData.apellidoPaterno?.trim().toUpperCase(),
                ApellidoMaterno: formData.apellidoMaterno?.trim().toUpperCase() || '',
                PrimerNombre: formData.primerNombre?.trim().toUpperCase(),
                SegundoNombre: formData.segundoNombre?.trim().toUpperCase() || '',
                idSituacionLaboral: situacion,
                Celular: formData.celular,
                Email: formData.email || '',
                idActEconomina: Number(formData.actividadEconomica),
                idCre_Tiempo: Number(formData.estabilidadLaboral),
                idCre_TiempoVivienda: Number(formData.tiempoVivienda),
                idProductos: Number(formData.producto),
                bAfiliado,
                bTieneRuc,
                bTerminosYCondiciones: formData.terminosCondiciones,
                bPoliticas: formData.politicasPrivacidad,
                idEstadoVerificacionDocumental: 1,
                Usuario: userData?.Nombre || userUsuario
            };

            // Eliminar campos que no debe tener el DTO según backend
            delete solicitudData.FechaNacimiento;
            delete solicitudData.Edad;
            delete solicitudData.TerminosCondiciones;
            delete solicitudData.PoliticasPrivacidad;
            delete solicitudData.idUsuario;

            // 4. Mostrar modal de progreso
            setModalProgreso(true);
            setProgreso(5);
            setFase('INICIADO');
            setMensajeProgreso('Iniciando proceso de solicitud...');
            setEstadoProceso('PROCESANDO');

            // 5. Enviar solicitud al endpoint


            const response = await axios.post(
                APIURL.post_cre_solicitud_web_V2(),
                solicitudData,
                {
                    headers: {
                        method: "POST",
                        cache: "no-store"
                    }
                }
            );


            // Verificar si la respuesta es exitosa
            if (response.data && response.data.success !== false) {
                // El backend puede devolver diferentes estructuras de respuesta
                const idSolicitud = response.data.data?.idSolicitud ||
                    response.data.idSolicitud ||
                    response.data.data?.id ||
                    response.data.id;

                if (idSolicitud) {
                    setIdSolicitudCreada(idSolicitud);
                    enqueueSnackbar(`Solicitud #${idSolicitud} iniciada. Procesando...`, { variant: "info" });

                    // FALLBACK: Si después de 60 segundos no hay respuesta del WebSocket, cerrar modal
                    const timeoutId = setTimeout(() => {
                        console.warn('⏰ Timeout: No se recibieron eventos WebSocket en 60s');
                        setModalProgreso(false);
                        enqueueSnackbar(`Solicitud #${idSolicitud} creada. El proceso puede continuar en segundo plano.`, { variant: "warning" });

                        // Avanzar al siguiente paso de todas formas
                        if (setCurrentStep) {
                            setCurrentStep(2);
                        }
                    }, 60000); // 60 segundos

                    // Guardar timeout ID para poder cancelarlo si llega la respuesta
                    window.solicitudTimeoutId = timeoutId;
                } else {
                    console.warn('⚠️ Respuesta exitosa pero sin ID de solicitud:', response.data);
                    setModalProgreso(false);
                    enqueueSnackbar('Solicitud enviada pero no se obtuvo ID de seguimiento', { variant: "warning" });
                }

                // El progreso se actualizará automáticamente vía WebSocket
            } else {
                // Error en la respuesta
                console.error('❌ Error en respuesta:', response.data);
                setModalProgreso(false);
                enqueueSnackbar(response.data.mensaje || response.data.message || "Error al iniciar la solicitud", { variant: "error" });
            }

        } catch (error) {
            console.error('❌ Error al enviar solicitud:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            setModalProgreso(false);
            setEstadoProceso('ERROR');

            const errorMsg = error.response?.data?.mensaje || error.message || "Error al procesar la solicitud";
            enqueueSnackbar(errorMsg, { variant: "error" });
        }
    };


    const handleCancel = () => {
        setFormData({
            bodega: '',
            tipoConsulta: '',
            cedula: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            primerNombre: '',
            segundoNombre: '',
            fechaNacimiento: '',
            edad: '',
            situacionLaboral: '',
            celular: '',
            email: '',
            actividadEconomica: '',
            estabilidadLaboral: '',
            tiempoVivienda: '',
            producto: '',
            terminosCondiciones: false,
            politicasPrivacidad: false
        });
        setErrors({});
        setDatosPersonalesVisible(false); // Ocultar campos personales
    };

    return (
        <div className="w-full relative">

            {socketConnecting && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 flex flex-col items-center space-y-4">
                        <div className="relative">
                            <CircularProgress size={60} thickness={4} className="text-blue-600" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                Estableciendo conexión segura
                            </h3>
                            <p className="text-sm text-slate-500">
                                Por favor espere mientras conectamos con el servidor...
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Conectando WebSocket...</span>
                        </div>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fila 1: Bodega y Tipo de Consulta */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bodega */}
                    <div className="flex flex-col">
                        <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                            <StoreIcon className="mr-2 text-blue-600" fontSize="small" />
                            Bodega
                        </label>
                        <select
                            name="bodega"
                            value={formData.bodega}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.bodega
                                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                    : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                } focus:outline-none focus:ring-2 transition-all duration-200`}
                        >
                            <option value="">Selecciona una opción</option>
                            {dataBodega.map((item) => (
                                <option key={item.b_Bodega} value={item.b_Bodega}>
                                    {item.b_Nombre}
                                </option>
                            ))}
                        </select>
                        {errors.bodega && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{errors.bodega}</p>
                        )}
                    </div>

                    {/* Tipo de Consulta */}
                    <div className="flex flex-col">
                        <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                            <AssignmentIcon className="mr-2 text-blue-600" fontSize="small" />
                            Tipo de Consulta
                        </label>
                        <select
                            name="tipoConsulta"
                            value={formData.tipoConsulta}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.tipoConsulta
                                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                    : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                } focus:outline-none focus:ring-2 transition-all duration-200`}
                        >
                            <option value="">Selecciona una opción</option>
                            {tipoConsulta.map((item) => (
                                <option key={item.idCompraEncuesta} value={item.idCompraEncuesta}>
                                    {item.Descripcion}
                                </option>
                            ))}
                        </select>
                        {errors.tipoConsulta && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{errors.tipoConsulta}</p>
                        )}
                    </div>
                </div>

                {/* Fila 2: Cédula y Apellido Paterno */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cédula con botón de validar */}
                    <div className="flex flex-col">
                        <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                            <BadgeIcon className="mr-2 text-blue-600" fontSize="small" />
                            Cédula
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                onBlur={handleCedulaBlur}
                                maxLength="10"
                                placeholder="Ingresa 10 dígitos"
                                disabled={loading}
                                className={`flex-1 px-4 py-2.5 rounded-lg border ${errors.cedula
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={handleValidarCedula}
                                disabled={loading || formData.cedula.length !== 10}
                                className={`px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 ${(loading || formData.cedula.length !== 10) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} sx={{ color: 'white' }} />
                                        <span className="hidden sm:inline">Validando...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                                        <span className="hidden sm:inline">Validar</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {loading && (
                            <p className="mt-1 text-xs text-blue-600 font-medium flex items-center">
                                <CircularProgress size={16} sx={{ color: '#2563eb', marginRight: '8px' }} />
                                Consultando datos...
                            </p>
                        )}
                        {errors.cedula && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{errors.cedula}</p>
                        )}
                    </div>

                    {/* Apellido Paterno */}
                    {datosPersonalesVisible && (
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <PersonIcon className="mr-2 text-blue-600" fontSize="small" />
                                Apellido Paterno
                            </label>
                            <input
                                type="text"
                                name="apellidoPaterno"
                                value={formData.apellidoPaterno}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.apellidoPaterno
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                            {errors.apellidoPaterno && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.apellidoPaterno}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Fila 3: Apellido Materno, Primer Nombre, Segundo Nombre, Fecha Nacimiento */}
                {datosPersonalesVisible && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Apellido Materno */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <PersonIcon className="mr-2 text-blue-600" fontSize="small" />
                                Apellido Materno
                            </label>
                            <input
                                type="text"
                                name="apellidoMaterno"
                                value={formData.apellidoMaterno}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Primer Nombre */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <PersonIcon className="mr-2 text-blue-600" fontSize="small" />
                                Primer Nombre
                            </label>
                            <input
                                type="text"
                                name="primerNombre"
                                value={formData.primerNombre}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.primerNombre
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                            {errors.primerNombre && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.primerNombre}</p>
                            )}
                        </div>

                        {/* Segundo Nombre */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <PersonIcon className="mr-2 text-blue-600" fontSize="small" />
                                Segundo Nombre
                            </label>
                            <input
                                type="text"
                                name="segundoNombre"
                                value={formData.segundoNombre}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Fecha Nacimiento */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <CakeIcon className="mr-2 text-blue-600" fontSize="small" />
                                Fecha Nacimiento
                            </label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                disabled
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-gray-100 cursor-not-allowed focus:outline-none transition-all duration-200"
                            />
                        </div>
                    </div>
                )}

                {/* Fila 4: Edad, Situación Laboral, Celular, Email */}
                {datosPersonalesVisible && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Edad */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <CakeIcon className="mr-2 text-blue-600" fontSize="small" />
                                Edad
                            </label>
                            <input
                                type="number"
                                name="edad"
                                value={formData.edad}
                                onChange={handleChange}
                                disabled
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-gray-100 cursor-not-allowed focus:outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Situación Laboral */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <WorkIcon className="mr-2 text-blue-600" fontSize="small" />
                                Situación Laboral
                            </label>
                            <select
                                name="situacionLaboral"
                                value={formData.situacionLaboral}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.situacionLaboral
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                            >
                                <option value="">Selecciona una opción</option>
                                {actividadLaboral.map((item) => (
                                    <option key={item.idSituacionLaboral} value={item.idSituacionLaboral}>
                                        {item.Descripcion}
                                    </option>
                                ))}
                            </select>
                            {errors.situacionLaboral && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.situacionLaboral}</p>
                            )}
                        </div>

                        {/* Celular */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <PhoneIcon className="mr-2 text-blue-600" fontSize="small" />
                                Celular
                            </label>
                            <input
                                type="text"
                                name="celular"
                                value={formData.celular}
                                onChange={handleChange}
                                maxLength="10"
                                placeholder="El celular debe tener 10 dígitos"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.celular
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                            {errors.celular && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.celular}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <EmailIcon className="mr-2 text-blue-600" fontSize="small" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                            />
                        </div>
                    </div>
                )}

                {/* Fila 5: Actividad Económica, Estabilidad Laboral, Tiempo de Vivienda, Producto */}
                {datosPersonalesVisible && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Actividad Económica */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <BusinessCenterIcon className="mr-2 text-blue-600" fontSize="small" />
                                Actividad Económica
                            </label>
                            <select
                                name="actividadEconomica"
                                value={formData.actividadEconomica}
                                onChange={handleChange}
                                disabled={!formData.situacionLaboral}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.actividadEconomica
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200 ${!formData.situacionLaboral ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Selecciona una opción</option>
                                {ActEconomina.map((item) => (
                                    <option key={item.idActEconomica} value={item.idActEconomica}>
                                        {item.Nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.actividadEconomica && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.actividadEconomica}</p>
                            )}
                        </div>

                        {/* Estabilidad Laboral */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <WorkIcon className="mr-2 text-blue-600" fontSize="small" />
                                Estabilidad Laboral
                            </label>
                            <select
                                name="estabilidadLaboral"
                                value={formData.estabilidadLaboral}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.estabilidadLaboral
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                            >
                                <option value="">Selecciona una opción</option>
                                {estabilidadLaboral.map((item) => (
                                    <option key={item.idCre_Tiempo} value={item.idCre_Tiempo}>
                                        {item.Descripcion}
                                    </option>
                                ))}
                            </select>
                            {errors.estabilidadLaboral && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.estabilidadLaboral}</p>
                            )}
                        </div>

                        {/* Tiempo de Vivienda */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <HomeIcon className="mr-2 text-blue-600" fontSize="small" />
                                Tiempo de Vivienda
                            </label>
                            <select
                                name="tiempoVivienda"
                                value={formData.tiempoVivienda}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.tiempoVivienda
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                            >
                                <option value="">Selecciona una opción</option>
                                {tiempoVivienda.map((item) => (
                                    <option key={item.idCre_Tiempo} value={item.idCre_Tiempo}>
                                        {item.Descripcion}
                                    </option>
                                ))}
                            </select>
                            {errors.tiempoVivienda && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.tiempoVivienda}</p>
                            )}
                        </div>

                        {/* Producto */}
                        <div className="flex flex-col">
                            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                <ShoppingCartIcon className="mr-2 text-blue-600" fontSize="small" />
                                Producto
                            </label>
                            <select
                                name="producto"
                                value={formData.producto}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.producto
                                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                        : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-200'
                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                            >
                                <option value="">Selecciona una opción</option>
                                {productos.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.producto && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.producto}</p>
                            )}
                        </div>
                    </div>
                )}
                {datosPersonalesVisible && (
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                        {/* Términos y Condiciones */}
                        <div className="flex items-start">
                            <div className="flex items-center h-6">
                                <input
                                    type="checkbox"
                                    name="terminosCondiciones"
                                    checked={formData.terminosCondiciones}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                            <label className="ml-3 text-sm text-slate-700">
                                Acepto los{' '}
                                <a href="https://point.com.ec/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                                    términos y condiciones
                                </a>
                                .
                            </label>
                        </div>
                        {errors.terminosCondiciones && (
                            <p className="text-xs text-red-600 font-medium ml-8">{errors.terminosCondiciones}</p>
                        )}

                        {/* Políticas de Privacidad */}
                        <div className="flex items-start">
                            <div className="flex items-center h-6">
                                <input
                                    type="checkbox"
                                    name="politicasPrivacidad"
                                    checked={formData.politicasPrivacidad}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                            <label className="ml-3 text-sm text-slate-700">
                                Acepto las{' '}
                                <a href="https://point.com.ec/politicas-de-privacidad" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                                    políticas de privacidad
                                </a>
                                .
                            </label>
                        </div>
                        {errors.politicasPrivacidad && (
                            <p className="text-xs text-red-600 font-medium ml-8">{errors.politicasPrivacidad}</p>
                        )}
                    </div>
                )}

                {/* Botones de Acción */}
                {datosPersonalesVisible && (
                    <div className="flex justify-center gap-4 pt-6 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} sx={{ color: 'white' }} />
                                    <span>Validando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Enviar</span>
                                    <SendIcon sx={{ fontSize: 20 }} />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className={`px-8 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <span>Cancelar</span>
                            <CancelIcon sx={{ fontSize: 20 }} />
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            className={`px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <span>Regresar</span>
                            <ArrowBackIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                )}
            </form>

            {/* Modal de Error para Cédula no Encontrada */}
            <SolicitudExitosa
                isOpen={mensajeExitoso}
                onClose={() => setMensajeExitoso(false)}
                titulo="¡NO SE ENCONTRARON DATOS PARA ESTA CÉDULA!"
                subtitulo="Por favor revisa que se hayan ingresado correctamente los datos."
                li1="Si el problema continúa comunícate con crédito."
                color="bg-red-100"
                ruta="/solicitud"
                icono="triste"
            />

            {/* Modal de Solicitud Activa */}
            <SolicitudExitosa
                isOpen={solicitudActiva}
                onClose={() => setSolicitudActiva(false)}
                titulo="¡TIENES UNA SOLICITUD DE CRÉDITO ACTIVA!"
                subtitulo="Por favor completa la solicitud de crédito que el cliente ya tiene activa."
                li1={`Cliente ${soliExistente?.PrimerNombre || ''} ${soliExistente?.ApellidoPaterno || ''} con cédula ${soliExistente?.Cedula || ''}`}
                li2={`Número de solicitud: ${soliExistente?.NumeroSolicitud || ''}`}
                color="bg-red-100"
                ruta="/solicitud"
            />

            {/* Modal de Progreso Asíncrono */}
            <ModalProgreso
                isOpen={modalProgreso}
                progreso={progreso}
                fase={fase}
                mensaje={mensajeProgreso}
                estado={estadoProceso}
            />

            {/* Modal de Solicitud Aprobada */}
            <SolicitudExitosa
                isOpen={modalAprobado}
                onClose={() => {
                    setModalAprobado(false);
                }}
                soliGrande={soliGrande}
                creSoliWeb={creSoliWeb}
                titulo={`¡TU SOLICITUD DE CRÉDITO HA SIDO CREADA CON ÉXITO!`}
                subtitulo={`Ahora puedes revisar el estado de tu solicitud de crédito.`}
                color="bg-green-100"
                li1={`Cliente ${creSoliWeb?.PrimerNombre || formData.primerNombre} ${creSoliWeb?.ApellidoPaterno || formData.apellidoPaterno} con cedula ${creSoliWeb?.Cedula || formData.cedula}`}
                li2={`Numero de solicitud: ${soliGrande?.data?.NumeroSolicitud || datosSolicitudFinal?.numeroSolicitud || ''}`}
                li3={`Cuota: ${soliGrande?.data?.CuotaAsignada || ''} y Cupo: ${soliGrande?.data?.Cupo || ''}`}
                ruta={'/ListadoSolicitud'}
            />

            {/* Modal de Solicitud Rechazada */}
            <SolicitudExitosa
                isOpen={modalRechazado}
                onClose={() => setModalRechazado(false)}
                soliGrande={soliGrande}
                creSoliWeb={creSoliWeb}
                titulo={`¡TU SOLICITUD DE CRÉDITO HA SIDO CREADA CON ÉXITO!`}
                subtitulo={`Ahora puedes revisar el estado de tu solicitud de crédito.`}
                color="bg-gray-100"
                li1="Recuerda que la compra de tu CELULAR lo aprueba PayJoy"
                li2={
                    (<button
                        onClick={() => window.open("https://app.payjoy.com/merchant3/merchant-login", "_blank")}
                        className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
                    >
                        <span>Consultar</span>
                        <img
                            src={payjoy}
                            alt="IconoPayJoy"
                            className="w-9 h-9 object-contain"
                        />
                    </button>
                    )}
                li3=""
                ruta={'/ListadoSolicitud'}
            />
        </div>
    );
};

