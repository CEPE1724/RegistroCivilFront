import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { APIURL } from '../../../configApi/apiConfig';
export function ModalAnalista({ isOpen, onClose }) {
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
     const { enqueueSnackbar } = useSnackbar();
    // Función para hacer la consulta a la API
    const fetchUsuarios = async (filter) => {
        setLoading(true);
        try {
            const url = APIURL.get_analis_cogno(filter);
            const response = await axios.get(url);
            setUsuarios(response.data); // Setear la lista de usuarios
        } catch (error) {
            console.error("Error al obtener los usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    // Función de búsqueda que llama a la API
    const handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value) {
            fetchUsuarios(event.target.value);
        } else {
            setUsuarios([]); // Limpiar los resultados si el campo de búsqueda está vacío
        }
    };

    // Función para manejar el click en Agregar
    const handleAgregar = async (usuario) => {


        const data = {
            idUsuario: usuario.idUsuario, // Asegúrate de que 'usuario.id' esté correctamente asignado según el objeto
            Nombre: usuario.Nombre,
  
        };
        try {
            const url = APIURL.post_analista();
            const response = await axios.post(url, data);
            enqueueSnackbar('Analista agregado exitosamente!', { variant: 'success' });
            // Aquí podrías actualizar el estado o realizar cualquier acción que necesites
        } catch (error) {
            enqueueSnackbar('Error al agregar el usuario', { variant: 'error' });
        }
    };

    if (!isOpen) return null; // Si el modal no está abierto, no mostrar nada

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Buscar Usuarios</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Buscar usuario..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-4">Cargando...</div>
                ) : (
                    <div>
                        {usuarios.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">No se encontraron usuarios.</div>
                        ) : (
                            <div className="overflow-x-auto max-h-60">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-left">Nombre</th>
                                            <th className="py-2 px-4 border-b text-left">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((usuario) => (
                                            <tr key={usuario.id} className="hover:bg-gray-100">
                                                <td className="py-2 px-4 border-b">{usuario.Nombre}</td>
                                                <td className="py-2 px-4 border-b">
                                                    <button
                                                        onClick={() => handleAgregar(usuario)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                                    >
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
