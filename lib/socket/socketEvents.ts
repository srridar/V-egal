export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",

  SEND_MESSAGE: "message:send",
  RECEIVE_MESSAGE: "message:receive",
  DELETE_MESSAGE: "message:delete",
  EDIT_MESSAGE: "message:edit",
  MESSAGE_ERROR: "message:error",

  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",

  CALL_USER: "call-user",
  CALL_INCOMING: "call:incoming",
  CALL_ACCEPTED: "call:accepted",
  CALL_REJECTED: "call:rejected",
  CALL_ENDED: "call:ended",

  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];