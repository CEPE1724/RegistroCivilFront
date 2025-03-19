import React, { useState, useRef, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useImperativeHandle, forwardRef } from "react";
import { APIURL } from "../../../configApi/apiConfig";
import axios from "axios";
import { FaStoreAlt , FaMoneyCheckAlt , FaMapMarkerAlt,FaClock , FaMoneyBillWave ,
	FaRoad , FaHouseUser, FaMapPin , FaRulerCombined, FaIndustry,FaSlidersH   } from "react-icons/fa";

export const SeccionA = forwardRef((props, ref) => {
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [tiempoNegocio, setTiempoNegocio] = useState("");
  const [metros, setMetros] = useState("");
  const [ingresos, setIngresos] = useState("");
  const [gastos, setGastos] = useState("");
  const [provincia, setProvincia] = useState("");
  const [canton, setCanton] = useState("");
  const [parroquia, setParroquia] = useState("");
  const [barrio, setBarrio] = useState("");
  const [callePrincipal, setCallePrincipal] = useState("");
  const [numeroCasa, setNumeroCasa] = useState("");
  const [calleSecundaria, setCalleSecundaria] = useState("");
  const [referenciaUbicacion, setReferenciaUbicacion] = useState("");
  const [actividadNegocio, setActividadNegocio] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [idProvincia, setIdProvincia] = useState("");
  const [parroquias, setParroquias] = useState([]);
  const [idCanton, setIdCanton] = useState("");
  const [barrios, setBarrios] = useState([]);
  const [idParroquia, setIdParroquia] = useState("");


  useEffect(() => {
    // Cada vez que idProvincia cambie (ya sea que se seleccione o se deseleccione), resetear todos los valores
    setCantones([]);
    setParroquias([]);
    setBarrios([]);
    setIdCanton(""); // Limpiar canton
    setIdParroquia(""); // Limpiar parroquia
    setCanton(""); // Limpiar texto de canton
    setParroquia(""); // Limpiar texto de parroquia
    setBarrio(""); // Limpiar texto de barrio
  }, [idProvincia]);
  
  useEffect(() => {
    // Cada vez que idCanton cambie, resetear parroquias y barrios
    setParroquias([]);
    setBarrios([]);
    setIdParroquia(""); // Limpiar parroquia
    setParroquia(""); // Limpiar texto de parroquia
    setBarrio(""); // Limpiar texto de barrio
  }, [idCanton]);
  
  useEffect(() => {
    // Cada vez que idParroquia cambie, resetear barrios
    setBarrios([]);
    setBarrio(""); // Limpiar texto de barrio
  }, [idParroquia]);
  
  useEffect(() => {
    // Cargar provincias inicialmente
    fetchProvincias();
  }, []);
  
  useEffect(() => {
    if (idProvincia) {
      // Si hay provincia seleccionada, obtener los cantones
      fetchCantones(idProvincia);
    }
  }, [idProvincia]);
  
  useEffect(() => {
    if (idCanton) {
      // Si hay cantón seleccionado, obtener las parroquias
      fetchparroquias(idCanton);
    }
  }, [idCanton]);
  
  useEffect(() => {
    if (idParroquia) {
      // Si hay parroquia seleccionada, obtener los barrios
      fetchBarrios(idParroquia);
    }
  }, [idParroquia]);
  

  const fetchBarrios = async (idParroquia) => {
    try {
      const response = await axios.get(APIURL.getBarrios(idParroquia), {
        headers: { method: "GET", cache: "no-store" },
      });
      setBarrios(
        response.data.map((item) => ({
          idBarrio: item.idBarrio,
          label: item.Nombre,
        }))
      );
    } catch (error) {
      console.error("Error al obtener barrios", error);
      setBarrios([]);
    }
  };



  const fetchparroquias = async (idCanton) => {
    try {
      const response = await axios.get(APIURL.getParroquias(idCanton), {
        headers: { method: "GET", cache: "no-store" },
      });
      setParroquias(
        response.data.map((item) => ({
          idParroquia: item.idParroquia,
          label: item.Nombre,
        }))
      );
    } catch (error) {
      console.error("Error al obtener parroquias", error);
      setParroquias([]);
    }
  };

  const fetchProvincias = async () => {
    try {
      const response = await axios.get(APIURL.getProvincias(), {
        headers: { method: "GET", cache: "no-store" },
      });
      setProvincias(
        response.data.map((item) => ({
          idProvincia: item.idProvincia,
          label: item.Nombre,
        }))
      );
    } catch (error) {
      console.error("Error al obtener provincias", error);
      setProvincias([]);
    }
  };

  const fetchCantones = async (idProvincia) => {
    try {   
        const response = await axios.get(APIURL.getCantones(idProvincia), {
            headers: { method: "GET", cache: "no-store" },
            });
            setCantones(
                response.data.map((item) => ({
                    idCanton: item.idCanton,
                    label: item.Nombre,
                }))
            );
        } catch (error) {
            console.error("Error al obtener cantones", error);
            setCantones([]);
        }
    };

  const handleSubmit = (e) => {
    e && e.preventDefault();

    // Validaciones
    if (!nombreNegocio || nombreNegocio.length <= 3) {
      enqueueSnackbar("El nombre del negocio debe tener más de 3 caracteres", {
        variant: "error",
      });
      return;
    }

    if (!tiempoNegocio || tiempoNegocio <= 0 || tiempoNegocio > 100000000000) {
      enqueueSnackbar("El tiempo del negocio debe ser un número mayor a 0", {
        variant: "error",
      });
      return;
    }

    if (!metros || metros <= 0 || metros > 100000000000) {
      enqueueSnackbar("Los metros deben ser un número mayor a 0", {
        variant: "error",
      });
      return;
    }

    if (!ingresos || ingresos <= 0 || ingresos > 100000000000) {
      enqueueSnackbar("Los ingresos deben ser un número mayor a 0", {
        variant: "error",
      });
      return;
    }

    if (!gastos || gastos <= 0 || gastos > 100000000000) {
      enqueueSnackbar("Los gastos deben ser un número mayor a 0", {
        variant: "error",
      });
      return;
    }

    if (gastos > ingresos) {
      enqueueSnackbar("Los gastos no pueden ser mayores a los ingresos", {
        variant: "error",
      });
      return;
    }

    if (!provincia) {
      enqueueSnackbar("La provincia es obligatoria", { variant: "error" });
      return;
    }

    if (!canton) {
      enqueueSnackbar("El cantón es obligatorio", { variant: "error" });
      return;
    }

    if (!parroquia) {
      enqueueSnackbar("La parroquia es obligatoria", { variant: "error" });
      return;
    }

    if (!barrio) {
      enqueueSnackbar("El barrio es obligatorio", { variant: "error" });
      return;
    }

    if (barrio.length > 100) {
      enqueueSnackbar("El barrio no debe exceder los 100 caracteres", {
        variant: "error",
      });
      return;
    }

    if (!callePrincipal) {
      enqueueSnackbar("La calle principal es obligatoria", {
        variant: "error",
      });
      return;
    }

    if (callePrincipal.length > 100) {
      enqueueSnackbar("La calle principal no debe exceder los 100 caracteres", {
        variant: "error",
      });
      return;
    }

    if (!numeroCasa) {
      enqueueSnackbar("El número de casa es obligatorio", { variant: "error" });
      return;
    }

    if (!calleSecundaria) {
      enqueueSnackbar("La calle secundaria es obligatoria", {
        variant: "error",
      });
      return;
    }

    if (calleSecundaria.length > 100) {
      enqueueSnackbar(
        "La calle secundaria no debe exceder los 100 caracteres",
        { variant: "error" }
      );
      return;
    }

    if (!referenciaUbicacion) {
      enqueueSnackbar("La referencia de ubicación es obligatoria", {
        variant: "error",
      });
      return;
    }

    if (referenciaUbicacion.length > 300) {
      enqueueSnackbar(
        "La referencia de ubicación no debe exceder los 300 caracteres",
        { variant: "error" }
      );
      return;
    }

    if (!actividadNegocio) {
      enqueueSnackbar("La actividad del negocio es obligatoria", {
        variant: "error",
      });
      return;
    }

    if (actividadNegocio.length > 300) {
      enqueueSnackbar(
        "La actividad del negocio no debe exceder los 300 caracteres",
        { variant: "error" }
      );
      return;
    }

    // Si todas las validaciones pasan, mostramos el mensaje de éxito
    enqueueSnackbar("Formulario enviado con éxito", { variant: "success" });
  };

  useImperativeHandle(ref, () => ({
    handleSubmit, // Exponemos la función handleSubmit al padre
  }));

  return (
	<div className="p-6">
	  {/* Rejilla adaptable para responsive */}
	  <form onSubmit={handleSubmit}>
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
			  value={nombreNegocio}
			  onChange={(e) => setNombreNegocio(e.target.value.toUpperCase())}
			/>
		  </div>
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaClock className="mr-2 text-primaryBlue" />
			  Tiempo del Negocio
			</label>
			<input
			  type="number"
			  className="solcitudgrande-style"
			  value={tiempoNegocio}
			  onChange={(e) => {
				const value = parseFloat(e.target.value);
				if (value >= 0 || e.target.value === "") {
				  setTiempoNegocio(e.target.value);
				}
			  }}
			/>
		  </div>
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaRulerCombined className="mr-2 text-primaryBlue" />
			  Metros
			</label>
			<input
			  type="number"
			  className="solcitudgrande-style"
			  value={metros}
			  onChange={(e) => {
				const value = parseFloat(e.target.value);
				if (value >= 0 || e.target.value === "") {
				  setMetros(e.target.value);
				}
			  }}
			/>
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
			  value={ingresos}
			  onChange={(e) => {
				const value = parseFloat(e.target.value);
				if (value >= 0 || e.target.value === "") {
				  setIngresos(e.target.value);
				}
			  }}
			/>
		  </div>
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaMoneyCheckAlt className="mr-2 text-primaryBlue" />
			  Gastos
			</label>
			<input
			  type="number"
			  className="solcitudgrande-style"
			  value={gastos}
			  onChange={(e) => {
				const value = parseFloat(e.target.value);
				if (value >= 0 || e.target.value === "") {
				  setGastos(e.target.value);
				}
			  }}
			/>
		  </div>
  
		  {/* Segunda fila: Provincia, Cantón, Parroquia, Barrio */}
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
			  Provincia
			</label>
			<select
			  className="solcitudgrande-style"
			  value={idProvincia} // Usamos idProvincia en el value
			  onChange={(e) => {
				const idSeleccionada = e.target.value;
				// Guardamos el nombre de la provincia y actualizamos el id
				setProvincia(e.target.options[e.target.selectedIndex].text);
				setIdProvincia(idSeleccionada);
			  }}
			>
			  <option value="">Seleccione</option>
			  {provincias.map((prov) => (
				<option key={prov.idProvincia} value={prov.idProvincia}>
				  {prov.label}
				</option>
			  ))}
			</select>
		  </div>
  
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
			  Cantón
			</label>
			<select
			  className="solcitudgrande-style"
			  value={idCanton}
			  onChange={(e) => {
				const idSeleccionada = e.target.value;
				setCanton(e.target.options[e.target.selectedIndex].text);
				setIdCanton(idSeleccionada);
			  }}
			>
			  <option value="">Seleccione</option>
			  {cantones.map((canton) => (
				<option key={canton.idCanton} value={canton.idCanton}>
				  {canton.label}
				</option>
			  ))}
			</select>
		  </div>
  
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaMapMarkerAlt className="mr-2 text-primaryBlue" />
			  Parroquia
			</label>
			<select
			  className="solcitudgrande-style"
			  value={idParroquia}
			  onChange={(e) => {
				const idSeleccionada = e.target.value;
				setParroquia(e.target.options[e.target.selectedIndex].text);
				setIdParroquia(idSeleccionada);
			  }}
			>
			  <option>Seleccione</option>
			  {parroquias.map((parroquia) => (
				<option key={parroquia.idParroquia} value={parroquia.idParroquia}>
				  {parroquia.label}
				</option>
			  ))}
			</select>
		  </div>
		  <div>
			<div className="flex flex-col">
			  <label className="text-xs font-medium mb-1 flex items-center">
				<FaMapMarkerAlt className="mr-2 text-primaryBlue" />
				Barrio
			  </label>
			  <select
				className="solcitudgrande-style"
				value={barrio}
				onChange={(e) => setBarrio(e.target.value.toUpperCase())}
			  >
				<option>Seleccione</option>
				{barrios.map((barrio) => (
				  <option key={barrio.idBarrio} value={barrio.idBarrio}>
					{barrio.label}
				  </option>
				))}
			  </select>
			</div>
		  </div>
  
		  <div className="lg:col-span-1"></div>
  
		  {/* Tercera fila: Calle Principal, Número Casa, Calle Secundaria, Referencia Ubicación */}
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaRoad className="mr-2 text-primaryBlue" />
			  Calle Principal
			</label>
			<input
			  type="text"
			  className="solcitudgrande-style"
			  value={callePrincipal}
			  onChange={(e) => setCallePrincipal(e.target.value.toUpperCase())}
			/>
		  </div>
  
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaHouseUser className="mr-2 text-primaryBlue" />
			  Número Casa
			</label>
			<input
			  type="text"
			  className="solcitudgrande-style"
			  value={numeroCasa}
			  onChange={(e) => setNumeroCasa(e.target.value.toUpperCase())}
			/>
		  </div>
  
		  <div className="flex flex-col">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaRoad className="mr-2 text-primaryBlue" />
			  Calle Secundaria
			</label>
			<input
			  type="text"
			  className="solcitudgrande-style"
			  value={calleSecundaria}
			  onChange={(e) => setCalleSecundaria(e.target.value.toUpperCase())}
			/>
		  </div>
  
		  <div className="flex flex-col lg:col-span-2">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaMapPin className="mr-2 text-primaryBlue" />
			  Referencia Ubicación
			</label>
			<textarea
			  className="solcitudgrande-style h-20"
			  value={referenciaUbicacion}
			  onChange={(e) => setReferenciaUbicacion(e.target.value.toUpperCase())}
			></textarea>
		  </div>
  
		  {/* Cuarta fila: Actividad del Negocio y Opciones */}
		  <div className="flex flex-col lg:col-span-2">
			<label className="text-xs font-medium mb-1 flex items-center">
			  <FaIndustry className="mr-2 text-primaryBlue" />
			  Actividad del Negocio
			</label>
			<textarea
			  className="solcitudgrande-style h-20"
			  value={actividadNegocio}
			  onChange={(e) => setActividadNegocio(e.target.value.toUpperCase())}
			></textarea>
		  </div>
  
		  {/* Opciones */}
		  <div className="lg:col-span-2 flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-2 lg:space-y-0">
			<label className="text-xs font-medium flex items-center">
			  <FaSlidersH className="mr-2 text-primaryBlue" />
			  Opciones:
			</label>
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
	  </form>
	</div>
  );
  
});
