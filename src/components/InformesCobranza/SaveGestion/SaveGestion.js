import React, { useState } from 'react';
import {
    XMarkIcon,
    PhoneIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentTextIcon,
    ArrowUpTrayIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { APIURL } from '../../../configApi/apiConfig';
import axios from '../../../configApi/axiosConfig';
import { ConfirmacionGuardarGestion } from './ConfirmacionGuardarGestion';

export function SaveGestion({ isOpen, onClose, estadoGestion, datosCobranza, data }) {


    // IDs de resultados que son compromiso de pago
    const IDS_COMPROMISO = [4, 39, 54, 69];

    const [formData, setFormData] = useState({
        fecha: new Date().toLocaleDateString('es-EC'),
        telefono: datosCobranza?.Celular || '',
        dato: '',
        tipoContacto: '',
        descripcion: '',
        fechaPago: '',
        valor: '0.00',
        observacion: '',
        archivo: null
    });

    const [tipoContactoData, setTipoContacto] = useState([]);
    const [selectResultadoData, setSelectResultado] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showConfirmacion, setShowConfirmacion] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const fetchTipoContacto = async (id) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(APIURL.SelectTipoContacto(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    idCbo_EstadoGestion: id
                }
            });
            const tipoContactoData = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data ? [response.data.data] : [];
            setTipoContacto(tipoContactoData);
        } catch (error) {
            console.error("Error fetching Tipo Contacto:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSelectResultado = async (id) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(APIURL.SelectTipoResultado(), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    idCbo_EstadosTipocontacto: id
                }
            });


            // Manejo flexible de la respuesta
            let selectResultadoData = [];
            if (Array.isArray(response.data)) {
                selectResultadoData = response.data;
            } else if (Array.isArray(response.data.data)) {
                selectResultadoData = response.data.data;
            } else if (response.data.data && typeof response.data.data === 'object') {
                selectResultadoData = [response.data.data];
            }

            setSelectResultado(selectResultadoData);
        } catch (error) {
            console.error("Error fetching Select Resultado:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardarGestion = async () => {
        // PASO 1: Validaciones antes de mostrar confirmación
        if (!formData.dato) {
            setError('❌ Por favor selecciona un Tipo de Gestión');
            return;
        }
        if (!formData.tipoContacto) {
            setError('❌ Por favor selecciona un Tipo de Contacto');
            return;
        }
        if (!formData.descripcion) {
            setError('❌ Por favor selecciona un Resultado/Descripción');
            return;
        }

        // Validar teléfono
        const telefonoLimpio = formData.telefono.replace(/\D/g, '');
        if (!formData.telefono || telefonoLimpio.length !== 10) {
            setError('❌ El teléfono debe tener exactamente 10 dígitos');
            return;
        }

        // Validar notas
        if (!formData.observacion || formData.observacion.trim().length < 10) {
            setError('❌ Las notas deben tener mínimo 10 caracteres');
            return;
        }

        // Validar Compromiso de Pago si está activo
        if (formData.descripcion && IDS_COMPROMISO.includes(parseInt(formData.descripcion))) {
            if (!formData.fechaPago) {
                setError('❌ La fecha de pago es obligatoria cuando hay compromiso');
                return;
            }

            const fechaPagoObj = new Date(formData.fechaPago);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (fechaPagoObj < hoy) {
                setError('❌ La fecha de pago no puede ser menor a la fecha actual');
                return;
            }

            const valorNum = parseFloat(formData.valor);
            if (!formData.valor || valorNum <= 0) {
                setError('❌ El valor debe ser mayor a 0 cuando hay compromiso de pago');
                return;
            }
        }

        // Si todas las validaciones pasaron, mostrar modal de confirmación
        setError('');
        setShowConfirmacion(true);
    };

    const handleConfirmarGuardar = async () => {
        // PASO 2: Guardar después de que el usuario confirme
        const telefonoLimpio = formData.telefono.replace(/\D/g, '');

        setLoading(true);
        setError('');
        setShowConfirmacion(false);

        try {
            const token = localStorage.getItem("token");

            // Preparar datos para enviar
            const datosEnvio = {
                idCompra: data?.idCompra || 0,
                idCbo_EstadoGestion: parseInt(formData.dato),
                idCbo_EstadosTipocontacto: parseInt(formData.tipoContacto) || 0,
                idCbo_ResultadoGestion: parseInt(formData.descripcion),
                Notas: formData.observacion || '',
                telefono: telefonoLimpio,
                FechaPago: formData.fechaPago ? new Date(formData.fechaPago).toISOString() : new Date('2000-01-01T00:00:00Z').toISOString(),
                Valor: formData.descripcion && IDS_COMPROMISO.includes(parseInt(formData.descripcion)) ? parseFloat(formData.valor) : 0
            };



            const response = await axios.post(APIURL.SaveGestion(), datosEnvio, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });



            if (response.data.success || response.status === 200) {
                setSuccess('Gestión guardada exitosamente');
                setTimeout(() => {
                    handleLimpiar();
                    onClose();
                }, 1500);
            }
        } catch (error) {
            console.error("❌ Error al guardar gestión:", error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || 'Error al guardar la gestión');
        } finally {
            setLoading(false);
        }
    };

    const handleLimpiar = () => {
        setFormData({
            fecha: new Date().toLocaleDateString('es-EC'),
            telefono: datosCobranza?.telefono || '',
            dato: '',
            tipoContacto: '',
            descripcion: '',
            fechaPago: '',
            valor: '0.00',
            observacion: '',
            archivo: null
        });
        setTipoContacto([]);
        setSelectResultado([]);
        setError('');
        setSuccess('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 text-white p-8 flex items-center justify-between shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-3 shadow-lg">
                            <DocumentTextIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Ingresar Gestión</h2>
                            <p className="text-blue-200 text-sm mt-1">Registra una nueva gestión de cobranza</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2.5 transition-all duration-200 transform hover:scale-110 relative z-10 backdrop-blur-sm"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
                    {/* Mensajes de Estado */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 animate-slideIn">
                            <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                                <XMarkIcon className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-800">Error</p>
                                <p className="text-xs text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3 animate-slideIn">
                            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                                <CheckIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-green-800">Éxito</p>
                                <p className="text-xs text-green-700">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Sección 1: Información Base */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-l-4 border-blue-500 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">1</div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Información Base</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Fecha */}
                            <div className="space-y-2.5">
                                <label className="flex items-center text-xs font-bold text-blue-700 uppercase tracking-wide">
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    Fecha
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={formData.fecha}
                                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm font-medium text-gray-700 cursor-not-allowed"
                                    readOnly
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2.5">
                                <label className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase tracking-wide">
                                    <span className="flex items-center">
                                        <PhoneIcon className="w-4 h-4 mr-2" />
                                        Teléfono (Obligatorio)
                                    </span>
                                    <span className={`text-xs font-bold ${formData.telefono.replace(/\D/g, '').length === 10 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formData.telefono.replace(/\D/g, '').length}/10
                                    </span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => {
                                        const soloNumeros = e.target.value.replace(/\D/g, '');
                                        handleInputChange('telefono', soloNumeros);
                                    }}
                                    maxLength="10"
                                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:ring-2 focus:outline-none transition-all text-sm font-medium ${formData.telefono.replace(/\D/g, '').length === 10
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                            : 'border-blue-200 focus:border-blue-500 focus:ring-blue-200'
                                        }`}
                                    placeholder="Ej: 0991234567"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Flujo de Gestión (Cascada) */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border-l-4 border-purple-500 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">2</div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Flujo de Gestión</h3>
                            <span className="text-xs text-gray-600 ml-auto bg-purple-100 px-3 py-1 rounded-full">Selecciona en orden →</span>
                        </div>

                        <div className="space-y-5">
                            {/* Paso 1: Dato */}
                            <div className="space-y-2.5">
                                <label className="text-xs font-bold text-purple-700 uppercase tracking-wide block flex items-center">
                                    <span className="bg-gradient-to-br from-purple-200 to-purple-300 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">1</span>
                                    Tipo de Gestión
                                    {formData.dato && <span className="ml-auto text-green-600 text-xs font-bold flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Seleccionado</span>}
                                </label>
                                <select
                                    value={formData.dato}
                                    onChange={(e) => {
                                        handleInputChange('dato', e.target.value);
                                        setFormData(prev => ({ ...prev, tipoContacto: '', descripcion: '' }));
                                        if (e.target.value) {
                                            fetchTipoContacto(e.target.value);
                                        } else {
                                            setTipoContacto([]);
                                            setSelectResultado([]);
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-sm bg-white font-medium hover:border-purple-300"
                                >
                                    <option value="">→ Seleccionar tipo de gestión...</option>
                                    {estadoGestion && estadoGestion.length > 0 && estadoGestion.map((item) => (
                                        <option key={item.idCbo_EstadoGestion} value={item.idCbo_EstadoGestion}>
                                            {item.Estado}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Paso 2: Tipo Contacto */}
                            <div className="space-y-2.5 transition-all duration-300">
                                <label className="text-xs font-bold uppercase tracking-wide block flex items-center" style={{ color: formData.dato ? '#9333ea' : '#9ca3af' }}>
                                    <span className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 transition-all" style={{ backgroundColor: formData.dato ? '#e9d5ff' : '#e5e7eb', color: formData.dato ? '#9333ea' : '#9ca3af' }}>2</span>
                                    Tipo de Contacto
                                    {formData.tipoContacto && <span className="ml-auto text-green-600 text-xs font-bold flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Seleccionado</span>}
                                </label>
                                <select
                                    value={formData.tipoContacto}
                                    onChange={(e) => {
                                        handleInputChange('tipoContacto', e.target.value);
                                        setFormData(prev => ({ ...prev, descripcion: '' }));
                                        if (e.target.value) {
                                            fetchSelectResultado(e.target.value);
                                        } else {
                                            setSelectResultado([]);
                                        }
                                    }}
                                    disabled={!formData.dato}
                                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all text-sm bg-white font-medium"
                                    style={{
                                        borderColor: formData.dato ? '#e9d5ff' : '#f3f4f6',
                                        backgroundColor: formData.dato ? '#ffffff' : '#f9fafb',
                                        cursor: formData.dato ? 'pointer' : 'not-allowed',
                                        opacity: formData.dato ? 1 : 0.6
                                    }}
                                >
                                    <option value="">→ Selecciona primero tipo de gestión...</option>
                                    {tipoContactoData && tipoContactoData.length > 0 && tipoContactoData.map((item) => (
                                        <option key={item.idCbo_EstadosTipocontacto} value={item.idCbo_EstadosTipocontacto}>
                                            {item.DescripcionTipoContacto || item.Nombre || item.Estado}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Paso 3: Descripción/Resultado */}
                            <div className="space-y-2.5 transition-all duration-300">
                                <label className="text-xs font-bold uppercase tracking-wide block flex items-center" style={{ color: formData.tipoContacto ? '#9333ea' : '#9ca3af' }}>
                                    <span className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 transition-all" style={{ backgroundColor: formData.tipoContacto ? '#e9d5ff' : '#e5e7eb', color: formData.tipoContacto ? '#9333ea' : '#9ca3af' }}>3</span>
                                    Resultado/Descripción
                                    {formData.descripcion && <span className="ml-auto text-green-600 text-xs font-bold flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Seleccionado</span>}
                                </label>
                                <select
                                    value={formData.descripcion}
                                    onChange={(e) => {
                                        const selectedId = parseInt(e.target.value);
                                       
                                        handleInputChange('descripcion', e.target.value);
                                        // Si NO es compromiso, limpiar los campos de compromiso
                                        if (!IDS_COMPROMISO.includes(selectedId)) {
                                            setFormData(prev => ({ ...prev, fechaPago: '', valor: '0.00' }));
                                        }
                                    }}
                                    disabled={!formData.tipoContacto}
                                    className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all text-sm bg-white font-medium"
                                    style={{
                                        borderColor: formData.tipoContacto ? '#e9d5ff' : '#f3f4f6',
                                        backgroundColor: formData.tipoContacto ? '#ffffff' : '#f9fafb',
                                        cursor: formData.tipoContacto ? 'pointer' : 'not-allowed',
                                        opacity: formData.tipoContacto ? 1 : 0.6
                                    }}
                                >
                                    <option value="">→ Selecciona primero tipo de contacto...</option>
                                    {selectResultadoData && selectResultadoData.length > 0 && selectResultadoData.map((item) => (
                                        <option key={item.idCbo_ResultadoGestion} value={item.idCbo_ResultadoGestion}>
                                            {item.Resultado || item.Descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Compromiso de Pago (Condicional) */}
                    {formData.descripcion && IDS_COMPROMISO.includes(parseInt(formData.descripcion)) && (
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border-l-4 border-amber-500 p-6 shadow-sm hover:shadow-md transition-all animate-fadeIn">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">3</div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Detalles de Compromiso de Pago</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2.5">
                                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wide block flex items-center">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        Fecha de Pago Comprometida (Obligatoria)
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.fechaPago}
                                        onChange={(e) => handleInputChange('fechaPago', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none transition-all text-sm bg-white font-medium cursor-pointer ${formData.fechaPago && new Date(formData.fechaPago) >= new Date()
                                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                : 'border-amber-200 focus:border-amber-500 focus:ring-amber-200'
                                            }`}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {formData.fechaPago && new Date(formData.fechaPago) < new Date() && (
                                        <p className="text-xs text-red-600 font-bold">❌ La fecha no puede ser menor a hoy</p>
                                    )}
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wide block flex items-center">
                                        <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                                        Monto a Pagar (Obligatorio y Mayor a 0)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.valor}
                                        onChange={(e) => handleInputChange('valor', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none transition-all text-sm bg-white font-medium ${formData.valor && parseFloat(formData.valor) > 0
                                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                                : 'border-amber-200 focus:border-amber-500 focus:ring-amber-200'
                                            }`}
                                        placeholder="0.00"
                                    />
                                    {formData.valor && parseFloat(formData.valor) <= 0 && (
                                        <p className="text-xs text-red-600 font-bold">❌ El monto debe ser mayor a 0</p>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección 4: Observaciones */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border-l-4 border-green-500 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">4</div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Notas Adicionales</h3>
                        </div>
                        <label className="flex items-center justify-between text-xs font-bold text-green-700 uppercase tracking-wide mb-3">
                            <span className="flex items-center">
                                <ChatBubbleBottomCenterTextIcon className="w-4 h-4 mr-2" />
                                Observación (Mínimo 10 caracteres)
                            </span>
                            <span className={`text-xs font-bold ${formData.observacion.trim().length >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                                {formData.observacion.trim().length}/10
                            </span>
                        </label>
                        <textarea
                            value={formData.observacion}
                            onChange={(e) => handleInputChange('observacion', e.target.value)}
                            rows="4"
                            className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none transition-all text-sm resize-none bg-white font-medium uppercase ${formData.observacion.trim().length >= 10
                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                    : 'border-green-200 focus:border-green-500 focus:ring-green-200'
                                }`}
                            placeholder="Ingrese observaciones, notas especiales o detalles adicionales (mínimo 10 caracteres)..."
                        />
                    </div>
                </div>

                {/* Footer - Botones */}
                <div className="sticky bottom-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 p-6 flex justify-end gap-3 shadow-2xl">
                    <button
                        onClick={() => {
                            handleLimpiar();
                            onClose();
                        }}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <XMarkIcon className="w-5 h-5" />
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardarGestion}
                        disabled={
                            loading ||
                            !formData.dato ||
                            !formData.tipoContacto ||
                            !formData.descripcion ||
                            formData.telefono.replace(/\D/g, '').length !== 10 ||
                            formData.observacion.trim().length < 10 ||
                            (formData.descripcion && IDS_COMPROMISO.includes(parseInt(formData.descripcion)) && (!formData.fechaPago || !formData.valor || parseFloat(formData.valor) <= 0))
                        }
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                        <CheckIcon className="w-5 h-5" />
                        {loading ? 'Guardando...' : 'Guardar Gestión'}
                    </button>
                </div>
            </div>
            <ConfirmacionGuardarGestion
                isOpen={showConfirmacion}
                onConfirm={handleConfirmarGuardar}
                onCancel={() => setShowConfirmacion(false)}
                formData={formData}
                estadoGestion={estadoGestion}
                tipoContactoData={tipoContactoData}
                selectResultadoData={selectResultadoData}
                IDS_COMPROMISO={IDS_COMPROMISO}
            />
        </div>




    );

}
