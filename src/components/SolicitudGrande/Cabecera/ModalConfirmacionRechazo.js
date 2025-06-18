import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ModalConfirmacionRechazo = ({
    isOpen,
    onClose,
    onConfirm,
    solicitudData,
    mensajePrincipal
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Confirmar Rechazo
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
                            {mensajePrincipal || "¿Estás seguro de que deseas rechazar esta solicitud?"}                        </p>
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

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-800">
                                        Advertencia
                                    </p>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Al confirmar esta acción, la prefactura será anulada y no podrás continuar con el crédito actual.
                                        Será necesario iniciar una nueva solicitud desde el principio.
                                        Esta acción es permanente.                  </p>
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
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Rechazando...
                                </>
                            ) : (
                                '❌ Confirmar Rechazo'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacionRechazo;