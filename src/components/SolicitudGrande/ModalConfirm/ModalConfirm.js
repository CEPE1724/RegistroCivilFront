// Modal.js
import React from 'react';

export function ModalConfirm ({ isOpen, onClose, onConfirm })  {
  if (!isOpen) return null; // Si el modal no está abierto, no se renderiza

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-xl font-semibold text-center mb-4">¿Estás seguro de enviar?</h3>
        <div className="flex justify-between">
          {/* Botón Cancelar */}
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            onClick={onClose} // Cerrar el modal
          >
            Cancelar
          </button>
          {/* Botón Aceptar */}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            onClick={() => {
              onConfirm(); // Ejecutar la acción al confirmar
              onClose();   // Cerrar el modal
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};


