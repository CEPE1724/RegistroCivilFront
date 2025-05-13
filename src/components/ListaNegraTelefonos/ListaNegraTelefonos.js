import { useState, useEffect } from 'react';
import axios from '../../configApi/axiosConfig';
import { APIURL } from "../../configApi/apiConfig";
import { useSnackbar } from 'notistack';
import { useAuth } from "../AuthContext/AuthContext";

export function ListaNegraTelefonos() {
    const [telefonos, setTelefonos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [nuevoNumero, setNuevoNumero] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { userData } = useAuth();

    useEffect(() => {
        fetchTelefonos();
    }, []);

    const fetchTelefonos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(APIURL.getTelefonos());
            const telefonosMapeados = response.data.map(tel => ({
                id: tel.idListaNegraCell,
                numero: tel.Telefono,
                descripcion: tel.Observacion,
                activo: tel.Activo,
                Usuario: tel.Usuario,
                FechaSistema: tel.FechaSistema,
            }));
            setTelefonos(telefonosMapeados);
            setError(null);
        } catch (err) {
            console.error("Error al cargar teléfonos:", err);
            setError("No se pudieron cargar los teléfonos. Intente de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const telefonosFiltrados = telefonos.filter(tel =>
        tel.numero?.includes(filtro) ||
        tel.descripcion?.toLowerCase().includes(filtro.toLowerCase())
    );

    const toggleActivo = async (id) => {
        try {
            const telefonoToUpdate = telefonos.find(tel => tel.id === id);
            if (!telefonoToUpdate) return;

            const nuevoEstado = !telefonoToUpdate.activo;

            await axios.patch(`${APIURL.updateTelefono(id)}`, { activo: nuevoEstado });

            setTelefonos(telefonos.map(tel =>
                tel.id === id ? { ...tel, activo: nuevoEstado } : tel
            ));
        } catch (err) {
            console.error("Error al actualizar el estado del teléfono:", err);
            alert("No se pudo actualizar el estado del teléfono.");
        }
    };



    const agregarTelefono = async () => {
        const numero = nuevoNumero.trim();
        const descripcion = nuevaDescripcion.trim();

        if (!numero) {
            enqueueSnackbar("El número de teléfono es obligatorio.", { variant: 'warning' });
            return;
        }

        if (!/^[0-9]+$/.test(numero)) {
            enqueueSnackbar("El número solo debe contener dígitos numéricos.", { variant: 'warning' });
            return;
        }

        if (numero.length !== 10) {
            enqueueSnackbar("El número de teléfono debe tener exactamente 10 dígitos.", { variant: 'warning' });
            return;
        }

        if (!descripcion) {
            enqueueSnackbar("La descripción es obligatoria.", { variant: 'warning' });
            return;
        }

        if (descripcion.length < 5) {
            enqueueSnackbar("La descripción debe tener al menos 5 caracteres.", { variant: 'warning' });
            return;
        }

        try {
            await axios.post(APIURL.postTelefono(), {
                NumeroCell: numero,
                Descripcion: descripcion,
                Activo: true,
                Usuario: userData.Nombre,
            });

            await fetchTelefonos();
            setNuevoNumero('');
            setNuevaDescripcion('');
            setMostrarFormulario(false);

            enqueueSnackbar("Número agregado exitosamente a la lista negra.", { variant: 'success' });

        } catch (err) {
            console.error("❌ Error al agregar teléfono:", err.response?.data || err);
            const mensaje = err.response?.data?.message || "No se pudo agregar el teléfono a la lista negra.";
            enqueueSnackbar(mensaje, { variant: 'error' });
        }
    };

    const cancelarFormulario = () => {
        setNuevoNumero('');
        setNuevaDescripcion('');
        setMostrarFormulario(false);
    };

    // SVG Icons
    const DeleteIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );

    const AddIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );

    const PhoneIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );

    const SearchIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    const CheckCircleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const CancelIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const BlockedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    );

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-6 border-t-4 border-red-600">
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-600 rounded-full">
                            <BlockedIcon />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Lista Negra de Teléfonos</h1>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
                    >
                        <AddIcon />
                        <span className="ml-2">Bloquear Número</span>
                    </button>
                </div>

                {mostrarFormulario && (
                    <div className="mb-8 p-6 border rounded-md bg-gray-700 border-red-500 shadow-md animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                            <PhoneIcon />
                            <span className="ml-2">Nuevo Número para Bloquear</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Número Telefónico</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon />
                                    </div>
                                    <input
                                        type="text"
                                        value={nuevoNumero}
                                        onChange={(e) => setNuevoNumero(e.target.value)}
                                        className="w-full p-3 pl-10 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="10 dígitos"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Motivo del Bloqueo</label>
                                <input
                                    type="text"
                                    value={nuevaDescripcion}
                                    onChange={(e) => setNuevaDescripcion(e.target.value)}
                                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Describa el motivo del bloqueo"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelarFormulario}
                                className="py-2 px-4 border border-gray-500 rounded-md text-gray-300 hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={agregarTelefono}
                                className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                            >
                                <AddIcon />
                                <span className="ml-2">Bloquear</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por número o descripción..."
                        className="pl-12 p-3 w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-red-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-300 text-lg">Cargando lista de números bloqueados...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-gray-700 rounded-lg">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <p className="text-xl text-red-400">{error}</p>
                        <button
                            onClick={fetchTelefonos}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg shadow border border-gray-700">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teléfono</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Motivo del Bloqueo</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th> */}
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {telefonosFiltrados.length > 0 ? (
                                    telefonosFiltrados.map(telefono => (
                                        <tr key={telefono.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-300">{telefono.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-600 mr-3">
                                                        <PhoneIcon />
                                                    </span>
                                                    <span className="font-mono">{telefono.numero}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{telefono.descripcion}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => toggleActivo(telefono.id)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full ${telefono.activo
                                                            ? 'bg-red-900 text-red-200'
                                                            : 'bg-gray-700 text-gray-400'
                                                        }`}
                                                >
                                                    {telefono.activo ? (
                                                        <>
                                                            <CheckCircleIcon />
                                                            <span className="ml-2">Bloqueado</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CancelIcon />
                                                            <span className="ml-2">Inactivo</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{telefono.Usuario}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{new Date(telefono.FechaSistema).toLocaleDateString()}</td>
                                            {/*    <td className="px-6 py-4 text-sm font-medium">
                                                <button 
                                                    onClick={() => eliminarTelefono(telefono.id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </td>*/}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <BlockedIcon />
                                                <p className="mt-2 text-lg">No se encontraron teléfonos en la lista negra.</p>
                                                <p className="text-sm text-gray-500">Añada un número utilizando el botón "Bloquear Número"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 text-xs text-gray-500 text-center">
                    Sistema de Lista Negra - Protegiendo contra llamadas no deseadas
                </div>
            </div>
        </div>
    );
}