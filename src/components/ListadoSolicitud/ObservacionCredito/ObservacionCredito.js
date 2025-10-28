import React, { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export function ObservacionCredito({
    isOpen,
    onClose,
    onConfirm,
    solicitudData,
    mensajePrincipal,
    Titulo,
}) {
    const [nota, setNota] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [error, setError] = useState("");

    // 🔄 Limpiar al cerrar
    useEffect(() => {
        if (!isOpen) {
            setNota("");
            setError("");
            setShowConfirmModal(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirmClick = () => {
        if (nota.trim().length < 10) {
            setError("La observación debe tener al menos 10 caracteres.");
            return;
        }
        setError("");
        setShowConfirmModal(true);
    };

    const handleFinalConfirm = () => {
        onConfirm({ nota });
        setNota("");
        setError("");
        setShowConfirmModal(false);
        onClose();
    };

    return (
        <>
            {/* 🔹 MODAL PRINCIPAL */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-fadeIn">
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                        aria-label="Cerrar modal"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                    {/* Título con ícono */}
                    <div className="flex items-center space-x-2 mb-3">
                        <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            {Titulo || "Agregar Observación al Crédito"}
                        </h2>
                    </div>

                    {/* Mensaje principal */}
                    {mensajePrincipal && (
                        <p className="text-gray-600 mb-4 text-sm">{mensajePrincipal}</p>
                    )}

                    {/* Información del crédito */}
                    {solicitudData && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium text-gray-900">Solicitud:</span>{" "}
                                {solicitudData.NumeroSolicitud}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium text-gray-900">Cliente:</span>{" "}
                                {solicitudData.PrimerNombre || solicitudData.ApellidoPaterno
                                    ? `${solicitudData.PrimerNombre || ""} ${solicitudData.ApellidoPaterno || ""}`.trim()
                                    : solicitudData.nombre}
                            </p>
                            {solicitudData.almacen && (
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium text-gray-900">Bodega Actual:</span>{" "}
                                    {solicitudData.almacen}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Campo Observación */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observación <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={nota}
                            onChange={(e) => setNota(e.target.value.toUpperCase())}
                            rows="4"
                            className={`w-full border rounded-md p-3 text-sm placeholder-gray-400 
                            focus:ring-2 focus:ring-blue-500 focus:outline-none 
                            transition ${
                                error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                            }`}
                            placeholder="Escribe una observación detallada..."
                        />
                        {error && (
                            <p className="flex items-center text-red-500 text-sm mt-1">
                                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔸 MODAL DE CONFIRMACIÓN */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center animate-fadeIn">
                        <CheckCircleIcon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            ¿Estás seguro de guardar esta observación?
                        </h3>
                        <p className="text-gray-600 text-sm mb-5">
                            Una vez guardada, esta observación quedará registrada en el crédito.
                        </p>

                        {/* Vista previa de la nota */}
                        <div className="bg-gray-50 p-3 rounded-md border text-left text-sm text-gray-700 mb-5">
                            <p className="italic">“{nota}”</p>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleFinalConfirm}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Sí, confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
