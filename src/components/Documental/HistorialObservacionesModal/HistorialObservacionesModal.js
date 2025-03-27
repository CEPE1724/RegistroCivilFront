import React from "react";
import { FaUserCircle } from "react-icons/fa";

export function HistorialObservacionesModal  ({ history, setHistory, observaciones })  {
  if (!history) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 max-h-[500px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Historial de Observaciones
        </h2>

        {/* Área de mensajes tipo chat */}
        <div className="flex-grow overflow-y-auto max-h-80 p-2 space-y-4 bg-gray-100 rounded-lg">
          {observaciones.length > 0 ? (
            observaciones.map((obs, index) => (
              <div
                key={index}
                className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {/* Icono de usuario */}
                  <FaUserCircle className="text-gray-600 text-2xl" />

                  {/* Burbuja de chat */}
                  <div
                    className={`p-3 rounded-lg shadow-md ${index % 2 === 0
                      ? "bg-white text-gray-900"
                      : "bg-blue-500 text-white"
                      }`}
                  >
                    <p className="font-semibold">
                      {obs.Usuario || "Usuario desconocido"}
                    </p>
                    <p className="text-sm">
                      {obs.Observacion || "Sin observación"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(obs.Fecha).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No hay observaciones registradas.
            </p>
          )}
        </div>

        {/* Botón de cierre */}
        <button
          onClick={() => setHistory(false)}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

