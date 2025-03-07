// src/components/SolicitudDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import StoreIcon from "@mui/icons-material/Store";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";

export default function SolicitudDialog({ open, onClose, selectedRow }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-xl font-bold">
        Detalles de la Solicitud
      </DialogTitle>
      <DialogContent dividers>
        {selectedRow && (
          <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
            {/* Imagen */}
            <div className="flex justify-center items-center md:w-1/3">
              <img
                src={selectedRow.imagen}
                alt="Imagen"
                className="w-64 h-64 object-cover rounded-md"
              />
            </div>

            {/* Datos */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-base leading-relaxed">
                <div className="flex items-center gap-2">
                  <PersonIcon className="text-blue-500" fontSize="medium" />
                  <p>{selectedRow.nombre}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeIcon className="text-blue-500" fontSize="medium" />
                  <p className="font-semibold">Cédula:</p>
                  <p>{selectedRow.cedula}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StoreIcon className="text-blue-500" fontSize="medium" />
                  <p className="font-semibold">Almacén:</p>
                  <p>{selectedRow.almacen}</p>
                </div>
                <div className="flex items-center gap-2">
                  <SupervisorAccountIcon
                    className="text-blue-500"
                    fontSize="medium"
                  />
                  <p className="font-semibold">Vendedor:</p>
                  <p>{selectedRow.vendedor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <InfoIcon className="text-blue-500" fontSize="medium" />
                  <p className="font-semibold">Tipo de Consulta:</p>
                  <p>{selectedRow.consulta}</p>
                </div>
                {/* Estado con color dinámico en el texto */}
                <div className="flex items-center">
                  <InfoIcon className="mr-2 text-blue-500" />
                  <span
                    className={`ml-2 font-semibold ${
                      selectedRow.estado === "activo"
                        ? "text-green-500"
                        : selectedRow.estado === "pendiente"
                        ? "text-yellow-500"
                        : selectedRow.estado === "anulado"
                        ? "text-gray-500"
                        : selectedRow.estado === "aprobado"
                        ? "text-blue-500"
                        : selectedRow.estado === "rechazado"
                        ? "text-red-500"
                        : "text-gray-700"
                    }`}
                  >
                    {selectedRow.estado}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="text-blue-500" fontSize="medium" />
                  <p>{selectedRow.celular}</p>
                </div>
                <div className="flex items-center gap-2">
                  <EmailIcon className="text-blue-500" fontSize="medium" />
                  <p>{selectedRow.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <EventIcon className="text-blue-500" fontSize="medium" />
                  <p className="font-semibold">Fecha:</p>
                  <p>{selectedRow.fecha.substring(0, 10)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon
                    className="text-blue-500"
                    fontSize="medium"
                  />
                  <p className="font-semibold">Afiliado:</p>
                  <p>{selectedRow.afiliado}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BusinessIcon className="text-blue-500" fontSize="medium" />
                  <p className="font-semibold">Tiene RUC:</p>
                  <p>{selectedRow.tieneRuc}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          className="text-base font-semibold"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
