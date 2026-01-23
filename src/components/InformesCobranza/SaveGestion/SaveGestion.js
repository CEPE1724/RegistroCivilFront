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

export function SaveGestion({ isOpen, onClose, estadoGestion, datosCobranza }) {
    console.log('SaveGestion - Datos recibidos:', { estadoGestion, datosCobranza });

    const [formData, setFormData] = useState({
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

    const [tipoContactoData, setTipoContacto] = useState([]);
    const [selectResultadoData, setSelectResultado] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            console.log('Respuesta SelectTipoContacto:', response.data);
            const tipoContactoData = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data ? [response.data.data] : [];
            console.log('TipoContactoData procesado:', tipoContactoData);
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
            console.log('Respuesta SelectTipoResultado:', response.data);
            const selectResultadoData = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data ? [response.data.data] : [];
            console.log('SelectResultadoData procesado:', selectResultadoData);
            setSelectResultado(selectResultadoData);
        } catch (error) {
            console.error("Error fetching Select Resultado:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardarGestion = async () => {
        if (!formData.dato || !formData.tipoContacto || !formData.descripcion) {
            setError('Por favor completa todos los campos requeridos de gestión');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem("token");

            // Preparar datos para enviar
            const datosEnvio = {
                idCbo_EstadoGestion: formData.dato,
                idCbo_EstadosTipocontacta: formData.tipoContacto,
                idCbo_Resultadogestión: formData.descripcion,
                fechaPago: formData.fechaPago || null,
                valor: formData.valor || '0.00',
                observacion: formData.observacion,
                telefono: formData.telefono,
                fecha: formData.fecha,
                ...datosCobranza
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
            console.error("Error al guardar gestión:", error);
            setError(error.response?.data?.message || 'Error al guardar la gestión');
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
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 rounded-full p-2">
                            <DocumentTextIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Ingresar Gestión</h2>
                            <p className="text-xs text-blue-100">Registra una nueva gestión de cobranza</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                    {/* Mensajes de Estado */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
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
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3">
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
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border-l-4 border-blue-500 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Información Base</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Fecha */}
                            <div className="space-y-2">
                                <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                    <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                                    Fecha
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={formData.fecha}
                                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                    readOnly
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                    <PhoneIcon className="w-4 h-4 mr-2 text-blue-600" />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                    placeholder="Ej: 0991234567"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Flujo de Gestión (Cascada) */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border-l-4 border-purple-500 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Flujo de Gestión</h3>
                            <span className="text-xs text-gray-600 ml-auto">Selecciona en orden →</span>
                        </div>

                        <div className="space-y-3">
                            {/* Paso 1: Dato */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-purple-700 uppercase tracking-wide block flex items-center">
                                    <span className="bg-purple-200 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2">1</span>
                                    Tipo de Gestión (Dato)
                                    {formData.dato && <span className="ml-auto text-green-600 text-xs">✓ Seleccionado</span>}
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
                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-sm bg-white font-medium"
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
                            <div className="space-y-2 opacity-transition">
                                <label className="text-xs font-bold uppercase tracking-wide block flex items-center" style={{ color: formData.dato ? '#7c3aed' : '#9ca3af' }}>
                                    <span className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2" style={{ backgroundColor: formData.dato ? '#e9d5ff' : '#e5e7eb', color: formData.dato ? '#7c3aed' : '#9ca3af' }}>2</span>
                                    Tipo de Contacto
                                    {formData.tipoContacto && <span className="ml-auto text-green-600 text-xs">✓ Seleccionado</span>}
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
                                    className="w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none transition-all text-sm bg-white font-medium"
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
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide block flex items-center" style={{ color: formData.tipoContacto ? '#7c3aed' : '#9ca3af' }}>
                                    <span className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2" style={{ backgroundColor: formData.tipoContacto ? '#e9d5ff' : '#e5e7eb', color: formData.tipoContacto ? '#7c3aed' : '#9ca3af' }}>3</span>
                                    Resultado/Descripción
                                    {formData.descripcion && <span className="ml-auto text-green-600 text-xs">✓ Seleccionado</span>}
                                </label>
                                <select
                                    value={formData.descripcion}
                                    onChange={(e) => {
                                        handleInputChange('descripcion', e.target.value);
                                        if (e.target.value && e.target.value.toLowerCase().includes('compromiso')) {
                                            // Mantener
                                        } else {
                                            setFormData(prev => ({ ...prev, fechaPago: '', valor: '0.00' }));
                                        }
                                    }}
                                    disabled={!formData.tipoContacto}
                                    className="w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none transition-all text-sm bg-white font-medium"
                                    style={{
                                        borderColor: formData.tipoContacto ? '#e9d5ff' : '#f3f4f6',
                                        backgroundColor: formData.tipoContacto ? '#ffffff' : '#f9fafb',
                                        cursor: formData.tipoContacto ? 'pointer' : 'not-allowed',
                                        opacity: formData.tipoContacto ? 1 : 0.6
                                    }}
                                >
                                    <option value="">→ Selecciona primero tipo de contacto...</option>
                                    {selectResultadoData && selectResultadoData.length > 0 && selectResultadoData.map((item) => (
                                        <option key={item.idCbo_Resultadogestión} value={item.idCbo_Resultadogestión}>
                                            {item.Resultado || item.Descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Compromiso de Pago (Condicional) */}
                    {formData.descripcion && formData.descripcion.toLowerCase().includes('compromiso') && (
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border-l-4 border-amber-500 p-5 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Detalles de Compromiso de Pago</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wide block flex items-center">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        Fecha de Pago Comprometida
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.fechaPago}
                                        onChange={(e) => handleInputChange('fechaPago', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-sm bg-white font-medium cursor-pointer"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wide block flex items-center">
                                        <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                                        Monto a Pagar
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.valor}
                                        onChange={(e) => handleInputChange('valor', e.target.value)}
                                        step="0.01"
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all text-sm bg-white font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección 4: Observaciones */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border-l-4 border-green-500 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Notas Adicionales</h3>
                        </div>
                        <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                            <ChatBubbleBottomCenterTextIcon className="w-4 h-4 mr-2 text-green-600" />
                            Observación
                        </label>
                        <textarea
                            value={formData.observacion}
                            onChange={(e) => handleInputChange('observacion', e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2.5 rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all text-sm resize-none bg-white"
                            placeholder="Ingrese observaciones, notas especiales o detalles adicionales..."
                        />
                    </div>
                </div>

                {/* Footer - Botones */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            handleLimpiar();
                            onClose();
                        }}
                        className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-bold rounded-lg transition-all duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardarGestion}
                        disabled={loading || !formData.dato || !formData.tipoContacto || !formData.descripcion}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white text-sm font-bold rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <CheckIcon className="w-4 h-4" />
                        {loading ? 'Guardando...' : 'Guardar Gestión'}
                    </button>
                </div>
            </div>
        </div>
    );
}
