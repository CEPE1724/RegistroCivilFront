import React, {
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { APIURL } from "../../../configApi/apiConfig";
import { useSnackbar } from "notistack";
import axios from "../../../configApi/axiosConfig";
import { SelectField } from "../../Utils";
import {
  fetchTipoEmpresa,
  fetchTipoContrato,
  fecthTipoSueldo,
  fetchCargo,
  fetchCognoTrabajocargo,
  fetchBarrios,
  fetchParroquias,
  fetchCantones,
  fetchProvincias,
} from "../DatosCliente/apisFetch";
import {
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaFileContract,
  FaCity,
  FaMapMarkerAlt,
  FaUserCheck,
  FaPhoneAlt,
  FaDollarSign,
  FaClock,
  FaUserTie,
  FaMoneyBillWave,
  FaBriefcase,
  FaBuilding,
  FaRoad,
  FaHouseUser,
  FaPhone,
  FaMobileAlt,
  FaMapPin,
} from "react-icons/fa";
import { LocationModal } from "../LocationModal";
import { useAuth } from "../../AuthContext/AuthContext";
import { useLocation } from "react-router-dom";

const SeccionB = forwardRef((props, ref) => {

  const location = useLocation();
  const [clientInfo, setClientInfo] = useState(null);
  const [ubicacionError, setUbicacionError] = useState(false);

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
  const { data } = props;

  const { userData, userUsuario } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [tipoEmpresa, setTipoEmpresa] = useState([]);
  const [tipoContrato, setTipoContrato] = useState([]);
  const [tipoSueldo, setTipoSueldo] = useState([]);
  const [cargo, setCargo] = useState([]);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [provincia, setProvincia] = useState([]);
  const [canton, setCanton] = useState([]);
  const [parroquia, setParroquia] = useState([]);
  const [barrio, setBarrio] = useState([]);
  const [errorUbicacion, setErrorUbicacion] = useState("");

  useEffect(() => {
    fetchTipoEmpresa(enqueueSnackbar, setTipoEmpresa);
    fetchTipoContrato(enqueueSnackbar, setTipoContrato);
    fecthTipoSueldo(enqueueSnackbar, setTipoSueldo);
    fetchCognoTrabajocargo(enqueueSnackbar, setCargo);

    fetchProvincias(enqueueSnackbar, setProvincia);
  }, []);

  // Estado para manejar los valores de los campos
  const [formData, setFormData] = useState({
    empresa: data.NombreEmpresa || "",
    tipoEmpresa: data.idTipoEmpresa || 0,
	jefeInmediato: data.JefeInmediato || "",
	numeroJefe: data.CelularInmediato || "", 
    fechaIngreso: data.FechaIngresoEmpresa || "",
    ingresos: data.IngresosTrabajo || 0,
    gastos: data.EgresosTrabajo || 0,
    tipoContrato: data.idTipoContrato || 0,
    tipoSueldo: data.idTipoSueldo || 0,
    departamento: data.Departaento || "",
    cargo: data.idCargo || 0,
    diasPago: data.DiaPago || 0,
    afiliado: data.AfiliadoIESS || 1,
    provincia: data.idProvinciaTrabajo || 0,
    canton: data.idCantonTrabajo || 0,
    parroquia: data.idParroquiaTrabajo || 0,
    barrio: data.idBarrioTrabajo || 0,
    callePrincipal: data.CallePrincipalTrabajo || "",
    numeroCasa: data.NumeroCasaTrabajo || "",
    calleSecundaria: data.CalleSecundariaTrabajo || "",
    telefono: data.TelefonoTrabajo || "",
    ext: data.Ext || "",
    celular: data.CelularTrabajo || "",
    referenciaUbicacion: data.ReferenciaUbicacionTrabajo || "",
  });

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
  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState({});

  // Maneja el cambio de valor de los campos
  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;

    // Validación para campos de teléfono
  if (name === 'telefono' || name === 'celular' || name === 'numeroJefe') {
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

    if (name === "provincia") {
      setFormData((prev) => ({
        ...prev,
        provincia: value,
        canton: "",
        parroquia: "",
        barrio: "",
      }));
      if (value) {
        fetchCantones(value, enqueueSnackbar, setCanton);
      } else {
        setCanton([]);
        setParroquia([]);
        setBarrio([]);
      }
    } else if (name === "canton") {
      setFormData((prev) => ({
        ...prev,
        canton: value,
        parroquia: "",
        barrio: "",
      }));
      if (value) {
        fetchParroquias(value, enqueueSnackbar, setParroquia);
      } else {
        setParroquia([]);
        setBarrio([]);
      }
    } else if (name === "parroquia") {
      setFormData((prev) => ({
        ...prev,
        parroquia: value,
        barrio: "",
      }));
      if (value) {
        fetchBarrios(value, enqueueSnackbar, setBarrio);
      } else {
        setBarrio([]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleBlur = (e) => {
	const {name, value} = e.target;

	if (name === 'jefeInmediato' || name === 'callePrincipal' || name === 'callePrincipal' || name === 'calleSecundaria' || name === 'referenciaUbicacion') {
		if(value.length > 0 && value.length < 5){
			enqueueSnackbar("El nombre debe tener mínimo 5 caracteres", { variant: 'warning' });
		}
 	}

	if(name === 'numeroJefe' || name === 'telefono'){
		if(value.length < 9 || value.length > 10){
			enqueueSnackbar("Ingresa un número valido.", {variant: 'warning'})
		}
	}

	if(name === 'celular'){
		if(value.length < 10 || value.length > 10){
			enqueueSnackbar("El número debe tener 10 caracteres.", {variant: 'warning'})
		}
	}

  }

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

  const handleOpenModal = async() => {
    
    const camposBase = [
      { dataKey: "NombreEmpresa", formKey: "empresa" },
      { dataKey: "idTipoEmpresa", formKey: "tipoEmpresa" },
	  { dataKey: "JefeInmediato", formKey: "jefeInmediato"},
	  { dataKey: "CelularInmediato", formKey: "numeroJefe"},
      { dataKey: "FechaIngresoEmpresa", formKey: "fechaIngreso" },
      { dataKey: "IngresosTrabajo", formKey: "ingresos" },
      { dataKey: "EgresosTrabajo", formKey: "gastos" },
      { dataKey: "idTipoContrato", formKey: "tipoContrato" },
      { dataKey: "idTipoSueldo", formKey: "tipoSueldo" },
      { dataKey: "Departaento", formKey: "departamento" },
      { dataKey: "idCargo", formKey: "cargo" },
      { dataKey: "DiaPago", formKey: "diasPago" },
      { dataKey: "idProvinciaTrabajo", formKey: "provincia" },
      { dataKey: "idCantonTrabajo", formKey: "canton" },
      { dataKey: "idParroquiaTrabajo", formKey: "parroquia" },
      { dataKey: "idBarrioTrabajo", formKey: "barrio" },
      { dataKey: "CallePrincipalTrabajo", formKey: "callePrincipal" },
      { dataKey: "NumeroCasaTrabajo", formKey: "numeroCasa" },
      { dataKey: "CalleSecundariaTrabajo", formKey: "calleSecundaria" },
      { dataKey: "ReferenciaUbicacionTrabajo", formKey: "referenciaUbicacion" },
    ];

    // Verifica que estén guardados (en data)
    const camposInvalidos = camposBase.filter(
      ({ dataKey }) =>
        data[dataKey] === null ||
        data[dataKey] === undefined ||
        data[dataKey] === "" ||
        data[dataKey] === 0
    );

    // Verifica que estén llenos (en formData)
    const camposNoLlenados = camposBase.filter(
      ({ formKey }) =>
        formData[formKey] === null ||
        formData[formKey] === undefined ||
        formData[formKey] === "" ||
        formData[formKey] === 0
    );

    if ( camposNoLlenados.length > 0) {
      enqueueSnackbar(
        "Para seleccionar la ubicación del trabajo, primero debes llenar y guardar todos los campos requeridos.",
        { variant: "warning" }
      );
      return;
    }

	const validation = await fecthValidaDomicilio(data.idCre_SolicitudWeb, 2);
	if (!validation || !validation.exists || validation.count === 0) {
		enqueueSnackbar("No es posible guardar coordenadas porque no hay datos válidos en la solicitud.", {
			variant: 'error'
		});
		setUbicacionError("No existen coordenadas registradas para esta solicitud.");
		return;
	}

    setOpenLocationModal((prev) => !prev);
  };

  // Función de verificación para el teléfono o celular
  const handleVerify = (fieldName) => {
    console.log(`Verificando ${fieldName}: ${formData[fieldName]}`);
    // Aquí podrías agregar la lógica de verificación
  };

  // Función de validación de campos
  const validateForm = () => {
    const newErrors = {};
    let showSnackbar = false; // Esta variable controla si mostramos un snackbar

    if (!formData.empresa) {
      newErrors.empresa = "Este campo es obligatorio";
      if (!showSnackbar) {
        // Solo mostrar el snackbar si aún no se ha mostrado uno
        enqueueSnackbar("Por favor, ingresa el nombre de la empresa", {
          variant: "error",
        });
        showSnackbar = true; // Asegura que solo se muestre un snackbar
      }
    }

    if (
      !formData.tipoEmpresa ||
      formData.tipoEmpresa == 0 ||
      formData.tipoEmpresa == "Selecciona una opcion"
    ) {
      newErrors.tipoEmpresa = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona el tipo de empresa", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.fechaIngreso) {
      newErrors.fechaIngreso = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona la fecha de ingreso", {
          variant: "error",
        });
        showSnackbar = true;
      }
    } else {
      const fechaActual = new Date();
      const fechaIngreso = new Date(formData.fechaIngreso);
      if (isNaN(fechaIngreso.getTime()) || fechaIngreso > fechaActual) {
        newErrors.fechaIngreso = "Por favor, selecciona una fecha válida";
        if (!showSnackbar) {
          enqueueSnackbar(
            "La fecha de ingreso no puede ser futura o inválida",
            { variant: "error" }
          );
          showSnackbar = true;
        }
      }
    }

    if (!formData.ingresos) {
      newErrors.ingresos = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe los ingresos", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.gastos) {
      newErrors.gastos = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe los gastos", { variant: "error" });
        showSnackbar = true;
      }
    }
    if (
      !formData.tipoContrato ||
      formData.tipoContrato == 0 ||
      formData.tipoContrato == "Selecciona una opcion"
    ) {
      newErrors.tipoContrato = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona el tipo de contrato", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.tipoSueldo ||
      formData.tipoSueldo == 0 ||
      formData.tipoSueldo == "Selecciona una opcion"
    ) {
      newErrors.tipoSueldo = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona el tipo de sueldo", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.departamento) {
      newErrors.departamento = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe el departamento", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.cargo ||
      formData.cargo == 0 ||
      formData.cargo == "Selecciona una opcion"
    ) {
      newErrors.cargo = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe el cargo", { variant: "error" });
        showSnackbar = true;
      }
    }

    if (!formData.diasPago || formData.diasPago < 1 || formData.diasPago > 31) {
      newErrors.diasPago = "Debe estar entre 1 y 31";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe los días de pago entre 1 y 31", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.provincia ||
      formData.provincia == 0 ||
      formData.provincia == "Selecciona una opcion"
    ) {
      newErrors.provincia = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona la provincia", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.canton ||
      formData.canton == 0 ||
      formData.canton == "Selecciona una opcion"
    ) {
      newErrors.canton = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona el cantón", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.parroquia ||
      formData.parroquia == 0 ||
      formData.parroquia == "Selecciona una opcion"
    ) {
      newErrors.parroquia = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona la parroquia", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (
      !formData.barrio ||
      formData.barrio == 0 ||
      formData.barrio == "Selecciona una opcion"
    ) {
      newErrors.barrio = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, selecciona el barrio", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.callePrincipal) {
      newErrors.callePrincipal = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe la calle principal", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.numeroCasa) {
      newErrors.numeroCasa = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe el número de la casa", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.calleSecundaria) {
      newErrors.calleSecundaria = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe la calle secundaria", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    if (!formData.telefono && !formData.celular) {
      newErrors.telefono = "Debes proporcionar al menos un teléfono o celular";
      newErrors.celular = "Debes proporcionar al menos un teléfono o celular";
      if (!showSnackbar) {
        enqueueSnackbar(
          "Por favor, proporciona al menos un teléfono o celular",
          { variant: "error" }
        );
        showSnackbar = true;
      }
    }

    if (!formData.referenciaUbicacion) {
      newErrors.referenciaUbicacion = "Este campo es obligatorio";
      if (!showSnackbar) {
        enqueueSnackbar("Por favor, escribe la referencia de ubicación", {
          variant: "error",
        });
        showSnackbar = true;
      }
    }

    // Actualizamos los errores en el estado
    setErrors(newErrors);

    // Retorna si no hay errores en el formulario
    return Object.keys(newErrors).length === 0;
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Formulario enviado con éxito", formData);
    } else {
      console.log("Errores en el formulario", errors);
    }
  };

  useImperativeHandle(ref, () => ({
    validateForm,
    getFormData: () => formData,
  }));

  return (
    <div className="py-2 w-full">
      <form
        className="grid gap-4 grid-cols-1 md:grid-cols-4"
        onSubmit={handleSubmit}
      >
        <div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaBuilding className="mr-2 text-primaryBlue" />
            Empresa
          </label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
            readOnly={
              data.NombreEmpresa !== 0 &&
              data.NombreEmpresa !== null &&
              data.NombreEmpresa !== undefined
            } // Deshabilitar el campo de empresa
          />
          {errors.empresa && (
            <span className="text-red-500 text-xs">{errors.empresa}</span>
          )}
        </div>

        <div className="col-span-1">
			<label className={`text-xs font-medium mb-1 flex items-center ${formData.tipoEmpresa === "" ? 'text-red-500' : 'text-gray-500'}`}>
            <FaBriefcase className="mr-2 text-primaryBlue" />
            (*)Tipo Empresa
          </label>
          <SelectField
            // label="Tipo Empresa"
            // icon={<FaBriefcase />}
            value={formData.tipoEmpresa}
            onChange={handleInputChange}
            options={tipoEmpresa}
            name="tipoEmpresa"
            error={errors.tipoEmpresa}
          />
        </div>

		<div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.jefeInmediato.length < 5 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaCity className="mr-2 text-primaryBlue" />
            (*)Jefe Inmediato
          </label>
          <input
            type="text"
            name="jefeInmediato"
            value={formData.jefeInmediato}
            onChange={handleInputChange}
			onBlur={handleBlur}
            className="block w-full solcitudgrande-style"
          />
          {/* {errors.departamento && (
            <span className="text-red-500 text-xs">{errors.departamento}</span>
          )} */}
        </div>

		<div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.numeroJefe.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaHouseUser className="mr-2 text-primaryBlue" />
            (*)Número Jefe
          </label>
          <input
            type="number"
            name="numeroJefe"
            value={formData.numeroJefe}
            onChange={handleInputChange}
			onBlur={handleBlur}
            className="block w-full solcitudgrande-style"
          />
          {/* {errors.numeroCasa && (
            <span className="text-red-500 text-xs">{errors.numeroCasa}</span>
          )} */}
        </div>

        <div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaCalendarAlt className="mr-2 text-primaryBlue" />
            Fecha Ingreso
          </label>
          <input
            type="date"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
            readOnly={true} // Deshabilitar el campo de fecha
          />
          {errors.fechaIngreso && (
            <span className="text-red-500 text-xs">{errors.fechaIngreso}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMoneyBillWave className="mr-2 text-primaryBlue" />
            Ingresos
          </label>
          <input
            type="number"
            name="ingresos"
            value={formData.ingresos}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
            readOnly={
              data.IngresosTrabajo !== 0 &&
              data.IngresosTrabajo !== null &&
              data.IngresosTrabajo !== undefined
            } // Deshabilitar el campo de ingresos
          />
          {errors.ingresos && (
            <span className="text-red-500 text-xs">{errors.ingresos}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMoneyCheckAlt className="mr-2 text-primaryBlue" />
            Gastos
          </label>
          <input
            type="number"
            name="gastos"
            value={formData.gastos}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
            readOnly={
              data.EgresosTrabajo !== 0 &&
              data.EgresosTrabajo !== null &&
              data.EgresosTrabajo !== undefined
            } // Deshabilitar el campo de gastos
          />
          {errors.gastos && (
            <span className="text-red-500 text-xs">{errors.gastos}</span>
          )}
        </div>

        <div className="col-span-1">
			<label className={`text-xs font-medium mb-1 flex items-center ${formData.tipoContrato === "" ? 'text-red-500' : 'text-gray-500'}`}>
            <FaFileContract className="mr-2 text-primaryBlue" />
            (*)Tipo Contrato
          </label>
          <SelectField
            // label="Tipo Contrato"
            // icon={<FaFileContract />}
            value={formData.tipoContrato}
            onChange={handleInputChange}
            options={tipoContrato}
            name="tipoContrato"
            error={errors.tipoContrato}
          />
        </div>

        <div className="col-span-1">
			<label className={`text-xs font-medium mb-1 flex items-center ${formData.tipoSueldo === "" ? 'text-red-500' : 'text-gray-500'}`}>
            <FaDollarSign className="mr-2 text-primaryBlue" />
            (*)Tipo Sueldo
          </label>
          <SelectField
            // label="Tipo Sueldo"
            // icon={<FaDollarSign />}
            value={formData.tipoSueldo}
            onChange={handleInputChange}
            options={tipoSueldo}
            name="tipoSueldo"
            error={errors.tipoSueldo}
          />
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.departamento.length < 5 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaCity className="mr-2 text-primaryBlue" />
            (*)Departamento
          </label>
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.departamento && (
            <span className="text-red-500 text-xs">{errors.departamento}</span>
          )}
        </div>

		<div className="col-span-1 flex flex-col items-center">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaUserCheck className="mr-2 text-primaryBlue" />
            Afiliado IESS
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="afilado"
              checked={formData.afiliado}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={true} // Deshabilitar el checkbox
            />
            <span className="text-sm">Sí</span>
          </label>
          {errors.afilado && (
            <span className="text-red-500 text-xs mt-1">{errors.afilado}</span>
          )}
        </div>

        <div className="col-span-1">
			<label className={`text-xs font-medium mb-1 flex items-center ${formData.cargo === "" ? 'text-red-500' : 'text-gray-500'}`}>
            <FaUserTie className="mr-2 text-primaryBlue" />
            (*)Cargo
          </label>
          <SelectField
            // label="Cargo"
            // icon={<FaUserTie />}
            value={formData.cargo}
            onChange={handleInputChange}
            options={cargo}
            name="cargo"
            error={errors.cargo}
            readOnly={
              data.idCargo !== 0 &&
              data.idCargo !== null &&
              data.idCargo !== undefined
            } // Deshabilitar el campo de cargo
          />
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.diasPago < 1 || formData.diasPago < 0 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaClock className="mr-2 text-primaryBlue" />
            (*)Dias Pago
          </label>
          <input
            type="number"
            name="diasPago"
            value={formData.diasPago}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.diasPago && (
            <span className="text-red-500 text-xs">{errors.diasPago}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            (*)Provincia
          </label>
          <select
            name="provincia"
            value={formData.provincia}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="">Selecciona una opción</option>
            {provincia.map((prov) => (
              <option key={prov.value} value={prov.value}>
                {prov.label}
              </option>
            ))}
          </select>
          {errors.provincia && (
            <span className="text-red-500 text-xs">{errors.provincia}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            (*)Cantón
          </label>
          <select
            name="canton"
            value={formData.canton}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="">Selecciona una opción</option>
            {canton.map((prov) => (
              <option key={prov.value} value={prov.value}>
                {prov.label}
              </option>
            ))}
          </select>
          {errors.canton && (
            <span className="text-red-500 text-xs">{errors.canton}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.parroquia === "" ? 'text-red-500' : 'text-gray-500'}`}>
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            (*)Parroquia
          </label>
          <select
            name="parroquia"
            value={formData.parroquia}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="">Selecciona una opcion</option>
            {parroquia?.map((parroquia) => (
              <option key={parroquia.value} value={parroquia.value}>
                {parroquia.label}
              </option>
            ))}
          </select>
          {errors.parroquia && (
            <span className="text-red-500 text-xs">{errors.parroquia}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.barrio === "" ? 'text-red-500' : 'text-gray-500'}`}>
            <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
            (*)Barrio
          </label>
          <select
            name="barrio"
            value={formData.barrio}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          >
            <option value="">Selecciona una opcion</option>
            {barrio?.map((barrio) => (
              <option key={barrio?.value} value={barrio?.value}>
                {barrio?.label}
              </option>
            ))}
          </select>
          {errors.barrio && (
            <span className="text-red-500 text-xs">{errors.barrio}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.callePrincipal.length < 5 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaRoad className="mr-2 text-primaryBlue" />
            (*)Calle Principal
          </label>
          <input
            type="text"
            name="callePrincipal"
            value={formData.callePrincipal}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.callePrincipal && (
            <span className="text-red-500 text-xs">
              {errors.callePrincipal}
            </span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.numeroCasa.length < 3 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaHouseUser className="mr-2 text-primaryBlue" />
            (*)Numero casa
          </label>
          <input
            type="text"
            name="numeroCasa"
            value={formData.numeroCasa}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.numeroCasa && (
            <span className="text-red-500 text-xs">{errors.numeroCasa}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.calleSecundaria.length < 5 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaRoad className="mr-2 text-primaryBlue" />
            (*)Calle Secundaria
          </label>
          <input
            type="text"
            name="calleSecundaria"
            value={formData.calleSecundaria}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.calleSecundaria && (
            <span className="text-red-500 text-xs">
              {errors.calleSecundaria}
            </span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.telefono.length < 9 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaPhoneAlt className="mr-2 text-primaryBlue" />
            (*)Telefono
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="number"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
			  onBlur={handleBlur}
              className="block w-full solcitudgrande-style"
            />
          </div>
          {errors.telefono && (
            <span className="text-red-500 text-xs">{errors.telefono}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center`}>
            <FaPhone className="mr-2 text-primaryBlue" />
            Ext
          </label>
          <input
            type="text"
            name="ext"
            value={formData.ext}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
          />
          {errors.ext && (
            <span className="text-red-500 text-xs">{errors.ext}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.celular.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaMobileAlt className="mr-2 text-primaryBlue" />
            (*)Celular
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="number"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
			  onBlur={handleBlur}
              className="block w-full solcitudgrande-style"
              //readOnly={data.CelularTrabajo !== "" && data.CelularTrabajo !== null && data.CelularTrabajo !== undefined} // Deshabilitar el campo de celular
            />
          </div>
          {errors.celular && (
            <span className="text-red-500 text-xs">{errors.celular}</span>
          )}
        </div>

        <div className="col-span-1">
          <label className={`text-xs font-medium mb-1 flex items-center ${formData.referenciaUbicacion.length < 5 ? 'text-red-500' : 'text-gray-500'}`}>
            <FaMapPin className="mr-2 text-primaryBlue" />
            (*)Referencia Ubicacion
          </label>
          <input
            type="text"
            name="referenciaUbicacion"
            value={formData.referenciaUbicacion}
            onChange={handleInputChange}
            className="block w-full solcitudgrande-style"
            //readOnly={data.ReferenciaUbicacionTrabajo !== 0 && data.ReferenciaUbicacionTrabajo !== null && data.ReferenciaUbicacionTrabajo !== undefined} // Deshabilitar el campo de referencia
          />
          {errors.referenciaUbicacion && (
            <span className="text-red-500 text-xs">
              {errors.referenciaUbicacion}
            </span>
          )}
        </div>

        {clientInfo?.data.Laboral && (
          <div className="col-span-1">
            <label className="text-xs font-medium mb-1 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
              Ubicacion Trabajo
            </label>
            <button
              type="button"
              className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
              name="ubicacionDomicilio"
              onClick={() => handleOpenModal("ubicacionDomicilio")}
            >
              Ubicacion Trabajo
            </button>
          </div>
        )}
      </form>
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
    </div>
  );

});

export default SeccionB;
