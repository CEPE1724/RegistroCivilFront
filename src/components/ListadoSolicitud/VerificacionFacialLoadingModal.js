import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const VerificacionFacialLoadingModal = ({ open }) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        className: "rounded-2xl shadow-2xl overflow-hidden"
      }}
    >
      <DialogContent className="p-0">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-10">
          {/* Icono central con animación de escaneo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Círculo pulsante de fondo */}
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-blue-300 rounded-full animate-pulse opacity-30"></div>
              
              {/* Icono principal */}
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-8 shadow-2xl">
                <FingerprintIcon className="w-20 h-20 text-white animate-pulse" />
              </div>

              {/* Anillo de escaneo rotatorio */}
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Título animado */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
            Verificando Identidad
          </h2>

          {/* Subtítulo con animación de puntos */}
          <div className="flex justify-center items-center space-x-1 mb-6">
            <p className="text-center text-gray-600 text-lg">
              Analizando reconocimiento facial
            </p>
            <span className="flex space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </span>
          </div>

          {/* Barra de progreso animada */}
          <div className="bg-white/70 backdrop-blur-sm rounded-full h-3 overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse"></div>
          </div>

          {/* Mensaje informativo */}
          <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
            <p className="text-center text-sm text-gray-600">
              Estamos comparando las características faciales.
              Este proceso puede tomar unos segundos.
            </p>
          </div>

          {/* Indicadores de progreso */}
          <div className="mt-6 flex justify-around">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
              </div>
              <p className="text-xs text-gray-600 font-medium">Procesando</p>
            </div>
            <div className="text-center opacity-50">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Comparando</p>
            </div>
            <div className="text-center opacity-30">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Verificando</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificacionFacialLoadingModal;
