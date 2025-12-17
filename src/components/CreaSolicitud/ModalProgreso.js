import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';


export function ModalProgreso ({isOpen, progreso, fase, mensaje, estado }) {
    if (!isOpen) return null;

    const fasesMensajes = {
        'INICIADO': { icono: '🚀', titulo: 'Iniciando proceso', color: 'blue' },
        'CONSULTANDO_EQUIFAX': { icono: '🔍', titulo: 'Consultando historial crediticio', color: 'blue' },
        'EQUIFAX_COMPLETADO': { icono: '✅', titulo: 'Historial verificado', color: 'green' },
        'CONSULTANDO_COGNO': { icono: '🏢', titulo: 'Consultando datos personales', color: 'blue' },
        'TOKEN_OBTENIDO': { icono: '🔑', titulo: 'Token obtenido', color: 'green' },
        'DATOS_PERSONALES_OBTENIDOS': { icono: '👤', titulo: 'Datos personales obtenidos', color: 'green' },
        'DATOS_LABORALES_OBTENIDOS': { icono: '💼', titulo: 'Datos laborales obtenidos', color: 'green' },
        'DATOS_GUARDADOS': { icono: '💾', titulo: 'Información guardada', color: 'green' },
        'COMPLETADO': { icono: '🎉', titulo: '¡Proceso completado!', color: 'green' },
        'ERROR': { icono: '❌', titulo: 'Error en el proceso', color: 'red' },
    };

    const faseActual = fasesMensajes[fase] || { icono: '⏳', titulo: 'Procesando', color: 'blue' };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{faseActual.icono}</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        {estado === 'ERROR' ? 'Error en el Proceso' : 'Procesando Solicitud'}
                    </h2>
                    <p className="text-slate-600">{faseActual.titulo}</p>
                </div>

                {/* Barra de Progreso */}
                {estado !== 'ERROR' && (
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span className="font-medium">{fase?.replace(/_/g, ' ')}</span>
                            <span className="font-bold text-blue-600">{progreso}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                    faseActual.color === 'green' 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                                        : faseActual.color === 'red'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                }`}
                                style={{ width: `${progreso}%` }}
                            >
                                <div className="h-full w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensaje Detallado */}
                <div className={`p-4 rounded-lg mb-6 ${
                    estado === 'ERROR' 
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-blue-50 border border-blue-200'
                }`}>
                    {estado === 'ERROR' ? (
                        <div className="flex items-start">
                            <ErrorIcon className="text-red-500 mr-3 mt-0.5" />
                            <p className="text-sm text-red-700">{mensaje || 'Ocurrió un error durante el procesamiento'}</p>
                        </div>
                    ) : (
                        <div className="flex items-start">
                            <HourglassEmptyIcon className="text-blue-500 mr-3 mt-0.5 animate-spin" />
                            <p className="text-sm text-blue-700">{mensaje || 'Procesando información...'}</p>
                        </div>
                    )}
                </div>

                {/* Fases del Proceso */}
                {estado !== 'ERROR' && (
                    <div className="space-y-2 mb-6">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">
                            Etapas del Proceso
                        </p>
                        
                        {['INICIADO', 'CONSULTANDO_EQUIFAX', 'CONSULTANDO_COGNO', 'DATOS_GUARDADOS', 'COMPLETADO'].map((etapa, index) => {
                            const completado = progreso > (index * 20);
                            const enProceso = fase === etapa;
                            
                            return (
                                <div key={etapa} className="flex items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        completado 
                                            ? 'bg-green-500' 
                                            : enProceso 
                                            ? 'bg-blue-500 animate-pulse'
                                            : 'bg-slate-300'
                                    }`}>
                                        {completado && (
                                            <CheckCircleIcon className="text-white" fontSize="small" />
                                        )}
                                    </div>
                                    <span className={`ml-3 text-sm ${
                                        completado || enProceso ? 'text-slate-800 font-medium' : 'text-slate-400'
                                    }`}>
                                        {etapa.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Información Adicional */}
                {fase === 'CONSULTANDO_COGNO' && estado !== 'ERROR' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-xs text-yellow-800">
                            <strong>Nota:</strong> Esta consulta puede tomar 1-2 minutos. 
                            Por favor mantén esta ventana abierta.
                        </p>
                    </div>
                )}

                {/* Loading Spinner cuando está procesando */}
                {estado !== 'ERROR' && estado !== 'COMPLETADO' && (
                    <div className="flex justify-center mt-6">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

