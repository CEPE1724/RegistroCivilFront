import React, { useState, useEffect } from "react";
import { APIURL } from "../../../configApi/apiConfig";
import { useSnackbar } from "notistack";
import axios from "axios";
import { FaCalendarAlt, FaMoneyCheckAlt , FaFileContract , FaCity , FaMapMarkerAlt, FaUserCheck ,
	FaPhoneAlt, FaDollarSign   ,FaClock , FaUserTie , FaMoneyBillWave , FaBriefcase , FaBuilding,
	FaRoad , FaHouseUser , FaPhone ,  FaMobileAlt, FaMapPin ,  } from "react-icons/fa";

export function SeccionB() {

	const { enqueueSnackbar } = useSnackbar();
	const [tipoEmpresa, setTipoEmpresa] = useState([]);
	const [tipoContrato, setTipoContrato] = useState([]);
	const [tipoSueldo, setTipoSueldo] = useState([]); 
	const [cargo, setCargo] = useState([]); 

	const [provincia, setProvincia] = useState([]);
	const [canton, setCanton] = useState([]);
	const [parroquia, setParroquia] = useState([]);
	const [barrio, setBarrio] = useState([]);

	const fetchTipoEmpresa = async ( enqueueSnackbar, setTipoEmpresa) => {
		try {
		  const response = await axios.get(APIURL.get_cre_tipoempresa(), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setTipoEmpresa(
			response.data.map((item) => ({
			  value: item.idTipoEmpresa,
			  label: item.Descripción,
			}))
		  );
		} catch (error) {
		  console.error("Error al obtener Tipo Empresa", error);
		  enqueueSnackbar("Error al cargar Tipo Empresa", {
			variant: "error",
			preventDuplicate: true,
		  });
		  setTipoEmpresa([]);
		}
	  };

	const fetchTipoContrato = async ( enqueueSnackbar, setTipoContrato) => {
		try {
		  const response = await axios.get(APIURL.get_tipocontrato(), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setTipoContrato(
			response.data.map((item) => ({
			  value: item.idTipoContrato,
			  label: item.Nombre,
			}))
		  );
		} catch (error) {
		  console.error("Error al obtener Tipo Contrato", error);
		  enqueueSnackbar("Error al cargar Tipo Contrato", {
			variant: "error",
			preventDuplicate: true,
		  });
		  setTipoContrato([]);
		}
	  };

	const fecthTipoSueldo = async ( enqueueSnackbar, setTipoSueldo) => {
		try {
		  const response = await axios.get(APIURL.get_cre_tiposueldo(), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setTipoSueldo(
			response.data.map((item) => ({
			  value: item.idTipoSueldo,
			  label: item.Nombre,
			}))
		  );
		} catch (error) {
		  console.error("Error al obtener Tipo Sueldo", error);
		  enqueueSnackbar("Error al cargar Tipo Sueldo", {
			variant: "error",
			preventDuplicate: true,
		  });
		  setTipoSueldo([]);
		}
	}

	const fetchCargo = async ( enqueueSnackbar, setCargo) => {
		try {
		  const response = await axios.get(APIURL.get_cre_cargo(), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setCargo(
			response.data.map((item) => ({
			  value: item.idCargo,
			  label: item.Nombre,
			}))
		  );
		} catch (error) {
		  console.error("Error al obtener Cargo", error);
		  enqueueSnackbar("Error al cargar Cargo", {
			variant: "error",
			preventDuplicate: true,
		  });
		  setCargo([]);

		}
	  };

	const fetchProvincias = async ( enqueueSnackbar, setProvincia) => {
		try {
		  const response = await axios.get(APIURL.getProvincias(), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setProvincia(
			response.data.map((item) => ({
			  value: item.idProvincia,
			  label: item.Nombre,
			}))
		  );
		  console.log(provincia);
		} catch (error) {
		  console.error("Error al obtener Provincia", error);
		  enqueueSnackbar("Error al cargar Provincia", {
			variant: "error",
			preventDuplicate: true,
		  });
		  setProvincia([]);
		}
	  };
	  
	  const fetchCantones = async (
		idProvincia,
		enqueueSnackbar,
		setCantones
	  ) => {
		try {
		  const response = await axios.get(APIURL.getCantones(idProvincia), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setCantones(
			response.data.map((item) => ({
			  value: item.idCanton,
			  label: item.Nombre,
			}))
		  );
		} catch (error) {
		  console.error("Error al obtener Canton", error);
		  enqueueSnackbar("Error al cargar Canton", {
			variant: "error",
			preventDuplicate: true,
		  });
		  setCantones([]);
		}
	  };
	  
	  const fetchParroquias = async (
		idCanton,
		enqueueSnackbar,
		setParroquias
	  ) => {
		try {
		  const response = await axios.get(APIURL.getParroquias(idCanton), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setParroquias(
			response.data.map((item) => ({
			  value: item.idParroquia,
			  label: item.Nombre,
			}))
		  );
		} catch (error) {
		  console.error("Error al obtener parroquias", error);
		  setParroquias([]);
		}
	  };
	  
	  const fetchBarrios = async (
		idParroquia,
		enqueueSnackbar,
		setBarrios
	  ) => {
		try {
		  const response = await axios.get(APIURL.getBarrios(idParroquia), {
			headers: { method: "GET", cache: "no-store" },
		  });
		  setBarrios(
			response.data.map((item) => ({
			  value: item.idBarrio,
			  label: item.Nombre,
			}))
		  );
		} catch (error) {
		  console.error("Error al obtener barrios", error);
		  setBarrios([]);
		}
	  };

	useEffect(() => {
		fetchTipoEmpresa(enqueueSnackbar, setTipoEmpresa);
		fetchTipoContrato(enqueueSnackbar, setTipoContrato);
		fecthTipoSueldo(enqueueSnackbar, setTipoSueldo);
		fetchCargo(enqueueSnackbar, setCargo);

		fetchProvincias(enqueueSnackbar, setProvincia);
	}, []);

  // Estado para manejar los valores de los campos
  const [formData, setFormData] = useState({
    empresa: "",
    tipoEmpresa: "",
    fechaIngreso: "",
    ingresos: "",
    gastos: "",
    tipoContrato: "",
    tipoSueldo: "",
    departamento: "",
    cargo: "",
    diasPago: "",
    afiliado: false,
    provincia: "",
    canton: "",
    parroquia: "",
    barrio: "",
    callePrincipal: "",
    numeroCasa: "",
    calleSecundaria: "",
    telefono: "",
    ext: "",
    celular: "",
    referenciaUbicacion: "",
  });

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState({});

  // Maneja el cambio de valor de los campos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "provincia") {
      setFormData((prev) => ({
        ...prev,
        provincia: value,
        canton: "",
        parroquia: "",
        barrio: "",
      }));
      if (value) {
        fetchCantones(value, enqueueSnackbar,setCanton);
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
        if (!showSnackbar) { // Solo mostrar el snackbar si aún no se ha mostrado uno
            enqueueSnackbar("Por favor, ingresa el nombre de la empresa", { variant: "error" });
            showSnackbar = true; // Asegura que solo se muestre un snackbar
        }
    }

    if (!formData.ingresos) {
        newErrors.ingresos = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe los ingresos", { variant: "error" });
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

    if (!formData.cargo) {
        newErrors.cargo = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe el cargo", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.diasPago) {
        newErrors.diasPago = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe los días de pago", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.provincia) {
        newErrors.provincia = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, selecciona la provincia", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.canton) {
        newErrors.canton = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, selecciona el cantón", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.parroquia) {
        newErrors.parroquia = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, selecciona la parroquia", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.barrio) {
        newErrors.barrio = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, selecciona el barrio", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.callePrincipal) {
        newErrors.callePrincipal = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe la calle principal", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.numeroCasa) {
        newErrors.numeroCasa = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe el número de la casa", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.calleSecundaria) {
        newErrors.calleSecundaria = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe la calle secundaria", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.telefono) {
        newErrors.telefono = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe el teléfono", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.celular) {
        newErrors.celular = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe el celular", { variant: "error" });
            showSnackbar = true;
        }
    }

    if (!formData.referenciaUbicacion) {
        newErrors.referenciaUbicacion = "Este campo es obligatorio";
        if (!showSnackbar) {
            enqueueSnackbar("Por favor, escribe la referencia de ubicación", { variant: "error" });
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

//   return (
//     <div className="py-2 w-full">
//       <form
//         className="grid gap-4 grid-cols-1 md:grid-cols-4"
//         onSubmit={handleSubmit}
//       >
//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Empresa</label>
//           <input
//             type="text"
//             name="empresa"
//             value={formData.empresa}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.empresa && (
//             <span className="text-red-500 text-xs">{errors.empresa}</span>
//           )}
//         </div>

// 		<div className="col-span-1">
//           <label className="block text-sm font-medium">Tipo Empresa</label>
//           <select
//             name="tipoEmpresa"
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="">Selecciona una opción</option>
//             {tipoEmpresa.map((prov) => (
//               <option key={prov.tipoEmpresa} value={prov.tipoEmpresa}>
//                 {prov.label}
//               </option>
//             ))}
//           </select>
//           {errors.tipoEmpresa && (
//             <span className="text-red-500 text-xs">{errors.provincia}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Fecha Ingreso</label>
//           <input
//             type="date"
//             name="fechaIngreso"
//             value={formData.fechaIngreso}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.fechaIngreso && (
//             <span className="text-red-500 text-xs">{errors.fechaIngreso}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Ingresos</label>
//           <input
//             type="number"
//             name="ingresos"
//             value={formData.ingresos}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.ingresos && (
//             <span className="text-red-500 text-xs">{errors.ingresos}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Gastos</label>
//           <input
//             type="number"
//             name="gastos"
//             value={formData.gastos}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.gastos && (
//             <span className="text-red-500 text-xs">{errors.gastos}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Tipo Contrato</label>
//           <select
//             name="tipoContrato"
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="">Selecciona una opción</option>
//             {tipoContrato.map((prov) => (
//               <option key={prov.tipoContrato} value={prov.tipoContrato}>
//                 {prov.label}
//               </option>
//             ))}
//           </select>
//           {errors.tipoContrato && (
//             <span className="text-red-500 text-xs">{errors.tipoContrato}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Tipo Sueldo</label>
//           <select
//             name="tipoSueldo"
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="">Selecciona una opción</option>
//             {tipoSueldo.map((prov) => (
//               <option key={prov.tipoSueldo} value={prov.tipoSueldo}>
//                 {prov.label}
//               </option>
//             ))}
//           </select>
//           {errors.tipoSueldo && (
//             <span className="text-red-500 text-xs">{errors.tipoSueldo}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Departamento</label>
//           <input
//             type="text"
//             name="departamento"
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.departamento && (
//             <span className="text-red-500 text-xs">{errors.departamento}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Cargo</label>
//           <select
//             name="cargo"
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="">Selecciona una opción</option>
//             {cargo.map((prov) => (
//               <option key={prov.cargo} value={prov.cargo}>
//                 {prov.label}
//               </option>
//             ))}
//           </select>
//           {errors.cargo && (
//             <span className="text-red-500 text-xs">{errors.cargo}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Dias Pago</label>
//           <input
//             type="number"
//             name="diasPago"
//             value={formData.diasPago}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.diasPago && (
//             <span className="text-red-500 text-xs">{errors.diasPago}</span>
//           )}
//         </div>

//         <div className="col-span-1 flex flex-col items-center">
//           <label className="text-sm font-medium mb-2">Afiliado IESS</label>
//           <label className="flex items-center space-x-2 cursor-pointer">
//             <input
//               type="checkbox"
//               name="afilado"
//               checked={formData.afilado}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-sm">Sí</span>
//           </label>
//           {errors.afilado && (
//             <span className="text-red-500 text-xs mt-1">{errors.afilado}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Provincia</label>
//           <select
//             name="provincia"
//             // value={formData.provincia}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="">Selecciona una opción</option>
//             {/* El valor vacío indica que no se ha seleccionado una opción */}
//             {provincia.map((prov) => (
//               <option key={prov.value} value={prov.value}>
//                 {prov.label}
//               </option>
//             ))}
//           </select>
//           {errors.provincia && (
//             <span className="text-red-500 text-xs">{errors.provincia}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Provincia</label>
//           <select
//             name="canton"
//             value={formData.canton}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="">Selecciona una opción</option>
//             {/* El valor vacío indica que no se ha seleccionado una opción */}
//             {canton.map((prov) => (
//               <option key={prov.value} value={prov.value}>
//                 {prov.label}
//               </option>
//             ))}
//           </select>
//           {errors.canton && (
//             <span className="text-red-500 text-xs">{errors.canton}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Parroquia</label>
//           <select
//             name="parroquia"
//             value={formData.parroquia}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="Selecciona una opcion">Selecciona una opcion</option>
//             {parroquia?.map((parroquia) => (
//               <option key={parroquia.value} value={parroquia.value}>
//                 {parroquia.label}
//               </option>
//             ))}
//           </select>
//           {errors.parroquia && (
//             <span className="text-red-500 text-xs">{errors.parroquia}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Barrio</label>
//           <select
//             name="barrio"
//             value={formData.barrio}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           >
//             <option value="Selecciona una opcion">Selecciona una opcion</option>
//             {barrio?.map((barrio) => (
//               <option key={barrio?.value} value={barrio?.value}>
//                 {barrio?.label}
//               </option>
//             ))}
//           </select>
//           {errors.barrio && (
//             <span className="text-red-500 text-xs">{errors.barrio}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Calle Principal</label>
//           <input
//             type="text"
//             name="callePrincipal"
//             value={formData.callePrincipal}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.callePrincipal && (
//             <span className="text-red-500 text-xs">
//               {errors.callePrincipal}
//             </span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Numero casa</label>
//           <input
//             type="text"
//             name="numeroCasa"
//             value={formData.numeroCasa}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.numeroCasa && (
//             <span className="text-red-500 text-xs">{errors.numeroCasa}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Calle Secundaria</label>
//           <input
//             type="text"
//             name="calleSecundaria"
//             value={formData.calleSecundaria}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.calleSecundaria && (
//             <span className="text-red-500 text-xs">
//               {errors.calleSecundaria}
//             </span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Telefono</label>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//             <input
//               type="text"
//               name="telefono"
//               value={formData.telefono}
//               onChange={handleInputChange}
//               className="block w-full solcitudgrande-style"
//             />
//             <button
//               type="button"
//               onClick={() => handleVerify("telefono")}
//               className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
//             >
//               <span className="text-xs">verificar</span>
//             </button>
//           </div>
//           {errors.telefono && (
//             <span className="text-red-500 text-xs">{errors.telefono}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Ext</label>
//           <input
//             type="text"
//             name="ext"
//             value={formData.ext}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.ext && (
//             <span className="text-red-500 text-xs">{errors.ext}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">Celular</label>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//             <input
//               type="text"
//               name="celular"
//               value={formData.celular}
//               onChange={handleInputChange}
//               className="block w-full solcitudgrande-style"
//             />
//             <button
//               type="button"
//               onClick={() => handleVerify("celular")}
//               className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
//             >
//               <span className="text-xs">verificar</span>
//             </button>
//           </div>
//           {errors.celular && (
//             <span className="text-red-500 text-xs">{errors.celular}</span>
//           )}
//         </div>

//         <div className="col-span-1">
//           <label className="block text-sm font-medium">
//             Referencia Ubicacion
//           </label>
//           <input
//             type="text"
//             name="referenciaUbicacion"
//             value={formData.referenciaUbicacion}
//             onChange={handleInputChange}
//             className="block w-full solcitudgrande-style"
//           />
//           {errors.referenciaUbicacion && (
//             <span className="text-red-500 text-xs">
//               {errors.referenciaUbicacion}
//             </span>
//           )}
//         </div>

//         <div className="col-span-1 md:col-span-4">
//           <button
//             type="submit"
//             className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
//           >
//             Enviar
//           </button>
//         </div>
//       </form>
//     </div>
//   );

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
		  />
		  {errors.empresa && (
			<span className="text-red-500 text-xs">{errors.empresa}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaBriefcase className="mr-2 text-primaryBlue" />
			Tipo Empresa
		  </label>
		  <select
			name="tipoEmpresa"
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  >
			<option value="">Selecciona una opción</option>
			{tipoEmpresa.map((prov) => (
			  <option key={prov.tipoEmpresa} value={prov.tipoEmpresa}>
				{prov.label}
			  </option>
			))}
		  </select>
		  {errors.tipoEmpresa && (
			<span className="text-red-500 text-xs">{errors.provincia}</span>
		  )}
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
		  />
		  {errors.gastos && (
			<span className="text-red-500 text-xs">{errors.gastos}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaFileContract className="mr-2 text-primaryBlue" />
			Tipo Contrato
		  </label>
		  <select
			name="tipoContrato"
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  >
			<option value="">Selecciona una opción</option>
			{tipoContrato.map((prov) => (
			  <option key={prov.tipoContrato} value={prov.tipoContrato}>
				{prov.label}
			  </option>
			))}
		  </select>
		  {errors.tipoContrato && (
			<span className="text-red-500 text-xs">{errors.tipoContrato}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaDollarSign className="mr-2 text-primaryBlue" />
			Tipo Sueldo
		  </label>
		  <select
			name="tipoSueldo"
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  >
			<option value="">Selecciona una opción</option>
			{tipoSueldo.map((prov) => (
			  <option key={prov.tipoSueldo} value={prov.tipoSueldo}>
				{prov.label}
			  </option>
			))}
		  </select>
		  {errors.tipoSueldo && (
			<span className="text-red-500 text-xs">{errors.tipoSueldo}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaCity className="mr-2 text-primaryBlue" />
			Departamento
		  </label>
		  <input
			type="text"
			name="departamento"
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  />
		  {errors.departamento && (
			<span className="text-red-500 text-xs">{errors.departamento}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaUserTie className="mr-2 text-primaryBlue" />
			Cargo
		  </label>
		  <select
			name="cargo"
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  >
			<option value="">Selecciona una opción</option>
			{cargo.map((prov) => (
			  <option key={prov.cargo} value={prov.cargo}>
				{prov.label}
			  </option>
			))}
		  </select>
		  {errors.cargo && (
			<span className="text-red-500 text-xs">{errors.cargo}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaClock className="mr-2 text-primaryBlue" />
			Dias Pago
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
  
		<div className="col-span-1 flex flex-col items-center">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaUserCheck className="mr-2 text-primaryBlue" />
			Afiliado IESS
		  </label>
		  <label className="flex items-center space-x-2 cursor-pointer">
			<input
			  type="checkbox"
			  name="afilado"
			  checked={formData.afilado}
			  onChange={handleInputChange}
			  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
			/>
			<span className="text-sm">Sí</span>
		  </label>
		  {errors.afilado && (
			<span className="text-red-500 text-xs mt-1">{errors.afilado}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaMapMarkerAlt className="mr-2 text-primaryBlue" />
			Provincia
		  </label>
		  <select
			name="provincia"
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
			Provincia
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
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaMapMarkerAlt className="mr-2 text-primaryBlue" />
			Parroquia
		  </label>
		  <select
			name="parroquia"
			value={formData.parroquia}
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  >
			<option value="Selecciona una opcion">Selecciona una opcion</option>
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
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaMapMarkerAlt className="mr-2 text-primaryBlue" />
			Barrio
		  </label>
		  <select
			name="barrio"
			value={formData.barrio}
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  >
			<option value="Selecciona una opcion">Selecciona una opcion</option>
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
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaRoad className="mr-2 text-primaryBlue" />
			Calle Principal
		  </label>
		  <input
			type="text"
			name="callePrincipal"
			value={formData.callePrincipal}
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  />
		  {errors.callePrincipal && (
			<span className="text-red-500 text-xs">{errors.callePrincipal}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaHouseUser className="mr-2 text-primaryBlue" />
			Numero casa
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
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaRoad className="mr-2 text-primaryBlue" />
			Calle Secundaria
		  </label>
		  <input
			type="text"
			name="calleSecundaria"
			value={formData.calleSecundaria}
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  />
		  {errors.calleSecundaria && (
			<span className="text-red-500 text-xs">{errors.calleSecundaria}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaPhoneAlt className="mr-2 text-primaryBlue" />
			Telefono
		  </label>
		  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
			<input
			  type="text"
			  name="telefono"
			  value={formData.telefono}
			  onChange={handleInputChange}
			  className="block w-full solcitudgrande-style"
			/>
			<button
			  type="button"
			  onClick={() => handleVerify("telefono")}
			  className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
			>
			  <span className="text-xs">verificar</span>
			</button>
		  </div>
		  {errors.telefono && (
			<span className="text-red-500 text-xs">{errors.telefono}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
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
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaMobileAlt className="mr-2 text-primaryBlue" />
			Celular
		  </label>
		  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
			<input
			  type="text"
			  name="celular"
			  value={formData.celular}
			  onChange={handleInputChange}
			  className="block w-full solcitudgrande-style"
			/>
			<button
			  type="button"
			  onClick={() => handleVerify("celular")}
			  className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
			>
			  <span className="text-xs">verificar</span>
			</button>
		  </div>
		  {errors.celular && (
			<span className="text-red-500 text-xs">{errors.celular}</span>
		  )}
		</div>
  
		<div className="col-span-1">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaMapPin className="mr-2 text-primaryBlue" />
			Referencia Ubicacion
		  </label>
		  <input
			type="text"
			name="referenciaUbicacion"
			value={formData.referenciaUbicacion}
			onChange={handleInputChange}
			className="block w-full solcitudgrande-style"
		  />
		  {errors.referenciaUbicacion && (
			<span className="text-red-500 text-xs">{errors.referenciaUbicacion}</span>
		  )}
		</div>
  
		<div className="col-span-1 md:col-span-4">
		  <button
			type="submit"
			className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5"
		  >
			Enviar
		  </button>
		</div>
	  </form>
	</div>
  );
  
}
