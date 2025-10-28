import React, { useState, useEffect } from "react";

export function CambioBodega({
    isOpen,
    onClose,
    onConfirm,
    solicitudData,
    mensajePrincipal,
    Titulo,
    ListaBodega = [],
}) {
    const [nota, setNota] = useState("");
    const [bodegaSeleccionada, setBodegaSeleccionada] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [errores, setErrores] = useState({ nota: "", bodega: "" });

      useEffect(() => {
        if (!isOpen) {
            setNota("");
            setBodegaSeleccionada("");
            setErrores({ nota: "", bodega: "" });
            setShowConfirmModal(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirmClick = () => {
        let newErrors = { nota: "", bodega: "" };
        let valid = true;

        if (!bodegaSeleccionada) {
            newErrors.bodega = "Debes seleccionar una bodega.";
            valid = false;
        }

        if (nota.trim().length < 10) {
            newErrors.nota = "La nota debe tener al menos 10 caracteres.";
            valid = false;
        }

        setErrores(newErrors);

        if (valid) setShowConfirmModal(true);
    };

    const handleFinalConfirm = () => {
        onConfirm({ nota, bodegaSeleccionada });
        // 🔄 Limpiar campos
        setNota("");
        setBodegaSeleccionada("");
        setErrores({ nota: "", bodega: "" });
        setShowConfirmModal(false);
        onClose(); // Cerrar el modal principal también
    };

    return (
        <>
            {/* MODAL PRINCIPAL */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                aria-modal="true"
                role="dialog"
            >
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
                    {/* Botón de cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>

                    {/* Título */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {Titulo || "Cambio de Bodega"}
                    </h2>

                    {/* Mensaje principal */}
                    {mensajePrincipal && (
                        <p className="text-gray-600 mb-4">{mensajePrincipal}</p>
                    )}

                    {/* Información de solicitud */}
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
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Bodega Actual:</span> {solicitudData.almacen}
                            </p>
                        </div>
                    )}

                    {/* Lista de bodegas */}
                    {ListaBodega?.length > 0 && (
                        <div className="mb-4">
                            <label
                                htmlFor="bodega"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Selecciona nueva bodega:
                            </label>
                            <select
                                id="bodega"
                                value={bodegaSeleccionada}
                                onChange={(e) => setBodegaSeleccionada(parseInt(e.target.value, 10))}
                                className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                    errores.bodega ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Seleccione una bodega</option>
                                {ListaBodega.map((bodega, idx) => (
                                    <option key={idx} value={bodega.b_Bodega}>
                                        {bodega.b_Nombre}
                                    </option>
                                ))}
                            </select>
                            {errores.bodega && (
                                <p className="text-red-500 text-sm mt-1">{errores.bodega}</p>
                            )}
                        </div>
                    )}

                    {/* Campo Nota */}
                    <div className="mb-4">
                        <label
                            htmlFor="nota"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nota (mínimo 10 caracteres):
                        </label>
                        <textarea
                            id="nota"
                            value={nota}
                            onChange={(e) => setNota(e.target.value.toUpperCase())}
                            rows="3"
                            className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                errores.nota ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Escribe una nota..."
                        />
                        {errores.nota && (
                            <p className="text-red-500 text-sm mt-1">{errores.nota}</p>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmClick}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            ¿Estás seguro?
                        </h3>
                        <p className="text-gray-600 mb-5">
                            Confirmar este cambio de bodega no se podrá deshacer.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleFinalConfirm}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
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
