import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

import { authenticateSocket } from "./socketAuth";
import { registerSocketHandlers } from "./socketHandler";

export const initializeSocket = (server: HTTPServer) => {
  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is missing");
  }

  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      credentials: true,
    },

    transports: ["websocket", "polling"],
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(
      `Connected: ${socket.id} | User: ${socket.data.user.id}`
    );

    registerSocketHandlers(io, socket);
  });

  return io;
};