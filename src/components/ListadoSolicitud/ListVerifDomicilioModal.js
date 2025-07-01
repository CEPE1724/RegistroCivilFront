import axios from "../../configApi/axiosConfig";
import { useEffect, useState } from "react";
import { APIURL } from "../../configApi/apiConfig";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSnackbar } from "notistack";
import DomicilioModal from "./DomicilioModal";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

const ListVerifDomicilioModal = ({ openModal, closeModal, datosCliente }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [verificaciones, setVerificaciones] = useState([]);
  const [verificadores, setVerificadores] = useState([]);
  const [isDomicilioModalOpen, setDomicilioModalOpen] = useState(false);
  const handleCloseDomicilioModal = () => setDomicilioModalOpen(false);
  const [selectedVerificacion, setSelectedVerificacion] = useState("");
  const [openModalPendiente, setOpenModalPendiente] = useState(false);

  const fetchVerificaciones = async (id) => {
    try {
      const url = APIURL.get_ClientesVerifTerrenporId(id) + "?tipo=domicilio";
      const response = await axios.get(url);
      setVerificaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las verificaciones:", error);
    }
  };

  const fetchVerificadores = async () => {
    try {
      const response = await axios.get(APIURL.get_ingresoCobrador());

      setVerificadores(response.data);
    } catch (error) {
      console.error("Error al cargar verificadores:", error);
      enqueueSnackbar("Error al cargar verificadores", { variant: "error" });
    }
  };

  useEffect(() => {
    if (openModal) {
      fetchVerificaciones(datosCliente?.idSolicitud);
      fetchVerificadores();
    }
  }, [openModal]);

  useEffect(() => {
    if (verificaciones.length === 1) {
      setDomicilioModalOpen(true);
    }
  }, [verificaciones]);

  useEffect(() => {
    if (!openModal) {
      setSelectedVerificacion("");
    }
  }, [openModal]);

  if (!openModal) return null;

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-40">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8 max-h-[90vh] overflow-y-auto animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6">
            Verificaciones Domicilio
          </h2>
          {/* Listado */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 border-b text-left">N°</th>
                      <th className="py-3 px-6 border-b text-left">Nombre</th>
                      <th className="py-3 px-6 border-b text-left">Estado</th>
                      <th className="py-3 px-6 border-b text-left">
                        Verificador
                      </th>
                      <th className="py-3 px-6 border-b text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {verificaciones.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 px-6 text-center text-gray-500"
                        >
                          No hay verificaciones disponibles.
                        </td>
                      </tr>
                    ) : (
                      verificaciones.map((verificacion, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-3 px-6 border-b">{idx + 1}</td>
                          <td className="py-3 px-6 border-b">
                            {verificacion.Nombres}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {verificacion.iEstado === 0
                              ? "Sin respuesta"
                              : verificacion.iEstado === 1
                              ? "Con respuesta"
                              : verificacion.iEstado === 2
                              ? "Reasignado"
                              : "Desconocido"}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {verificadores.find(
                              (v) =>
                                v.idIngresoCobrador ===
                                verificacion.idVerificador
                            )?.Nombre || "Sin asignar"}
                          </td>
                          <td className="py-3 px-6 border-b">
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800"
                              title="Ver detalles"
                              onClick={() => {
                                setSelectedVerificacion(verificacion);
                                if (
                                  verificacion?.idTerrenaGestionDomicilio !== 0
                                ) {
                                  setDomicilioModalOpen(true);
                                } else {
                                  setOpenModalPendiente(true);
                                }
                              }}
                            >
                              <VisibilityIcon />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-end mt-8 space-x-4">
            <button
              className="rounded-full bg-gray-400 text-white px-6 py-2 text-sm hover:bg-gray-500 transition"
              onClick={closeModal}
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      <DomicilioModal
        openModal={isDomicilioModalOpen}
        closeModal={handleCloseDomicilioModal}
        idsTerrenas={selectedVerificacion}
        idSolicitud={datosCliente?.idSolicitud}
        datosCliente={datosCliente?.cliente}
      />

      <Dialog
        open={openModalPendiente}
        onClose={() => setOpenModalPendiente(false)}
      >
        <DialogTitle>Verificación Pendiente</DialogTitle>
        <DialogContent>
          <Typography>
            Verificación pendiente por el verificador:
            <strong className="ml-2 text-blue-700">
              {verificadores.find(
                (v) =>
                  v.idIngresoCobrador === selectedVerificacion?.idVerificador
              )?.Nombre || "Sin asignar"}
            </strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModalPendiente(false);
              setSelectedVerificacion("");
            }}
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListVerifDomicilioModal;
