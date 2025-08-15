
import React, { useState, useEffect } from 'react';
import axios from '../../../configApi/axiosConfig';
import { APIURL } from "../../../configApi/apiConfig";
import { enqueueSnackbar } from "notistack";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


export function MotivoContinuidad({ isOpen, onClose, data, userData }) {
    console.log("Datos del cliente en MotivoContinuidad:", data);

    const [motivoSeleccionado, setMotivoSeleccionado] = useState('');
    const [motivos, setMotivos] = useState([]);

    useEffect(() => {
        const fetchMotivos = async () => {
            try {
                const response = await axios.get(APIURL.get_motivosContinuidad());
                setMotivos(response.data);
            } catch (error) {
                console.error('Error al obtener los motivos de continuidad:', error);
            }
        };

        fetchMotivos();
    }, []);

    if (!isOpen) return null;



    // Manejo del guardado del motivo seleccionado
    const handleGuardar = async () => {

        if (!motivoSeleccionado) {
            enqueueSnackbar("Por favor, selecciona un motivo.", { variant: "warning" });
            return;
        }
        try {
            const response = await axios.patch(APIURL.update_solicitud(data.id), {
                idMotivoContinuidad: parseInt(motivoSeleccionado, 10)

            });

            if (response.data) {
                await patchTiempo(data.id, userData.Nombre, parseInt(motivoSeleccionado, 10));

                enqueueSnackbar("Motivo de continuidad guardado correctamente.", { variant: "success" });
                setMotivoSeleccionado('');
                onClose();
            }
        } catch (error) {
            console.error("Error al guardar el motivo de continuidad:", error);
            enqueueSnackbar("Error al guardar el motivo de continuidad.", { variant: "error" });
        }

    }

    const patchTiempo = async (idSolicitud, Usuario, idMotivoContinuidad) => {
        try {
            const response = await axios.post(url, {
                idCre_SolicitudWeb: idSolicitud,
                Tipo: 7,
                idEstadoVerificacionDocumental: idMotivoContinuidad,
                Usuario: Usuario,
                Telefono: `MOTIVO `,
            });

            if (response.data) {
                console.log("Tiempo de solicitud registrado:", response.data);
            }
        }
        catch (error) {
            console.error("Error al registrar el tiempo de solicitud:", error);
        }
    }

    const url = APIURL.post_createtiemposolicitudeswebDto();

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
                        <option key={motivo.idMotivoContinuidad} value={motivo.idMotivoContinuidad}>
                            {motivo.Nombre}
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