import React, {
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { useSnackbar } from "notistack";
import {
  fetchNacionalidad,
  fecthGenero,
  fecthEstadoCivil,
  fetchNivelEducacion,
  fetchProfesion,
  fetchSituacionLaboral,
  fetchProvincias,
  fetchCantones,
  fetchParroquias,
  fetchBarrios,
  fetchActividadEconomina,
  fetchTiempoVivienda,
  fecthTipoVivienda,
  fecthInmueble,
  fecthCiudadInmueble,
} from "../DatosCliente/apisFetch";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "../../../configApi/axiosConfig";
import {
  FaStoreAlt,
  FaMoneyCheckAlt,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaRoad,
  FaHouseUser,
  FaMapPin,
  FaRulerCombined,
  FaIndustry,
  FaPhoneAlt,
  FaStore,
  FaMobileAlt,
} from "react-icons/fa";
import { SelectField } from "../../Utils";
import { LocationModal } from "../LocationModal";
import { useAuth } from "../../AuthContext/AuthContext";
import { useLocation } from "react-router-dom";
import { GoogleMapModal } from "../../ListadoSolicitud/DomicilioModal"
const SeccionA = forwardRef((props, ref) => {

  const location = useLocation();
  const [clientInfo, setClientInfo] = useState(null);
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



  const { userData, userUsuario } = useAuth();
  const { data } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [tiempoNegocio, setTiempoNegocio] = useState([]);
  const [metros, setMetros] = useState("");
  const [ingresos, setIngresos] = useState("");
  const [gastos, setGastos] = useState("");
  const [provincia, setProvincia] = useState([]);
  const [canton, setCanton] = useState([]);
  const [parroquia, setParroquia] = useState([]);
  const [barrio, setBarrio] = useState([]);
  const [callePrincipal, setCallePrincipal] = useState("");
  const [numeroCasa, setNumeroCasa] = useState("");
  const [calleSecundaria, setCalleSecundaria] = useState("");
  const [referenciaUbicacion, setReferenciaUbicacion] = useState("");
  const [actividadNegocio, setActividadNegocio] = useState("");
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [ubicacionError, setUbicacionError] = useState(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyDSFUJHYlz1cpaWs2EIkelXeMaUY0YqWag";
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombreNegocio: data.NombreNegocio || "",
    tiempoNegocio: data.idCre_TiempoNegocio || "",
    metros: data.MetrosCuadrados || 0,
    ingresos: data.IngresosNegosio || 0,
    gastos: data.EgresosNegocio || 0,
    provincia: data.idProvinciaNegocio || 0,
    canton: data.idCantonNegocio || 0,
    parroquia: data.idParroquiaNegocio || 0,
    barrio: data.idBarrioNegocio || 0,
    callePrincipal: data.CallePrincipalNegocio || "",
    numeroCasa: data.NumeroCasaNegocio || "",
    calleSecundaria: data.CalleSecundariaNegocio || "",
    referenciaUbicacion: data.ReferenciaUbicacionNegocio || "",
    actividadNegocio: data.ActividadEconomicaNegocio || "",
    AfiliadoTributario: data.AfiliadoTributario || false,
    ObligadoContabilidad: data.ObligadoContabilidad || false,
    telefono: data.TelefonoNegocio || "",
    celular: data.CelularNegocio || "",
  });
  const [showMapModal, setShowMapModal] = useState(false);
  const [ Latitud, setLatitud ] = useState("")
  const [ Longitud, setLongitud ] = useState ("")

  useEffect(() => {
    fetchTiempoVivienda(enqueueSnackbar, setTiempoNegocio);
    fetchProvincias(enqueueSnackbar, setProvincia);
  }, []);

  useEffect(() => {
    if (formData.provincia) {
      fetchCantones(formData.provincia, enqueueSnackbar, setCanton);
    }
  }, [formData.provincia, enqueueSnackbar]);

  useEffect(() => {
    if (formData.canton) {
      fetchParroquias(formData.canton, enqueueSnackbar, setParroquia);
    }
  }, [formData.canton, enqueueSnackbar]);

  useEffect(() => {
    if (formData.parroquia) {
      fetchBarrios(formData.parroquia, enqueueSnackbar, setBarrio);
    }
  }, [formData.parroquia, enqueueSnackbar]);

  const fecthValidaDomicilio = async () => {
    try {

      const idCre_SolicitudWeb = data.idCre_SolicitudWeb;
      const url = APIURL.getCoordenadasprefacturaPorId(idCre_SolicitudWeb, 1);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        return response.data; // Return the fetched data
      } else {
        console.error("No se encontraron datos para la solicitud.");
        return null; // Return null if no data is found
      }
    } catch (error) {
      console.error("Error al obtener los datos del cliente", error);
      return null; // Return null in case of an error
    }
  };


  const handleOpenModal = async () => {


    const camposBase = [
    //   { dataKey: "NombreNegocio", formKey: "nombreNegocio" },
    //   { dataKey: "idCre_TiempoNegocio", formKey: "tiempoNegocio" },
    //   { dataKey: "MetrosCuadrados", formKey: "metros" },
    //   { dataKey: "IngresosNegosio", formKey: "ingresos" },
    //   { dataKey: "EgresosNegocio", formKey: "gastos" },
    //   { dataKey: "idProvinciaNegocio", formKey: "provincia" },
    //   { dataKey: "idCantonNegocio", formKey: "canton" },
    //   { dataKey: "idParroquiaNegocio", formKey: "parroquia" },
    //   { dataKey: "idBarrioNegocio", formKey: "barrio" },
    //   { dataKey: "CallePrincipalNegocio", formKey: "callePrincipal" },
    //   { dataKey: "NumeroCasaNegocio", formKey: "numeroCasa" },
    //   { dataKey: "CalleSecundariaNegocio", formKey: "calleSecundaria" },
    //   { dataKey: "ReferenciaUbicacionNegocio", formKey: "referenciaUbicacion" },
    //   { dataKey: "ActividadEconomicaNegocio", formKey: "actividadNegocio" },
    ];

    const camposInvalidos = camposBase.filter(
      ({ dataKey }) =>
        data[dataKey] === null ||
        data[dataKey] === undefined ||
        data[dataKey] === "" ||
        data[dataKey] === 0
    );

    const camposNoLlenados = camposBase.filter(
      ({ formKey }) =>
        formData[formKey] === null ||
        formData[formKey] === undefined ||
        formData[formKey] === "" ||
        formData[formKey] === 0
    );

    if (camposNoLlenados.length > 0) {
      enqueueSnackbar(
        "Para seleccionar la ubicación del negocio, primero debes llenar la provincia, cantón, parroquia y barrio.",
        {
          variant: "warning",
        }
      );
      return;
    }

    // const validation = await fecthValidaDomicilio(data.idCre_SolicitudWeb, 2);
    // if (!validation || !validation.exists || validation.count === 0) {
    //   enqueueSnackbar("No es posible guardar coordenadas porque no hay datos válidos en la solicitud.", {
    //     variant: 'error'
    //   });
    //   setUbicacionError("No existen coordenadas registradas para esta solicitud.");
    //   return;
    // }

    setOpenLocationModal((prev) => !prev);
  };

  const handleFormChange = async (e) => {
    const { name, value, type, checked } = e.target;

    // Validación para campos de teléfono
    if (name === 'telefono' || name === 'celular') {
      // Solo validar si el campo tiene valor y tiene la longitud correcta
      if (value && (value.length === 9 || value.length === 10)) {
        const existe = await props.comprobTelf(value);
        if (existe === 1) {
          enqueueSnackbar(`El número ${value} se encuentra en la lista negra`, {
            variant: 'warning'
          });
          return;
        }
      }
    }
    // Expresión regular para detectar caracteres no permitidos
    const invalidCharsRegex = /[<>'"\\;{}()[\]`~!@#$%^&*=+|/?]/g;

    if (invalidCharsRegex.test(value)) {
      // Si hay caracteres no permitidos, los eliminamos y actualizamos formData y formErrors
      const cleanedValue = value.replace(invalidCharsRegex, "");

      setFormData((prevState) => ({
        ...prevState,
        [name]: cleanedValue,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Este campo contiene caracteres no permitidos",
      }));

      return;
    }

    // Si el valor es válido, actualizar normalmente
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Limpiar el error si el valor es válido
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "provincia" && value) {
      fetchCantones(value, enqueueSnackbar, setCanton);
      setCanton([]);
      setParroquia([]);
      setBarrio([]);
      setFormData((prev) => ({
        ...prev,
        canton: "",
        parroquia: "",
        barrio: "",
      }));
    }

    if (name === "canton" && value) {
      fetchParroquias(value, enqueueSnackbar, setParroquia);
      setParroquia([]);
      setBarrio([]);
      setFormData((prev) => ({ ...prev, parroquia: "", barrio: "" }));
    }

    if (name === "parroquia" && value) {
      fetchBarrios(value, enqueueSnackbar, setBarrio);
      setBarrio([]);
      setFormData((prev) => ({ ...prev, barrio: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let showSnackbar = false; // Esta variable controla si mostramos un snackbar
    if (!formData.nombreNegocio || formData.nombreNegocio.length <= 3) {
      newErrors.nombreNegocio = "Este campo es obligatorio";
      if (!showSnackbar) {
        // Solo mostrar el snackbar si aún no se ha mostrado uno
        enqueueSnackbar(
          "El nombre del negocio debe tener más de 3 caracteres",
          { variant: "error" }
        );
        showSnackbar = true; // Asegura que solo se muestre un snackbar
      }
    }

    if (
      !formData.tiempoNegocio ||
      formData.tiempoNegocio <= 0 ||
      formData.tiempoNegocio > 100000000000
    ) {
      newErrors.tiempoNegocio = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("El tiempo del negocio debe ser un número mayor a 0", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.metros ||
      formData.metros <= 0 ||
      formData.metros > 100000000000
    ) {
      newErrors.metros = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Los metros deben ser un número mayor a 0", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.ingresos ||
      formData.ingresos <= 0 ||
      formData.ingresos > 100000000000
    ) {
      newErrors.ingresos = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Los ingresos deben ser un número mayor a 0", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.gastos ||
      formData.gastos <= 0 ||
      formData.gastos > 100000000000
    ) {
      newErrors.gastos = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Los gastos deben ser un número mayor a 0", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (formData.gastos > formData.ingresos) {
      newErrors.gastos = "Los gastos no pueden ser mayores a los ingresos";
      if (!showSnackbar) {
        enqueueSnackbar("Los gastos no pueden ser mayores a los ingresos", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.provincia) {
      newErrors.provincia = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("La provincia es obligatoria", { variant: "error" });
        showSnackbar = true;
      }
    }

    if (!formData.canton) {
      newErrors.canton = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("El cantón es obligatorio", { variant: "error" });
        showSnackbar = true;
      }
    }

    if (!formData.parroquia) {
      newErrors.parroquia = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("La parroquia es obligatoria", { variant: "error" });
        showSnackbar = true;
      }
    }

    if (!formData.barrio) {
      newErrors.barrio = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("El barrio es obligatorio", { variant: "error" });
        showSnackbar = true;
      }
    }

    if (formData.barrio.length > 100) {
      newErrors.barrio = "El barrio no debe exceder los 100 caracteres";
      if (!showSnackbar) {
        enqueueSnackbar("El barrio no debe exceder los 100 caracteres", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.callePrincipal) {
      newErrors.callePrincipal = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("La calle principal es obligatoria", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (formData.callePrincipal.length > 100) {
      newErrors.callePrincipal =
        "La calle principal no debe exceder los 100 caracteres";
      if (!showSnackbar) {
        enqueueSnackbar(
          "La calle principal no debe exceder los 100 caracteres",
          { variant: "error" }
        );
        showSnackbar = true;
      }
    }

    if (!formData.numeroCasa) {
      newErrors.numeroCasa = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("El número de casa es obligatorio", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.calleSecundaria) {
      newErrors.calleSecundaria = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("La calle secundaria es obligatoria", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (formData.calleSecundaria.length > 100) {
      newErrors.calleSecundaria =
        "La calle secundaria no debe exceder los 100 caracteres";
      if (!showSnackbar) {
        enqueueSnackbar(
          "La calle secundaria no debe exceder los 100 caracteres",
          { variant: "error" }
        );
        showSnackbar = true;
      }
    }

    if (!formData.referenciaUbicacion) {
      newErrors.referenciaUbicacion = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("La referencia de ubicación es obligatoria", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (formData.referenciaUbicacion.length > 300) {
      newErrors.referenciaUbicacion =
        "La referencia de ubicación no debe exceder los 300 caracteres";
      if (!showSnackbar) {
        enqueueSnackbar(
          "La referencia de ubicación no debe exceder los 300 caracteres",
          { variant: "error" }
        );
        showSnackbar = true;
      }
    }

    if (!formData.actividadNegocio) {
      newErrors.actividadNegocio = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("La actividad del negocio es obligatoria", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (formData.actividadNegocio.length > 300) {
      newErrors.actividadNegocio =
        "La actividad del negocio no debe exceder los 300 caracteres";
      if (!showSnackbar) {
        enqueueSnackbar(
          "La actividad del negocio no debe exceder los 300 caracteres",
          { variant: "error" }
        );
        showSnackbar = true;
      }
    }

    // Actualizamos los errores en el estado
    setErrors(newErrors);

    // Retorna si no hay errores en el formulario
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    validateForm,
    getFormData: () => formData,
  }));

  const fetchLatyLon = async () => {
	try {
		const id = clientInfo?.data?.id
		console.log("id", id)
		const response = await axios.get(APIURL.getCoordenadasId(id, 2))
		setLatitud(response.data[0].latitud)
		setLongitud(response.data[0].longitud)
		setShowMapModal(true)
	}  catch (error) {
	console.error("Error al obtener coordenadas", error);
	enqueueSnackbar("Error al obtener coordenadas", { variant: "error" });
  }
}

  return (
    <div className="p-6">
      {/* Rejilla adaptable para responsive */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Primera fila: Nombre, Tiempo, Metros, Ingresos y Gastos */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaStoreAlt className="mr-2 text-primaryBlue" />
            Nombre de Negocio
          </label>
          <input
            type="text"
            className="solcitudgrande-style"
            value={formData.nombreNegocio}
            name="nombreNegocio"
            onChange={handleFormChange}
          />
          {errors.nombreNegocio && (
            <span className="text-red-500 text-xs">{errors.nombreNegocio}</span>
          )}
        </div>
        <div className="col-span-1">
          <SelectField
            label="Tiempo del Negocio"
            icon={<FaClock />}
            value={formData.tiempoNegocio}
            onChange={handleFormChange}
            options={tiempoNegocio}
            name="tiempoNegocio"
            error={errors.tiempoNegocio}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaRulerCombined className="mr-2 text-primaryBlue" />
            Metros
          </label>
          <input
            type="number"
            required
            className="solcitudgrande-style"
            value={formData.metros}
            onChange={handleFormChange}
            name={"metros"}
          />
          {errors.metros && (
            <span className="text-red-500 text-xs">{errors.metros}</span>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMoneyBillWave className="mr-2 text-primaryBlue" />
            Ingresos
          </label>
          <input
            type="number"
            required
            className="solcitudgrande-style"
            value={formData.ingresos}
            onChange={handleFormChange}
            name={"ingresos"}
          />
          {errors.metros && (
            <span className="text-red-500 text-xs">{errors.metros}</span>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMoneyCheckAlt className="mr-2 text-primaryBlue" />
            Gastos
          </label>
          <input
            type="number"
            className="solcitudgrande-style"
            value={formData.gastos}
            onChange={handleFormChange}
            name={"gastos"}
          />
          {errors.gastos && (
            <span className="text-red-500 text-xs">{errors.gastos}</span>
          )}
        </div>

        {/* Segunda fila: Provincia, Cantón, Parroquia, Barrio */}
        <div className="flex flex-col">
          <SelectField
            label="Provincia"
            icon={<FaMapMarkerAlt />}
            value={formData.provincia}
            onChange={handleFormChange}
            options={provincia}
            name="provincia"
            error={errors.provincia}
          />
        </div>

        <div className="col-span-1">
          <SelectField
            label="Canton"
            icon={<FaStore />}
            value={formData.canton}
            onChange={handleFormChange}
            options={canton}
            name="canton"
            error={errors.canton}
          />
        </div>
        <div className="col-span-1">
          <SelectField
            label="Parroquia"
            icon={<FaStore />}
            value={formData.parroquia}
            onChange={handleFormChange}
            options={parroquia}
            name="parroquia"
            error={errors.parroquia}
          />
        </div>
        <div className="col-span-1">
          <SelectField
            label="Barrio"
            icon={<FaStore />}
            value={formData.barrio}
            onChange={handleFormChange}
            options={barrio}
            name="barrio"
            error={errors.barrio}
          />
        </div>

        {(clientInfo?.data?.idEstadoVerificacionSolicitud == 1 || clientInfo?.data?.idEstadoVerificacionSolicitud == 11 ) && (
		<div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            Ubicacion Trabajo
          </label>
          <button
            type="button"
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
            name="verubicacionDomicilio"
            onClick={() => handleOpenModal("ubicacionDomicilio")}
          >
            Ubicacion Trabajo
          </button>
          {ubicacionError && (
            <p className="mt-1 text-sm text-red-500 border-red-500">
              No se han registrado coordenadas para este domicilio.
            </p>
          )}
        </div>)}

		{(clientInfo?.data.idEstadoVerificacionSolicitud == 12 || clientInfo?.data.idEstadoVerificacionSolicitud == 10 || clientInfo?.data?.idEstadoVerificacionSolicitud == 13) && (
			<div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            Ver Ubicacion Trabajo
          </label>
          <button
            type="button"
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
            name="ubicacionDomicilio"
            onClick={fetchLatyLon}
          >
            Ver Ubicacion Trabajo
          </button>
          {ubicacionError && (
            <p className="mt-1 text-sm text-red-500 border-red-500">
              No se han registrado coordenadas para este domicilio.
            </p>
          )}
        </div>)}


        <div className="lg:col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaPhoneAlt className="mr-2 text-primaryBlue" />
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleFormChange}
            className="solcitudgrande-style"
          />
          {errors.telefono && (
            <span className="text-red-500 text-xs">{errors.telefono}</span>
          )}
        </div>

        <div className="lg:col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMobileAlt className="mr-2 text-primaryBlue" />
            Celular
          </label>
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleFormChange}
            className="solcitudgrande-style"
          />
          {errors.celular && (
            <span className="text-red-500 text-xs">{errors.celular}</span>
          )}
        </div>

        {/* Tercera fila: Calle Principal, Número Casa, Calle Secundaria, Referencia Ubicación */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaRoad className="mr-2 text-primaryBlue" />
            Calle Principal
          </label>
          <input
            type="text"
            required
            className="solcitudgrande-style"
            value={formData.callePrincipal}
            onChange={handleFormChange}
            name="callePrincipal"
          />
          {errors.callePrincipal && (
            <span className="text-red-500 text-xs">
              {errors.callePrincipal}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaHouseUser className="mr-2 text-primaryBlue" />
            Número Casa
          </label>
          <input
            type="text"
            required
            className="solcitudgrande-style"
            value={formData.numeroCasa}
            onChange={handleFormChange}
            name="numeroCasa"
          />
          {errors.numeroCasa && (
            <span className="text-red-500 text-xs">{errors.numeroCasa}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaRoad className="mr-2 text-primaryBlue" />
            Calle Secundaria
          </label>
          <input
            type="text"
            required
            className="solcitudgrande-style"
            value={formData.calleSecundaria}
            onChange={handleFormChange}
            name="calleSecundaria"
          />
          {errors.numeroCasa && (
            <span className="text-red-500 text-xs">{errors.numeroCasa}</span>
          )}
        </div>

        <div className="flex flex-col lg:col-span-2">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMapPin className="mr-2 text-primaryBlue" />
            Referencia Ubicación
          </label>
          <textarea
            className="solcitudgrande-style h-20"
            value={formData.referenciaUbicacion}
            onChange={handleFormChange}
            name="referenciaUbicacion"
            required
          />
          {errors.referenciaUbicacion && (
            <span className="text-red-500 text-xs">
              {errors.referenciaUbicacion}
            </span>
          )}
        </div>

        {/* Cuarta fila: Actividad del Negocio y Opciones */}
        <div className="flex flex-col lg:col-span-2">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaIndustry className="mr-2 text-primaryBlue" />
            Actividad del Negocio
          </label>
          <textarea
            className="solcitudgrande-style h-20"
            value={formData.actividadNegocio}
            onChange={handleFormChange}
            name="actividadNegocio"
            required
          />
          {errors.actividadNegocio && (
            <span className="text-red-500 text-xs">
              {errors.actividadNegocio}
            </span>
          )}
        </div>

        {/* Opciones */}
        <div className="lg:col-span-2 flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-2 lg:space-y-0">
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-2" />
            Afiliado Tributario
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-2" />
            Obligado a Llevar Contabilidad
          </label>
        </div>
      </div>
      <LocationModal
        isOpen={() => handleOpenModal()}
        openLocationModal={openLocationModal}
        locationType={null}
        locationData={null}
        onLocationChange={null}
        userSolicitudData={data}
        tipo={2}
        userData={userData}
      />
	  {/* MAP MODAL */}
		{showMapModal && Latitud && Longitud && (
		  <GoogleMapModal
			lat={Latitud}
			lng={Longitud}
			apiKey={GOOGLE_MAPS_API_KEY}
			onClose={() => setShowMapModal(false)}
		  />
		)}
    </div>
  );
});

export default SeccionA;
