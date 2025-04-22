

import { Manager, Socket } from "socket.io-client";

let socket;
export const connectToServer = (token) => {


    const manager = new Manager("http://localhost:3008/socket.io/socket.io.js",
        {
            extraHeaders: {
                hola: "mundo",
                authentication : token,
            },
        }
    );

    const socket = manager.socket("/");

    addListener(socket);
    return socket;

}

function addListener(socket) {
    socket.on("connect", () => {
                console.log("Connected to server");
        
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });

    socket.on('clients-updated', (clients) => {
        console.log("Clients updated:", clients);
    })

    
}

export const getSocket = () => socket;

