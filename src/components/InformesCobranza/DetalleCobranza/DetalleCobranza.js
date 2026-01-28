import React, { useEffect, useState } from 'react';
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


    const [showSaveGestion, setShowSaveGestion] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tipoContactoData, setTipoContacto] = useState([]);
    const [selectResultado, setSelectResultado] = useState([]);
    const [direccionData, setDireccionData] = useState(null);
    const [datosCobranza, setDatosCobranza] = useState(null);
    const [historialAPI, setHistorialAPI] = useState([]);

    useEffect(() => {
        if (isOpen && data && data.sCre_SolicitudWeb) {
            fetchSelectResultado(data.sCre_SolicitudWeb);
        }
    }, [isOpen, data]);

    const fetchSelectResultado = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(APIURL.Cbo_GestorDeCobranzasOperativodet(id));
         
            
            // Extraer el objeto correctamente - puede ser Array o Objeto
            let datosDir = null;
            
            if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                datosDir = response.data.data[0]; // Primer elemento del array
            } else if (response.data.data && typeof response.data.data === 'object') {
                datosDir = response.data.data;
            } else if (Array.isArray(response.data) && response.data.length > 0) {
                datosDir = response.data[0];
            } else {
                datosDir = response.data;
            }
            
          
            setDireccionData(datosDir);
            setSelectResultado(response.data);
        } catch (error) {
            console.error("Error fetching Select Resultado:", error);
            setError('Error al cargar la información');
        } finally {
            setLoading(false);
        }
    };


    const fetchDataCobranza = async () => {
        if (data && data.sCre_SolicitudWeb) {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(APIURL.getDetalleGestoresCobranzasDetalleOperativoWeb(data.idCompra, data.sCre_SolicitudWeb));     
          
                setDatosCobranza(response.data);
                
                // Procesar el historial desde la API
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setHistorialAPI(response.data);
                } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    setHistorialAPI(response.data.data);
                } else {
                    setHistorialAPI([]);
                }
            } catch (error) {
                console.error("Error fetching Datos Cobranza:", error);
                setError('Error al cargar la información de cobranza');
                setHistorialAPI([]);
            }
            finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDataCobranza();
            fetchSelectResultado(data.idCompra);
        }
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
                        {/* Header Premium */}
                        <div className="relative bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 px-8 py-6 flex items-center justify-between overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
                            </div>
                            
                            <div className="relative flex-1 flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg">
                                    <DocumentTextIcon className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-white">
                                    <h2 className="text-2xl font-bold tracking-tight">Gestión de Cobranza</h2>
                                    <p className="text-blue-100 text-sm mt-1 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        Cliente: ZUMBA TOBAR NATHALY ELIZABETH | Cédula: 0926654815
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="relative p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                                <XMarkIcon className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Address Bar - Mejorado */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-4 border-b-2 border-blue-100">
                            {loading && (
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin">
                                        <MapPinIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Cargando información de dirección...</p>
                                </div>
                            )}
                            {direccionData && (
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 mb-2">INFORMACIÓN DE DIRECCIÓN</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {direccionData.provincia && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Provincia</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.provincia.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.canton && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Cantón</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.canton.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.parroquia && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Parroquia</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.parroquia.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.barrio && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Barrio</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.barrio.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.CallePrincipal && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Calle Principal</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.CallePrincipal.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.CalleSecundaria && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Calle Secundaria</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.CalleSecundaria.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.NumeroCasa && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Número Casa</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.NumeroCasa.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.Celular && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-green-200 shadow-sm bg-green-50">
                                                        <p className="text-xs font-semibold text-green-700 uppercase">Celular</p>
                                                        <p className="text-sm text-green-900 font-bold">{direccionData.Celular.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.TelefonoDomicilio && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-semibold text-slate-600 uppercase">Teléfono</p>
                                                        <p className="text-sm text-slate-900 font-bold">{direccionData.TelefonoDomicilio.toUpperCase()}</p>
                                                    </div>
                                                )}
                                                {direccionData.ReferenciaUbicacion && (
                                                    <div className="bg-white rounded-lg p-2.5 border border-amber-200 shadow-sm bg-amber-50 col-span-2 md:col-span-3 lg:col-span-4">
                                                        <p className="text-xs font-semibold text-amber-700 uppercase">Referencia de Ubicación</p>
                                                        <p className="text-sm text-amber-900 font-bold">{direccionData.ReferenciaUbicacion.toUpperCase()}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!loading && !direccionData && (
                                <p className="text-sm text-slate-600 italic">No hay información de dirección disponible</p>
                            )}
                        </div>

                        {/* Content - Scrollable */}
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 250px)', paddingBottom: '100px' }}>
                            <div className="p-8">
                                {/* Tabla de Historial Mejorada */}
                                <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-500 rounded-xl">
                                            <DocumentTextIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-wide">HISTORIAL DE GESTIONES</h3>
                                            <p className="text-blue-200 text-xs mt-1">{historialAPI.length} registro(s) encontrado(s)</p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-max border-collapse">
                                            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300 sticky top-0 z-10">
                                                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300">
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Tipo</th>
                                              
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Fecha</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Operador</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Estado</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Tipo Contrato</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Resultado</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Fecha Pago</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Valor</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Estado Pago</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Nombre</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Usuario</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Dirección</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Teléfono</th>
                                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-800 uppercase tracking-wide whitespace-nowrap">Notas</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {historialAPI.map((item, index) => (
                                                    <tr key={index} className="hover:bg-blue-50 transition-colors duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                                                       
                                                        <td className="px-3 py-3">
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">{item.Tipo || '-'}</span>
                                                        </td>
                                                     
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium whitespace-nowrap">{item.Fecha ? new Date(item.Fecha).toLocaleString('es-EC') : '-'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium">{item.Operador_Cobrador || '-'}</td>
                                                        <td className="px-3 py-3">
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">{item.Estado || '-'}</span>
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                (item['Tipo Contrato'] || '').includes('DIRECTO')
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {item['Tipo Contrato'] || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium">{item.Resultado || '-'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium whitespace-nowrap">{item.FechaPago && item.FechaPago !== '2000-01-01T05:00:00.000Z' ? new Date(item.FechaPago).toLocaleDateString('es-EC') : '-'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium font-mono whitespace-nowrap">{item.Valor || '0.00'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium">{item.ESTADO_PAGO || '-'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium">{item.Nombre || '-'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium font-mono">{item.Usuario || '-'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium max-w-xs truncate">{item.Direccion || '-'}</td>
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium font-mono whitespace-nowrap">{item.Telefono || '-'}</td>
                                                     
                                                        <td className="px-3 py-3 text-xs text-slate-700 font-medium max-w-sm uppercase truncate">{item.Notas || item.Observacion || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Botones Principales */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-100 via-white to-transparent px-8 py-6 flex gap-4 justify-end border-t border-slate-200 shadow-2xl">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2.5 shadow-md hover:shadow-lg border-2 border-slate-300 hover:border-slate-400 transform hover:scale-105"
                            >
                                <XMarkIcon className="w-5 h-5" />
                                Cerrar
                            </button>
                            <button
                                onClick={() => setShowSaveGestion(true)}
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 hover:from-blue-600 hover:via-blue-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2.5 shadow-xl hover:shadow-2xl transform hover:scale-105 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                <PlusIcon className="w-5 h-5 relative" />
                                <span className="relative">Ingresar Gestión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal SaveGestion */}
            <SaveGestion
                isOpen={showSaveGestion}
                onClose={() => setShowSaveGestion(false)}
                estadoGestion={estadoGestion}
                datosCobranza={direccionData}
                data ={data}
            />
        </div>
    );
};


