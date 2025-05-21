import { Manager, Socket } from "socket.io-client";

let socket;
export const connectToServer = (token) => {
    //const manager = new Manager("http://192.168.2.173:3025/socket.io/socket.io.js", 

/*https://backregistrocivil.appservices.com.ec/socket.io/socket.io.js*/

    const manager = new Manager("https://backregistrocivil.appservices.com.ec", {
  path: "/socket.io",
  extraHeaders: {
    authentication: token,
  },
});

    const socket = manager.socket("/");

    addListener(socket);
    return socket;

}

function addListener(socket) {
    socket.on("connect", () => {});

    socket.on("disconnect", () => {
    });

    socket.on('clients-updated', (clients) => {
    });




  ////  socket.on("solicitud-web-changed", (data) => console.log("📩 Evento recibido (cambio solicitud):", data));


    
}

export const getSocket = () => socket;