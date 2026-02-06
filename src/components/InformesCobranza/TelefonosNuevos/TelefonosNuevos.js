import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

export function TelefonosNuevos  ({ isOpen, onClose, onSave, clienteData }) {
    const [telefonos, setTelefonos] = useState([
        { id: 1, idCre_GCTelefono: null, telefono: '', descripcion: '', fecha: new Date().toISOString().split('T')[0], guardado: false }
    ]);
    const [telefonosGuardados, setTelefonosGuardados] = useState([]);

    const handleChangeTelefono = (index, field, value) => {
        const nuevosTelefonos = [...telefonos];
        nuevosTelefonos[index] = {
            ...nuevosTelefonos[index],
            [field]: value
        };
        setTelefonos(nuevosTelefonos);
    };

    const handleAgregarFila = () => {
        setTelefonos([
            ...telefonos,
            {
                id: telefonos.length + 1,
                idCre_GCTelefono: null,
                telefono: '',
                descripcion: '',
                fecha: new Date().toISOString().split('T')[0],
                guardado: false
            }
        ]);
    };

    const handleGuardarFila = (index) => {
        const telefono = telefonos[index];
        
        // Validar que el teléfono no esté vacío
        if (!telefono.telefono.trim()) {
            alert('El teléfono es requerido');
            return;
        }

        // Asignar un ID único a la fila
        const nuevosTelefonos = [...telefonos];
        nuevosTelefonos[index] = {
            ...nuevosTelefonos[index],
            idCre_GCTelefono: `TELF_${Date.now()}_${index}`,
            guardado: true
        };
        setTelefonos(nuevosTelefonos);
        
        // Agregar a telefonos guardados
        const nuevosTelefonosGuardados = [...telefonosGuardados, nuevosTelefonos[index]];
        setTelefonosGuardados(nuevosTelefonosGuardados);
    };

    const handleEliminarFila = (index) => {
        const nuevosTelefonos = telefonos.filter((_, i) => i !== index);
        setTelefonos(nuevosTelefonos);
    };

    const handleGuardar = () => {
        // Enviar telefonos guardados
        if (telefonosGuardados.length > 0) {
            onSave(telefonosGuardados);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <PlusIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Teléfonos Nuevos</h2>
                            <p className="text-blue-100 text-sm mt-1">Registra nuevos números de contacto</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 bg-gray-50">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-700 to-blue-600 text-white sticky top-0">
                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Teléfono</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Descripción</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Fecha</th>
                                    <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {telefonos.map((telefono, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${telefono.guardado ? 'bg-green-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="tel"
                                                value={telefono.telefono}
                                                onChange={(e) => handleChangeTelefono(index, 'telefono', e.target.value)}
                                                disabled={telefono.guardado}
                                                placeholder="Ej: +593 9 98765432"
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                    telefono.guardado ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={telefono.descripcion}
                                                onChange={(e) => handleChangeTelefono(index, 'descripcion', e.target.value)}
                                                disabled={telefono.guardado}
                                                placeholder="Ej: Celular principal"
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                    telefono.guardado ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="date"
                                                value={telefono.fecha}
                                                onChange={(e) => handleChangeTelefono(index, 'fecha', e.target.value)}
                                                disabled={telefono.guardado}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                    telefono.guardado ? 'bg-gray-100 cursor-not-allowed' : ''
                                                }`}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {!telefono.guardado ? (
                                                    <button
                                                        onClick={() => handleGuardarFila(index)}
                                                        className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                                                        title="Guardar fila"
                                                    >
                                                        <CheckIcon className="w-4 h-4 text-green-600 group-hover:text-green-700" />
                                                    </button>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Guardado</span>
                                                )}
                                                <button
                                                    onClick={() => handleEliminarFila(index)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                                    title="Eliminar fila"
                                                >
                                                    <TrashIcon className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón Agregar Fila */}
                    <button
                        onClick={handleAgregarFila}
                        className="mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Agregar Fila
                    </button>
                </div>

                {/* Footer con Botones */}
                <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700">
                        Guardados: <span className="text-green-600">{telefonosGuardados.length}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardar}
                            disabled={telefonosGuardados.length === 0}
                            className={`px-6 py-2.5 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all ${
                                telefonosGuardados.length > 0
                                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Guardar ({telefonosGuardados.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


