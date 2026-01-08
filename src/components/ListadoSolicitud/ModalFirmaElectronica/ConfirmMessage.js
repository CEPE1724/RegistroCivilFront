import React from "react";

export default function ConfirmMessage({ isOpen, onConfirm, onCancel, message = "¿Está seguro?" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative animate-fadeIn border border-gray-300">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">Confirmación</h3>
        <div className="text-gray-700 text-center text-sm mb-6">
          {message}
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            onClick={onConfirm}
          >
            Sí, continuar
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-bold hover:bg-gray-400 transition"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
