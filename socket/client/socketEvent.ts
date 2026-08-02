
// Connection Events

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",


  // Room Events

  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",


  // Chat Events

  SEND_MESSAGE: "message:send",
  RECEIVE_MESSAGE: "message:receive",

  MESSAGE_SENT: "message:sent",
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_SEEN: "message:seen",

  DELETE_MESSAGE: "message:delete",
  EDIT_MESSAGE: "message:edit",

 // Typing Events

  TYPING: "typing",
  STOP_TYPING: "stop-typing",

  // User Status

  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",


  // Friend Events
  
  FRIEND_REQUEST: "friend:request",
  FRIEND_ACCEPTED: "friend:accepted",
  FRIEND_REMOVED: "friend:removed",


  // Notifications
  NOTIFICATION: "notification",


  // Call Events
  CALL_INCOMING: "call:incoming",
  CALL_ACCEPTED: "call:accepted",
  CALL_REJECTED: "call:rejected",
  CALL_ENDED: "call:ended",


  // WebRTC
  OFFER: "offer",
  ANSWER: "answer",
  ICE_CANDIDATE: "ice-candidate",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];