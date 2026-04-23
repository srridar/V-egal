import { getSocket } from "./socket";

export const joinCallRoom = (roomId: string) => {     // roomId is unique identifier of a call
  const socket = getSocket();                         // it gets your existing socket connection. this line means “Give me the active connection to the server”    
  socket.emit("join-room", roomId);                   // socket emits means send some message to server . so it  means "Hey server, I want to join this room with given roomId”
};


export const sendOffer = (roomId: string, offer: any) => {       //   send WebRTC offer to another user . it's a connection setup signal . roomid means unique call and offer means WebRTC connection data
  const socket = getSocket();                    
  socket.emit("offer", { roomId, offer });
};

export const sendAnswer = (roomId: string, answer: any) => {
  const socket = getSocket();
  socket.emit("answer", { roomId, answer });
};

export const sendIceCandidate = (roomId: string, candidate: any) => {
  const socket = getSocket();
  socket.emit("ice-candidate", { roomId, candidate });
};

// incoming call
export const emitIncomingCall = (data: any) => {
  const socket = getSocket();
  socket.emit("call:incoming", data);
};

// accept call
export const emitAcceptCall = (roomId: string) => {
  const socket = getSocket();
  socket.emit("call:accepted", { roomId });
};

// reject call
export const emitRejectCall = (roomId: string) => {
  const socket = getSocket();
  socket.emit("call:rejected", { roomId });
};

// end call
export const emitEndCall = (roomId: string) => {
  const socket = getSocket();
  socket.emit("call:ended", { roomId });
};