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
    CheckIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { APIURL } from '../../../configApi/apiConfig';
import axios from '../../../configApi/axiosConfig';
import { SaveGestion } from '../SaveGestion/SaveGestion';
export function DetalleCobranza({ isOpen, onClose, data, estadoGestion }) {
    console.log('Datos recibidos en DetalleCobranza:', estadoGestion);
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

    const [tipoContactoData, setTipoContacto] = useState([]);
    const [selectResultadoData, setSelectResultado] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSaveGestion, setShowSaveGestion] = useState(false);

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

    ]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const fetchTipoContacto = async (id) => {
        setLoading(true);
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
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(APIURL.SelectTipoResultado(), {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    idCbo_EstadosTipocontacto: id
                }
            });
            const selectResultadoData = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data ? [response.data.data] : [];
            setSelectResultado(selectResultadoData);
        } catch (error) {
            console.error("Error fetching Select Resultado:", error);
        } finally {
            setLoading(false);
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


                                {/* Tabla de Historial */}
                                <div className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden shadow-sm">
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                                            <DocumentTextIcon className="w-5 h-5" />
                                            Historial de Gestiones
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Fecha</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Tipo</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Operador</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Cliente</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Estado</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Tipo Contrato</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Observación</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
                                                {historial.map((item, index) => (
                                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-4 py-3 text-xs text-slate-700 font-medium">{item.fecha}</td>
                                                        <td className="px-4 py-3 text-xs font-semibold text-slate-800">{item.tipo}</td>
                                                        <td className="px-4 py-3 text-xs text-slate-700">{item.operador}</td>
                                                        <td className="px-4 py-3 text-xs text-slate-700">{item.cliente}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                                                                {item.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${item.tipoContrato.includes('CONTACTO INDI')
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {item.tipoContrato}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-slate-700">{item.gestionEs}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Botones Principales */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
                            <button
                                onClick={() => setShowSaveGestion(true)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Ingresar Gestión
                            </button>
                            <div className="flex items-center gap-3">
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

            {/* Modal SaveGestion */}
            <SaveGestion
                isOpen={showSaveGestion}
                onClose={() => setShowSaveGestion(false)}
                estadoGestion={estadoGestion}
                datosCobranza={{
                    telefono: formData.telefono,
                    cliente: data?.cliente || 'ZUMBA TOBAR NATHALY ELIZABETH',
                    cedula: data?.cedula || '0926654815'
                }}
            />
        </div>
    );
};


