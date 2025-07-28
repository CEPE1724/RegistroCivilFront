import { useState } from 'react';
import { X, Edit3 } from 'lucide-react';

const ModalCorreccion = ({
    isOpen,
    onClose,
    onConfirm,
    solicitudData,
    mensajePrincipal,
	Titulo
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [observaciones, setObservaciones] = useState('');
    const [error, setError] = useState('');

    const handleObservacionesChange = (e) => {
        const value = e.target.value.toUpperCase();
        setObservaciones(value);
        
        // Validar longitud
        if (value.length < 10 && value.length > 0) {
            setError('Las observaciones deben tener al menos 10 caracteres');
        } else if (value.length > 350) {
            setError('Las observaciones no pueden exceder 350 caracteres');
        } else {
            setError('');
        }
    };

    const handleConfirm = async () => {

        // Validar antes de confirmar
        if (observaciones.length < 10) {
            setError('Las observaciones son obligatorias y deben tener al menos 10 caracteres');
            return;
        }
        
        if (observaciones.length > 350) {
            setError('Las observaciones no pueden exceder 350 caracteres');
            return;
        }

        setIsLoading(true);
        try {
            await onConfirm(observaciones);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setObservaciones('');
        setError('');
        onClose();
    };

    const isValidObservaciones = observaciones.length >= 10 && observaciones.length <= 350;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {Titulo || 'Solicitar Corrección'}
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            {mensajePrincipal || "¿Deseas solicitar una corrección para esta solicitud?"}
                        </p>
                        {solicitudData && (
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Solicitud:</span> {solicitudData.NumeroSolicitud}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Cliente:</span>{" "}
                                    {solicitudData.PrimerNombre || solicitudData.ApellidoPaterno
                                        ? `${solicitudData.PrimerNombre || ""} ${solicitudData.ApellidoPaterno || ""}`.trim()
                                        : solicitudData.nombre}
                                </p>
                            </div>
                        )}

                        {/* Campo de Observaciones */}
                        <div className="mb-4">
                            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                                Detalle de la corrección solicitada <span className="text-orange-500">*</span>
                            </label>
                            <textarea
                                id="observaciones"
                                value={observaciones}
                                onChange={handleObservacionesChange}
                                placeholder="Describa detalladamente qué corrección necesita (mínimo 10 caracteres, máximo 350)"
                                rows="4"
                                className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
                                    error 
                                        ? 'border-orange-300 focus:ring-orange-500 focus:border-orange-500' 
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                disabled={isLoading}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-xs">
                                    {error && (
                                        <span className="text-orange-500">{error}</span>
                                    )}
                                </div>
                                <span className={`text-xs ${
                                    observaciones.length > 350 ? 'text-orange-500' : 
                                    observaciones.length < 10 ? 'text-gray-400' : 'text-green-600'
                                }`}>
                                    {observaciones.length}/350
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <Edit3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">
                                        Información
                                    </p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Al solicitar una corrección, la solicitud será marcada para revisión.
                                        El vendedor recibirá una notificación con los detalles de la corrección solicitada
                                        y podrá realizar los ajustes necesarios.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading || !isValidObservaciones}
                            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Enviando...
                                </>
                            ) : (
                                '📝 Enviar a Corrección'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCorreccion;