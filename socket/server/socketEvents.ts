import { Server } from "socket.io";
import { SOCKET_EVENTS } from "../socketEvents";
import { registerSocketListeners } from "./socketListners";

export const registerSocketEvents = (io: Server) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    registerSocketListeners(io, socket);
  });
};