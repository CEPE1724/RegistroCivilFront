import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Import axios

import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import DatosCliente from "../DatosCliente/DatosCliente";
import DatosConyuge from "../DatosConyuge/DatosConyuge";
import SeccionB from "../../SolicitudGrande/SeccionB/SeccionB";
import SeccionA from "../../SolicitudGrande/SeccionA/SeccionA";
import { FactoresCredito } from "../FactoresCredito";
import { useSnackbar } from 'notistack';
import { Verificacion } from "../Verificacion/Verificacion";
import  InformacionCredito  from "../InformacionCredito/InformacionCredito";
import { APIURL } from "../../../configApi/apiConfig";
import { CabeceraDatosSolicitud } from "../CabeceraDatosSolicitud";
import { Loader } from "../../Utils"; // Make sure to import the Loader component
import Datos from "../DatosCliente/Datos/Datos";
import Domicilio from "../DatosCliente/Domicilio/Domicilio";
import Referencias from "../Referencia/Referencia";
import { useAuth } from "../../AuthContext/AuthContext";
export function Cabecera() {
  const { userData, userUsuario } = useAuth();
  const { state } = useLocation();
  const { data } = state || {};
  console.log("data cabecera", data);
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
    fetchDatosCliente();
  }, [idSolicitud, numeroSolicitud, activeTab]);

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
      setLoading(false); // Set loading to false once data is fetched

    } catch (error) {
      console.error("Error al obtener los datos del cliente", error);
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  const tabs = [
    { name: "Datos Cliente", icon: <ManageSearchIcon fontSize="small" /> },
    { name: "Domicilio", icon: <PrintIcon fontSize="small" /> },
    { name: "Datos Conyuge", icon: <SaveIcon fontSize="small" />, },
    { name: "Referencias", icon: <PrintIcon fontSize="small" /> },
    { name: "Negocio", icon: <ManageSearchIcon fontSize="small" /> },
    { name: "Dependiente", icon: <LogoutIcon fontSize="small" /> },
    { name: "Información de Crédito", icon: <SaveIcon fontSize="small" /> },
    { name: "Factores de Crédito", icon: <PrintIcon fontSize="small" /> },
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
        return <FactoresCredito ref={datosInformacionCredito} data={clienteData}  />;
        {/*} case "Verificación":
        return <Verificacion />;*/}
      case "Información de Crédito":
        return <InformacionCredito data={clienteData}  />;
      default:
        return <div>Contenido no disponible</div>;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
        setActiveTab("Factores de Crédito");
      }
    }

    if (activeTab === "Negocio" && clienteData.idSituacionLaboral != 1) {
      tipoDato = 6;
      const formData = datosNegocio.current.getFormData();
      const isValid = datosNegocio.current.validateForm(); // Llamamos a validateForm del componente Datos
      console.log("datos negocio", formData);
      if (isValid) {
        fetchSaveDatosNegocio(formData);
       // setActiveTab("Factores de Crédito");
      }
    }
    fetchInsertarDatos(tipoDato); // Llamar a la función para insertar datos
  };

  const fetchInsertarDatos = async (tipo) => {
    try{
     const url = APIURL.post_createtiemposolicitudeswebDto();

          await axios.post(url, {
    
            idCre_SolicitudWeb: clienteData.idCre_SolicitudWeb,
            Tipo: 1,
            idEstadoVerificacionDocumental: tipo,
            Usuario: userData.Nombre,
          });
        }catch (error) {
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

            {tabs.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => handleTabClick(name)}
                className={`inline-flex items-center px-2 py-2 rounded-lg w-full ${activeTab === name ? 'bg-blue-700 text-white' : 'bg-gray-50 text-gray-500'} hover:text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                {icon}
                <span className="ml-1">{name}</span>
              </button>
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

        </div>
      )}
    </>
  );
}
