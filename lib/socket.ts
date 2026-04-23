

import { io, Socket } from 'socket.io-client';         //   io creates connection to server , and Socket is the type for the socket instance

// create a variable to hold the socket connection globally . only one connection should exist at a time to avoid multiple connections and performance issues.
let socket: Socket | null = null;

// function to initialize the socket connection
export const initializeSocket = (userId: string) => {
    // if socket is already exist , return it to avoid multiple connections
    if (socket) return socket;

    // create a new socket connection to the server

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        withCredentials: true,
        transports: ['websocket'],  // force WebSocket transport for better performance
        query: { userId },          // pass userId as query parameter to identify user
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {      // Event: When successfully connected to server
        console.log("✅ Connected to socket server:", socket?.id);
    });

    // Event: When disconnected
    socket.on("disconnect", (reason) => {
        console.log(" Disconnected from socket server", reason);
    });

    socket.on("reconnect", () => {
        console.log(" Reconnected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
        console.error(" Socket connection error:", error.message);
    });

    return socket;
}


// Function to get existing socket instance
export const getSocket = (): Socket => {
    if (!socket) {
        throw new Error("Socket not initialized. Call initSocket() first.");
    }
    return socket;
};

// Function to disconnect socket manually (logout case)
export const disconnectSocket = () => {
    if (socket) {
        socket.removeAllListeners(); // remove all event listeners . it helps to 
        socket.disconnect(); // close connection
        socket = null;       // reset instance
    }
};




//   You open website → request sent . Server sends HTML → done. Server CANNOT send data by itself. In normal HTTP, the server is not allowed to send data unless the client asks first
//   You open a website. Browser sends request to server. Server sends HTML → done. Server CANNOT send data by itself. In normal HTTP, the server is not allowed to send data
//  unless the client asks first. This is where WebSockets come in. With WebSockets, once the connection is established, both the client and server can send data to each other
//   at any time without needing to ask for it. This allows for real-time communication, which is essential for applications like chat apps, live notifications, and online
// gaming.

//  in old time :  Client must repeatedly ask: "Do I have new message?" "Do I have new message?""Do I have new message?" This is called Polling. It is inefficient and causes
//  unnecessary load on the server and network. With WebSockets, the server can push new messages to the client immediately when they arrive, eliminating the need for
//  polling and providing a much more responsive user experience.




// A socket (WebSocket / Socket.io connection) ends when the continuous connection between client and server is broken. This can happen for various reasons, such as:
// 1. Network Issues: If the user's internet connection drops or becomes unstable, the socket connection will be lost.
// 2. Server Shutdown: If the server hosting the socket connection is shut down or restarted, all active socket connections will be terminated.
// 3. Client Closure: If the user closes their browser tab or window, the socket connection will be closed.
// 4. Inactivity Timeout: Some servers may have a timeout for inactive connections. If there is no activity (no messages sent or received) for a certain period, the server may close the socket connection.
// 5. Manual Disconnection: The client or server can choose to disconnect the socket connection manually, such as when a user logs out of an application.

// socket.io mainly uses WebSocket protocol for communication, but it can fall back to other transports (like long polling) if WebSockets are not supported by the client or
//  server. However, in our implementation, we are forcing the use of WebSockets for better performance and real-time capabilities.

