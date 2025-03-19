import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Import axios

import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import DatosCliente from "../DatosCliente/DatosCliente";
import { DatosConyuge } from "../DatosConyuge";
import { Referencias } from "../Referencia";
import { SeccionB } from "../SeccionB";
import { SeccionA } from "../SeccionA";
import { FactoresCredito } from "../FactoresCredito";
import { useSnackbar } from 'notistack';
import { Verificacion } from "../Verificacion/Verificacion";
import { InformacionCredito } from "../InformacionCredito";
import { APIURL } from "../../../configApi/apiConfig";
import { CabeceraDatosSolicitud } from "../CabeceraDatosSolicitud";
import { Loader } from "../../Utils"; // Make sure to import the Loader component
import Datos from "../DatosCliente/Datos/Datos";
import Domicilio from "../DatosCliente/Domicilio/Domicilio";
export function Cabecera() {
  const { state } = useLocation();
  const { data } = state || {};
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
  const datosClienteRef = useRef(); // Referencia para el componente DatosCliente
  const ref = useRef(); // Create ref for imperative handle

  useEffect(() => {
    fetchDatosCliente();
  }, [idSolicitud, numeroSolicitud]);

  const fetchDatosCliente = async () => {
    try {
      if (!idSolicitud || !numeroSolicitud) {
        console.error("idSolicitud or numeroSolicitud is missing.");
        return;
      }

      const url = APIURL.get_cre_solicitud_web_id(idSolicitud, numeroSolicitud);
      console.log("Fetching data from URL:", url);

      setLoading(true); // Set loading to true before making the request
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Fetched data:", response.data);
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
    { name: "Datos Conyuge", icon: <SaveIcon fontSize="small" /> },
    { name: "Referencias", icon: <PrintIcon fontSize="small" /> },
    { name: "Negocio", icon: <ManageSearchIcon fontSize="small" /> },
    { name: "Dependiente", icon: <LogoutIcon fontSize="small" /> },
    { name: "Información de Crédito", icon: <SaveIcon fontSize="small" /> },
    { name: "Factores de Crédito", icon: <PrintIcon fontSize="small" /> },
    { name: "Verificación", icon: <ManageSearchIcon fontSize="small" /> },
  ];

  const renderTabContent = (clienteData) => {
    if (clienteData.idEdoCivil === 1 && activeTab !== "Datos Conyuge") {
      setActiveTab("Datos Conyuge");
    }

    switch (activeTab) {

      case "Datos Cliente":
        return <Datos ref={datosRef} data={clienteData} />;
      case "Domicilio":
        return <Domicilio ref={datosClienteRef} data={clienteData} />;
      case "Datos Conyuge":
        return clienteData.idEdoCivil === 1 ? <DatosConyuge /> : null;
      case "Referencias":
        return <Referencias />;
      case "Negocio":
        return <SeccionA ref={seccionRef} />;
      case "Dependiente":
        return <SeccionB />;
      case "Factores de Crédito":
        return <FactoresCredito ref={seccionRef} />;
      case "Verificación":
        return <Verificacion />;
      case "Información de Crédito":
        return <InformacionCredito />;
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
    const formData = datosRef.current.getFormData();
    const isValid = datosRef.current.validateForm(); // Llamamos a validateForm del componente Datos
    if (isValid) {
      fetchSaveDatosNacimiento(formData);
      // Aquí podrías proceder con el envío de los datos o alguna otra acción
    } else {
      enqueueSnackbar("Por favor corrige los errores en el formulario.", { variant: "error" });
    }
  };

  const fetchSaveDatosNacimiento = async (formData) => {
    try {
      const url = APIURL.puth_web_solicitudgrande_listadosolicitud(clienteData.idWeb_SolicitudGrande);
      console.log("URL:", url);
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

      console.log("Datos de nacimiento guardados correctamente:", response.data);

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
