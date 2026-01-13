import React, { useState } from "react";
import ConfirmMessage from "./ConfirmMessage";
import axios from "../../../configApi/axiosConfig";
import { APIURL } from "../../../configApi/apiConfig";
import StepDetailModal from "./StepDetailModal";
import { FcSearch } from "react-icons/fc";

const steps = [
  {
    label: "Envío del link biométrico",
    description: "",
    button: "Generar link biométrico"
  },
  {
    label: "Firma electrónica",
    description: "Una vez aprobado el biométrico, procede a la firma electrónica de la solicitud.",
    button: "Firmar electrónicamente"
  }
];

export  function ModalFirmaElectronica({ data, isOpen, onClose }) {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStep, setPendingStep] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailStep, setDetailStep] = useState(null);
  // Estado textual según idFirmaElectronica
  const estadoFirmaMap = {
    1: "Aplica a la firma",
    2: "Se envió el link del biométrico",
    3: "Respuesta del biométrico",
    4: "Envío de documentos"
  };
  const estadoFirmaTexto = estadoFirmaMap[data?.idFirmaElectronica] || "Estado desconocido";
  // El paso actual se basa en idFirmaElectronica (resta 1 para index)
  const currentStep = (data?.idFirmaElectronica ? data.idFirmaElectronica - 1 : 0);

  const stepConfirmMessages = {
    "Generar link biométrico": "¿Está seguro que desea generar el link biométrico? Recuerde que el Cliente debe contar con su cédula física.",
    "Firmar electrónicamente": "¿Está seguro que desea proceder con la firma electrónica?"
  };

  const handleStepAction = (step) => {
    setPendingStep(step);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (pendingStep) {
      if (pendingStep.button === "Generar link biométrico") {
        try {
            const response = await axios.post(APIURL.serviciosia365pro_biometric(), {
              identificacion: data?.cedula,
              callback: "https://backregistrocivil.appservices.com.ec/api/v1/corporacion-dfl/serviciosia365pro/biometrico/callback",
                motivo: data?.nombre,
                cre_solicitud: data?.sCre_SolicitudWeb,
                usuario: data?.usuario || "ECEPEDA"
            });
            alert(response?.data?.message || "Link biométrico generado correctamente");
        } catch (err) {
            alert("Error al generar el link biométrico");
        }
      } else {
        alert(`Acción confirmada: ${pendingStep.label}`);
      }
      setPendingStep(null);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingStep(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg relative animate-fadeIn border border-blue-900">
        {/* Encabezado institucional */}
        <div className="flex items-center justify-between px-8 py-5 bg-blue-900 rounded-t-xl">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M7 12h10M12 7v10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-xl font-bold text-white tracking-wide"> Solicitud de Firma Electrónica</span>
          </div>
          <button
            className="text-white hover:text-red-300 text-2xl font-bold"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>
        {/* Datos del ciudadano */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="text-lg font-semibold text-blue-900">{data?.nombre || "-"}</div>
              <div className="text-base text-gray-700">Cédula: <span className="font-medium">{data?.cedula || "-"}</span></div>
            </div>
            <div className="text-base text-gray-700">Solicitud N°: <span className="font-medium">{data?.NumeroSolicitud || "-"}</span></div>
          </div>
        </div>
        {/* Estado actual de la firma electrónica */}
        <div className="px-8 py-8">
          <div className="mb-8">
           <div className="w-full h-1 bg-blue-100 rounded mb-6" />
          </div>
          {/* Stepper horizontal */}
          <div className="flex flex-row items-center justify-center gap-8 mb-10">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <div key={step.label} className="flex flex-col items-center min-w-[120px]">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold border-4 mb-2 transition-all duration-200
                    ${isCompleted ? 'bg-green-500 border-green-700 text-white' : isActive ? 'bg-blue-100 border-blue-700 text-blue-900' : 'bg-gray-200 border-gray-400 text-gray-400'}`}
                  >
                    {idx + 1}
                  </div>
                  {/* Flecha de detalle debajo del icono para pasos completados */}
                  {isCompleted && (
                    <button
                      className="mt-1 text-green-700 hover:text-green-900 focus:outline-none"
                      title="Ver detalle"
                      onClick={() => {
                        setDetailStep(step);
                        setDetailOpen(true);
                      }}
                    >
                      <FcSearch className="w-6 h-6" />
                    </button>
                  )}
                  <div className={`text-sm font-semibold text-center mb-1 ${isCompleted ? 'text-green-700' : isActive ? 'text-blue-900' : 'text-gray-400'}`}>{step.label}</div>
                  {/* Línea de conexión horizontal */}
                  {idx < steps.length - 1 && (
                    <div className={`h-1 w-16 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'} rounded-full mt-2 mb-2`} />
                  )}
                  {/* Botón solo en el paso activo */}
                  {isActive && (
                    <button
                      className="mt-3 px-6 py-2 rounded-lg font-bold bg-blue-700 text-white shadow-md transition-all duration-200"
                      onClick={() => handleStepAction(step)}
                    >
                      {step.button}
                    </button>
                  )}
                  {/* Descripción solo en el paso activo */}
                  {isActive && (
                    <div className="text-xs text-gray-500 mt-2 text-center max-w-[120px]">{step.description}</div>
                  )}
                </div>
              );
            })}
          </div>
          {currentStep >= steps.length && (
            <div className="mt-10 text-center text-green-700 font-bold text-lg animate-pulse">
              <svg className="mx-auto mb-2" width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              ¡Solicitud completada!
            </div>
          )}
        </div>
        <ConfirmMessage
          isOpen={confirmOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message={pendingStep ? (stepConfirmMessages[pendingStep.button] || `¿Está seguro de continuar con: ${pendingStep.label}?`) : "¿Está seguro?"}
        />
        <StepDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          title={detailStep?.label || "Detalle"}
          detail={detailStep ? `Detalle de la acción: ${detailStep.label}` : ""}
          data={data}
        />
      </div>
    </div>
  );
}
