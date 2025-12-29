import { io } from "socket.io-client";

let socket;

export const connectToServer = (token, isNewLogin = false) => {
  return new Promise((resolve, reject) => {
    // La URL del WebSocket NO debe incluir /api/v1, solo el host:port
    const SOCKET_URL = process.env.REACT_APP_BASE_URL_SOCKET;
    
    socket = io(SOCKET_URL, {
      path: "/socket.io",                 // default, pero lo dejo explícito
      transports: ["websocket", "polling"], // Intentar websocket primero
      auth: { 
        token,
        isNewLogin  // Enviar flag de nuevo login al backend
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // ✅ Resolver Promise solo cuando el socket esté realmente conectado
    socket.on('connect', () => {
      resolve(socket); // Resolver la Promise cuando la conexión sea exitosa
    });
    
    // ❌ Rechazar Promise si hay error de conexión
    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión WebSocket:', error.message);
      console.error('❌ Error completo:', error);
      reject(error); // Rechazar la Promise si falla la conexión
    });
  
  // Escuchar evento de sesión terminada por el backend
  socket.on('session-terminated', (data) => {

    let message = 'Tu sesión ha sido cerrada';
    
    if (data.reason === 'duplicate_session') {
      message = 'Tu sesión se cerró porque iniciaste sesión en otro dispositivo';
    } else if (data.reason === 'admin_disconnect') {
      message = 'Tu sesión fue cerrada por un administrador';
    }
    
    // Emitir evento personalizado para que AuthContext maneje el logout
    window.dispatchEvent(new CustomEvent('force-logout', { 
      detail: { 
        reason: data.reason,
        message: data.message || message
      }
    }));
  });
  
    socket.on('disconnect', (reason) => {
      console.warn('⚠️ WebSocket desconectado. Razón:', reason);
      
      // Si el servidor fuerza la desconexión, hacer logout
      if (reason === 'io server disconnect') {
        
        // Emitir evento personalizado para que AuthContext maneje el logout
        window.dispatchEvent(new CustomEvent('force-logout', { 
          detail: { reason: 'Se detecto un inicio de sesión en otro dispositivo' }
        }));
      }
    });

    // Configurar listeners adicionales
    addListener(socket);
  });
};

function addListener(socket) {
  // listeners existentes (si los hay)
}

export const getSocket = () => socket;
