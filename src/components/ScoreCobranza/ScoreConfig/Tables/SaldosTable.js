import React from 'react';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

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
                <h2 className="text-2xl font-bold text-gray-900">Cbo_Saldos <span className="text-blue-600">(Score: {scoresCobranzas.find(s => s.idCbo_Scores_Cobranzas === scoreSeleccionado)?.Descripcion})</span></h2>
                <p className="text-gray-600 mt-1">Rangos de saldo para score seleccionado: <span className="font-bold text-blue-600">{saldosFiltrados.length} registros</span></p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase">Desde</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase">Hasta</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase bg-yellow-600">Riesgo</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase">Puntaje</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {saldosFiltrados.length > 0 ? saldosFiltrados.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 text-sm">
                                    <input type="number" value={item.desde} onChange={(e) => onUpdate(item.id, 'desde', e.target.value)} step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right" />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input type="number" value={item.hasta} onChange={(e) => onUpdate(item.id, 'hasta', e.target.value)} step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right" />
                                </td>
                                <td className="px-6 py-4 text-sm bg-yellow-50">
                                    <select value={item.idCbo_Riesgo} onChange={(e) => onUpdate(item.id, 'idCbo_Riesgo', e.target.value)} className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                        <option value="">Seleccionar</option>
                                        {riesgos.map(r => (<option key={r.id} value={r.id}>{r.id} - {r.nombre}</option>))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input type="number" value={item.puntaje} onChange={(e) => onUpdate(item.id, 'puntaje', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right" placeholder="0" />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 hover:bg-green-100 rounded-lg transition-colors"><CheckIcon className="w-4 h-4 text-green-600" /></button>
                                        <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors"><TrashIcon className="w-4 h-4 text-red-600" /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">No hay registros para este score</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
