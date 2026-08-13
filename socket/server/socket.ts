import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerSocketEvents } from "./socketEvents";

let io: Server | null = null;

export const initializeSocket = (server: HttpServer) => {
  if (io) {
    return io;
  }

  const allowedOrigins = process.env.CLIENT_URL?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  registerSocketEvents(io);
  console.log("Socket.IO initialized");

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }
  return io;
};

