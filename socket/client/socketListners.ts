import { getSocket } from "./socket";
import { SOCKET_EVENTS } from "./socketEvent";

type SocketHandlers = {
  onMessage?: (msg: any) => void;
  onTyping?: (data: any) => void;
  onStopTyping?: (data: any) => void;

  onIncomingCall?: (data: any) => void;
  onCallAccepted?: (data: any) => void;
  onCallRejected?: (data: any) => void;

  onOffer?: (offer: any) => void;
  onAnswer?: (answer: any) => void;
  onIceCandidate?: (candidate: any) => void;
  onCallEnded?: () => void;
};

export const setupSocketListeners = (roomId: string, handlers: SocketHandlers) => {
  const socket = getSocket();

  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }

  // MESSAGE
  if (handlers.onMessage) {
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handlers.onMessage);
  }

  //  TYPING
  if (handlers.onTyping) {
    socket.on(SOCKET_EVENTS.TYPING, handlers.onTyping);
  }

  if (handlers.onStopTyping) {
    socket.on(SOCKET_EVENTS.STOP_TYPING, handlers.onStopTyping);
  }

  //  CALL EVENTS
  if (handlers.onIncomingCall) {
    socket.on(
      SOCKET_EVENTS.CALL_INCOMING,
      handlers.onIncomingCall
    );
  }

  if (handlers.onCallAccepted) {
    socket.on(SOCKET_EVENTS.CALL_ACCEPTED, handlers.onCallAccepted);
  }

  if (handlers.onCallRejected) {
    socket.on(SOCKET_EVENTS.CALL_REJECTED, handlers.onCallRejected);
  }

  //  WEBRTC SIGNALING (FILTERED BY ROOM)
  if (handlers.onOffer) {
    socket.on(SOCKET_EVENTS.OFFER, (data) => {
      if (data.roomId === roomId) {
        handlers.onOffer!(data.offer);
      }
    });
  }



  if (handlers.onAnswer) {
    socket.on(SOCKET_EVENTS.ANSWER, (data) => {
      if (data.roomId === roomId) {
        handlers.onAnswer!(data.answer);
      }
    });
  }

  if (handlers.onIceCandidate) {
    socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (data) => {
      if (data.roomId === roomId) {
        handlers.onIceCandidate!(data.candidate);
      }
    });
  }

  if (handlers.onCallEnded) {
    socket.on(SOCKET_EVENTS.CALL_ENDED, (data) => {
      if (data.roomId === roomId) {
        handlers.onCallEnded!();
      }
    });
  }
};


export const removeSocketListeners = () => {
  const socket = getSocket();
  if (!socket) {
    console.warn("Socket not initialized");
    return;
  }
  socket.off("message:receive");
  socket.off("typing");
  socket.off("stop-typing");
  socket.off("call:incoming");
  socket.off("call:accepted");
  socket.off("call:rejected");
  socket.off("offer");
  socket.off("answer");
  socket.off("ice-candidate");
  socket.off("call:ended");
};