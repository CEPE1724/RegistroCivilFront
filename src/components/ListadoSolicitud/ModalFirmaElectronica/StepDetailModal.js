import React from "react";

export default function StepDetailModal({ isOpen, onClose, title, detail }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative animate-fadeIn border border-gray-300">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
          onClick={onClose}
          title="Cerrar"
        >
          ×
        </button>
        <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">{title}</h3>
        <div className="text-gray-700 text-center text-sm">
          {detail}
        </div>
      </div>
    </div>
  );
}
