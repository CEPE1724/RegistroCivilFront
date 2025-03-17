import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";  // Import axios

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

  const datosClienteRef = useRef(); // Referencia para el componente DatosCliente

  useEffect(() => {
    fetchDatosCliente();
  }, [idSolicitud, numeroSolicitud]);

  const fetchDatosCliente = async () => {
    try {
      // Validate that idSolicitud and numeroSolicitud are defined
      if (!idSolicitud || !numeroSolicitud) {
        console.error("idSolicitud or numeroSolicitud is missing.");
        return;
      }

      // Construct the URL dynamically using the parameters
      const url = APIURL.get_cre_solicitud_web_id(idSolicitud, numeroSolicitud);
      console.log("Fetching data from URL:", url);

      // Make the axios GET request
      setLoading(true); // Set loading to true before making the request
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If the response is successful, log the data
      console.log("Fetched data:", response.data);

      // Save the fetched data to state
      setClienteData(response.data);
      setLoading(false); // Set loading to false once data is fetched

    } catch (error) {
      console.error("Error al obtener los datos del cliente", error);
      setLoading(false); // Set loading to false if an error occurs
    }
  };

  const tabs = [
    "Datos Cliente",
    "Datos Conyuge",
    "Referencias",
    "Sección A- Negocio",
    "Sección B- Dependiente",
    "Información de Crédito",
    "Factores de Crédito",
    "Verificación",
  ];

  const renderTabContent = (clienteData) => {
    console.log("clienteData", clienteData.idEdoCivil);
  
    // Habilitar el tab de "Datos Conyuge" solo si idEdoCivil == 1
    if (clienteData.idEdoCivil === 1 && activeTab !== "Datos Conyuge") {
      setActiveTab("Datos Conyuge"); // Cambiar la pestaña activa a "Datos Conyuge" si el estado civil es 1
    }
  
    switch (activeTab) {
      case "Datos Cliente":
        return <DatosCliente ref={datosClienteRef} data={clienteData} />;
      case "Datos Conyuge":
        return clienteData.idEdoCivil === 1 ? <DatosConyuge /> : null; 
      case "Referencias":
        return <Referencias />;
      case "Sección A- Negocio":
        return <SeccionA ref={seccionRef} />;
      case "Sección B- Dependiente":
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

  const handleSave = () => {
    const isValid = datosClienteRef.current.handleValidate(); // Llamamos a handleValidate de DatosCliente
    if (isValid) {
      enqueueSnackbar("Datos guardados exitosamente.", { variant: "success" });
      // Aquí podrías proceder con el envío de los datos o alguna otra acción
    } else {
      enqueueSnackbar("Por favor corrige los errores en el formulario.", { variant: "error" });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">

          <div className="bg-white p-6 rounded-lg shadow-md">
            <CabeceraDatosSolicitud
              datosConsulta={data}
              data={{ fecha, cedula, local, apellidoPaterno, segundoApellido, primerNombre, segundoNombre, email, celular, estado, bGarante }}
              setData={{ setFecha, setCedula, setLocal, setApellidoPaterno, setSegundoApellido, setPrimerNombre, setSegundoNombre, setEmail, setCelular, setEstado, setBGarante }}
              handleInputChange={handleInputChange}
            />
          </div>

          <div className="mt-6 border-b">
            <ul className="flex flex-wrap space-x-4">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer p-2 ${activeTab === tab
                    ? "border-b-2 border-blue-500 font-bold"
                    : "text-gray-500"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 mt-0">
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
      )}
    </>
  );
}
