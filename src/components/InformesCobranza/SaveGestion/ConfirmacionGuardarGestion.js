import React from 'react';
import {
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export function ConfirmacionGuardarGestion({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    formData, 
    estadoGestion, 
    tipoContactoData, 
    selectResultadoData,
    IDS_COMPROMISO
}) {
    if (!isOpen) return null;
    console.log('📋 CONFIRMACIÓN - Datos recibidos:', {
        formData,
        estadoGestion,
        tipoContactoData,
        selectResultadoData
    });
    // Obtener nombres desde los arrays
    const getNombreEstado = (id) => {
        return estadoGestion?.find(e => e.idCbo_EstadoGestion === parseInt(id))?.Estado || 'N/A';
    };

    const getNombreTipoContacto = (id) => {
        const resultado = tipoContactoData?.find(t => t.idCbo_EstadosTipocontacto === parseInt(id));
        console.log(`🔍 Buscando tipoContacto ${id}:`, resultado);
        return resultado?.Estado || 'N/A';
    };

    const getNombreResultado = (id) => {
        return selectResultadoData?.find(r => r.idCbo_ResultadoGestion === parseInt(id))?.Resultado || 'N/A';
    };

    const esCompromiso = formData.descripcion && IDS_COMPROMISO.includes(parseInt(formData.descripcion));

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
                {/* Header */}
                <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ExclamationCircleIcon className="w-6 h-6" />
                        <h2 className="text-xl font-bold">¿Está seguro de guardar?</h2>
                    </div>
                    <button onClick={onCancel} className="hover:bg-blue-700 p-1 rounded transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                    {/* Información principal */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Teléfono:</span>
                            <span className="text-gray-900 font-bold">{formData.telefono}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Tipo de Gestión:</span>
                            <span className="text-gray-900 font-bold">{getNombreEstado(formData.dato)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Tipo de Contacto:</span>
                            <span className="text-gray-900 font-bold">{getNombreTipoContacto(formData.tipoContacto)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Resultado:</span>
                            <span className={`font-bold ${esCompromiso ? 'text-orange-600' : 'text-gray-900'}`}>
                                {getNombreResultado(formData.descripcion)}
                            </span>
                        </div>

                        {/* Compromiso de Pago si aplica */}
                        {esCompromiso && (
                            <>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Fecha de Pago:</span>
                                    <span className="text-gray-900 font-bold">{new Date(formData.fechaPago).toLocaleDateString('es-EC')}</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Monto:</span>
                                    <span className="text-orange-600 font-bold">${parseFloat(formData.valor).toFixed(2)}</span>
                                </div>
                            </>
                        )}

                        <div className="py-3">
                            <p className="text-gray-600 font-medium mb-2">Notas:</p>
                            <p className="text-gray-700 italic bg-gray-50 p-3 rounded border border-gray-200 text-sm uppercase">
                                "{formData.observacion}"
                            </p>
                        </div>
                    </div>

                    {/* Advertencia */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                        <p className="text-xs text-yellow-800 font-bold">
                            ⚠️ Esta acción no se puede deshacer una vez guardada.
                        </p>
                    </div>
                </div>

                {/* Footer - Botones */}
                <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Sí, Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
