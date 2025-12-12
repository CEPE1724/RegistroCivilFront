import { io } from "socket.io-client";

let socket;

export const connectToServer = (token) => {
  socket = io("https://backregistrocivil.appservices.com.ec", {
    path: "/socket.io",                 // default, pero lo dejo explícito
    transports: ["polling", "websocket"],
    secure: true,
    auth: { token },                    // esto sí lo lee Socket.IO
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  addListener(socket);
  return socket;
};

function addListener(socket) {
  // listeners
}

export const getSocket = () => socket;
