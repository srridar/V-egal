export const SOCKET_EVENTS = {         // Connection Events
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  JOIN_ROOM: "join-room",             //  Room Events
  LEAVE_ROOM: "leave-room",

  SEND_MESSAGE: "message:send",        // Chat Events
  RECEIVE_MESSAGE: "message:receive",
  DELETE_MESSAGE: "message:delete",
  EDIT_MESSAGE: "message:edit",
  MESSAGE_ERROR: "message:error",

  USER_ONLINE: "user:online",         // User Status
  USER_OFFLINE: "user:offline",
  
  CALL_USER: "call-user",
  CALL_INCOMING: "call:incoming",           // Call Events
  CALL_ACCEPTED: "call:accepted",
  CALL_REJECTED: "call:rejected",
  CALL_ENDED: "call:ended",

  OFFER: "offer",                           // WebRTC
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
