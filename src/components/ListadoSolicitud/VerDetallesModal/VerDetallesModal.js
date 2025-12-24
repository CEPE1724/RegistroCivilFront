import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
} from "@mui/lab";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import StoreIcon from "@mui/icons-material/Store";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import PhoneIcon from "@mui/icons-material/Phone";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HouseIcon from "@mui/icons-material/House";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CapturarCamara from "../../CapturarCamara/CapturarCamara";
import ModalConfirmacionRechazo from "../../SolicitudGrande/Cabecera/ModalConfirmacionRechazo";

export function VerDetallesModal({
  open,
  onClose,
  selectedRow,
  fechaTiempos,
  previewUrl,
  fileToUpload,
  inputFileRef,
  openCameraModal,
  setOpenCameraModal,
  setImagenCapturada,
  setPreviewUrl,
  setFileToUpload,
  ExistPrefactura,
  showModalRechazo,
  setShowModalRechazo,
  editarCodDac,
  editarCodDac2,
  // Funciones
  formatDateTime,
  calcularTiempoTranscurrido,
  sumarTodosLosTiempos,
  handleFileChange,
  handleUploadClick,
  fetchImagenRegistroCivil,
  handleVerificarIdentidad,
  setErrorModalData,
  setErrorModalOpen,
  handleOpenEditModal,
  puedeAprobar,
  permitirEquifax,
  handleEquifax,
  handleAbrirVerificacionManual,
  handleRechazar,
  data,
}) {
  // Calcular tiempo total desde fechaTiempos si sumarTodosLosTiempos() devuelve NaN
  const calcularTiempoTotal = () => {
    const tiempoSumado = sumarTodosLosTiempos();

    // Si la función devuelve un valor válido, usarlo
    if (tiempoSumado && tiempoSumado !== 'NaN' && !isNaN(tiempoSumado)) {
      return tiempoSumado;
    }

    // Si no, calcular manualmente desde fechaTiempos
    const tiempos = [];

    // Tiempo de Solicitud (tipo1)
    if (fechaTiempos?.tipo1?.length > 1) {
      tiempos.push(calcularTiempoTranscurrido(
        fechaTiempos.tipo1[0]?.FechaSistema,
        fechaTiempos.tipo1[1]?.FechaSistema
      ));
    }

    // Tiempo Documental (tipo3)
    if (fechaTiempos?.tipo3?.some(item => item.idEstadoVerificacionDocumental === 2) &&
      fechaTiempos?.tipo3?.some(item => item.idEstadoVerificacionDocumental === 4)) {
      tiempos.push(calcularTiempoTranscurrido(
        fechaTiempos.tipo3.find(item => item.idEstadoVerificacionDocumental === 2)?.FechaSistema,
        fechaTiempos.tipo3.find(item => item.idEstadoVerificacionDocumental === 4)?.FechaSistema
      ));
    }

    // Tiempo Telefónica (tipo2)
    if (fechaTiempos?.tipo2?.length > 0 &&
      fechaTiempos?.tipo2?.some(item => item.idEstadoVerificacionDocumental === 3)) {
      tiempos.push(calcularTiempoTranscurrido(
        fechaTiempos.tipo2.slice().reverse().find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema,
        fechaTiempos.tipo2.find(item => item.idEstadoVerificacionDocumental === 3)?.FechaSistema
      ));
    }

    // Tiempo Domicilio (tipo4)
    if (fechaTiempos?.tipo4?.length > 0 &&
      fechaTiempos?.tipo4?.some(item => item.idEstadoVerificacionDocumental === 2)) {
      tiempos.push(calcularTiempoTranscurrido(
        fechaTiempos.tipo4.find(item => item.idEstadoVerificacionDocumental == 1)?.FechaSistema,
        fechaTiempos.tipo4.find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema
      ));
    }

    // Tiempo Trabajo (tipo5)
    if (fechaTiempos?.tipo5?.length > 0 &&
      fechaTiempos?.tipo5?.some(item => item.idEstadoVerificacionDocumental === 2)) {
      tiempos.push(calcularTiempoTranscurrido(
        fechaTiempos.tipo5.find(item => item.idEstadoVerificacionDocumental == 1)?.FechaSistema,
        fechaTiempos.tipo5.find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema
      ));
    }

    // Si no hay tiempos, retornar mensaje
    if (tiempos.length === 0 || tiempos.every(t => !t || t === 'NaN')) {
      return '0h 0m';
    }

    // Si hay un solo tiempo válido, retornarlo
    if (tiempos.length === 1) {
      return tiempos[0];
    }

    // Si hay múltiples tiempos, sumarlos
    let totalMinutos = 0;
    tiempos.forEach(tiempo => {
      if (tiempo && tiempo !== 'NaN') {
        // Formato: "Xh Ym" (ej: "2h 30m")
        const matchHorasMinutos = tiempo.match(/(\d+)h\s*(\d+)m/);
        if (matchHorasMinutos) {
          totalMinutos += parseInt(matchHorasMinutos[1]) * 60 + parseInt(matchHorasMinutos[2]);
          return;
        }

        // Formato: "Xmin" (ej: "3min", "45min")
        const matchSoloMinutos = tiempo.match(/(\d+)min/);
        if (matchSoloMinutos) {
          totalMinutos += parseInt(matchSoloMinutos[1]);
          return;
        }

        // Formato: "Xh" solo horas (ej: "2h")
        const matchSoloHoras = tiempo.match(/(\d+)h/);
        if (matchSoloHoras) {
          totalMinutos += parseInt(matchSoloHoras[1]) * 60;
        }
      }
    });

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    // Retornar formato apropiado
    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${minutos}min`;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth className="backdrop-blur-sm">
      {/* Header con gradiente moderno */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 py-2.5 relative overflow-hidden">
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
              <PendingActionsIcon className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Seguimiento de Solicitud</h2>
            </div>
          </div>

          {/* Badge de tiempo total */}
          <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-md">
            <div className="text-[10px] font-semibold text-blue-100 uppercase tracking-wide">Tiempo Total</div>
            <div className="text-lg font-bold text-white mt-0.5">{calcularTiempoTotal()}</div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white px-4 py-4 border-b-2 border-gray-200">


        {/* Timeline Horizontal Moderno */}
        <div className="relative">
          {/* Línea horizontal de fondo */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 transform -translate-y-1/2 rounded-full"></div>

          {/* Grid de etapas */}
          <div className="grid grid-cols-5 gap-2 relative z-10">
            {/* Solicitud */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-1 mb-2">
                {fechaTiempos?.tipo1?.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-200">
                    {formatDateTime(fechaTiempos?.tipo1[0]?.FechaSistema)}
                  </span>
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md border-2 border-white transform hover:scale-110 transition-transform duration-300">
                <PendingActionsIcon className="text-white text-lg" />
              </div>

              <div className="mt-1.5 text-center">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Solicitud</p>
              </div>

              <div className="flex flex-col items-center gap-1 mt-2">
                {fechaTiempos?.tipo1?.length > 1 && (
                  <>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-200">
                      {formatDateTime(fechaTiempos?.tipo1[1]?.FechaSistema)}
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-[10px] font-bold shadow-sm">
                      ⏱️ {calcularTiempoTranscurrido(
                        fechaTiempos?.tipo1[0]?.FechaSistema,
                        fechaTiempos?.tipo1[1]?.FechaSistema
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Documental */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-1 mb-2">
                {fechaTiempos?.tipo3?.some(item => item.idEstadoVerificacionDocumental === 2) && (
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-semibold border border-green-200">
                    {formatDateTime(fechaTiempos?.tipo3?.find(item => item.idEstadoVerificacionDocumental === 2)?.FechaSistema)}
                  </span>
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md border-2 border-white transform hover:scale-110 transition-transform duration-300">
                <FolderIcon className="text-white text-lg" />
              </div>

              <div className="mt-1.5 text-center">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Documental</p>
              </div>

              <div className="flex flex-col items-center gap-1 mt-2">
                {fechaTiempos?.tipo3?.some(item => item.idEstadoVerificacionDocumental === 4) && (
                  <>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-semibold border border-green-200">
                      {formatDateTime(fechaTiempos?.tipo3?.find(item => item.idEstadoVerificacionDocumental === 4)?.FechaSistema)}
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full text-[10px] font-bold shadow-sm">
                      ⏱️ {calcularTiempoTranscurrido(
                        fechaTiempos?.tipo3.find(item => item.idEstadoVerificacionDocumental === 2)?.FechaSistema,
                        fechaTiempos?.tipo3.find(item => item.idEstadoVerificacionDocumental === 4)?.FechaSistema
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Telefónica */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-1 mb-2">
                {fechaTiempos?.tipo2?.length > 0 && (
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-semibold border border-purple-200">
                    {formatDateTime(fechaTiempos?.tipo2?.slice().reverse().find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema)}
                  </span>
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md border-2 border-white transform hover:scale-110 transition-transform duration-300">
                <PhoneInTalkIcon className="text-white text-lg" />
              </div>

              <div className="mt-1.5 text-center">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Telefónica</p>
              </div>

              <div className="flex flex-col items-center gap-1 mt-2">
                {fechaTiempos?.tipo2?.some(item => item.idEstadoVerificacionDocumental === 3) && (
                  <>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-semibold border border-purple-200">
                      {formatDateTime(fechaTiempos?.tipo2?.find(item => item.idEstadoVerificacionDocumental === 3)?.FechaSistema)}
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-[10px] font-bold shadow-sm">
                      ⏱️ {calcularTiempoTranscurrido(
                        fechaTiempos?.tipo2?.slice().reverse().find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema,
                        fechaTiempos?.tipo2?.find(item => item.idEstadoVerificacionDocumental === 3)?.FechaSistema
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Domicilio */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-1 mb-2">
                {fechaTiempos?.tipo4?.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-semibold border border-amber-200">
                    {formatDateTime(fechaTiempos?.tipo4?.find(item => item.idEstadoVerificacionDocumental == 1)?.FechaSistema)}
                  </span>
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md border-2 border-white transform hover:scale-110 transition-transform duration-300">
                <HouseIcon className="text-white text-lg" />
              </div>

              <div className="mt-1.5 text-center">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Domicilio</p>
              </div>

              <div className="flex flex-col items-center gap-1 mt-2">
                {fechaTiempos?.tipo4?.some(item => item.idEstadoVerificacionDocumental === 2) && (
                  <>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-semibold border border-amber-200">
                      {formatDateTime(fechaTiempos?.tipo4?.find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema)}
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full text-[10px] font-bold shadow-sm">
                      ⏱️ {calcularTiempoTranscurrido(
                        (fechaTiempos?.tipo4?.find(item => item.idEstadoVerificacionDocumental == 1)?.FechaSistema),
                        (fechaTiempos?.tipo4?.find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema)
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Trabajo */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-1 mb-2">
                {fechaTiempos?.tipo5?.length > 0 && (
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-semibold border border-rose-200">
                    {formatDateTime(fechaTiempos?.tipo5?.find(item => item.idEstadoVerificacionDocumental == 1)?.FechaSistema)}
                  </span>
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-md border-2 border-white transform hover:scale-110 transition-transform duration-300">
                <ApartmentIcon className="text-white text-lg" />
              </div>

              <div className="mt-1.5 text-center">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Trabajo</p>
              </div>

              <div className="flex flex-col items-center gap-1 mt-2">
                {fechaTiempos?.tipo4?.some(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema && (
                  <>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-semibold border border-rose-200">
                      {formatDateTime(fechaTiempos?.tipo5?.find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema)}
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-full text-[10px] font-bold shadow-sm">
                      ⏱️ {calcularTiempoTranscurrido(
                        fechaTiempos?.tipo5?.find(item => item.idEstadoVerificacionDocumental == 1)?.FechaSistema,
                        fechaTiempos?.tipo5?.find(item => item.idEstadoVerificacionDocumental == 2)?.FechaSistema
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Imagen y Botones */}
      <DialogContent className="!p-6 bg-gradient-to-br from-gray-50 to-blue-50">
        {selectedRow && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sección de Imagen */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Fotografía del Cliente
                </h4>

                {/* Contenedor de la imagen */}
                <div className="relative group">
                  <div className="w-full aspect-square rounded-xl overflow-hidden border-4 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                    {!previewUrl && (!selectedRow.imagen || selectedRow.imagen === "prueba") ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-24 w-24 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={previewUrl || selectedRow.imagen}
                        alt="Foto del cliente"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Botones de Acción */}
                {puedeAprobar(selectedRow) &&
                  selectedRow.estado !== "APROBADO" &&
                  selectedRow.estado !== "RECHAZADO" &&
                  selectedRow.estado !== "FACTURADO" &&
                  selectedRow.estado !== "NOTA DE CRÉDITO AUTOMÁTICA" && (
                    <div className="mt-6 space-y-4">
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                        ref={inputFileRef}
                        style={{ display: "none" }}
                      />

                      {/* Botones de Foto */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setOpenCameraModal(true)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          </svg>
                          Tomar Foto
                        </button>

                        <button
                          onClick={() => inputFileRef.current.click()}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          Cargar Foto
                        </button>
                      </div>

                      {/* Botón Subir */}
                      <button
                        onClick={handleUploadClick}
                        disabled={!fileToUpload}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 transform ${fileToUpload
                          ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                        {fileToUpload ? "Subir Imagen" : "Seleccione una imagen"}
                      </button>

                      {/* Verificar Fotos */}
                      {!ExistPrefactura ? (
                        <button
                          onClick={async () => {
                            const cedula = selectedRow?.cedula;
                            const dactilar = selectedRow?.CodigoDactilar;
                            const imagenSubida = selectedRow?.imagen;

                            if (!cedula || !dactilar || !imagenSubida) {
                              setErrorModalData({
                                tipo: 'datos_incompletos',
                                mensaje: 'Datos incompletos',
                                detalle: 'No se pueden verificar las fotos porque faltan datos en la solicitud:\n\n' +
                                  `• Cédula: ${cedula || 'NO DISPONIBLE'}\n` +
                                  `• Código Dactilar: ${dactilar || 'NO DISPONIBLE'}\n` +
                                  `• Imagen: ${imagenSubida ? 'Disponible' : 'NO DISPONIBLE'}\n\n` +
                                  'Por favor complete los datos faltantes antes de continuar.'
                              });
                              setErrorModalOpen(true);
                              return;
                            }

                            const result = await fetchImagenRegistroCivil(cedula, dactilar);

                            if (result.success && result.foto && result.foto.trim() !== "") {
                              await handleVerificarIdentidad(imagenSubida, result.foto);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Verificar Fotos
                        </button>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center gap-3 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-4 rounded-xl shadow-md">
                          <ReportProblemIcon fontSize="large" className="text-red-600 animate-pulse" />
                          <p className="font-bold text-red-800 text-sm">
                            No se encontró ninguna <span className="uppercase">pre-factura activa</span>
                          </p>
                          <span className="text-xs text-red-600">
                            Si considera que esto es un error, contacte a soporte.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>

            <Dialog
              open={openCameraModal}
              onClose={() => setOpenCameraModal(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Tomar Foto con Cámara</DialogTitle>
              <DialogContent>
                <CapturarCamara
                  onCapture={(imgBase64) => {
                    setImagenCapturada(imgBase64);
                    setPreviewUrl(imgBase64);
                    setOpenCameraModal(false);

                    const blob = fetch(imgBase64)
                      .then((res) => res.blob())
                      .then((blobData) => {
                        const file = new File([blobData], "captura.jpg", {
                          type: "image/jpeg",
                        });
                        setFileToUpload(file);
                      });
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Sección de Información del Cliente */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Información de la Solicitud
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                  {/* Cédula */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                        <BadgeIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Cédula</p>
                        <p className="text-xs font-bold text-gray-900">{selectedRow.cedula}</p>
                      </div>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                        <PersonIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Nombre</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{selectedRow.nombre}</p>
                      </div>
                    </div>
                  </div>



                  {/* Email */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                        <EmailIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Email</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{selectedRow.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vendedor */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                        <SupervisorAccountIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Vendedor</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{selectedRow.vendedor}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Grid de 3 columnas para Estado, Celular, Código Dactilar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  {/* Estado */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                        <InfoIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Estado</p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedRow.estado === "activo"
                            ? "bg-green-600 text-white"
                            : selectedRow.estado === "pendiente"
                              ? "bg-amber-600 text-white"
                              : selectedRow.estado === "anulado"
                                ? "bg-gray-500 text-white"
                                : selectedRow.estado === "aprobado"
                                  ? "bg-blue-700 text-white"
                                  : selectedRow.estado === "rechazado"
                                    ? "bg-red-700 text-white"
                                    : "bg-slate-700 text-white"
                            }`}
                        >
                          {selectedRow.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Celular */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                        <PhoneIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Celular</p>
                        <p className="text-xs font-bold text-gray-900">{selectedRow.celular}</p>
                      </div>
                    </div>
                  </div>

                  {/* Codigo Dactilar */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                        <FingerprintIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Código Dactilar</p>
                          <p className="text-xs font-bold text-gray-900">{selectedRow.CodigoDactilar}</p>
                        </div>
                        {editarCodDac && editarCodDac2 && (
                          <button
                            onClick={handleOpenEditModal}
                            className="ml-2 p-1.5 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                          >
                            <BorderColorIcon sx={{ fontSize: 16 }} className="text-blue-900" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid de 3 columnas para Almacén, Tipo de Consulta, Producto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  {/* Fecha */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                        <EventIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Fecha</p>
                        <p className="text-xs font-bold text-gray-900">{selectedRow.fecha.substring(0, 10)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Afiliado */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Afiliado</p>
                        <p className="text-xs font-bold text-gray-900">{selectedRow.afiliado}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tiene RUC */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                        <BusinessIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Tiene RUC</p>
                        <p className="text-xs font-bold text-gray-900">{selectedRow.tieneRuc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">


                  {/* Tipo de Consulta */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                        <InfoIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Tipo de Consulta</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{selectedRow.consulta}</p>
                      </div>
                    </div>
                  </div>

                  {/* Almacén */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                        <StoreIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Almacén</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{selectedRow.almacen}</p>
                      </div>
                    </div>
                  </div>

                  {/* Producto */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                        <ShoppingCartIcon sx={{ fontSize: 16 }} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Producto</p>
                        <p className="text-xs font-bold text-gray-900">{selectedRow.idProducto}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {/* Ingreso Afiliación */}
                  {selectedRow.FechaAfiliacionIngreso !== '1970-01-01' && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                          <EventIcon sx={{ fontSize: 16 }} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Ingreso Afiliación</p>
                          <p className="text-xs font-bold text-gray-900">{selectedRow.FechaAfiliacionIngreso}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Afiliación Hasta */}
                  {selectedRow.FechaAfiliacionHasta !== '1970-01-01' && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center">
                          <EventIcon sx={{ fontSize: 16 }} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Afiliación Hasta</p>
                          <p className="text-xs font-bold text-gray-900">{selectedRow.FechaAfiliacionHasta}</p>
                        </div>
                      </div>
                    </div>
                  )}


                </div>

                {/* Botones de Acción */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {permitirEquifax() && (
                    <button
                      onClick={() => handleEquifax(data)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Consultar Equifax
                    </button>
                  )}

                  {!ExistPrefactura && puedeAprobar(selectedRow) && selectedRow.estado !== "RECHAZADO" && (
                    <button
                      onClick={handleAbrirVerificacionManual}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Verificación Facial
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions className="!p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-200">
        <div className="flex items-center justify-between w-full gap-4">
          {selectedRow?.Estado === 1 && (
            <button
              onClick={() => setShowModalRechazo(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Rechazar Solicitud
            </button>
          )}

          <div className="flex-1"></div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Cerrar
          </button>
        </div>

        <ModalConfirmacionRechazo
          isOpen={showModalRechazo}
          onClose={() => setShowModalRechazo(false)}
          onConfirm={handleRechazar}
          solicitudData={selectedRow}
        />
      </DialogActions>
    </Dialog>
  );
};


