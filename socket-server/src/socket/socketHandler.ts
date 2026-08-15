import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socketEvent";

export const registerSocketHandlers = (io: Server, socket: Socket) => {
    const userId = socket.data.userId as string;

    // JOIN CHAT ROOM

    socket.on(SOCKET_EVENTS.JOIN_ROOM,
        ({ chatId }: { chatId: string }) => {
            if (!chatId) {
                return;
            }

            socket.join(chatId);
            console.log(`User ${userId} joined chat room ${chatId}`);
        }
    );


    // LEAVE CHAT ROOM

    socket.on(SOCKET_EVENTS.LEAVE_ROOM,
        ({ chatId }: { chatId: string }) => {
            if (!chatId) {
                return;
            }
            socket.leave(chatId);
            console.log(`User ${userId} left chat room ${chatId}`);
        }
    );


    // MESSAGE

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, (payload) => {
        if (!payload?.chatId) {
            return;
        }

        socket.to(payload.chatId).emit(
            SOCKET_EVENTS.RECEIVE_MESSAGE,
            payload
        );
    }
    );

 

    
    // WEBRTC OFFER
     
    socket.on(SOCKET_EVENTS.OFFER, (payload) => {
            if (!payload?.chatId) {
                return;
            }

            socket.to(payload.chatId).emit(
                    SOCKET_EVENTS.OFFER,
                    {
                        ...payload,
                        senderId: userId,
                    }
                );
        }
    );

    
    //  WEBRTC ANSWER
     
    socket.on(  SOCKET_EVENTS.ANSWER, (payload) => {
            if (!payload?.chatId) {
                return;
            }

            socket.to(payload.chatId).emit(
                    SOCKET_EVENTS.ANSWER,
                    {
                        ...payload,
                        senderId: userId,
                    }
                );
        }
    );

    
    // ICE CANDIDATE
     
    socket.on(SOCKET_EVENTS.ICE_CANDIDATE,
        (payload) => {
            if (!payload?.chatId) {
                return;
            }

            socket.to(payload.chatId).emit(
                    SOCKET_EVENTS.ICE_CANDIDATE,
                    {
                        ...payload,
                        senderId: userId,
                    }
                );
        }
    );

    
     // CALL USER
     
    socket.on( SOCKET_EVENTS.CALL_USER, (payload) => {
            if (!payload?.chatId) {
                return;
            }

            socket.to(payload.chatId).emit(
                    SOCKET_EVENTS.CALL_INCOMING,
                    {
                        ...payload,
                        callerId: userId,
                    }
                );
        }
    );

    
    //   CALL ACCEPTED
     
    socket.on( SOCKET_EVENTS.CALL_ACCEPTED,
        (payload) => {
            if (!payload?.chatId) {
                return;
            }

            socket.to(payload.chatId).emit(
                    SOCKET_EVENTS.CALL_ACCEPTED,
                    {
                        ...payload,
                        userId,
                    }
                );
        }
    );

    
     //  CALL REJECTED
     
    socket.on(SOCKET_EVENTS.CALL_REJECTED,
        (payload) => {
            if (!payload?.chatId) {
                return;
            }

            socket.to(payload.chatId).emit(
                    SOCKET_EVENTS.CALL_REJECTED,
                    {
                        ...payload,
                        userId,
                    }
                );
        }
    );

    
     //  CALL ENDED
     
    socket.on( SOCKET_EVENTS.CALL_ENDED,
        (payload) => {
            if (!payload?.chatId) {
                return;
            }

            socket.to(payload.chatId)
                .emit(
                    SOCKET_EVENTS.CALL_ENDED,
                    {
                        ...payload,
                        userId,
                    }
                );
        }
    );


     //  DISCONNECT
 
    socket.on(SOCKET_EVENTS.DISCONNECT,
        (reason) => {
            console.log(`Socket disconnected: ${socket.id} | user: ${userId} | reason: ${reason}`);
        }
    );
};