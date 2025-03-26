import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";
import { enqueueSnackbar } from "notistack";
import { FaListAlt ,FaUser, FaBriefcase ,FaMoneyBillWave ,FaMoneyCheckAlt ,
	FaStarHalfAlt ,FaCheckCircle,FaInfoCircle  ,FaCommentDots
} from "react-icons/fa";


// Definir el componente con forwardRef correctamente
export const FactoresCredito = forwardRef((props, ref) => {
  const { data } = props;
  console.log('factores de credito',data);
  const [tipo, setTipo] = useState([]);
  const [tipoCliente, setTipoCliente] = useState([]);
  const [tipoTrabajo, setTipoTrabajo] = useState([]);
  const [calificacion, setCalificacion] = useState([]);
  const [estado, setEstado] = useState([]);
  const [estadoSolicitud, setEstadoSolicitud] = useState([]);
  const [idEstado, setIdEstado] = useState("");
  useEffect(() => {
    fetchTipoCliente();
    fetchDetalleTipoCliente();
    fetchTipoTrabajo();
    fetchCalificacion();
    fetchEstado();
  }, []);

  useEffect(() => {
    if (idEstado) {
      setEstadoSolicitud([]); // Limpiar estado antes de realizar la solicitud
      fetchEstadoSolicitud(idEstado); // Hacer la solicitud con el nuevo idEstado
    } else {
      setEstadoSolicitud([]); // Si no hay idEstado, limpiar el estado
    }
  }, [idEstado]);
  const fetchTipoCliente = async () => {
    try {
      const response = await axios.get(APIURL.getTipoCliente());
      if (response.status === 200) {
        setTipo(
          response.data.map((item) => ({
            value: item.idTipoCliente,
            label: item.Nombre,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener el tipo de cliente:", error);
      enqueueSnackbar("No se pudo cargar los tipos de clientes", {
        variant: "error",
      });
      //  setTipo([]);
    }
  };

  const fetchTipoTrabajo = async () => {
    try {
      const response = await axios.get(APIURL.getTipoTrabajo());
      if (response.status === 200) {
        setTipoTrabajo(
          response.data.map((item) => ({
            value: item.idTipoTrabajo,
            label: item.Tipo,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener el tipo de trabajo:", error);
      enqueueSnackbar("No se pudo cargar los tipos de trabajo", {
        variant: "error",
      });
      // setTipoTrabajo([]);
    }
  };

  const fetchDetalleTipoCliente = async () => {
    try {
      const response = await axios.get(APIURL.getDetalleTipoCliente());
      if (response.status === 200) {
        setTipoCliente(
          response.data.map((item) => ({
            value: item.idDetalleTipoCliente,
            label: item.Nombre,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener el detalle del tipo de cliente:", error);
      enqueueSnackbar(
        "No se pudo cargar los detalles de los tipos de clientes",
        { variant: "error" }
      );
      // setTipoCliente([]);
    }
  };

  const fetchEstado = async () => {
    try {
      const response = await axios.get(APIURL.getEstado());
      if (response.status === 200) {
        setEstado(
          response.data.map((item) => ({
            value: item.idEstado,
            label: item.Estado,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener el estado:", error);
      enqueueSnackbar("No se pudo cargar los estados", { variant: "error" });
      // setEstado([]);
    }
  };

  const fetchEstadoSolicitud = async (idEstado) => {
    try {
      const response = await axios.get(APIURL.getEstadoSolicitud(idEstado));
      if (response.status === 200) {
        setEstadoSolicitud(
          response.data.map((item) => ({
            value: item.idNegadoPendiente,
            label: item.Nombre,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener el estado de la solicitud:", error);
      enqueueSnackbar("No se pudo cargar los estados de la solicitud", {
        variant: "error",
      });
      // setEstadoSolicitud([]);
    }
  };

  const fetchCalificacion = async () => {
    try {
      const response = await axios.get(APIURL.getCalificacion());
      if (response.status === 200) {
        setCalificacion(
          response.data.map((item) => ({
            value: item.idTipoCalificacion,
            label: item.Nombre,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener la calificación:", error);
      enqueueSnackbar("No se pudo cargar las calificaciones", {
        variant: "error",
      });
      // setCalificacion([]);
    }
  };

  const [formData, setFormData] = useState({
    tipoCliente: "",
    tipo: "",
    tipoTrabajo: "",
    cuotaAsignada: "",

    cupo: "",
    calificacion: "",
    tipoTrabajo: "",
    estadoSolicitud: "",
    observaciones: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();

    // Validaciones
    if (!formData.tipo) {
      enqueueSnackbar("El tipo de actividad laboral es obligatorio", {
        variant: "error",
      });
      return;
    }

    if (!formData.tipoCliente) {
      enqueueSnackbar("El tipo de cliente es obligatorio", {
        variant: "error",
      });
      return;
    }

    if (!formData.tipoTrabajo) {
      enqueueSnackbar("El tipo de trabajo es obligatorio", {
        variant: "error",
      });
      return;
    }

    if (!formData.cuotaAsignada || formData.cuotaAsignada <= 0) {
      enqueueSnackbar("La cuota asignada debe ser un número mayor a 0", {
        variant: "error",
      });
      if (formData.cuotaAsignada > 10000000) {
        enqueueSnackbar("La cuota asignada no puede ser mayor a 10000000", {
          variant: "error",
        });
        return;
      }
      return;
    }

    if (!formData.cupo || formData.cupo <= 0) {
      enqueueSnackbar("El cupo debe ser un número mayor a 0", {
        variant: "error",
      });
      if (formData.cupo > 10000000) {
        enqueueSnackbar("El cupo no puede ser mayor a 10000000", {
          variant: "error",
        });
        return;
      }
      return;
    }

    if (!formData.calificacion) {
      enqueueSnackbar("La calificación es obligatoria", { variant: "error" });
      return;
    }

    if (!formData.estado) {
      enqueueSnackbar("El estado es obligatorio", { variant: "error" });
      return;
    }

    if (!formData.estadoSolicitud) {
      enqueueSnackbar("El estado de la solicitud es obligatorio", {
        variant: "error",
      });
      return;
    }

    if (!formData.observaciones) {
      enqueueSnackbar("Las observaciones son obligatorias", {
        variant: "error",
      });
      return;
    }

    if (formData.observaciones.length > 300) {
      enqueueSnackbar("Las observaciones no deben exceder los 300 caracteres", {
        variant: "error",
      });
      return;
    }




    // Si todas las validaciones pasan, mostramos el mensaje de éxito
    enqueueSnackbar("Formulario enviado con éxito", { variant: "success" });
  };

  // Exponer la función handleSubmit al padre
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
	<div>
	  {/* Botón de impresión y selects superiores */}
	  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-0">
		{/* Tipo */}
		<div className="flex flex-col">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaListAlt className="mr-2 text-primaryBlue" />
			Tipo
		  </label>
		  <select
			name="tipo"
			className="solcitudgrande-style"
			value={formData.tipo}
			onChange={handleChange}
		  >
			<option value="">Seleccione una opción</option>
			{tipo.map((item) => (
			  <option key={item.value} value={item.value}>
				{item.label}
			  </option>
			))}
		  </select>
		</div>
  
		{/* Tipo Cliente */}
		<div className="flex flex-col">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaUser className="mr-2 text-primaryBlue" />
			Tipo Cliente
		  </label>
		  <select
			name="tipoCliente"
			className="solcitudgrande-style"
			value={formData.tipoCliente}
			onChange={handleChange}
		  >
			<option value="">Seleccione una opción</option>
			{tipoCliente.map((item) => (
			  <option key={item.value} value={item.value}>
				{item.label}
			  </option>
			))}
		  </select>
		</div>
  
		{/* Tipo Trabajo */}
		<div className="flex flex-col">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaBriefcase className="mr-2 text-primaryBlue" />
			Tipo Trabajo
		  </label>
		  <select
			name="tipoTrabajo"
			className="solcitudgrande-style"
			value={formData.tipoTrabajo}
			onChange={handleChange}
		  >
			<option value="">Seleccione una opción</option>
			{tipoTrabajo.map((item) => (
			  <option key={item.value} value={item.value}>
				{item.label}
			  </option>
			))}
		  </select>
		</div>
  
		<div className="lg:col-span-1"></div>
  
		{/* Cuota Asignada */}
		<div className="flex flex-col w-full">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaMoneyBillWave className="mr-2 text-primaryBlue" />
			Cuota Asignada
		  </label>
		  <input
			type="number"
			name="cuotaAsignada"
			placeholder="Cuota Asignada"
			className="solcitudgrande-style"
			value={formData.cuotaAsignada}
			onChange={handleChange}
		  />
		</div>
  
		{/* Cupo */}
		<div className="flex flex-col">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaMoneyCheckAlt className="mr-2 text-primaryBlue" />
			Cupo
		  </label>
		  <input
			type="number"
			name="cupo"
			placeholder="Cupo"
			className="solcitudgrande-style"
			value={formData.cupo}
			onChange={handleChange}
		  />
		</div>
  
		<div className="flex justify-between items-center pl-8 mb-4 pt-6">
		  <IconButton
			color="primary"
			aria-label="Imprimir"
			onClick={() => window.print()} 
			style={{ fontSize: '40px' }}
		  >
			<PrintIcon />
		  </IconButton>
		</div>
	  </div>
  
	  {/* Segunda sección: Calificación, Estado y Estado Solicitud */}
	  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
		{/* Calificación */}
		<div className="flex flex-col">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaStarHalfAlt className="mr-2 text-primaryBlue" />
			Calificación
		  </label>
		  <select
			name="calificacion"
			className="solcitudgrande-style w-full"
			value={formData.calificacion}
			onChange={handleChange}
		  >
			<option value="">Seleccione una opción</option>
			{calificacion.map((item) => (
			  <option key={item.value} value={item.value}>
				{item.label}
			  </option>
			))}
		  </select>
		</div>
  
		{/* Estado */}
		<div className="flex flex-col w-full">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaCheckCircle className="mr-2 text-primaryBlue" />
			Estado
		  </label>
		  <select
			name="estado"
			className="solcitudgrande-style w-full"
			value={formData.estado}
			onChange={(e) => {
			  const idSeleccionada = e.target.value;
			  setFormData((prev) => ({ ...prev, estado: idSeleccionada }));
			  setIdEstado(idSeleccionada);
			}}
		  >
			<option value="">Seleccione una opción</option>
			{estado.map((item) => (
			  <option key={item.value} value={item.value}>
				{item.label}
			  </option>
			))}
		  </select>
		</div>
  
		{/* Estado Solicitud */}
		<div className="flex flex-col w-full">
		  <label className="text-xs font-medium mb-1 flex items-center">
			<FaInfoCircle className="mr-2 text-primaryBlue" />
			Estado Solicitud
		  </label>
		  <select
			name="estadoSolicitud"
			className="solcitudgrande-style w-full"
			value={formData.estadoSolicitud}
			onChange={handleChange}
		  >
			<option value="">Seleccione una opción</option>
			{estadoSolicitud.map((item) => (
			  <option key={item.value} value={item.value}>
				{item.label}
			  </option>
			))}
		  </select>
		</div>
	  </div>
  
	  {/* Observaciones */}
	  <div className="flex flex-col">
		<label className="text-xs font-medium mb-1 flex items-center">
		  <FaCommentDots className="mr-2 text-primaryBlue" />
		  Observaciones
		</label>
		<textarea
		  name="observaciones"
		  placeholder="Observaciones"
		  className="solcitudgrande-style w-full"
		  value={formData.observaciones}
		  onChange={handleChange}
		/>
	  </div>
	</div>
  );
  
});
