import React from 'react';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
const getRiesgoColor = (riesgo) => {
    const tipo = riesgo?.toUpperCase().trim() || '';
    if (tipo.includes('ALTO')) {
        return { badge: 'bg-red-200 text-red-900', cell: 'bg-red-50' };
    } else if (tipo.includes('MEDIANO') || tipo.includes('MEDIO')) {
        return { badge: 'bg-amber-200 text-amber-900', cell: 'bg-amber-50' };
    } else if (tipo.includes('BAJO')) {
        return { badge: 'bg-green-200 text-green-900', cell: 'bg-green-50' };
    }
    return { badge: 'bg-gray-200 text-gray-900', cell: 'bg-gray-50' };
};
export const SaldosTable = ({
    saldosFiltrados,
    riesgos,
    scoresCobranzas,
    scoreSeleccionado,
    onUpdate,
    onDelete
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 border-b-2 border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Saldos <span className="text-blue-600">(Score: {scoresCobranzas.find(s => s.idCbo_Scores_Cobranzas === scoreSeleccionado)?.Descripcion})</span></h2>
                <p className="text-gray-600 mt-1">Configuración de tipos de saldo para score seleccionado: <span className="font-bold text-blue-600">{saldosFiltrados.length} registros</span></p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">#</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Desde</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Hasta</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Riesgo</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Puntaje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {saldosFiltrados.length > 0 ? saldosFiltrados.map((item, idx) => {
                            // Buscar el riesgo en diferentes propiedades posibles
                            const riesgoValue = item.cboRiesgoData?.Riesgo || item.Riesgo || item.riesgo || '';
                            const riesgoColor = getRiesgoColor(riesgoValue);
                            return (
                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{idx + 1}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                        {item.Desde || '(Sin tipo)'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                        {item.Hasta || '(Sin tipo)'}
                                    </td>
                                    <td className={`px-6 py-4 text-sm text-center text-gray-700 `}>
                                        <span className={`inline-block px-3 py-1 rounded-md font-semibold text-sm ${riesgoColor.badge}`}>
                                            {riesgoValue || '(Sin riesgo)'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center font-medium text-gray-700">
                                        {item.Puntaje || '—'}
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No hay registros para este score</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
