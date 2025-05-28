import { useState, useEffect } from 'react';
import axios from '../../configApi/axiosConfig';
import { APIURL } from "../../configApi/apiConfig";
import { useSnackbar } from 'notistack';
import { useAuth } from "../AuthContext/AuthContext";

export function ListaNegraCedulas() {
    const [cedulas, setCedulas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [nuevaCedula, setNuevaCedula] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { userData } = useAuth();

    useEffect(() => {
        fetchCedulas();
    }, []);

    const fetchCedulas = async () => {
        try {
            setLoading(true);
            const response = await axios.get(APIURL.getCedulas());
            const cedulasMapeadas = response.data.map(item => ({
                id: item.idListaNegraCedula,
                cedula: item.Cedula,
                descripcion: item.Observacion,
                activo: item.Activo,
                Usuario: item.Usuario,
                FechaSistema: item.FechaSistema,
            }));
            setCedulas(cedulasMapeadas);
            setError(null);
        } catch (err) {
            console.error("Error al cargar cédulas:", err);
            setError("No se pudieron cargar las cédulas. Intente de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const cedulasFiltradas = cedulas.filter(item =>
        item.cedula?.includes(filtro) ||
        item.descripcion?.toLowerCase().includes(filtro.toLowerCase())
    );

    const toggleActivo = async (id) => {
        try {
            const cedulaToUpdate = cedulas.find(c => c.id === id);
            if (!cedulaToUpdate) return;

            const nuevoEstado = !cedulaToUpdate.activo;

            await axios.patch(`${APIURL.updateCedula(id)}`, { activo: nuevoEstado });

            setCedulas(cedulas.map(c =>
                c.id === id ? { ...c, activo: nuevoEstado } : c
            ));
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            alert("No se pudo actualizar el estado de la cédula.");
        }
    };

    const agregarCedula = async () => {
        const cedula = nuevaCedula.trim();
        const descripcion = nuevaDescripcion.trim();

        if (!cedula) {
            enqueueSnackbar("La cédula es obligatoria.", { variant: 'warning' });
            return;
        }

        if (!/^[0-9]+$/.test(cedula)) {
            enqueueSnackbar("La cédula solo debe contener dígitos numéricos.", { variant: 'warning' });
            return;
        }

        if (cedula.length !== 10) {
            enqueueSnackbar("La cédula debe tener exactamente 10 dígitos.", { variant: 'warning' });
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
            await axios.post(APIURL.postCedula(), {
                Cedula: cedula,
                Observacion: descripcion,
                Activo: true,
                Usuario: userData.Nombre,
            });

            await fetchCedulas();
            setNuevaCedula('');
            setNuevaDescripcion('');
            setMostrarFormulario(false);

            enqueueSnackbar("Cédula agregada exitosamente a la lista negra.", { variant: 'success' });

        } catch (err) {
            console.error("❌ Error al agregar cédula:", err.response?.data || err);
            const mensaje = err.response?.data?.message || "No se pudo agregar la cédula a la lista negra.";
            enqueueSnackbar(mensaje, { variant: 'error' });
        }
    };

    const cancelarFormulario = () => {
        setNuevaCedula('');
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

    const IdIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
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
                        <h1 className="text-3xl font-bold text-white">Lista Negra de Cédulas</h1>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
                    >
                        <AddIcon />
                        <span className="ml-2">Bloquear Cédula</span>
                    </button>
                </div>

                {mostrarFormulario && (
                    <div className="mb-8 p-6 border rounded-md bg-gray-700 border-red-500 shadow-md animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                            <IdIcon />
                            <span className="ml-2">Nueva Cédula para Bloquear</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Número de Cédula</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IdIcon />
                                    </div>
                                    <input
                                        type="text"
                                        value={nuevaCedula}
                                        onChange={(e) => setNuevaCedula(e.target.value)}
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
                                onClick={agregarCedula}
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
                        placeholder="Buscar por cédula o descripción..."
                        className="pl-12 p-3 w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-red-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-300 text-lg">Cargando lista de cédulas bloqueadas...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-gray-700 rounded-lg">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <p className="text-xl text-red-400">{error}</p>
                        <button
                            onClick={fetchCedulas}
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
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cédula</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Motivo del Bloqueo</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th> */}
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {cedulasFiltradas.length > 0 ? (
                                    cedulasFiltradas.map(cedula => (
                                        <tr key={cedula.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-300">{cedula.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-600 mr-3">
                                                        <IdIcon />
                                                    </span>
                                                    <span className="font-mono">{cedula.cedula}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{cedula.descripcion}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => toggleActivo(cedula.id)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full ${cedula.activo
                                                            ? 'bg-red-900 text-red-200'
                                                            : 'bg-gray-700 text-gray-400'
                                                        }`}
                                                >
                                                    {cedula.activo ? (
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
                                            <td className="px-6 py-4 text-sm text-gray-300">{cedula.Usuario}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{new Date(cedula.FechaSistema).toLocaleDateString()}</td>
                                            {/*    <td className="px-6 py-4 text-sm font-medium">
                                                <button 
                                                    onClick={() => eliminarCedula(cedula.id)}
                                                    className="text-yellow-400 hover:text-yellow-600 transition-colors"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </td>*/}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <BlockedIcon />
                                                <p className="mt-2 text-lg">No se encontraron cédulas en la lista negra.</p>
                                                <p className="text-sm text-gray-500">Añada una cédula utilizando el botón "Bloquear Cédula"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 text-xs text-gray-500 text-center">
                    Sistema de Lista Negra - Protegiendo contra cédulas fraudulentas
                </div>
            </div>
        </div>
    );
}