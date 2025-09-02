import React, { useState } from "react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export  function ConfirmarAccionModal ({
  open,
  onClose,
  onConfirm,
  currentAction,
  entrada,
  setEntrada,
  justificacion,
  setJustificacion,
  domicilioChecked,
  setDomicilioChecked,
  laboralChecked,
  setLaboralChecked,
}) {
	const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCancel = () => {
	if (loading) return;
    setEntrada("");
    setJustificacion("");
    setLaboralChecked(false);
    setDomicilioChecked(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onConfirm(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Confirmar acción
            </h2>
          </div>
          <button onClick={handleCancel}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 mb-4">
          ¿Estás seguro de cambiar el{" "}
          <span className="font-medium text-gray-800">
            {currentAction === "estado" ? "estado" : "resultado"}
          </span>
          ?
        </p>

        {currentAction === "estado" && (
          <div className="space-y-4">
            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  onChange={(e) => setDomicilioChecked(e.target.checked)}
                  className="accent-blue-600"
                />
                Domicilio
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={laboralChecked}
                  onChange={(e) => setLaboralChecked(e.target.checked)}
                  className="accent-blue-600"
                />
                Laboral
              </label>
            </div>

            {/* Entrada numérica */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Digite la entrada ($)
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]{1,7}(\\.[0-9]{0,2})?$"
                maxLength={10}
                value={entrada}
                onChange={(e) => {
                  const val = e.target.value;
                  const regex = /^\d{0,7}(\.\d{0,2})?$/;
                  if (val === "" || regex.test(val)) {
                    setEntrada(val);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {entrada !== "" && parseFloat(entrada) > 100 && (
                <p className="text-sm text-red-500 mt-1">
                  Máximo permitido: 100
                </p>
              )}
            </div>

            {/* Justificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Justificación / Motivo <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                maxLength={500}
                placeholder="Ingrese la justificación para este cambio..."
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-gray-500 mt-1">
                {justificacion.length < 10 && justificacion.length > 0 ? (
                  <span className="text-red-500">
                    Mínimo 10 caracteres. Actual: {justificacion.length}/500
                  </span>
                ) : (
                  `${justificacion.length}/500 caracteres`
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={currentAction === "estado" && justificacion.length < 10}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Confirmar cambio"}
          </button>
        </div>
      </div>
    </div>
  );
};


