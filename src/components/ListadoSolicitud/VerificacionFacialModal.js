import React from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const VerificacionFacialModal = ({ open, onClose, tipo, data }) => {
  // Configuración según el tipo de resultado
  const config = {
    aprobado: {
      icon: <CheckCircleIcon className="w-24 h-24 text-green-500" />,
      titulo: "Aprobado",
      mensaje: "La verificación ha sido exitosa.",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
      iconBg: "bg-green-100",
      mostrarMetricas: false // No mostrar métricas en aprobado
    },
    rechazado: {
      icon: <CancelIcon className="w-24 h-24 text-red-500" />,
      titulo: "Reconocimiento Facial Rechazado",
      mensaje: "Las imágenes no coinciden. Se requiere revisión manual.",
      bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
      borderColor: "border-red-500",
      buttonColor: "bg-red-500 hover:bg-red-600",
      iconBg: "bg-red-100",
      detalles: [
        "Verifique que la foto esté nítida y bien iluminada",
        "Considere solicitar nuevas imágenes",
        "Contacte al analista asignado si el problema persiste"
      ]
    },
    error: {
      icon: <ErrorOutlineIcon className="w-24 h-24 text-yellow-500" />,
      titulo: "Error en la Verificación",
      mensaje: data?.mensaje || "Ocurrió un error durante el proceso de verificación.",
      bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
      borderColor: "border-yellow-500",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      iconBg: "bg-yellow-100"
    }
  };

  const currentConfig = config[tipo] || config.error;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-2xl shadow-2xl overflow-hidden"
      }}
    >
      <DialogContent className="p-0">
        <div className={`${currentConfig.bgColor} p-8`}>
          {/* Icono central con animación */}
          <div className="flex justify-center mb-6">
            <div className={`${currentConfig.iconBg} rounded-full p-6 animate-pulse`}>
              {currentConfig.icon}
            </div>
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {currentConfig.titulo}
          </h2>

          {/* Mensaje principal */}
          <p className="text-center text-gray-600 text-lg mb-6">
            {currentConfig.mensaje}
          </p>


          {/* Detalles adicionales (solo para rechazados) */}
          {currentConfig.detalles && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Próximos pasos:</p>
              <ul className="space-y-2">
                {currentConfig.detalles.map((detalle, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{detalle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Métricas (solo si están disponibles y configurado para mostrar) */}
          {data?.distance !== undefined && currentConfig.mostrarMetricas !== false && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Similitud</p>
                  <p className="text-xl font-bold text-gray-800">
                    {data.similarity ? `${data.similarity.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Distancia</p>
                  <p className="text-xl font-bold text-gray-800">
                    {data.distance.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions className="bg-gray-50 px-8 py-4">
        <Button
          onClick={onClose}
          className={`${currentConfig.buttonColor} text-white font-semibold px-8 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg normal-case`}
          variant="contained"
          fullWidth
          style={{
            backgroundColor: currentConfig.buttonColor.includes('green') ? '#10b981' 
              : currentConfig.buttonColor.includes('red') ? '#ef4444' 
              : '#f59e0b'
          }}
        >
          {tipo === 'aprobado' ? 'Continuar' : 'Entendido'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerificacionFacialModal;
