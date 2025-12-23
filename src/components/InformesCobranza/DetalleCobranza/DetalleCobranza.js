import React, { useState } from 'react';
import { 
    XMarkIcon,
    UserIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    EnvelopeIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    ChatBubbleBottomCenterTextIcon,
    ArrowUpTrayIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

export function DetalleCobranza({ isOpen, onClose, data }) {
    const [formData, setFormData] = useState({
        fecha: new Date().toLocaleDateString('es-EC'),
        vendedor: '',
        telefono: '',
        dato: '',
        direccion: '',
        tipoContacto: '',
        descripcion: '',
        fechaPago: '',
        valor: '0.00',
        emailOperador: '',
        emailCliente: '',
        archivo: null,
        observacion: ''
    });

    const [historial, setHistorial] = useState([
        {
            fecha: '2025/06/26 09:06:18',
            tipo: 'OPERADOR',
            operador: 'COLLAGUAZO ARAUJO ADRIANA MARCELA',
            cliente: 'ZUMBA TOBAR NATHALY ELIZABETH',
            estado: 'GESTION TELEFO',
            tipoContrato: 'CONTACTO INDI',
            gestionEs: 'MENSAJE A'
        },
        {
            fecha: '2025/06/26 09:04:22',
            tipo: 'OPERADOR',
            operador: 'COLLAGUAZO ARAUJO ADRIANA MARCELA',
            cliente: 'ZUMBA TOBAR NATHALY ELIZABETH',
            estado: 'GESTION TELEFO',
            tipoContrato: 'NO CONTACTO',
            gestionEs: 'NO CONTEST'
        },
        {
            fecha: '2025/06/26 09:02:49',
            tipo: 'OPERADOR',
            operador: 'COLLAGUAZO ARAUJO ADRIANA MARCELA',
            cliente: 'ZUMBA TOBAR NATHALY ELIZABETH',
            estado: 'GESTION TELEFO',
            tipoContrato: 'NO CONTACTO',
            gestionEs: 'NO CONTEST'
        },
        {
            fecha: '2025/05/09 11:50:38',
            tipo: 'COBRADOR',
            operador: 'MERCHAN BAQUE FRANCISCO FABRICIO',
            cliente: 'ZUMBA TOBAR NATHALY ELIZABETH',
            estado: 'TERRENO',
            tipoContrato: 'NO CONTACTO',
            gestionEs: 'NO HAY NAD'
        },
        {
            fecha: '2025/04/28 13:30:05',
            tipo: 'COBRADOR',
            operador: 'MERCHAN BAQUE FRANCISCO FABRICIO',
            cliente: 'ZUMBA TOBAR NATHALY ELIZABETH',
            estado: 'TERRENO',
            tipoContrato: 'CONTACTO INDI',
            gestionEs: 'NOTIFICACIO'
        }
    ]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, archivo: file }));
        }
    };

    const handleGuardar = () => {
        console.log('Guardando datos:', formData);
        // Lógica para guardar
        onClose();
    };

    const handleContacto = () => {
        console.log('Abrir módulo de contacto');
    };

    const handleGestion = () => {
        console.log('Abrir módulo de gestión');
    };

    const handleCobranza = () => {
        console.log('Abrir módulo de cobranza');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <DocumentTextIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-white">
                                        <h2 className="text-xl font-bold">Detalle de Gestión de Cobranza</h2>
                                        <p className="text-sm text-blue-100 mt-1">
                                            Cliente: ZUMBA TOBAR NATHALY ELIZABETH | Cédula: 0926654815
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                            >
                                <XMarkIcon className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Address Bar */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200">
                            <p className="text-xs font-medium text-gray-700 leading-relaxed">
                                <span className="font-bold text-gray-800">Dirección:</span> PROVINCIA: GUAYAS CIUDAD: GUAYAQUIL PARROQUIA: TARQUI BARRIO: MAPASINGUE ESTE DIRECCION: COOPERATIVA UNION PAZ Y PROGRESO MZ D SOLAR 5 TELEFONO: 042555212 CELULAR: 0996571796 REFERENCIA: CASA AMARILLA DE 2 PISOS A UNA CUADRA DEL MERCADO SAN FRANCISCO
                            </p>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 250px)' }}>
                            <div className="p-6 space-y-6">
                                {/* Formulario Principal */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Columna Izquierda */}
                                    <div className="space-y-4">
                                        {/* Fecha */}
                                        <div className="space-y-2">
                                            <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                Fecha
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.fecha}
                                                onChange={(e) => handleInputChange('fecha', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                            />
                                        </div>

                                        {/* Vendedor */}
                                        <div className="space-y-2">
                                            <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <UserIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                Vendedor
                                            </label>
                                            <select
                                                value={formData.vendedor}
                                                onChange={(e) => handleInputChange('vendedor', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                            >
                                                <option value="">Seleccionar vendedor...</option>
                                                <option value="vendedor1">Vendedor 1</option>
                                                <option value="vendedor2">Vendedor 2</option>
                                            </select>
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
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                                placeholder="Ingrese teléfono"
                                            />
                                        </div>

                                        {/* Dato */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                                Dato
                                            </label>
                                            <select
                                                value={formData.dato}
                                                onChange={(e) => handleInputChange('dato', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="dato1">Dato 1</option>
                                                <option value="dato2">Dato 2</option>
                                            </select>
                                        </div>

                                        {/* Tipo Contacto */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                                Tipo Contacto
                                            </label>
                                            <select
                                                value={formData.tipoContacto}
                                                onChange={(e) => handleInputChange('tipoContacto', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="llamada">Llamada</option>
                                                <option value="visita">Visita</option>
                                                <option value="whatsapp">WhatsApp</option>
                                            </select>
                                        </div>

                                        {/* Descripción */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                                Descripción
                                            </label>
                                            <select
                                                value={formData.descripcion}
                                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="desc1">Descripción 1</option>
                                                <option value="desc2">Descripción 2</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Columna Derecha */}
                                    <div className="space-y-4">
                                        {/* Dirección */}
                                        <div className="space-y-2">
                                            <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <MapPinIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                Dirección
                                            </label>
                                            <textarea
                                                value={formData.direccion}
                                                onChange={(e) => handleInputChange('direccion', e.target.value)}
                                                rows="4"
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm resize-none"
                                                placeholder="Ingrese la dirección completa"
                                            />
                                        </div>

                                        {/* Fecha Pago y Valor */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                                    Fecha Pago
                                                </label>
                                                <select
                                                    value={formData.fechaPago}
                                                    onChange={(e) => handleInputChange('fechaPago', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                                >
                                                    <option value="">(none)</option>
                                                    <option value="hoy">Hoy</option>
                                                    <option value="manana">Mañana</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                    <CurrencyDollarIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                    Valor
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.valor}
                                                    onChange={(e) => handleInputChange('valor', e.target.value)}
                                                    step="0.01"
                                                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Email Operador/Cobrador */}
                                        <div className="space-y-2">
                                            <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <EnvelopeIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                Email Operador/Cobrador
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.emailOperador}
                                                onChange={(e) => handleInputChange('emailOperador', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                                placeholder="operador@empresa.com"
                                            />
                                        </div>

                                        {/* Email Cliente */}
                                        <div className="space-y-2">
                                            <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <EnvelopeIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                Email Cliente
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.emailCliente}
                                                onChange={(e) => handleInputChange('emailCliente', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm"
                                                placeholder="cliente@email.com"
                                            />
                                        </div>

                                        {/* Archivo */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                                                Archivo
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.archivo ? formData.archivo.name : ''}
                                                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 text-sm"
                                                    placeholder="Ningún archivo seleccionado"
                                                />
                                                <label className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2">
                                                    <ArrowUpTrayIcon className="w-5 h-5" />
                                                    <span>Cargar</span>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Observación */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        <ChatBubbleBottomCenterTextIcon className="w-4 h-4 mr-2 text-blue-600" />
                                        Observación
                                    </label>
                                    <textarea
                                        value={formData.observacion}
                                        onChange={(e) => handleInputChange('observacion', e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm resize-none"
                                        placeholder="Ingrese observaciones adicionales..."
                                    />
                                </div>

                                {/* Botones de Acción Secundarios */}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={handleContacto}
                                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                    >
                                        <PhoneIcon className="w-5 h-5" />
                                        Contacto
                                    </button>
                                    <button
                                        onClick={handleGestion}
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                    >
                                        <DocumentTextIcon className="w-5 h-5" />
                                        Gestión
                                    </button>
                                    <button
                                        onClick={handleCobranza}
                                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                    >
                                        <CurrencyDollarIcon className="w-5 h-5" />
                                        Cobranza
                                    </button>
                                </div>

                                {/* Tabla de Historial */}
                                <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Historial de Gestiones</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Fecha</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tipo</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Operador/Cobrador/Vendedor</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Cliente</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tipo Contrato</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Gestión Es...</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {historial.map((item, index) => (
                                                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                                                        <td className="px-4 py-3 text-xs text-gray-700">{item.fecha}</td>
                                                        <td className="px-4 py-3 text-xs font-medium text-gray-800">{item.tipo}</td>
                                                        <td className="px-4 py-3 text-xs text-gray-700">{item.operador}</td>
                                                        <td className="px-4 py-3 text-xs text-gray-700">{item.cliente}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                                                                {item.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                                                item.tipoContrato.includes('CONTACTO INDI') 
                                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}>
                                                                {item.tipoContrato}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-gray-700">{item.gestionEs}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Botones Principales */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button
                                onClick={handleGuardar}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                            >
                                <CheckIcon className="w-5 h-5" />
                                Guardar
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                            >
                                <XMarkIcon className="w-5 h-5" />
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


