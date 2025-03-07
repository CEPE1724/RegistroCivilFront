import axios from '../configApi/axiosConfig';
export const fetchPerfil = async () => {

    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Token no encontrado. Por favor, inicie sesión.');
        }
        const response = await axios.get('auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error en la respuesta del servidor:', error.response.status, error.response.data);
            throw new Error(error.response.data.message || 'Error en la respuesta del servidor');
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
            throw new Error('No se pudo conectar con el servidor. Por favor, verifique su conexión a Internet.');
        } else {
            console.error('Error al hacer la solicitud:', error.message);
            throw new Error('Error al hacer la solicitud: ' + error.message);
        }
    }
};
