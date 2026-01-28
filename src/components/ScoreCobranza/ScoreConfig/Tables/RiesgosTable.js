import React from 'react';
import { RxUpdate } from "react-icons/rx";
import { TrashIcon } from '@heroicons/react/24/outline';

// Función para obtener colores según el tipo de riesgo
const getRiesgoColor = (riesgo) => {
    const tipo = riesgo?.toUpperCase() || '';
    if (tipo === 'ALTO') {
        return { bg: 'bg-red-50', text: 'text-red-900', badge: 'bg-red-100 text-red-800', border: 'border-l-4 border-red-500' };
    } else if (tipo === 'MEDIO') {
        return { bg: 'bg-amber-50', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800', border: 'border-l-4 border-amber-500' };
    } else if (tipo === 'BAJO') {
        return { bg: 'bg-green-50', text: 'text-green-900', badge: 'bg-green-100 text-green-800', border: 'border-l-4 border-green-500' };
    }
    return { bg: 'bg-gray-50', text: 'text-gray-900', badge: 'bg-gray-100 text-gray-800', border: 'border-l-4 border-gray-500' };
};

export const RiesgosTable = ({
    riesgos,
    onAdd,
    onUpdate,
    onDelete
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 border-b-2 border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Riesgos</h2>
                    <p className="text-gray-600 mt-1">Gestión de niveles de riesgo (ALTO, MEDIO, BAJO)</p>
                </div>
                
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">Riesgo</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase">Peso (%)</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase">Desde</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase">Hasta</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {riesgos.map((item, idx) => {
                            const itemId = item.idCbo_Riesgo > 0 ? item.idCbo_Riesgo : item._tempId;
                            const colorClass = getRiesgoColor(item.Riesgo);
                            return (
                            <tr key={itemId} className={`${colorClass.bg} ${colorClass.border} hover:bg-opacity-75 transition-colors`}>
                                <td className={`px-6 py-4 text-sm font-bold ${colorClass.text}`}>
                                    {idx + 1}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colorClass.badge}`}>
                                            {item.Riesgo || '(Sin asignar)'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input
                                        type="number"
                                        value={item.Peso}
                                        onChange={(e) => onUpdate(itemId, 'Peso', e.target.value)}
                                        min="0"
                                        max="100"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-semibold"
                                        placeholder="0"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input
                                        type="number"
                                        value={item.Desde}
                                        onChange={(e) => onUpdate(itemId, 'Desde', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <input
                                        type="number"
                                        value={item.Hasta}
                                        onChange={(e) => onUpdate(itemId, 'Hasta', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                        placeholder="100.00"
                                        step="0.01"
                                    />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Editar">
                                            <RxUpdate className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button onClick={() => onDelete(itemId)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar">
                                            <TrashIcon className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
