

import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

export function GestorTelefonico({ selectedItem, closeModal }) {  // Recibe props como un objeto
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                <h2 className="text-xl font-semibold">Detalles del Gestor</h2>
                <div className="mt-4 text-cyan-500">
                    <p><strong>Cliente:</strong> {selectedItem.Cliente}</p>
                    <p><strong>Cedula:</strong> {selectedItem.Cedula}</p>
                    <p><strong>Agente:</strong> {selectedItem.Agente}</p>
                    <p><strong>Cartera:</strong> {selectedItem.Cartera}</p>
                    <p><strong>Direccion:</strong> {selectedItem.Direccion}</p>
                    <p><strong>Saldo Vencido:</strong> {selectedItem.SaldoVencido}</p>
                    <p><strong>Mora:</strong> {selectedItem.Mora}</p>
                    {/* Aquí puedes agregar más campos según sea necesario */}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                    >
                        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                            <LogoutIcon className="text-white" />
                        </div>
                        <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            Salir
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
