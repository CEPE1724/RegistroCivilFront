import React, { useState, useEffect } from "react";
import axios from "../../configApi/axiosConfig";
import { APIURL } from "../../configApi/apiConfig";
import { useSnackbar } from "notistack";

export default function VerificacionTerrenaModal({
  isOpen,           // Booleano: ¿modal abierto?
  onClose,          // Función para cerrar el modal
  userSolicitudData,
  userData,
  tipoSeleccionado,
  data,
  idClienteVerificacion
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [verificador, setVerificador] = useState("");
  const [verificadores, setVerificadores] = useState([]);
  const [tipoVerificacion, setTipoVerificacion] = useState(null); // 'domicilio' o 'trabajo'
  const [verificadorNombre, setVerificadorNombre] = useState("");
  const [tokenVerificador, setTokenVerificador] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const isFormValid = tipoVerificacion && verificador;

const filteredVerificadores = verificadores.filter((v) =>
  v.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
);

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

    const payload2 = {
      tokens: [tokenVerificador],
      notification: {
        type: "alert",
        title: "VERIFICACIÓN TERRENA REQUERIDA",
        body: `📍 ${userSolicitudData.almacen} | Solicitante: ${userSolicitudData?.PrimerNombre} ${userSolicitudData.SegundoNombre} ${userSolicitudData?.ApellidoPaterno} ${userSolicitudData.ApellidoMaterno} 🪪 ${userSolicitudData.cedula}  | Solicitud activa de inspección en terreno.`,
        url: "",
        empresa: "CREDI",
      }
    }

	const payload3 = {
		iEstado: 2
	}

    try {
	  const response = await axios.post(APIURL.post_clientesVerificacionTerrenaBasica(), payload);
	  if (response.status !== 201){
		throw new Error("Error al agregar el registro.");
	  }

	  await axios.patch(APIURL.patch_ClientesVerifTerren(idClienteVerificacion), payload3);
      enqueueSnackbar("Verificación registrada correctamente", { variant: "success" });
      if (tokenVerificador) {
		try {
			const responseNoti = await axios.post(APIURL.enviarNotificacion(), payload2);
			if (responseNoti.status !== 200) {
				throw new Error("Error al enviar la notificación");
			}
			enqueueSnackbar("Notificación enviada", { variant: "success" });
		} catch (notiError) {
			console.error("❌ Error al enviar notificación:", notiError);
			//enqueueSnackbar("Error al enviar notificación", { variant: "error" });
		}
      }

      resetForm();
      onClose(); // Cierra el modal

	  if (tipoVerificacion === "domicilio") {
      await patchSolicitud(userSolicitudData.id, "domicilio");
      await fetchInsertarDatos(4, userSolicitudData.id, verificadorNombre, 1)
    } else if (tipoVerificacion === "trabajo") {
      await patchSolicitud(userSolicitudData.id, "trabajo");
      await fetchInsertarDatos(5, userSolicitudData.id, verificadorNombre, 1);
    }

    } catch (error) {
      console.error("❌ Error al enviar verificación:", error);
      enqueueSnackbar("Error, no se pueden crear mas de 3 registros", { variant: "error" });
    }
  };


  const fetchInsertarDatos = async (tipo, idSolicitudWeb, telefono, estado) => {
    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {
        idCre_SolicitudWeb: idSolicitudWeb,
        Tipo: tipo,
        idEstadoVerificacionDocumental: estado,
        Usuario: userData.Nombre,
        Telefono: telefono
      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente:", error);
    }
  };


  const patchSolicitud = async (idSolicitud, tipo) => {
    try {
      const estado = tipo === "domicilio"
        ? { idEstadoVerificacionDomicilio: 1 } // Actualiza para "domicilio"
        : { idEstadoVerificacionTerrena: 1 };  // Actualiza para "trabajo"

      const response = await axios.patch(
        APIURL.update_solicitud(idSolicitud),
        estado,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


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
        const response = await axios.get(APIURL.get_ingresoCobrador());

        setVerificadores(response.data);
      } catch (error) {
        console.error("❌ Error al cargar verificadores:", error);
        enqueueSnackbar("Error al cargar verificadores", { variant: "error" });
      }
    };

    if (isOpen) fetchVerificadores();
  }, [isOpen, enqueueSnackbar]);

  if (!isOpen) return null;

  const handleSelectChange = (e) => {
  const selectedId = e.target.value;
  setVerificador(selectedId);

  const verificadorSeleccionado = verificadores.find(
    (v) => v.idIngresoCobrador === parseInt(selectedId)
  );

  if (verificadorSeleccionado) {
    setVerificadorNombre(verificadorSeleccionado.Nombre); // 👉 Aquí asignamos el nombre

    if (verificadorSeleccionado.dispositivos.length > 0) {
      const token = verificadorSeleccionado.dispositivos[0].TokenExpo;
      setTokenVerificador(token);
    } else {
      setTokenVerificador("");
    }
  } else {
    setVerificadorNombre("");
    setTokenVerificador("");
  }
};


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

        {/* Buscador de verificadores */}
        <div className="space-y-2">
          <label className="text-sm">Buscar verificador:</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Verificador:</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={verificador}
            onChange={handleSelectChange}
          >
            <option value="">Seleccione un verificador</option>
            {filteredVerificadores.map((v) => (
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