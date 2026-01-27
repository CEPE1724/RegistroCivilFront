import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export const ScoresCobranzasTable = ({
    scoresCobranzas,
    scoreSeleccionado,
    onSelectScore
}) => {
    const [filtroEstado, setFiltroEstado] = useState(0);

    const getEstadoInfo = (estado) => {
        const estados = {
            1: { label: 'ACTIVO', color: 'bg-green-100 text-green-800 border-green-300' },
            2: { label: 'CERRADO', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
            3: { label: 'ANULADO', color: 'bg-red-100 text-red-800 border-red-300' }
        };
        return estados[estado] || { label: 'DESCONOCIDO', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    };

    const scoresFiltrados = filtroEstado === 0 
        ? scoresCobranzas 
        : scoresCobranzas.filter(score => score.Estado === filtroEstado);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 border-b-2 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Cbo_Scores_Cobranzas</h2>
                        <p className="text-gray-600 mt-1">Configuración de períodos de cobranza</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-gray-700">Filtrar por Estado:</label>
                        <select 
                            value={filtroEstado} 
                            onChange={(e) => setFiltroEstado(Number(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={0}>TODO</option>
                            <option value={1}>ACTIVO</option>
                            <option value={2}>CERRADO</option>
                            <option value={3}>ANULADO</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
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
                        {scoresFiltrados.map((item, idx) => (
                            <tr
                                key={item.idCbo_Scores_Cobranzas}
                                onClick={() => onSelectScore(item.sCbo_Scores_Cobranzas)}
                                className={`cursor-pointer transition-all duration-200 ${
                                    scoreSeleccionado === item.sCbo_Scores_Cobranzas
                                        ? 'bg-blue-200 border-l-4 border-blue-600 font-semibold'
                                        : idx % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-slate-50 hover:bg-blue-50'
                                }`}
                            >
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.idCbo_Scores_Cobranzas}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.Desde}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.Hasta}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.Descripcion}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getEstadoInfo(item.Estado).color}`}>
                                        {getEstadoInfo(item.Estado).label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            disabled={item.Estado !== 1}
                                            className={`p-2 rounded-lg transition-colors ${
                                                item.Estado === 1
                                                    ? 'hover:bg-blue-100 cursor-pointer'
                                                    : 'opacity-50 cursor-not-allowed'
                                            }`}
                                            title={item.Estado !== 1 ? 'Solo disponible para registros ACTIVOS' : 'Editar'}
                                        >
                                            <PencilIcon className={`w-4 h-4 ${item.Estado === 1 ? 'text-blue-600' : 'text-gray-400'}`} />
                                        </button>
                                        <button 
                                            disabled={item.Estado !== 1}
                                            className={`p-2 rounded-lg transition-colors ${
                                                item.Estado === 1
                                                    ? 'hover:bg-red-100 cursor-pointer'
                                                    : 'opacity-50 cursor-not-allowed'
                                            }`}
                                            title={item.Estado !== 1 ? 'Solo disponible para registros ACTIVOS' : 'Eliminar'}
                                        >
                                            <TrashIcon className={`w-4 h-4 ${item.Estado === 1 ? 'text-red-600' : 'text-gray-400'}`} />
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
