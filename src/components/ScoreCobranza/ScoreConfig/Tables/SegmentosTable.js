import React from 'react';

import { RxUpdate } from "react-icons/rx";
export const SegmentosTable = ({
    segmentos,
    onAdd,
    onUpdate,
    onDelete
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 border-b-2 border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Segmentos</h2>
                    <p className="text-gray-600 mt-1">Configuración de segmentación</p>
                </div>

            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Segmento</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase">Participación %</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {segmentos.map((item, idx) => (
                            <tr key={item.idCbo_Segmento} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    {idx + 1}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input
                                        type="text"
                                        value={item.Segmento}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        placeholder="Nombre del segmento"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input
                                        type="number"
                                        value={item.Participacion}
                                        onChange={(e) => onUpdate(item.idCbo_Segmento, 'Participacion', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                        placeholder="0"
                                        max="100"
                                    />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                            <RxUpdate className="w-4 h-4 text-blue-600" />
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
