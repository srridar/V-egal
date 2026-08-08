import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "../socketEvents";
import { sendMessage } from "@/services/message.service";

export const registerSocketListeners = (io: Server, socket: Socket) => {

  const userId = socket.handshake.query.userId as string;

  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`${socket.id} joined personal room user:${userId}`);
  }

  socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string) => {
    socket.join(`chat:${roomId}`);
    console.log(`${socket.id} joined chat:${roomId}`);
  });


  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId: string) => {
    socket.leave(`chat:${roomId}`);
    console.log(`${socket.id} left chat:${roomId}`);
  });


  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
    try {
      const { tempId, chatId, senderId, content, messageType, file, fileName } = data;

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
      io.to(chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
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

  socket.on(SOCKET_EVENTS.CALL_USER, (data) => {
    io.to(`user:${data.receiver.id}`).emit(
      SOCKET_EVENTS.CALL_INCOMING,
      data
    );
  });

  socket.on(SOCKET_EVENTS.CALL_INCOMING, (data) => {
    io.to(`user:${data.receiver.id}`).emit(
      SOCKET_EVENTS.CALL_INCOMING, data);
  });

  socket.on(SOCKET_EVENTS.CALL_ACCEPTED, (data) => {
    io.to(`user:${data.receiverId}`).emit(
      SOCKET_EVENTS.CALL_ACCEPTED,
      data
    );
  });

  socket.on(SOCKET_EVENTS.CALL_REJECTED, (data) => {
    console.log("Call Rejected:", data);
    io.to(`user:${data.senderId}`).emit(
      SOCKET_EVENTS.CALL_REJECTED,
      data
    );
  });

  socket.on(SOCKET_EVENTS.CALL_ENDED, (data) => {
    io.to(`user:${data.receiverId}`).emit(
      SOCKET_EVENTS.CALL_ENDED,
      data
    );
  });

  socket.on(SOCKET_EVENTS.OFFER, (data) => {
    io.to(`user:${data.receiverId}`).emit(
      SOCKET_EVENTS.OFFER,
      data
    );
  });

  socket.on(SOCKET_EVENTS.ANSWER, (data) => {
    io.to(`user:${data.receiverId}`).emit(
      SOCKET_EVENTS.ANSWER,
      data
    );
  });

  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (data) => {
    io.to(`user:${data.receiverId}`).emit(
      SOCKET_EVENTS.ICE_CANDIDATE,
      data
    );
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(` Disconnected: ${socket.id}`);
  });
};