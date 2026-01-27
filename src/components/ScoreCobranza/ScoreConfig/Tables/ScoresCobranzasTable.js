import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export const ScoresCobranzasTable = ({
    scoresCobranzas,
    scoreSeleccionado,
    onSelectScore
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 border-b-2 border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Cbo_Scores_Cobranzas</h2>
                <p className="text-gray-600 mt-1">Configuración de períodos de cobranza</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Desde</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Hasta</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Descripción</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Estado</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {scoresCobranzas.map((item, idx) => (
                            <tr
                                key={item.idCbo_Scores_Cobranzas}
                                onClick={() => onSelectScore(item.idCbo_Scores_Cobranzas)}
                                className={`cursor-pointer transition-all duration-200 ${
                                    scoreSeleccionado === item.idCbo_Scores_Cobranzas
                                        ? 'bg-blue-200 border-l-4 border-blue-600 font-semibold'
                                        : idx % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-slate-50 hover:bg-blue-50'
                                }`}
                            >
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.idCbo_Scores_Cobranzas}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.Desde}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.Hasta}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.Descripcion}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                                        {item.Estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                            <PencilIcon className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                                            <TrashIcon className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
