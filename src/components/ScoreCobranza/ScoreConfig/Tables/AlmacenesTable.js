import React from 'react';
import { CheckIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// Función para obtener colores sutiles según el tipo de riesgo
const getRiesgoColor = (riesgo) => {
    const tipo = riesgo?.toUpperCase() || '';
    if (tipo.includes('ALTO')) {
        return { input: 'bg-red-100 text-red-900 border-red-300', badge: 'bg-red-200 text-red-900' };
    } else if (tipo.includes('MEDIANO') || tipo.includes('MEDIO')) {
        return { input: 'bg-amber-100 text-amber-900 border-amber-300', badge: 'bg-amber-200 text-amber-900' };
    } else if (tipo.includes('BAJO')) {
        return { input: 'bg-green-100 text-green-900 border-green-300', badge: 'bg-green-200 text-green-900' };
    }
    return { input: 'bg-gray-100 text-gray-900 border-gray-300', badge: 'bg-gray-200 text-gray-900' };
};

export const AlmacenesTable = ({
    almacenes,
    riesgos,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 border-b-2 border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Almacenes</h2>
                    <p className="text-gray-600 mt-1">Asignación de bodegas a riesgos</p>
                </div>

            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
               <table className="w-full">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Bodega</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Riesgo</th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase">Puntaje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {almacenes.map((item, idx) => {
                            const colorClass = getRiesgoColor(item.cboRiesgoData?.Riesgo);
                            return (
                            <tr key={item.idCbo_Almacenes} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900"> {idx + 1}</td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className="text-gray-700 font-medium">
                                        {item.bodegaData?.Nombre || '(Sin bodega)'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className={`inline-block px-3 py-1 rounded-md font-semibold text-sm ${colorClass.badge}`}>
                                        {item.cboRiesgoData?.Riesgo || '(Sin riesgo)'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className="text-gray-700 font-medium">
                                        {item.Puntaje || '—'}
                                    </span>
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
