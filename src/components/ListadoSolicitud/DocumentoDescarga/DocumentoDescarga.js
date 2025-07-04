import React from 'react';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export function DocumentoDescarga({ isOpen, onClose, data }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 mx-4">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* Icono encabezado */}
                <div className="flex items-center justify-center mb-4">
                    <TwoWheelerIcon className="text-4xl text-[#063970]" />
                </div>

                {/* Datos del cliente */}
                <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {data?.PrimerNombre} {data?.SegundoNombre} {data?.ApellidoPaterno} {data?.ApellidoMaterno}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Cédula: {data?.cedula} &bull; Solicitud: {data?.NumeroSolicitud}
                    </p>
                </div>

                {/* Tipo de verificación */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Verificaciones realizadas
                    </h4>
                    <div className="flex items-center gap-4">
                        {/* Verificación domicilio */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <HomeIcon className="text-lg" />
                            <span>Domicilio:</span>
                            {data?.Domicilio ? (
                                <CheckCircleIcon className="text-green-600" />
                            ) : (
                                <CancelIcon className="text-gray-400" />
                            )}
                        </div>

                        {/* Verificación laboral */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <WorkIcon className="text-lg" />
                            <span>Trabajo:</span>
                            {data?.Laboral ? (
                                <CheckCircleIcon className="text-green-600" />
                            ) : (
                                <CancelIcon className="text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Título del documento */}
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Informe del Motorizado
                </h2>

                {/* Descripción */}
                <p className="text-sm text-gray-600 mb-6">
                    Este informe detalla la verificación presencial realizada en el domicilio y/o lugar de trabajo del cliente, como parte del proceso de evaluación crediticia.
                    Incluye observaciones generales, validación de presencia, ubicación, y datos relevantes recopilados durante la visita.
                </p>

                {/* Contenedor del documento */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-3 bg-[#E0ECF9] text-[#063970] rounded-full">
                        <DescriptionIcon className="text-3xl" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <span className="text-sm font-semibold text-gray-800">
                            motorizado-informe.pdf
                        </span>
                        <span className="text-xs text-gray-500">Haz clic para descargar</span>
                    </div>
                    <a
                        href="/docs/motorizado-informe.pdf"
                        download
                        className="text-white bg-[#063970] hover:bg-[#052c5e] font-medium rounded-lg text-sm px-4 py-2 transition-all"
                    >
                        Descargar
                    </a>
                </div>
            </div>
        </div>
    );
}
