import React, { useState, useEffect } from "react";
import axios from "axios";
import { APIURL } from "../../configApi/apiConfig";
import { useSnackbar } from "notistack";

export default function VerificacionTerrenaModal({
  isOpen,           // Booleano: ¿modal abierto?
  onClose,          // Función para cerrar el modal
  userSolicitudData,
  userData,
  tipoSeleccionado,
  data
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [verificador, setVerificador] = useState("");
  const [verificadores, setVerificadores] = useState([]);
  const [tipoVerificacion, setTipoVerificacion] = useState(null); // 'domicilio' o 'trabajo'


  const isFormValid = tipoVerificacion && verificador;

  console.log(userSolicitudData.id, "es el id de la solicutd ")

  useEffect(() => {
    if (isOpen) {
      setTipoVerificacion(tipoSeleccionado);
      setVerificador("");
    }
  }, [isOpen, tipoSeleccionado]);

  const handleTipoVerificacion = (tipo) => {
    setTipoVerificacion((prev) => (prev === tipo ? null : tipo));
  };

  const resetForm = () => {
    setVerificador("");
    setTipoVerificacion(null);
  };

  const handleCancelar = () => {
    resetForm();
    onClose(); // Cierra el modal
  };

  const handleAceptar = async () => {
    if (!isFormValid) return;

    const payload = {
      idCre_solicitud: userSolicitudData?.id,
      idVerificador: verificador,
      bDomicilio: tipoVerificacion === "domicilio",
      bTrabajo: tipoVerificacion === "trabajo",
      Usuario: userData?.Usuario,
      Web: 1
    };

    try {
      await axios.post(APIURL.post_clientesVerificacionTerrenaBasica(), payload);
      enqueueSnackbar("Verificación registrada correctamente", { variant: "success" });
      resetForm();
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("❌ Error al enviar verificación:", error);
      enqueueSnackbar("Error al registrar la verificación", { variant: "error" });
    }


    if (tipoVerificacion === "domicilio") {
      patchSolicitud(userSolicitudData.id, "domicilio");
    } else if (tipoVerificacion === "trabajo") {
      patchSolicitud(userSolicitudData.id, "trabajo");
    }


  };



  const patchSolicitud = async (idSolicitud, tipo) => {
    try {
      const estado = tipo === "domicilio"
        ? { idEstadoVerificacionDomicilio: 1 } // Actualiza para "domicilio"
        : { idEstadoVerificacionTrabajo: 1 };  // Actualiza para "trabajo"

      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        estado,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response data:", response.data); // Log the response data
      if (response.data) {
        enqueueSnackbar("Solicitud actualizada correctamente.", { variant: "success" });
      }
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      enqueueSnackbar("Error al actualizar la solicitud.", { variant: "error" });
    }
  };


  useEffect(() => {
    const fetchVerificadores = async () => {
      try {
        const response = await fetch(APIURL.get_ingresoCobrador());
        if (!response.ok) throw new Error("Error al obtener verificadores");
        const data = await response.json();
        setVerificadores(data);
      } catch (error) {
        console.error("❌ Error al cargar verificadores:", error);
        enqueueSnackbar("Error al cargar verificadores", { variant: "error" });
      }
    };

    if (isOpen) fetchVerificadores();
  }, [isOpen, enqueueSnackbar]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-6">

        {/* Número de solicitud destacado */}
        <div className="bg-gray-100 p-3 rounded-lg shadow-md text-center">
          <h3 className="text-gray-700 text-sm">Número de Solicitud</h3>
          <p className="text-xl font-bold text-gray-900">
            {userSolicitudData?.NumeroSolicitud || "N/A"}
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center text-red-600">
          Seleccione el tipo de Verificación
        </h2>

        <div className="flex justify-center gap-8">
          <label className={`flex items-center gap-2 text-sm ${tipoVerificacion === "trabajo" ? "opacity-50" : ""}`}>
            <input
              type="checkbox"
              checked={tipoVerificacion === "domicilio"}
              onChange={() => handleTipoVerificacion("domicilio")}
              disabled={tipoVerificacion === "trabajo"}
            />
            Domicilio
          </label>
          <label className={`flex items-center gap-2 text-sm ${tipoVerificacion === "domicilio" ? "opacity-50" : ""}`}>
            <input
              type="checkbox"
              checked={tipoVerificacion === "trabajo"}
              onChange={() => handleTipoVerificacion("trabajo")}
              disabled={tipoVerificacion === "domicilio"}
            />
            Trabajo
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Verificador:</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={verificador}
            onChange={(e) => setVerificador(e.target.value)}
          >
            <option value="">Seleccione un verificador</option>
            {verificadores.map((v) => (
              <option key={v.idIngresoCobrador} value={v.idIngresoCobrador}>
                {v.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
            onClick={handleCancelar}
          >
            Cancelar
          </button>
          <button
            className={`bg-blue-600 text-white text-sm px-4 py-2 rounded ${!isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            onClick={handleAceptar}
            disabled={!isFormValid}
          >
            Aceptar
          </button>
        </div>

      </div>
    </div>
  );
}