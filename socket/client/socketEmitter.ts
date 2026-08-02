import { getSocket, setCurrentRoom } from "./socket";

// ================== ROOM ==================
export const joinCallRoom = (roomId: string) => {
  const socket = getSocket();
  setCurrentRoom(roomId);
  socket.emit("join-room", roomId);
};

export const leaveCallRoom = (roomId: string) => {
  const socket = getSocket();
  socket.emit("leave-room", roomId);
};

// ================== CALL ==================
export const emitIncomingCall = (data: any) => {
  getSocket().emit("call:incoming", data);
};

export const emitAcceptCall = (roomId: string) => {
  getSocket().emit("call:accepted", { roomId });
};

export const emitRejectCall = (roomId: string) => {
  getSocket().emit("call:rejected", { roomId });
};

export const emitEndCall = (roomId: string) => {
  getSocket().emit("call:ended", { roomId });
};

// ================== WEBRTC ==================
export const sendOffer = (roomId: string, offer: any) => {
  getSocket().emit("offer", { roomId, offer });
};

export const sendAnswer = (roomId: string, answer: any) => {
  getSocket().emit("answer", { roomId, answer });
};

export const sendIceCandidate = (roomId: string, candidate: any) => {
  getSocket().emit("ice-candidate", { roomId, candidate });
};

// ================== CHAT ==================
export const sendMessage = (data: any) => {
  getSocket().emit("message:send", data);
};

export const emitTyping = (chatId: string) => {
  getSocket().emit("typing", { chatId });
};

export const emitStopTyping = (chatId: string) => {
  getSocket().emit("stop-typing", { chatId });
};