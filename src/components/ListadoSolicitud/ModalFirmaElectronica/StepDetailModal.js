import React, { useEffect, useState } from "react";
import axios from "../../../configApi/axiosConfig";
import { APIURL } from "../../../configApi/apiConfig";
import { PiCopy } from "react-icons/pi";

export default function StepDetailModal({ isOpen, onClose, title, detail, data }) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    async function fetchInfo() {
      if (isOpen && data?.cedula) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(APIURL.infoanalisisIdentidad(data.cedula, data.id));
          setInfo(response.data);
        } catch (err) {
          setError("Error al cargar la información. Por favor, intente nuevamente.");
        }
        setLoading(false);
      } else {
        setInfo(null);
        setError(null);
      }
    }
    fetchInfo();
  }, [isOpen, data]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fadeIn border border-blue-300">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
          onClick={onClose}
          title="Cerrar"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-blue-800 mb-4 text-center border-b pb-2">{title}</h3>
        <div className="text-gray-700 text-left text-sm">
          {loading && <span className="block text-center">Cargando información...</span>}
          {error && <span className="block text-center text-red-500">{error}</span>}
          {!loading && !error && info && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">Identificación:</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{info.identificacion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">URL:</span>
                <div className="flex items-center gap-2">
                  <a href={info.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all text-xs">{info.url}</a>
                  <button onClick={() => handleCopy(info.url)} className="text-blue-700 hover:text-blue-900">
                    <PiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">Short URL:</span>
                <div className="flex items-center gap-2">
                  <a href={info.short_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all text-xs">{info.short_url}</a>
                  <button onClick={() => handleCopy(info.short_url)} className="text-blue-700 hover:text-blue-900">
                    <PiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">Válido hasta:</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{info.valido_hasta}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">Código interno:</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{info.codigo_interno}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">Fecha sistema:</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{info.FechaSistema}</span>
              </div>
              {copied && (
                <div className="text-green-600 text-xs text-center mt-2">¡Copiado al portapapeles!</div>
              )}
            </div>
          )}
          {!loading && !error && !info && (
            <div className="text-center text-gray-500">{detail}</div>
          )}
        </div>
      </div>
    </div>
  );
}
