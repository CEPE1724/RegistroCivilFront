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
import { FaListAlt, FaMoneyBillWave, FaMoneyCheckAlt,FaCommentDots } from "react-icons/fa";


// Definir el componente con forwardRef correctamente
export const FactoresCredito = forwardRef((props, ref) => {
  const { data } = props;
  console.log('factores de credito', data);
  const [tipo, setTipo] = useState([]);
  useEffect(() => {
    fetchTipoCliente();
  }, []);

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

  const [formData, setFormData] = useState({
    tipoCliente: data.idTipoCliente || 0,
    tipo: "",
    tipoTrabajo: "",
    cuotaAsignada: data.CuotaAsignada || 0,

    cupo: data.Cupo || 0,
    calificacion: "",
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
            value={data.idTipoCliente}
            onChange={handleChange}
            disabled
          >
            <option value="">Seleccione una opción</option>
            {tipo.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>




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

        <div className="flex justify-between items-center pl-8 pt-6">
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

      {/* 
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
      Observaciones */}
    </div>
  );

});
