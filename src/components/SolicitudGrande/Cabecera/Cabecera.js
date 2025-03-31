import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Import axios

import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import DatosCliente from "../DatosCliente/DatosCliente";
import DatosConyuge from "../DatosConyuge/DatosConyuge";
import SeccionB from "../../SolicitudGrande/SeccionB/SeccionB";
import SeccionA from "../../SolicitudGrande/SeccionA/SeccionA";
import { FactoresCredito } from "../FactoresCredito";
import { useSnackbar } from 'notistack';
import { Verificacion } from "../Verificacion/Verificacion";
import InformacionCredito from "../InformacionCredito/InformacionCredito";
import { APIURL } from "../../../configApi/apiConfig";
import { CabeceraDatosSolicitud } from "../CabeceraDatosSolicitud";
import { Loader } from "../../Utils"; // Make sure to import the Loader component
import Datos from "../DatosCliente/Datos/Datos";
import Domicilio from "../DatosCliente/Domicilio/Domicilio";
import Referencias from "../Referencia/Referencia";
import { ModalConfirm } from "../ModalConfirm";
import { useAuth } from "../../AuthContext/AuthContext";
export function Cabecera() {
  const { userData, userUsuario } = useAuth();
  const { state } = useLocation();
  const { data } = state || {};
  console.log("data cabecera", data);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
 
  const [activeTab, setActiveTab] = useState("Datos Cliente");
  const [fecha, setFecha] = useState(data?.fecha ? new Date(data.fecha).toISOString().split('T')[0] : "");
  const [cedula, setCedula] = useState(data?.cedula || "");
  const [local, setLocal] = useState(data?.almacen || "");
  const [apellidoPaterno, setApellidoPaterno] = useState(data?.ApellidoPaterno || "");
  const [segundoApellido, setSegundoApellido] = useState(data?.ApellidoMaterno || "");
  const [primerNombre, setPrimerNombre] = useState(data?.PrimerNombre || "");
  const [segundoNombre, setSegundoNombre] = useState(data?.SegundoNombre || "");
  const [email, setEmail] = useState(data?.email || "");
  const [celular, setCelular] = useState(data?.celular || "");
  const [estado, setEstado] = useState(data?.estado || "");
  const [bGarante, setBGarante] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState(data?.id || "");
  const [numeroSolicitud, setNumeroSolicitud] = useState(data?.NumeroSolicitud || "");
  const [clienteData, setClienteData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [checkDatos, setCheckDatos] = useState(false); // Loading state
  const [checkDomicilio, setCheckDomicilio] = useState(false); // Loading state
  const [checkConyuge, setCheckConyuge] = useState(false); // Loading state
  const [checkReferencias, setCheckReferencias] = useState(false); // Loading state
  const [checkTrabajo, setCheckTrabajo] = useState(false); // Loading state
  const [checkNegocio, setCheckNegocio] = useState(false); // Loading state
  const [checkInformacionCredito, setCheckInformacionCredito] = useState(true); // Loading state
  const [checkCompeletado, setCheckCompletado] = useState(false); // Loading state
  const [checkFactoresCredito, setCheckFactoresCredito] = useState(false); // Loading state
  const { enqueueSnackbar } = useSnackbar();
  const seccionRef = useRef(null); // Crear la referencia para las secciones
  const datosRef = useRef(); // Referencia al componente Datos
  const datosDomicilioRef = useRef(); // Referencia para el componente Domicilio
  const datosConyuge = useRef(); // Referencia para el componente DatosConyuge
  const datosReferencias = useRef(); // Referencia para el componente Referencias
  const datosTrabajo = useRef(); // Referencia para el componente Trabajo
  const datosNegocio = useRef(); // Referencia para el componente Negocio
  const datosInformacionCredito = useRef(); // Referencia para el componente InformacionCredito
  console.log("idSolicitud", clienteData);
  const ref = useRef(); // Create ref for imperative handle

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar los datos del cliente
        const datosCliente = await fetchDatosCliente();
        if (datosCliente) {
          // Asignamos los datos al estado
          setClienteData(datosCliente);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();

  }, [idSolicitud, numeroSolicitud, activeTab]);

  useEffect(() => {
    if (clienteData && clienteData.idCre_SolicitudWeb) {
      console.log("clienteData ID Cre Solicitud Web:", clienteData.idCre_SolicitudWeb);
      SearchData(clienteData.idCre_SolicitudWeb);
    } else {
      console.log("El ID Cre Solicitud Web no está disponible aún");
    }
  }, [clienteData]);  // Dependencia de clienteData
  // Monitorear cambios en clienteData y ejecutar la validación
  useEffect(() => {
    if (clienteData) {
      // Realizar las validaciones necesarias
      validarcaposdata();
      validarcaposdataDomicilio();

      // Verificar si el estado civil es 1, si es así, validar los datos del cónyuge
      if (clienteData.idEdoCivil === 1) {
        validarcaposdataConyuge();
      }

      // Verificar si la situación laboral es 1, si es así, validar los datos del trabajo
      if (clienteData.idSituacionLaboral === 1) {
        validarcaposdataTrabajo();
      }

      // Si la situación laboral no es 1, validar los datos del negocio
      if (clienteData.idSituacionLaboral !== 1) {
        validarcaposdataNegocio();
      }
    }

    // Verificar si todas las validaciones se completaron
    if (
      checkDatos &&
      checkDomicilio &&
      (clienteData.idEdoCivil !== 1 || checkConyuge) &&  // Verificar que el conyuge se validó solo si corresponde
      checkReferencias &&
      (clienteData.idSituacionLaboral !== 1 || checkTrabajo) &&  // Verificar que el trabajo se validó solo si corresponde
      (clienteData.idSituacionLaboral === 1 || checkNegocio)  // Verificar que el negocio se validó solo si corresponde
    ) {
      setCheckCompletado(true);  // Todo se completó correctamente
    }
  }, [clienteData, checkDatos, checkDomicilio, checkConyuge, checkReferencias, checkTrabajo, checkNegocio]);


  const SearchData = async (id) => {
    try {
      console.log("Buscando con el ID:", id);
      const url = APIURL.get_cre_referenciasclientesweb_id_all(id);
      const response = await axios.get(url);
      console.log("Response data refrencias:", response.data); // Log the response data
      if (response.data && response.data > 1) {
        setCheckReferencias(true);
      } else {
        setCheckReferencias(false);
      }
    } catch (error) {
      console.error("Error al buscar los datos:", error);
    }
  };

  // Aquí validamos los datos después de que se hayan cargado
  const validarcaposdata = () => {
    // Inicializamos checkDatos como verdadero
    let valid = true;

    // Verificamos que el valor de idNacionalidad sea 54 antes de continuar con la validación
    if (clienteData.idNacionalidad === 54) {
      // Validaciones específicas cuando idNacionalidad es 54
      if (
        !clienteData.idProvinciaNacimiento || // Verificamos si idProvinciaNacimiento está vacío
        clienteData.idProvinciaNacimiento === 0 ||
        clienteData.idProvinciaNacimiento == null
      ) {
        valid = false;
      }

      if (
        !clienteData.idCantonNacimiento || // Verificamos si idCantonNacimiento está vacío
        clienteData.idCantonNacimiento === 0 ||
        clienteData.idCantonNacimiento == null
      ) {
        valid = false;
      }
    }

    // Si idNacionalidad no es 54, no validamos los campos idProvinciaNacimiento e idCantonNacimiento
    // Si fuera necesario, aquí podrías agregar alguna validación alternativa para otros valores de idNacionalidad

    // Validaciones para otros campos
    if (
      clienteData.idNivelEducacion === 0 ||
      clienteData.idNivelEducacion == null ||
      clienteData.idNivelEducacion === undefined
    ) {
      valid = false;
    }

    if (
      clienteData.idProfesion === 0 ||
      clienteData.idProfesion == null ||
      clienteData.idProfesion === undefined
    ) {
      valid = false;
    }

    if (
      clienteData.idSituacionLaboral === 0 ||
      clienteData.idSituacionLaboral == null ||
      clienteData.idSituacionLaboral === undefined
    ) {
      valid = false;
    }

    if (
      clienteData.idActEconomica === 0 ||
      clienteData.idActEconomica == null ||
      clienteData.idActEconomica === undefined
    ) {
      valid = false;
    }

    if (
      clienteData.idGenero === 0 ||
      clienteData.idGenero == null ||
      clienteData.idGenero === undefined
    ) {
      valid = false;
    }

    if (
      clienteData.idEdoCivil === 0 ||
      clienteData.idEdoCivil == null ||
      clienteData.idEdoCivil === undefined
    ) {
      valid = false;
    }

    if (
      clienteData.FechaNacimiento === 0 ||
      clienteData.FechaNacimiento == null ||
      clienteData.FechaNacimiento === undefined
    ) {
      valid = false;
    }

    if (
      clienteData.ObservacionesActividadEconomica === 0 ||
      clienteData.ObservacionesActividadEconomica == null ||
      clienteData.ObservacionesActividadEconomica === undefined
    ) {
      valid = false;
    }

    // Finalmente, actualizamos el estado de checkDatos con el resultado de la validación
    setCheckDatos(valid);
  };


  const validarcaposdataDomicilio = () => {
    let valid = true;

    // Obtener los datos de cliente
    const isValidaData = {
      idProvinciaDomicilio: clienteData.idProvinciaDomicilio,
      idCantonDomicilio: clienteData.idCantonDomicilio,
      idParroquiaDomicilio: clienteData.idParroquiaDomicilio,
      idBarrioDomicilio: clienteData.idBarrioDomicilio,
      CallePrincipal: clienteData.CallePrincipal,
      NumeroCasa: clienteData.NumeroCasa,
      CalleSecundaria: clienteData.CalleSecundaria,
      ReferenciaUbicacion: clienteData.ReferenciaUbicacion,
      TelefonoDomicilio: clienteData.TelefonoDomicilio,
      TelefonoDomiliarDos: clienteData.TelefonoDomiliarDos,
      Celular: clienteData.Celular,
      idTipoVivienda: clienteData.idTipoVivienda,
      idCre_Tiempo: clienteData.idCre_Tiempo,
      NombreArrendador: clienteData.NombreArrendador,
      TelefonoArrendador: clienteData.TelefonoArrendador,
      CelularArrendador: clienteData.CelularArrendador,
      idInmueble: clienteData.idInmueble,
      idCantonInmueble: clienteData.idCantonInmueble,
      ValorInmmueble: clienteData.ValorInmmueble,
    };

    // Validaciones comunes para todos los casos
    if (
      isValidaData.idProvinciaDomicilio == 0 || isValidaData.idProvinciaDomicilio == null || isValidaData.idProvinciaDomicilio == undefined ||
      isValidaData.idCantonDomicilio == 0 || isValidaData.idCantonDomicilio == null || isValidaData.idCantonDomicilio == undefined ||
      isValidaData.idParroquiaDomicilio == 0 || isValidaData.idParroquiaDomicilio == null || isValidaData.idParroquiaDomicilio == undefined ||
      isValidaData.idBarrioDomicilio == 0 || isValidaData.idBarrioDomicilio == null || isValidaData.idBarrioDomicilio == undefined ||
      isValidaData.CallePrincipal == 0 || isValidaData.CallePrincipal == null || isValidaData.CallePrincipal == undefined ||
      isValidaData.NumeroCasa == 0 || isValidaData.NumeroCasa == null || isValidaData.NumeroCasa == undefined ||
      isValidaData.CalleSecundaria == 0 || isValidaData.CalleSecundaria == null || isValidaData.CalleSecundaria == undefined ||
      isValidaData.ReferenciaUbicacion == 0 || isValidaData.ReferenciaUbicacion == null || isValidaData.ReferenciaUbicacion == undefined ||
      (isValidaData.TelefonoDomicilio == 0 || isValidaData.TelefonoDomicilio == null || isValidaData.TelefonoDomicilio == undefined) &&
      (isValidaData.TelefonoDomiliarDos == 0 || isValidaData.TelefonoDomiliarDos == null || isValidaData.TelefonoDomiliarDos == undefined) &&
      (isValidaData.Celular == 0 || isValidaData.Celular == null || isValidaData.Celular == undefined) ||
      isValidaData.idTipoVivienda == 0 || isValidaData.idTipoVivienda == null || isValidaData.idTipoVivienda == undefined ||
      isValidaData.idCre_Tiempo == 0 || isValidaData.idCre_Tiempo == null || isValidaData.idCre_Tiempo == undefined
    ) {
      valid = false; // Si algún campo obligatorio no es válido, cambiamos valid a false
    }

    // Validación adicional si tipoVivienda es 1 (Requiere campos de arrendador)
    if (isValidaData.idTipoVivienda == 1) {
      if (
        isValidaData.NombreArrendador == 0 || isValidaData.NombreArrendador == null || isValidaData.NombreArrendador == undefined ||
        isValidaData.TelefonoArrendador == 0 || isValidaData.TelefonoArrendador == null || isValidaData.TelefonoArrendador == undefined ||
        isValidaData.CelularArrendador == 0 || isValidaData.CelularArrendador == null || isValidaData.CelularArrendador == undefined
      ) {
        valid = false; // Si los campos de arrendador no están completos, cambiamos valid a false
      }
    }

    // Validación adicional si tipoVivienda es 3 o 4 (Requiere campos de inmueble)
    if (isValidaData.idTipoVivienda == 3 || isValidaData.idTipoVivienda == 4) {
      if (
        isValidaData.idInmueble == 0 || isValidaData.idInmueble == null || isValidaData.idInmueble == undefined ||
        isValidaData.idCantonInmueble == 0 || isValidaData.idCantonInmueble == null || isValidaData.idCantonInmueble == undefined ||
        isValidaData.ValorInmmueble == 0 || isValidaData.ValorInmmueble == null || isValidaData.ValorInmmueble == undefined
      ) {
        valid = false; // Si los campos de inmueble no están completos, cambiamos valid a false
      }
    }

    // Actualizamos el estado de checkDomicilio con el resultado de la validación
    setCheckDomicilio(valid);
  };

  const validarcaposdataConyuge = () => {
    let valid = true; // Inicializamos la validación como verdadera

    // Validación de cada campo en clienteData según la estructura solicitada
    if (
      !clienteData.idTipoDocConyuge ||
      clienteData.idTipoDocConyuge === 0 ||
      clienteData.idTipoDocConyuge == null
    ) {
      valid = false;
    }

    if (
      !clienteData.ApellidoPaternoConyuge ||
      clienteData.ApellidoPaternoConyuge === 0 ||
      clienteData.ApellidoPaternoConyuge == null
    ) {
      valid = false;
    }

    if (
      !clienteData.PrimerNombreConyuge ||
      clienteData.PrimerNombreConyuge === 0 ||
      clienteData.PrimerNombreConyuge == null
    ) {
      valid = false;
    }


    if (
      !clienteData.CedulaConyuge ||
      clienteData.CedulaConyuge === 0 ||
      clienteData.CedulaConyuge == null
    ) {
      valid = false;
    }

    if (
      !clienteData.FechaNacimientoConyuge ||
      clienteData.FechaNacimientoConyuge === 0 ||
      clienteData.FechaNacimientoConyuge == null
    ) {
      valid = false;
    }

    if (
      !clienteData.idNacionalidadConyuge ||
      clienteData.idNacionalidadConyuge === 0 ||
      clienteData.idNacionalidadConyuge == null
    ) {
      valid = false;
    }

    if (
      !clienteData.idGeneroConyuge ||
      clienteData.idGeneroConyuge === 0 ||
      clienteData.idGeneroConyuge == null
    ) {
      valid = false;
    }

    if (
      !clienteData.idNivelEducacionConyuge ||
      clienteData.idNivelEducacionConyuge === 0 ||
      clienteData.idNivelEducacionConyuge == null
    ) {
      valid = false;
    }

    if (
      !clienteData.idProfesionConyuge ||
      clienteData.idProfesionConyuge === 0 ||
      clienteData.idProfesionConyuge == null
    ) {
      valid = false;
    }
    // Actualizamos el estado de checkConyuge con el resultado de la validación
    setCheckConyuge(valid);
  };

  const validarcaposdataTrabajo = () => {
    let valid = true; // Inicializamos la validación como verdadera

    /*
    NombreEmpresa: formData.empresa,
          idTipoEmpresa: getParsedValue(formData.tipoEmpresa),
          FechaIngresoEmpresa: formData.fechaIngreso,
          IngresosTrabajo: IngresosTrabajoString,
          EgresosTrabajo: EgresosTrabajoString,
          idTipoContrato: getParsedValue(formData.tipoContrato),
          idTipoSueldo: getParsedValue(formData.tipoSueldo),
          Departaento: formData.departamento,
          idCargo: getParsedValue(formData.cargo),
          DiaPago: getParsedValue(formData.diasPago),
          AfiliadoIESS: formData.afiliado,
          idProvinciaTrabajo: getParsedValue(formData.provincia),
          idCantonTrabajo: getParsedValue(formData.canton),
          idParroquiaTrabajo: getParsedValue(formData.parroquia),
          idBarrioTrabajo: getParsedValue(formData.barrio),
          CallePrincipalTrabajo: formData.callePrincipal,
          NumeroCasaTrabajo: formData.numeroCasa,
          CalleSecundariaTrabajo: formData.calleSecundaria,
          TelefonoTrabajo: formData.telefono,
          Ext: formData.ext,
          CelularTrabajo: formData.celular,
          ReferenciaUbicacionTrabajo: formData.referenciaUbicacion,
*/
    // Validación de cada campo en clienteData según la estructura solicitada
    if (clienteData.idTipoEmpresa === 0 || clienteData.idTipoEmpresa == null) {
      valid = false;
    }
    if (clienteData.FechaIngresoEmpresa === 0 || clienteData.FechaIngresoEmpresa == null) {
      valid = false;
    }
    if (clienteData.IngresosTrabajo === 0 || clienteData.IngresosTrabajo == null) {
      valid = false;
    }
    if (clienteData.EgresosTrabajo === 0 || clienteData.EgresosTrabajo == null) {
      valid = false;
    }
    if (clienteData.idTipoContrato === 0 || clienteData.idTipoContrato == null) {
      valid = false;
    }
    if (clienteData.idTipoSueldo === 0 || clienteData.idTipoSueldo == null) {
      valid = false;
    }
    if (clienteData.Departaento === 0 || clienteData.Departaento == null) {
      valid = false;
    }
    if (clienteData.idCargo === 0 || clienteData.idCargo == null) {
      valid = false;
    }
    if (clienteData.DiaPago === 0 || clienteData.DiaPago == null) {
      valid = false;
    }
    if (clienteData.AfiliadoIESS === 0 || clienteData.AfiliadoIESS == null) {
      valid = false;
    }
    if (clienteData.idProvinciaTrabajo === 0 || clienteData.idProvinciaTrabajo == null) {
      valid = false;
    }
    if (clienteData.idCantonTrabajo === 0 || clienteData.idCantonTrabajo == null) {
      valid = false;
    }
    if (clienteData.idParroquiaTrabajo === 0 || clienteData.idParroquiaTrabajo == null) {
      valid = false;
    }
    if (clienteData.idBarrioTrabajo === 0 || clienteData.idBarrioTrabajo == null) {
      valid = false;
    }
    if (clienteData.CallePrincipalTrabajo === 0 || clienteData.CallePrincipalTrabajo == null) {
      valid = false;
    }
    if (clienteData.NumeroCasaTrabajo === 0 || clienteData.NumeroCasaTrabajo == null) {
      valid = false;
    }
    if (clienteData.CalleSecundariaTrabajo === 0 || clienteData.CalleSecundariaTrabajo == null) {
      valid = false;
    }
    if (
      (clienteData.TelefonoTrabajo === 0 || clienteData.TelefonoTrabajo == null) &&
      (clienteData.CelularTrabajo === 0 || clienteData.CelularTrabajo == null)
    ) {
      valid = false;
    }
    if (clienteData.ReferenciaUbicacionTrabajo === 0 || clienteData.ReferenciaUbicacionTrabajo == null) {
      valid = false;
    }

    // Actualizamos el estado de checkTrabajo con el resultado de la validación
    setCheckTrabajo(valid);
  };

  const validarcaposdataNegocio = () => {
    /* NombreNegocio: formData.nombreNegocio,
          idCre_TiempoNegocio: getParsedValue(formData.tiempoNegocio),
          MetrosCuadrados: getParsedValue(formData.metros),
          idProvinciaNegocio: getParsedValue(formData.provincia),
          idCantonNegocio: getParsedValue(formData.canton),
          idParroquiaNegocio: getParsedValue(formData.parroquia),
          idBarrioNegocio: getParsedValue(formData.barrio),
          CallePrincipalNegocio: formData.callePrincipal,
          NumeroCasaNegocio: formData.numeroCasa,
          CalleSecundariaNegocio: formData.calleSecundaria,
          ReferenciaUbicacionNegocio: formData.referenciaUbicacion,
          IngresosNegosio: IngresosTrabajoString,
          EgresosNegocio: EgresosTrabajoString,
          ActividadEconomicaNegocio: formData.actividadNegocio,
          AfiliadoTributario: formData.AfiliadoTributario,
          OblidagoLlevarContabilidad: formData.ObligadoContabilidad*/
    let valid = true; // Inicializamos la validación como verdadera

    // Validación de cada campo en clienteData según la estructura solicitada
    if (clienteData.NombreNegocio === 0 || clienteData.NombreNegocio == null) {
      valid = false;
    }
    if (clienteData.idCre_TiempoNegocio === 0 || clienteData.idCre_TiempoNegocio == null) {
      valid = false;
    }
    if (clienteData.MetrosCuadrados === 0 || clienteData.MetrosCuadrados == null) {
      valid = false;
    }
    if (clienteData.idProvinciaNegocio === 0 || clienteData.idProvinciaNegocio == null) {
      valid = false;
    }
    if (clienteData.idCantonNegocio === 0 || clienteData.idCantonNegocio == null) {
      valid = false;
    }
    if (clienteData.idParroquiaNegocio === 0 || clienteData.idParroquiaNegocio == null) {
      valid = false;
    }
    if (clienteData.idBarrioNegocio === 0 || clienteData.idBarrioNegocio == null) {
      valid = false;
    }
    if (clienteData.CallePrincipalNegocio === 0 || clienteData.CallePrincipalNegocio == null) {
      valid = false;
    }
    if (clienteData.NumeroCasaNegocio === 0 || clienteData.NumeroCasaNegocio == null) {
      valid = false;
    }
    if (clienteData.CalleSecundariaNegocio === 0 || clienteData.CalleSecundariaNegocio == null) {
      valid = false;
    }
    if (clienteData.ReferenciaUbicacionNegocio === 0 || clienteData.ReferenciaUbicacionNegocio == null) {
      valid = false;
    }
    if (clienteData.IngresosNegosio === 0 || clienteData.IngresosNegosio == null) {
      valid = false;
    }
    if (clienteData.EgresosNegocio === 0 || clienteData.EgresosNegocio == null) {
      valid = false;
    }
    if (clienteData.ActividadEconomicaNegocio === 0 || clienteData.ActividadEconomicaNegocio == null) {
      valid = false;
    }
    // Actualizamos el estado de checkNegocio con el resultado de la validación
    setCheckNegocio(valid);
  };



  // Si todos los campos son válidos, actualizamos el estado



  const fetchDatosCliente = async () => {
    try {
      if (!idSolicitud || !numeroSolicitud) {
        console.error("idSolicitud or numeroSolicitud is missing.");
        return;
      }

      const url = APIURL.get_cre_solicitud_web_id(idSolicitud, numeroSolicitud);

      setLoading(true); // Set loading to true before making the request
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setClienteData(response.data);
      // Call the validation function after fetching data

      setLoading(false); // Set loading to false once data is fetched

    } catch (error) {
      console.error("Error al obtener los datos del cliente", error);
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  const tabs = [
    { name: "Datos Cliente", icon: <ManageSearchIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkDatos },
    { name: "Domicilio", icon: <PrintIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkDomicilio },
    { name: "Datos Conyuge", icon: <SaveIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkConyuge },
    { name: "Referencias", icon: <PrintIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkReferencias },
    { name: "Negocio", icon: <ManageSearchIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkNegocio },
    { name: "Dependiente", icon: <LogoutIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkTrabajo },
    { name: "Información de Crédito", icon: <SaveIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkInformacionCredito },
    { name: "Factores de Crédito", icon: <PrintIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: checkFactoresCredito },
    { name: "Completado", icon: <CheckIcon fontSize="small" />, icons_2: <CircleIcon fontSize="small" />, check: false },
    // { name: "Verificación", icon: <ManageSearchIcon fontSize="small" /> },
  ];

  const renderTabContent = (clienteData) => {
    /* if (clienteData.idEdoCivil === 1 && activeTab !== "Datos Conyuge") {
       setActiveTab("Datos Conyuge");
     }*/

    switch (activeTab) {

      case "Datos Cliente":
        return <Datos ref={datosRef} data={clienteData} />;
      case "Domicilio":
        return <Domicilio ref={datosDomicilioRef} data={clienteData} />;
      case "Datos Conyuge":
        return clienteData.idEdoCivil === 1 ? <DatosConyuge ref={datosConyuge} data={clienteData} /> : null;
      case "Referencias":
        return <Referencias data={clienteData} />;
      case "Dependiente":
        return clienteData.idSituacionLaboral === 1 ? <SeccionB ref={datosTrabajo} data={clienteData} /> : null;
      case "Negocio":
        return clienteData.idSituacionLaboral != 1 ? <SeccionA ref={datosNegocio} data={clienteData} /> : null;
      case "Factores de Crédito":
        return <FactoresCredito ref={datosInformacionCredito} data={clienteData} />;
      case "Completado":
        {/*} case "Verificación":
        return <Verificacion />;*/}
      case "Información de Crédito":
        return <InformacionCredito data={clienteData} />;
      default:
        return <div>Contenido no disponible</div>;
    }
  };

  const openModal = () => setIsModalOpen(true);
  
  // Función para manejar el cierre del modal
  const closeModal = () => setIsModalOpen(false);

  // Función para confirmar la acción (enviar)
  const handleConfirm = () => {
    alert("¡Enviado!"); // Aquí puedes hacer la acción de enviar los datos
    closeModal(); // Cerrar el modal después de confirmar
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Completado") {
      openModal();
    }
  };
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      enqueueSnackbar("Por favor corrige los errores en el formulario..", { variant: "error" });
      return;
    }
    handleSave();

  };



  const validateForm = () => {
    if (!/^\d{10}$/.test(cedula)) {
      enqueueSnackbar("La cédula debe ser un número de 10 dígitos.", { variant: "error" });
      return false;
    }
    if (!local) {
      enqueueSnackbar("Debe seleccionar un local.", { variant: "error" });
      return false;
    }
    if (apellidoPaterno.length < 2 || primerNombre.length < 2) {
      enqueueSnackbar("El apellido paterno y el primer nombre deben tener al menos 5 caracteres.", { variant: "error" });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      enqueueSnackbar("El email no tiene un formato válido.", { variant: "error" });
      return false;
    }
    if (!/^\d{10}$/.test(celular)) {
      enqueueSnackbar("El celular debe ser un número de 10 dígitos.", { variant: "error" });
      return false;
    }
    return true;
  };
  const handleSave = () => {
    let tipoDato = 0;
    // Obtenemos los datos del formulario de acuerdo a su tab 
    if (activeTab === "Datos Cliente") {
      tipoDato = 2;
      const formData = datosRef.current.getFormData();
      const isValid = datosRef.current.validateForm(); // Llamamos a validateForm del componente Datos
      if (isValid) {
        fetchSaveDatosNacimiento(formData);
        setActiveTab("Domicilio");
        // Aquí podrías proceder con el envío de los datos o alguna otra acción
      } else {
        enqueueSnackbar("Por favor corrige los errores en el formulario.", { variant: "error" });
      }
    }
    if (activeTab === "Domicilio") {
      tipoDato = 3;
      const formData = datosDomicilioRef.current.getFormData();
      const isValid = datosDomicilioRef.current.validateForm(); // Llamamos a validateForm del componente Datos

      if (isValid) {
        fetchSaveDatosDomicilio(formData);
        setActiveTab("Datos Conyuge");
        // Aquí podrías proceder con el envío de los datos o alguna otra acción
      } else {
        enqueueSnackbar("Por favor corrige los errores en el formulario.", { variant: "error" });
      }
    }
    if (activeTab === "Datos Conyuge" && clienteData.idEdoCivil === 1) {
      tipoDato = 4;
      const formData = datosConyuge.current.getFormData();
      const isValid = datosConyuge.current.validateForm(); // Llamamos a validateForm del componente Datos

      if (isValid) {
        fetchSaveDatosConyuge(formData);
        setActiveTab("Referencias");
        // Aquí podrías proceder con el envío de los datos o alguna otra acción
      }
      //else {
      //enqueueSnackbar("Por favor corrige los errores en el formulario.", { variant: "error" });
      //}
    }
    if (activeTab === "Dependiente" && clienteData.idSituacionLaboral === 1) {
      tipoDato = 7;
      const formData = datosTrabajo.current.getFormData();
      const isValid = datosTrabajo.current.validateForm(); // Llamamos a validateForm del componente Datos

      if (isValid) {
        fetchSaveDatosTrabajo(formData);
        setActiveTab("Domicilio");
      }
    }

    if (activeTab === "Negocio" && clienteData.idSituacionLaboral != 1) {
      tipoDato = 6;
      const formData = datosNegocio.current.getFormData();
      const isValid = datosNegocio.current.validateForm(); // Llamamos a validateForm del componente Datos
      console.log("datos negocio", formData);
      if (isValid) {
        fetchSaveDatosNegocio(formData);
        setActiveTab("Domicilio");
      }
    }
    fetchInsertarDatos(tipoDato); // Llamar a la función para insertar datos
  };

  const fetchInsertarDatos = async (tipo) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {

        idCre_SolicitudWeb: clienteData.idCre_SolicitudWeb,
        Tipo: 1,
        idEstadoVerificacionDocumental: tipo,
        Usuario: userData.Nombre,
      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  const fetchSaveDatosNegocio = async (formData) => {
    try {
      const url = APIURL.puth_web_solicitudgrande_listadosolicitud(clienteData.idWeb_SolicitudGrande);
      // Función para asegurar que los valores sean válidos y numéricos
      const getParsedValue = (value) => (value ? parseInt(value) : null);
      const getParsedDecimalValue = (value) => (value ? parseFloat(value) : null);
      const gestString = (value) => (value ? value : null);
      const IngresosTrabajoString = String(formData.ingresos);  // Convierte a string
      const EgresosTrabajoString = String(formData.gastos);     // Convierte a string

      const response = await axios.patch(
        url,
        {
          NombreNegocio: formData.nombreNegocio,
          idCre_TiempoNegocio: getParsedValue(formData.tiempoNegocio),
          MetrosCuadrados: getParsedValue(formData.metros),
          idProvinciaNegocio: getParsedValue(formData.provincia),
          idCantonNegocio: getParsedValue(formData.canton),
          idParroquiaNegocio: getParsedValue(formData.parroquia),
          idBarrioNegocio: getParsedValue(formData.barrio),
          CallePrincipalNegocio: formData.callePrincipal,
          NumeroCasaNegocio: formData.numeroCasa,
          CalleSecundariaNegocio: formData.calleSecundaria,
          ReferenciaUbicacionNegocio: formData.referenciaUbicacion,
          IngresosNegosio: IngresosTrabajoString,
          EgresosNegocio: EgresosTrabajoString,
          ActividadEconomicaNegocio: formData.actividadNegocio,
          AfiliadoTributario: formData.AfiliadoTributario,
          OblidagoLlevarContabilidad: formData.ObligadoContabilidad
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Si todo sale bien
      enqueueSnackbar("Datos del conyuge guardados correctamente.", { variant: "success" });
    } catch (error) {
      // Si ocurre algún error
      enqueueSnackbar("Error al guardar los datos del conyuge.", { variant: "error" });
      console.error("Error al guardar los datos del conyuge", error);
    }
  };

  const getParsedDecimalValue = (value) => {
    if (value) {
      // Remove any non-numeric characters (e.g., commas) and ensure it's a valid decimal
      const sanitizedValue = value.replace(/[^0-9.-]+/g, '');
      let parsedValue = parseFloat(sanitizedValue);

      // If parsed value is an integer, ensure it has decimals (e.g., 500 => 500.00)
      if (parsedValue === parseInt(parsedValue)) {
        parsedValue = parseFloat(parsedValue.toFixed(2)); // Ensure it's a decimal with two decimal places
      }

      return isNaN(parsedValue) ? null : parsedValue;
    }
    return null;
  };

  const fetchSaveDatosTrabajo = async (formData) => {
    try {
      const url = APIURL.puth_web_solicitudgrande_listadosolicitud(clienteData.idWeb_SolicitudGrande);
      // Función para asegurar que los valores sean válidos y numéricos
      const getParsedValue = (value) => (value ? parseInt(value) : null);
      const getParsedDecimalValue = (value) => (value ? parseFloat(value) : null);
      const gestString = (value) => (value ? value : null);
      const IngresosTrabajoString = String(formData.ingresos);  // Convierte a string
      const EgresosTrabajoString = String(formData.gastos);     // Convierte a string

      const response = await axios.patch(
        url,
        {
          NombreEmpresa: formData.empresa,
          idTipoEmpresa: getParsedValue(formData.tipoEmpresa),
          FechaIngresoEmpresa: formData.fechaIngreso,
          IngresosTrabajo: IngresosTrabajoString,
          EgresosTrabajo: EgresosTrabajoString,
          idTipoContrato: getParsedValue(formData.tipoContrato),
          idTipoSueldo: getParsedValue(formData.tipoSueldo),
          Departaento: formData.departamento,
          idCargo: getParsedValue(formData.cargo),
          DiaPago: getParsedValue(formData.diasPago),
          AfiliadoIESS: formData.afiliado,
          idProvinciaTrabajo: getParsedValue(formData.provincia),
          idCantonTrabajo: getParsedValue(formData.canton),
          idParroquiaTrabajo: getParsedValue(formData.parroquia),
          idBarrioTrabajo: getParsedValue(formData.barrio),
          CallePrincipalTrabajo: formData.callePrincipal,
          NumeroCasaTrabajo: formData.numeroCasa,
          CalleSecundariaTrabajo: formData.calleSecundaria,
          TelefonoTrabajo: formData.telefono,
          Ext: formData.ext,
          CelularTrabajo: formData.celular,
          ReferenciaUbicacionTrabajo: formData.referenciaUbicacion,

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Si todo sale bien
      enqueueSnackbar("Datos del conyuge guardados correctamente.", { variant: "success" });
    } catch (error) {
      // Si ocurre algún error
      enqueueSnackbar("Error al guardar los datos del conyuge.", { variant: "error" });
      console.error("Error al guardar los datos del conyuge", error);
    }
  };


  const fetchSaveDatosConyuge = async (formData) => {
    try {
      const url = APIURL.puth_web_solicitudgrande_listadosolicitud(clienteData.idWeb_SolicitudGrande);
      // Función para asegurar que los valores sean válidos y numéricos
      const getParsedValue = (value) => (value ? parseInt(value) : null);

      const response = await axios.patch(
        url,
        {
          idTipoDocConyuge: getParsedValue(formData.tipoDocumento),
          ApellidoPaternoConyuge: formData.apellidoPaterno,
          PrimerNombreConyuge: formData.primerNombre,
          SegundoNombreConyuge: formData.segundoNombre,
          CedulaConyuge: formData.numeroDocumento,
          FechaNacimientoConyuge: formData.fechaNacimiento,
          idNacionalidadConyuge: getParsedValue(formData.nacionalidad),
          idGeneroConyuge: getParsedValue(formData.sexo),
          idNivelEducacionConyuge: getParsedValue(formData.nivelEducacion),
          idProfesionConyuge: getParsedValue(formData.profesion),

        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Si todo sale bien
      enqueueSnackbar("Datos del conyuge guardados correctamente.", { variant: "success" });
    } catch (error) {
      // Si ocurre algún error
      enqueueSnackbar("Error al guardar los datos del conyuge.", { variant: "error" });
      console.error("Error al guardar los datos del conyuge", error);
    }
  };

  const fetchSaveDatosDomicilio = async (formData) => {
    try {
      const url = APIURL.puth_web_solicitudgrande_listadosolicitud(clienteData.idWeb_SolicitudGrande);
      // Función para asegurar que los valores sean válidos y numéricos
      const getParsedValue = (value) => (value ? parseInt(value) : null);


      const response = await axios.patch(
        url,
        {
          idProvinciaDomicilio: getParsedValue(formData.provincia),
          idCantonDomicilio: getParsedValue(formData.canton),
          idParroquiaDomicilio: getParsedValue(formData.parroquia),
          idBarrioDomicilio: getParsedValue(formData.barrio),
          CallePrincipal: formData.callePrincipal,
          NumeroCasa: formData.numeroCasa,
          CalleSecundaria: formData.calleSecundaria,
          ReferenciaUbicacion: formData.referenciaUbicacion,
          TelefonoDomicilio: formData.telefonoCasa,
          TelefonoDomiliarDos: formData.telefonoCasa2,
          Celular: formData.celular,
          idTipoVivienda: getParsedValue(formData.tipoVivienda),
          idCre_Tiempo: getParsedValue(formData.tiempoVivienda),
          NombreArrendador: formData.nombreArrendador,
          TelefonoArrendador: formData.telfArrendador,
          CelularArrendador: formData.celularArrendador,
          idInmueble: getParsedValue(formData.inmueble),
          idCantonInmueble: getParsedValue(formData.ciudadInmueble),
          ValorInmmueble: formData.valorInmueble,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Si todo sale bien
      enqueueSnackbar("Datos de nacimiento guardados correctamente.", { variant: "success" });
    } catch (error) {
      // Si ocurre algún error
      enqueueSnackbar("Error al guardar los datos de nacimiento.", { variant: "error" });
      console.error("Error al guardar los datos de nacimiento", error);
    }
  };



  const fetchSaveDatosNacimiento = async (formData) => {
    try {
      const url = APIURL.puth_web_solicitudgrande_listadosolicitud(clienteData.idWeb_SolicitudGrande);
      // Función para asegurar que los valores sean válidos y numéricos
      const getParsedValue = (value) => (value ? parseInt(value) : null);

      const response = await axios.patch(
        url,
        {
          idNacionalidad: getParsedValue(formData.nacionalidad),
          FechaNacimiento: formData.fechaNacimiento,
          idGenero: getParsedValue(formData.genero),
          idProvinciaNacimiento: getParsedValue(formData.provinciaNacimiento),
          idCantonNacimiento: getParsedValue(formData.cantonNacimiento),
          idEdoCivil: getParsedValue(formData.estadoCivil),
          NumeroHijos: getParsedValue(formData.dependientes),
          idNivelEducacion: getParsedValue(formData.nivelEducacion),
          idProfesion: getParsedValue(formData.profesion),
          idSituacionLaboral: getParsedValue(formData.situacionLaboral),
          idActEconomica: getParsedValue(formData.actividadEconomica),
          ObservacionesActividadEconomica: formData.observacionActividadEconomica
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Si todo sale bien
      enqueueSnackbar("Datos de nacimiento guardados correctamente.", { variant: "success" });
    } catch (error) {
      // Si ocurre algún error
      enqueueSnackbar("Error al guardar los datos de nacimiento.", { variant: "error" });
      console.error("Error al guardar los datos de nacimiento", error);
    }
  };

  console.log("checkDatos", checkDatos);

  const handleValidate = () => {
    const isDatosValid = datosRef.current.validateForm(); // Llamamos a validateForm del componente Datos

    return isDatosValid;
  };

  useImperativeHandle(ref, () => ({
    handleValidate
  }));

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="md:flex">
          <div className="flex flex-col space-y-4 text-xs font-medium">

            {tabs.map(({ name, icon, icons_2, check }) => (
              // Verificamos si el nombre es 'Completado' y si checkCompletado es true
              (name === "Completado" ? checkCompeletado : true) && (
                <button
                  key={name}
                  onClick={() => handleTabClick(name)}
                  className={`inline-flex items-center px-2 py-2 rounded-lg w-full ${activeTab === name ? 'bg-blue-700 text-white' : 'bg-gray-50 text-gray-500'} hover:text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                >
                  {icon}
                  <span className="ml-1">{name}</span>
                  <div className="flex-grow" />
                  {check && (
                    <span className="text-green-500">{icons_2}</span>
                  )}
                </button>
              )
            ))}

          </div>

          <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CabeceraDatosSolicitud
                datosConsulta={data}
                data={{ fecha, cedula, local, apellidoPaterno, segundoApellido, primerNombre, segundoNombre, email, celular, estado, bGarante }}
                setData={{ setFecha, setCedula, setLocal, setApellidoPaterno, setSegundoApellido, setPrimerNombre, setSegundoNombre, setEmail, setCelular, setEstado, setBGarante }}
                handleInputChange={handleInputChange}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              {renderTabContent(clienteData)}
            </div>
            <div className="flex flex-wrap sm:flex-nowrap justify-start mt-6 gap-4">
              <div className="flex items-center">
                <button
                  onClick={handleSubmit}
                  className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-8 py-2.5 focus:shadow-none flex items-center justify-center space-x-2"
                >
                  <SaveIcon className="text-lg" />
                  <span className="text-xs">Guardar</span>
                </button>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => { }}
                  className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-8 py-2.5 focus:shadow-none flex items-center justify-center space-x-2"
                >
                  <PrintIcon className="text-lg" />
                  <span className="text-xs">Imprimir</span>
                </button>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => { }}
                  className="w-[150px] min-w-[120px] rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-8 py-2.5 focus:shadow-none flex items-center justify-center space-x-2"
                >
                  <LogoutIcon className="text-lg" />
                  <span className="text-xs">Salir</span>
                </button>
              </div>
            </div>
          </div>
          <ModalConfirm
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
        </div>
      )}
    </>
  );
}
