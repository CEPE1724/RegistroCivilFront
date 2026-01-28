import React, { useState, useEffect } from "react";
import axios from "axios";
import { APIURL } from "../../../configApi/apiConfig";
import { PagosTDAmortizacion } from "../PagosTDAmortizacion/PagosTDAmortizacion";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const TablaAmortizacionWeb = ({ idCompra, cliente, cedula, numeroDocumento, onClose }) => {
    const [productos, setProductos] = useState([]);
    const [valores, setValores] = useState({});
    const [listaValores, setListaValores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [token, setToken] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [numeroCuota, setNumeroCuota] = useState(0);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    useEffect(() => {
        if (token) {
            fetchData();
            fetchDataValores();
        }
    }, [token, idCompra]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = APIURL.getViewTablaAmortizacion();

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.post(url, {
                idCompra
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            setProductos(response.data || []);
        } catch (error) {
            console.error("Error al cargar tabla de amortización:", error);

        } finally {
            setLoading(false);
        }
    };

    const fetchDataValores = async () => {
        try {
            const url = APIURL.getViewTablaAmortizacionValores();
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.post(url, {
                idCompra
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

            });

            setValores(response.data?.[0] || {});
        } catch (error) {
            console.error("Error al cargar valores:", error);
        }
    };

    const handleRowPress = async (id, cuota) => {
        setSelectedId(id);
        setNumeroCuota(cuota);

        try {
            
            const url = APIURL.listTablaPagosAmortizacion();

            const response = await axios.post(url, {
                idCre_TablaDeAmortizacion: id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

            });

      
            console.log("🔍 Pagos recibidos:", response.data);
            setListaValores(response.data || []);
            setModalVisible(true);
        } catch (error) {
            console.error("Error al cargar pagos:", error);
        }
    };

    const SearchSaldoVencido = (productos) => {
        let saldoVencido = 0;
        const today = new Date();

        productos.forEach((item) => {
            const venceDate = new Date(item.Vence);
            if (today > venceDate && item.Saldo > 0) {
                saldoVencido += item.Saldo;
            }
        });

        return saldoVencido.toFixed(2);
    };

    useEffect(() => {
        if (productos.length > 0) {
            const saldoVencido = SearchSaldoVencido(productos);
            setValores((prev) => ({
                ...prev,
                SaldoVencido: saldoVencido,
            }));
        }
    }, [productos]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-black/50 to-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-12 max-w-md w-full mx-4 shadow-2xl">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute inset-2 border-4 border-transparent border-t-blue-600 border-r-blue-500 rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-800 font-semibold text-lg">Cargando tabla de amortización</p>
                            <p className="text-gray-500 text-sm mt-2">Por favor espera un momento...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/30 to-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl p-0 space-y-0 max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 text-white p-8 border-b border-slate-700">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                                <h2 className="text-4xl font-bold tracking-tight">Tabla de Amortización</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="border-l-2 border-blue-300/50 pl-4">
                                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Cliente</p>
                                    <p className="text-base font-bold text-white mt-1">{cliente}</p>
                                </div>
                                <div className="border-l-2 border-blue-300/50 pl-4">
                                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Cédula/RUC</p>
                                    <p className="text-base font-bold text-white mt-1">{cedula}</p>
                                </div>
                                <div className="border-l-2 border-blue-300/50 pl-4">
                                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Factura</p>
                                    <p className="text-base font-bold text-white mt-1">{numeroDocumento}</p>
                                </div>
                                <div className="border-l-2 border-blue-300/50 pl-4">
                                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Referencia</p>
                                    <p className="text-base font-bold text-white mt-1">#{idCompra}</p>
                                </div>
                            </div>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
                                title="Cerrar"
                            >
                                <XMarkIcon className="w-7 h-7" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Resumen Ejecutivo - KPIs */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 border-b border-slate-200">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {/* Vencido */}
                        <div className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-red-100 hover:border-red-300">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Vencido</p>
                                <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors"></div>
                            </div>
                            <p className="text-2xl font-bold text-red-700 mb-1">${parseFloat(valores.SaldoVencido || 0).toLocaleString('es-EC', { minimumFractionDigits: 2 })}</p>
                            <p className="text-xs text-red-600 font-medium">En mora</p>
                        </div>

                        {/* Saldo Total */}
                        <div className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-300">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Saldo Total</p>
                                <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
                            </div>
                            <p className="text-2xl font-bold text-blue-700 mb-1">${parseFloat(valores.SaldoTotal || 0).toLocaleString('es-EC', { minimumFractionDigits: 2 })}</p>
                            <p className="text-xs text-blue-600 font-medium">Por cobrar</p>
                        </div>

                        {/* Próximo Vence */}
                        <div className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-100 hover:border-amber-300">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Próximo</p>
                                <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:bg-amber-600 transition-colors"></div>
                            </div>
                            <p className="text-2xl font-bold text-amber-700 mb-1">#{valores.CuotaSiguiente || 0}</p>
                            <p className="text-xs text-amber-600 font-medium">Cuota a vencer</p>
                        </div>

                        {/* Vencidas */}
                        <div className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-rose-100 hover:border-rose-300">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Vencidas</p>
                                <div className="w-2 h-2 rounded-full bg-rose-500 group-hover:bg-rose-600 transition-colors"></div>
                            </div>
                            <p className="text-2xl font-bold text-rose-700 mb-1">{valores.CuotasVencidas || 0}</p>
                            <p className="text-xs text-rose-600 font-medium">En retraso</p>
                        </div>

                        {/* Días Mora */}
                        <div className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-100 hover:border-orange-300">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">Mora</p>
                                <div className="w-2 h-2 rounded-full bg-orange-500 group-hover:bg-orange-600 transition-colors"></div>
                            </div>
                            <p className="text-2xl font-bold text-orange-700 mb-1">{valores.DiasMora || 0}</p>
                            <p className="text-xs text-orange-600 font-medium">Días</p>
                        </div>

                        {/* Próximo Pago */}
                        <div className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-300">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Próximo Pago</p>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:bg-emerald-600 transition-colors"></div>
                            </div>
                            <p className="text-2xl font-bold text-emerald-700 mb-1">{valores.ProximoPago || 0}</p>
                            <p className="text-xs text-emerald-600 font-medium">Días</p>
                        </div>
                    </div>
                </div>

                {/* Tabla Premium - Scrollable */}
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full border-collapse">
                        {/* Header Sticky */}
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
                                <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-blue-200">Cuota</th>
                                <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-blue-200">Vence</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Valor</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Interés Total</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Capital Total</th>
                            
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Interés</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Capital</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Gestión</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Mora</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Abono</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Saldo Pend.</th>
                                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-blue-200">Retraso</th>
                                <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-blue-200">Estado</th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-gray-200">
                            {productos.map((item, index) => {
                                const estado = item.Estado;
                                // Estado 0: Verde - AL DÍA
                                // Estado 1: Rojo - EN MORA
                                // Estado 2: Azul - PAGO
                                // Estado 3: Fucsia - ABONO
                                // Estado 4: Marrón - DIFERIMIENTO
                                const isAlDia = estado === 0;
                                const isEnMora = estado === 1;
                                const isPagado = estado === 2;
                                const esAbono = estado === 3;
                                const esDiferimiento = estado === 4;
                                const isSelected = selectedId === item.idCre_TablaDeAmortizacion;

                                // Función para obtener el color según el estado
                                const getEstadoStyles = () => {
                                    switch(estado) {
                                        case 0: // AL DÍA - Verde
                                            return 'bg-green-100 text-green-800 border-green-300';
                                        case 1: // EN MORA - Rojo
                                            return 'bg-red-100 text-red-800 border-red-300';
                                        case 2: // PAGO - Azul
                                            return 'bg-blue-100 text-blue-800 border-blue-300';
                                        case 3: // ABONO - Fucsia
                                            return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300';
                                        case 4: // DIFERIMIENTO - Marrón
                                            return 'bg-amber-100 text-amber-800 border-amber-300';
                                        default:
                                            return 'bg-gray-100 text-gray-800 border-gray-300';
                                    }
                                };

                                const getEstadoLabel = () => {
                                    switch(estado) {
                                        case 0: return 'Al Día';
                                        case 1: return 'En Mora';
                                        case 2: return 'Pagado';
                                        case 3: return 'Abono';
                                        case 4: return 'Diferimiento';
                                        default: return 'Desconocido';
                                    }
                                };

                                const getEstadoIndicatorColor = () => {
                                    switch(estado) {
                                        case 0: return 'bg-green-600';
                                        case 1: return 'bg-red-600';
                                        case 2: return 'bg-blue-600';
                                        case 3: return 'bg-fuchsia-600';
                                        case 4: return 'bg-amber-600';
                                        default: return 'bg-gray-600';
                                    }
                                };

                                return (
                                    <tr
                                        key={item.idCre_TablaDeAmortizacion}
                                        onClick={() => handleRowPress(item.idCre_TablaDeAmortizacion, item.NumeroCuota)}
                                        className={`cursor-pointer transition-all duration-200 hover:bg-blue-50/80 group ${
                                            isSelected 
                                                ? 'bg-blue-100/80 border-l-4 border-l-blue-600 shadow-md' 
                                                : index % 2 === 0 ? 'bg-white hover:bg-blue-50/40' : 'bg-slate-50/50 hover:bg-blue-50/40'
                                        }`}
                                    >
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-xs shadow-sm group-hover:shadow-md transition-shadow">
                                                {item.NumeroCuota}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                            {new Date(item.Vence).toLocaleDateString('es-EC', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm font-bold text-gray-900">
                                            ${parseFloat(item.ValorCuota).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                            ${parseFloat(item.InteresTotal).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                            ${parseFloat(item.CapitalTotal).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                      
                                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                            ${parseFloat(item.Interes).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                            ${parseFloat(item.Capital).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                            ${parseFloat(item.Gastos).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm">
                                            <span className={parseFloat(item.Mora) > 0 ? 'text-red-600 font-bold' : 'text-gray-500 font-medium'}>
                                                ${parseFloat(item.Mora).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                       
                                        <td className="px-5 py-4 text-right text-sm">
                                            <span className={parseFloat(item.Abono) > 0 ? 'text-green-600 font-bold' : 'text-gray-500 font-medium'}>
                                                ${parseFloat(item.Abono).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm font-bold">
                                            <span className={
                                                parseFloat(item.Saldo) === 0 ? 'text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg' :
                                                    parseFloat(item.Saldo) > 0 && isEnMora ? 'text-red-600 bg-red-50 px-2.5 py-1 rounded-lg' :
                                                        'text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg'
                                            }>
                                                ${parseFloat(item.Saldo).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                            {item.Retraso} días
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getEstadoStyles()}`}>
                                                <span className={`w-2 h-2 rounded-full ${getEstadoIndicatorColor()} ${(isEnMora || esAbono || esDiferimiento) ? 'animate-pulse' : ''}`}></span>
                                                {getEstadoLabel()}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="bg-slate-50 border-t border-slate-200 p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full mt-0.5"></div>
                        <div>
                            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Información importante</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Haz clic en cualquier cuota para ver el historial detallado de pagos. Los montos están expresados en dólares americanos (USD). Todos los cálculos incluyen intereses, capital y diferenciales aplicables.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal de Pagos */}
                <PagosTDAmortizacion
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    data={listaValores}
                    cliente={cliente}
                    cedula={cedula}
                    numeroDocumento={numeroDocumento}
                    numeroCuota={numeroCuota}
                />
            </div>
        </div>
    );
};

export default TablaAmortizacionWeb;
