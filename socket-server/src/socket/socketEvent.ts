export const SOCKET_EVENTS = {

  // Connection

  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",


  // Room

  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",


  // Chat / Messages

  SEND_MESSAGE: "message:send",
  RECEIVE_MESSAGE: "message:receive",
  DELETE_MESSAGE: "message:delete",
  EDIT_MESSAGE: "message:edit",
  MESSAGE_ERROR: "message:error",


  // User Presence

  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",


  // Calls

  CALL_USER: "call-user",
  CALL_INCOMING: "call:incoming",
  CALL_ACCEPTED: "call:accepted",
  CALL_REJECTED: "call:rejected",
  CALL_ENDED: "call:ended",


  // WebRTC Signaling

  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];