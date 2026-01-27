import React from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export function PagosTDAmortizacion({ 
    visible, 
    onClose, 
    data, 
    cliente, 
    cedula, 
    numeroDocumento, 
    numeroCuota 
}) {
    if (!visible || !data || data.length === 0) return null;

    const totalAbonado = data.reduce((sum, item) => sum + parseFloat(item.TotalAbonoCuota || 0), 0);
    const totalGeneral = data.reduce((sum, item) => sum + parseFloat(item.Total || 0), 0);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/30 to-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-slate-800 via-emerald-700 to-slate-800 text-white p-8 border-b border-slate-700">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-10 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">Resumen de Cobro</h2>
                                    <p className="text-emerald-200 text-sm mt-1">Cuota N.{numeroCuota}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 mt-6">
                                <div className="border-l-2 border-emerald-300/50 pl-4">
                                    <p className="text-xs font-semibold text-emerald-200 uppercase tracking-widest">Cliente</p>
                                    <p className="text-base font-bold text-white mt-1">{cliente}</p>
                                </div>
                                <div className="border-l-2 border-emerald-300/50 pl-4">
                                    <p className="text-xs font-semibold text-emerald-200 uppercase tracking-widest">Cédula</p>
                                    <p className="text-base font-bold text-white mt-1">{cedula}</p>
                                </div>
                                <div className="border-l-2 border-emerald-300/50 pl-4">
                                    <p className="text-xs font-semibold text-emerald-200 uppercase tracking-widest">Factura</p>
                                    <p className="text-base font-bold text-white mt-1">{numeroDocumento}</p>
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

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Tabla de Pagos Premium */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full border-collapse">
                            {/* Header */}
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-200">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-200">Comprobante</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-200">Forma de Pago</th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-emerald-200">Abono Cuota</th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-emerald-200">Total Pagado</th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody className="divide-y divide-gray-200">
                                {data.map((item, index) => (
                                    <tr
                                        key={`${item.idAnticipo}-${index}`}
                                        className={`transition-all duration-200 hover:bg-emerald-50/80 group ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                                        }`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:bg-emerald-600 transition-colors"></div>
                                                {new Date(item.Fecha).toLocaleDateString('es-EC', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 text-xs">
                                                {item.Secuencial}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                {item.FormaPago}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">
                                            ${parseFloat(item.TotalAbonoCuota).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                            ${parseFloat(item.Total).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Resumen Total - Tarjeta Premium */}
                    {data.length > 0 && (
                        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <CheckCircleIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resumen de Transacción</p>
                                        <p className="text-sm text-emerald-600 mt-0.5">Detalles de pagos registrados</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t-2 border-emerald-200">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Total Abonado a Cuota</p>
                                    <p className="text-3xl font-black text-emerald-600">
                                        ${totalAbonado.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">Suma de abonos aplicados</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Total General</p>
                                    <p className="text-3xl font-black text-blue-600">
                                        ${totalGeneral.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">Monto total pagado</p>
                                </div>
                            </div>

                            {/* Badge de estado */}
                            <div className="mt-6 pt-6 border-t border-emerald-200 flex items-center justify-center">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                    Registro confirmado
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-slate-200 px-8 py-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 uppercase tracking-wider text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
