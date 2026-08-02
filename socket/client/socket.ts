import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentUserId: string | null = null;
let currentRoomId: string | null = null;

export const initializeSocket = (userId: string): Socket => {
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

  if (!SOCKET_URL) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined.");
  }

  if (socket && currentUserId === userId) {
    return socket;
  }

  if (socket && currentUserId !== userId) {
    disconnectSocket();
  }

  currentUserId = userId;

  socket = io(SOCKET_URL, {
    withCredentials: true,

    query: {
      userId,
    },

    autoConnect: true,

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });



  socket.on("connect", () => {
    console.log(" Socket Connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log(" Socket Disconnected:", reason);
  });

  socket.io.on("reconnect_attempt", (attempt) => {
    console.log(` Reconnect Attempt: ${attempt}`);
  });

  socket.io.on("reconnect", (attempt) => {
    console.log(` Reconnected after ${attempt} attempt(s)`);


    if (currentRoomId) {
      socket?.emit("join-room", currentRoomId);
    }
  });

  socket.io.on("reconnect_error", (err) => {
    console.error("Reconnect Error:", err);
  });

  socket.io.on("reconnect_failed", () => {
    console.error("Unable to reconnect.");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection failed:", err);
    console.log("URL:", SOCKET_URL);
  });
  
  socket.on("error", (err) => {
    console.error("Socket Error:", err);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};

export const joinRoom = (roomId: string) => {
    const socket = getSocket();
    if (!socket) {
        console.error("Socket not connected");
        return;
    }
    currentRoomId = roomId;
    console.log("Joining room:", roomId);
    socket.emit("join-room", roomId);
};

export const leaveRoom = () => {
  if (!socket || !currentRoomId) return;
  socket.emit("leave-room", currentRoomId);
  currentRoomId = null;
};

export const setCurrentRoom = (roomId: string) => {
  currentRoomId = roomId;
};

export const clearCurrentRoom = () => {
  currentRoomId = null;
};

export const getCurrentRoom = () => {
  return currentRoomId;
};

export const emitEvent = <T>(event: string, payload?: T) => {
    const socket = getSocket();
    if (!socket) {
        console.error("Socket is not initialized.");
        return;
    }
    console.log("EMIT:", event, payload);
    socket.emit(event, payload);
};

export const onEvent = (event: string, callback: (...args: any[]) => void) => {
  const socket = getSocket();
  socket.off(event, callback);
  socket.on(event, callback);
};

export const onceEvent = (event: string, callback: (...args: any[]) => void) => {
  getSocket().once(event, callback);
};

export const offEvent = (event: string, callback?: (...args: any[]) => void) => {
  const socket = getSocket();

  if (callback) {
    socket.off(event, callback);
  } else {
    socket.removeAllListeners(event);
  }
};

export const disconnectSocket = () => {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  currentUserId = null;
  currentRoomId = null;
  console.log(" Socket connection closed.");
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

