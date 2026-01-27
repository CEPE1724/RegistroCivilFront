import React from 'react';
import { CheckIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

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
                    <h2 className="text-2xl font-bold text-gray-900">Cbo_Segmentos</h2>
                    <p className="text-gray-600 mt-1">Configuración de segmentación</p>
                </div>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <PlusIcon className="w-5 h-5" />
                    Nuevo
                </button>
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
                            <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 text-sm">
                                    <input
                                        type="text"
                                        value={item.nombre}
                                        onChange={(e) => onUpdate(item.id, 'nombre', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nombre del segmento"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input
                                        type="number"
                                        value={item.participacion}
                                        onChange={(e) => onUpdate(item.id, 'participacion', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                        placeholder="0"
                                        max="100"
                                    />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                                            <CheckIcon className="w-4 h-4 text-green-600" />
                                        </button>
                                        <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
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
