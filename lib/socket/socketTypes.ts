
// ROOM TYPES

export interface JoinRoomPayload {
  roomId: string;
}

export interface LeaveRoomPayload {
  roomId: string;
}


// MESSAGE TYPES

export type SocketMessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file";

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  messageType?: SocketMessageType;
}

export interface ReceiveMessagePayload {
  conversationId: string;

  message: {
    id: string;
    senderId: string;
    content: string;
    messageType: SocketMessageType;
    createdAt: string;
  };
}

export interface DeleteMessagePayload {
  conversationId: string;
  messageId: string;
}

export interface EditMessagePayload {
  conversationId: string;
  messageId: string;
  content: string;
}



// MESSAGE ERROR

export interface MessageErrorPayload {
  conversationId?: string;
  messageId?: string;
  message: string;
  code?: string;
}


// USER PRESENCE

export interface UserOnlinePayload {
  userId: string;
}

export interface UserOfflinePayload {
  userId: string;
}



// CALL TYPES

export type CallType = "audio" | "video";

export interface CallUserPayload {
  chatId: string;

  caller: {
    id: string;
    username: string;
    avatar?: string;
  };

  receiver: {
    id: string;
    username: string;
    avatar?: string;
  };

  type: CallType;
}

export interface CallIncomingPayload {
  chatId: string;

  caller: {
    id: string;
    username: string;
    avatar?: string;
  };

  type: CallType;
}


// CALL STATUS

export interface CallAcceptedPayload {
  chatId: string;
  userId: string;
}

export interface CallRejectedPayload {
  chatId: string;
  userId: string;
}

export interface CallEndedPayload {
  chatId: string;
  userId: string;
}


// WEBRTC SIGNALING


export interface OfferPayload {
  chatId: string;
  callerId: string;
  receiverId: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerPayload {
  chatId: string;
  callerId: string;
  receiverId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  chatId: string;
  senderId: string;
  receiverId: string;
  candidate: RTCIceCandidateInit;
}