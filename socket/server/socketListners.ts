import { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "../socketEvents";
import { sendMessage } from "@/services/message.service";

export const registerSocketListeners = (io: Server,
  socket: Socket) => {
  console.log(` Connected: ${socket.id}`);

  // Join Room

  socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
  });

  // Leave Room

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId: string) => {
    socket.leave(roomId);
    console.log(`${socket.id} left ${roomId}`);
  });

  // Send Message


  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async (data) => {
    try {
      console.log("Incoming Message:", data);

      const {
        tempId,
        chatId,
        senderId,
        content,
        messageType,
        file,
        fileName,
      } = data;

      // Save to MongoDB
      const message = await sendMessage({
        chatId,
        senderId,
        content,
        file,
        fileName,
        messageType,
      });

      // Send the saved message to everyone in the room
      io.to(chatId).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, {
        ...message.toObject(),
        tempId,
      });

    } catch (error: any) {
      console.error(" Error sending message:", error);

      socket.emit(SOCKET_EVENTS.MESSAGE_ERROR, {
        message: error.message || "Failed to send message",
      });
    }
  });

  // ==========================
  // Typing
  // ==========================

  socket.on(SOCKET_EVENTS.TYPING, ({ chatId }) => {
    socket.to(chatId).emit(
      SOCKET_EVENTS.TYPING,
      { chatId }
    );
  });

  socket.on(SOCKET_EVENTS.STOP_TYPING, ({ chatId }) => {
    socket.to(chatId).emit(
      SOCKET_EVENTS.STOP_TYPING,
      { chatId }
    );
  });

  // Incoming Call


  socket.on(SOCKET_EVENTS.CALL_INCOMING, (data) => {
    socket.to(data.roomId).emit(
      SOCKET_EVENTS.CALL_INCOMING,
      data
    );
  });

  socket.on(SOCKET_EVENTS.CALL_ACCEPTED, (data) => {
    socket.to(data.roomId).emit(
      SOCKET_EVENTS.CALL_ACCEPTED,
      data
    );
  });

  socket.on(SOCKET_EVENTS.CALL_REJECTED, (data) => {
    socket.to(data.roomId).emit(
      SOCKET_EVENTS.CALL_REJECTED,
      data
    );
  });

  socket.on(SOCKET_EVENTS.CALL_ENDED, (data) => {
    socket.to(data.roomId).emit(
      SOCKET_EVENTS.CALL_ENDED,
      data
    );
  });


  // WebRTC


  socket.on(SOCKET_EVENTS.OFFER, (data) => {
    socket.to(data.roomId).emit(
      SOCKET_EVENTS.OFFER,
      data
    );
  });

  socket.on(SOCKET_EVENTS.ANSWER, (data) => {
    socket.to(data.roomId).emit(
      SOCKET_EVENTS.ANSWER,
      data
    );
  });

  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (data) => {
    socket.to(data.roomId).emit(
      SOCKET_EVENTS.ICE_CANDIDATE,
      data
    );
  });

  // Disconnect

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(` Disconnected: ${socket.id}`);
  });
};