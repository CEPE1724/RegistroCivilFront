import { Manager } from "socket.io-client";

let socket;

export const connectToServer = (token) => {
  // ✅ URL CORRECTA - Sin /socket.io/socket.io.js
  const manager = new Manager("https://backregistrocivil.appservices.com.ec/socket.io/socket.io.js", {
    transports: ['polling','websocket'], // ✅ Especificar transports
    secure: true,
    auth: { token: token },
    extraHeaders: { Authorization: `Bearer ${token}` }, // <-- agrega esto
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket = manager.socket("/"); // ✅ Asignar a la variable global

  addListener(socket);
  return socket;
}

function addListener(socket) {
  // No enviar información por consola ni mostrar mensajes.
}

export const getSocket = () => socket;

