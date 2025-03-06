import React, { useState, useEffect, forwardRef , useImperativeHandle} from "react";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";
import { enqueueSnackbar } from 'notistack';

// Definir el componente con forwardRef correctamente
export const FactoresCredito = forwardRef((props, ref) => {
  const [actividadLaboral, setActividadLaboral] = useState([]);

  useEffect(() => {
    fetchActividadLaboral();
  }, []);

  const fetchActividadLaboral = async () => {
    try {
      const response = await axios.get(APIURL.getActividadEconomina(), {
        headers: { method: "GET", cache: "no-store" },
      });
      setActividadLaboral(
        response.data.map((item) => ({
          value: item.idActEconomica,
          label: item.Nombre,
        }))
      );
    } catch (error) {
      console.error("Error al obtener actividad laboral", error);
      setActividadLaboral([]);
    }
  };

  const [formData, setFormData] = useState({
    tipo: "",
    tipoCliente: "",
    cuotaAsignada: "",
    estado: "",
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
      enqueueSnackbar('El tipo de actividad laboral es obligatorio', { variant: 'error' });
      return;
    }

    if (!formData.tipoCliente) {
      enqueueSnackbar('El tipo de cliente es obligatorio', { variant: 'error' });
      return;
    }

    if (!formData.cuotaAsignada || formData.cuotaAsignada <= 0) {
      enqueueSnackbar('La cuota asignada debe ser un número mayor a 0', { variant: 'error' });
      if(formData.cuotaAsignada > 10000000){
        enqueueSnackbar('La cuota asignada no puede ser mayor a 10000000', { variant: 'error' });
        return;
      }
      return;
    }

    if (!formData.cupo || formData.cupo <= 0) {
      enqueueSnackbar('El cupo debe ser un número mayor a 0', { variant: 'error' });
      if(formData.cupo > 10000000){
        enqueueSnackbar('El cupo no puede ser mayor a 10000000', { variant: 'error' });
        return;
      }
      return;
    }

    if (!formData.calificacion) {
      enqueueSnackbar('La calificación es obligatoria', { variant: 'error' });
      return;
    }

    if (!formData.estado) {
      enqueueSnackbar('El estado es obligatorio', { variant: 'error' });
      return;
    }

    if (!formData.estadoSolicitud) {
      enqueueSnackbar('El estado de la solicitud es obligatorio', { variant: 'error' });
      return;
    }

    if (!formData.observaciones) {
      enqueueSnackbar('Las observaciones son obligatorias', { variant: 'error' });
      return;
    }

    if (formData.observaciones.length > 300) {
      enqueueSnackbar('Las observaciones no deben exceder los 300 caracteres', { variant: 'error' });
      return;
    }


    // Si todas las validaciones pasan, mostramos el mensaje de éxito
    enqueueSnackbar('Formulario enviado con éxito', { variant: 'success' });
  };

  // Exponer la función handleSubmit al padre
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div>
      {/* Aquí agregamos el botón de impresión */}
      <div className="flex justify-between items-center mb-4 pt-4">
        <IconButton
          color="primary"
          aria-label="Imprimir"
          onClick={() => window.print()} // Función de impresión
        >
          <PrintIcon />
        </IconButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-0">
        {/* Tipo */}
        <div className="flex flex-col ">
          <label className="text-lightGrey text-xs mb-2">Tipo</label>
          <select
            name="tipo"
            className="p-2 border rounded "
            value={formData.tipo}
            onChange={handleChange}
          >
            <option value="">Seleccione una opción</option>
            {actividadLaboral.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo Cliente */}
        <div className="flex flex-col">
          <label className="text-lightGrey text-xs mb-2">Tipo Cliente</label>
          <select
            name="tipoCliente"
            className="p-2 border rounded"
            value={formData.tipoCliente}
            onChange={handleChange}
          >
            <option value="">Seleccione una opción</option>
            <option value="FORMAL">FORMAL</option>
            <option value="INFORMAL">INFORMAL</option>
          </select>
        </div>

        {/* Cuota Asignada */}
        <div className="flex flex-col w-full">
          <label className="text-lightGrey text-xs mb-2">Cuota Asignada</label>
          <input
            type="number"
            name="cuotaAsignada"
            placeholder="Cuota Asignada"
            className="p-2 border rounded"
            value={formData.cuotaAsignada}
            onChange={handleChange}
          />
        </div>

        {/* Cupo */}
        <div className="flex flex-col ">
          <label className="text-lightGrey text-xs mb-2">Cupo</label>
          <input
            type="number"
            name="cupo"
            placeholder="Cupo"
            className="p-2 border rounded w-full"
            value={formData.cupo}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Calificación */}
        <div className="flex flex-col">
          <label className="text-lightGrey text-xs mb-2">Calificación</label>
          <select
            name="calificacion"
            className="p-2 border rounded w-full"
            value={formData.calificacion}
            onChange={handleChange}
          >
            <option value="">Seleccione una opción</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-col w-full">
            <label className="text-lightGrey text-xs mb-2">Estado</label>
            <select
              name="estado"
              className="p-2 border rounded w-full"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="">Seleccione una opción</option>
              <option value="NEGADO">NEGADO</option>
              <option value="APROBADO">APROBADO</option>
            </select>
          </div>
        </div>

        {/* Estado Solicitud */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-col w-full">
            <label className="text-lightGrey text-xs mb-2">Estado Solicitud</label>
            <select
              name="estadoSolicitud"
              className="p-2 border rounded w-full"
              value={formData.estadoSolicitud}
              onChange={handleChange}
            >
              <option value="">Seleccione una opción</option>
              <option value="NEGADO">NEGADO</option>
              <option value="APROBADO">APROBADO</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col col-span-2 ">
        <label className="text-lightGrey text-xs mb-2">Observaciones</label>
        <textarea
          name="observaciones"
          placeholder="Observaciones"
          className="p-2 border rounded w-full"
          value={formData.observaciones}
          onChange={handleChange}
        />
      </div>
    </div>
  );
});

