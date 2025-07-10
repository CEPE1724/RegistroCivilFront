import { useState, useEffect } from 'react';
import axios from '../../configApi/axiosConfig';
import { APIURL } from "../../configApi/apiConfig";
import { useSnackbar } from 'notistack';
import { useAuth } from "../AuthContext/AuthContext";

export function ListaNegraEmails() {
    const [emails, setEmails] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [nuevoEmail, setNuevoEmail] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { userData } = useAuth();

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(APIURL.getEmails());
            const emailsMapeados = response.data.map(item => ({
                id: item.idListaNegraEmail,
                email: item.Email,
                descripcion: item.Observacion,
                activo: item.Activo,
                Usuario: item.Usuario,
                FechaSistema: item.FechaSistema,
            }));
            setEmails(emailsMapeados);
            setError(null);
        } catch (err) {
            console.error("Error al cargar emails:", err);
            setError("No se pudieron cargar los emails. Intente de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const emailsFiltrados = emails.filter(item =>
        item.email?.toLowerCase().includes(filtro.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(filtro.toLowerCase())
    );

    // Lógica de paginación
    const totalPages = Math.ceil(emailsFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const emailsPaginados = emailsFiltrados.slice(startIndex, endIndex);

    // Resetear página cuando cambie el filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [filtro]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const toggleActivo = async (id) => {
        try {
            const emailToUpdate = emails.find(e => e.id === id);
            if (!emailToUpdate) return;

            const nuevoEstado = !emailToUpdate.activo;

            await axios.patch(APIURL.updateEmail(id), { activo: nuevoEstado });

            setEmails(emails.map(e =>
                e.id === id ? { ...e, activo: nuevoEstado } : e
            ));

            enqueueSnackbar(
                `Email ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
                { variant: 'success' }
            );

        } catch (err) {
            console.error("Error al actualizar estado:", err);
            const mensaje = err.response?.data?.message || "No se pudo actualizar el estado del email.";
            enqueueSnackbar(mensaje, { variant: 'error' });
        }
    };

    const validarEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const agregarEmail = async () => {
        const email = nuevoEmail.trim().toLowerCase();
        const descripcion = nuevaDescripcion.trim();

        if (!email) {
            enqueueSnackbar("El email es obligatorio.", { variant: 'warning' });
            return;
        }

        if (!validarEmail(email)) {
            enqueueSnackbar("El formato del email no es válido.", { variant: 'warning' });
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
            const response = await axios.post(APIURL.postEmail(), {
                Email: email,
                Descripcion: descripcion, // ✅ Cambiar de "Observacion" a "Descripcion"
                Activo: true,
                Usuario: userData.Nombre,
            });

            if (response.status === 200 || response.status === 201) {
                await fetchEmails();
                setNuevoEmail('');
                setNuevaDescripcion('');
                setMostrarFormulario(false);

                enqueueSnackbar("Email agregado exitosamente a la lista negra.", { variant: 'success' });
            }

        } catch (err) {
            console.error("❌ Error al agregar email:", err);
            
            // Manejo específico de errores del servidor
            if (err.response) {
                const { status, data } = err.response;
                
                if (status === 400) {
                    enqueueSnackbar(data.message || "Datos inválidos. Verifique la información ingresada.", { variant: 'error' });
                } else if (status === 409) {
                    enqueueSnackbar("Este email ya existe en la lista negra.", { variant: 'warning' });
                } else if (status === 500) {
                    enqueueSnackbar("Error interno del servidor. Intente nuevamente.", { variant: 'error' });
                } else {
                    enqueueSnackbar(data.message || "Error desconocido del servidor.", { variant: 'error' });
                }
            } else if (err.request) {
                enqueueSnackbar("No se pudo conectar con el servidor. Verifique su conexión.", { variant: 'error' });
            } else {
                enqueueSnackbar("Ocurrió un error inesperado. Intente nuevamente.", { variant: 'error' });
            }
        }
    };

    const cancelarFormulario = () => {
        setNuevoEmail('');
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

    const EmailIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

    const ChevronLeftIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    );

    const ChevronRightIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-6 border-t-4 border-red-600">
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-600 rounded-full">
                            <EmailIcon />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Lista Negra de Emails</h1>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
                    >
                        <AddIcon />
                        <span className="ml-2">Bloquear Email</span>
                    </button>
                </div>

                {mostrarFormulario && (
                    <div className="mb-8 p-6 border rounded-md bg-gray-700 border-red-500 shadow-md animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                            <EmailIcon />
                            <span className="ml-2">Nuevo Email para Bloquear</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Dirección de Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <EmailIcon />
                                    </div>
                                    <input
                                        type="email"
                                        value={nuevoEmail}
                                        onChange={(e) => setNuevoEmail(e.target.value)}
                                        className="w-full p-3 pl-10 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="usuario@ejemplo.com"
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
                                onClick={agregarEmail}
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
                        placeholder="Buscar por email o descripción..."
                        className="pl-12 p-3 w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-red-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-300 text-lg">Cargando lista de emails bloqueados...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-gray-700 rounded-lg">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <p className="text-xl text-red-400">{error}</p>
                        <button
                            onClick={fetchEmails}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Información de resultados */}
                        <div className="mb-4 flex justify-between items-center text-gray-300 text-sm">
                            <span>
                                Mostrando {startIndex + 1}-{Math.min(endIndex, emailsFiltrados.length)} de {emailsFiltrados.length} emails
                            </span>
                            <div className="flex items-center space-x-2">
                                <label className="text-gray-300">Mostrar:</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                    className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-gray-300">por página</span>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg shadow border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Motivo del Bloqueo</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {emailsPaginados.length > 0 ? (
                                        emailsPaginados.map((email, index) => (
                                            <tr key={email.id} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    <div className="flex items-center">
                                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-600 mr-3">
                                                            <EmailIcon />
                                                        </span>
                                                        <span className="font-mono">{email.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{email.descripcion}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => toggleActivo(email.id)}
                                                        className={`inline-flex items-center px-3 py-1 rounded-full ${email.activo
                                                                ? 'bg-red-900 text-red-200'
                                                                : 'bg-gray-700 text-gray-400'
                                                            }`}
                                                    >
                                                        {email.activo ? (
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
                                                <td className="px-6 py-4 text-sm text-gray-300">{email.Usuario}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{new Date(email.FechaSistema).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <EmailIcon />
                                                    <p className="mt-2 text-lg">No se encontraron emails en la lista negra.</p>
                                                    <p className="text-sm text-gray-500">Añada un email utilizando el botón "Bloquear Email"</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-300">
                                    Página {currentPage} de {totalPages}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-l-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeftIcon />
                                        Anterior
                                    </button>

                                    {/* Números de página */}
                                    <div className="flex items-center space-x-1">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            const isCurrentPage = pageNumber === currentPage;
                                            
                                            // Mostrar solo páginas cercanas para no saturar la UI
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`px-3 py-2 text-sm font-medium border ${isCurrentPage
                                                                ? 'bg-red-600 text-white border-red-600'
                                                                : 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === currentPage - 3 ||
                                                pageNumber === currentPage + 3
                                            ) {
                                                return (
                                                    <span key={pageNumber} className="px-2 py-2 text-gray-400">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-r-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                        <ChevronRightIcon />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-6 text-xs text-gray-500 text-center">
                    Sistema de Lista Negra - Protegiendo contra emails fraudulentos
                </div>
            </div>
        </div>
    );
}

