


       import React, { useState, useEffect } from 'react';
import axios from '../../../configApi/axiosConfig';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import jsPDF from "jspdf";
import { APIURL } from "../../../configApi/apiConfig";
import { enqueueSnackbar } from "notistack";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const motivos = [
    { id: 1, label: 'CLIENTE SOLO AVERIGUA SI APLICA' },
    { id: 2, label: 'NO TIENE DOCUMENTACIÓN COMPLETA' },
    { id: 3, label: 'NO TIENE INGRESOS SUFICIENTES' },
    { id: 4, label: 'TIENE MAL BURÓ' },
    { id: 5, label: 'DECIDIÓ NO COMPRAR' },
    { id: 6, label: 'SE FUE A OTRA CASA COMERCIAL' },
    { id: 7, label: 'NO CONTESTA / NO SE LOGRÓ CONTACTAR' },
    { id: 8, label: 'OTRA RAZÓN' },
];

export function MotivoContinuidad({ isOpen, onClose, data }) {
    const [motivoSeleccionado, setMotivoSeleccionado] = useState('');

    if (!isOpen) return null;

    const handleGuardar = () => {
        if (!motivoSeleccionado) return alert('Por favor selecciona un motivo.');
        // Aquí puedes hacer un POST o update con el motivo seleccionado
        console.log('Motivo seleccionado:', motivoSeleccionado);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 mx-4">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                >
                    ✕
                </button>

                {/* Icono de encabezado */}
                <div className="flex items-center justify-center mb-4">
                    <NoteAltIcon className="text-4xl text-[#063970]" />
                </div>

                {/* Datos del cliente */}
                <div className="mb-4 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-800">
                        <PersonIcon />
                        <h3 className="text-lg font-semibold">
                            {data?.PrimerNombre} {data?.SegundoNombre} {data?.ApellidoPaterno} {data?.ApellidoMaterno}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Cédula: {data?.cedula} &bull; Solicitud: {data?.NumeroSolicitud}
                    </p>
                </div>

                {/* Instrucción */}
                <div className="mb-4 text-gray-800 text-sm flex items-start gap-2">
                    <HelpOutlineIcon className="text-[#dc3545] mt-0.5" />
                    <p>
                        Selecciona el motivo por el cual el cliente <strong>no desea continuar</strong> con el proceso de crédito.  Esta información será registrada como parte del seguimiento comercial.
                    </p>
                </div>

                {/* Select del motivo */}
                <select
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#063970]"
                    value={motivoSeleccionado}
                    onChange={(e) => setMotivoSeleccionado(e.target.value)}
                >
                    <option value="">-- Selecciona un motivo --</option>
                    {motivos.map((motivo) => (
                        <option key={motivo.id} value={motivo.id}>
                            {motivo.label}
                        </option>
                    ))}
                </select>

                {/* Botón de guardar */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGuardar}
                        disabled={!motivoSeleccionado}
                        className={`px-4 py-2 rounded-md transition 
    ${!motivoSeleccionado
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#063970] text-white hover:bg-[#052d59]'
                            }`}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}