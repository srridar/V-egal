import { getSocket } from "./socket";

export const setupCallListeners = (handlers: {
    onMessage?: (msg: any) => void;
    onIncomingCall?: (data: any) => void;
    onOffer?: (offer: any) => void;
    onAnswer?: (answer: any) => void;
    onIceCandidate?: (candidate: any) => void;
    onCallEnded?: () => void;
}) => {
    const socket = getSocket();

    if (handlers.onMessage) {
        socket.on("message:receive", handlers.onMessage);
    }

    if (handlers.onIncomingCall) {
        socket.on("call:incoming", handlers.onIncomingCall);
    }

    if (handlers.onOffer) {
        socket.on("offer", handlers.onOffer);
    }

    if (handlers.onAnswer) {
        socket.on("answer", handlers.onAnswer);
    }

    if (handlers.onIceCandidate) {
        socket.on("ice-candidate", handlers.onIceCandidate);
    }

    if (handlers.onCallEnded) {
        socket.on("call:ended", handlers.onCallEnded);
    }
};



export const removeSocketListeners = () => {
  const socket = getSocket();

  socket.off("message:receive");
  socket.off("call:incoming");
  socket.off("offer");
  socket.off("answer");
  socket.off("ice-candidate");
  socket.off("call:ended");
};