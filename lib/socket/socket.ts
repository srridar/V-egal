"use client";

import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8008";

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on("connect", () => console.log("Socket connected:", socket?.id));
  socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
  socket.on("connect_error", (err) => console.error("Socket connection error:", err.message));

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};

export const emitEvent = <T = unknown>(event: string, payload?: T): void => {
  if (!socket?.connected) throw new Error("Socket is not connected");
  socket.emit(event, payload);
};

export const onEvent = <T = unknown>(event: string, handler: (payload: T) => void): void => {
  socket?.on(event, handler);
};

export const offEvent = <T = unknown>(event: string, handler: (payload: T) => void): void => {
  socket?.off(event, handler);
};