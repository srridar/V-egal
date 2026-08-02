export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",

  MESSAGE_SEND: "message:send",
  MESSAGE_RECEIVE: "message:receive",
  MESSAGE_ERROR: "message:error",

  TYPING: "typing",
  STOP_TYPING: "stop-typing",

  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",

  CALL_INCOMING: "call:incoming",
  CALL_ACCEPTED: "call:accepted",
  CALL_REJECTED: "call:rejected",
  CALL_ENDED: "call:ended",

  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
} as const;


