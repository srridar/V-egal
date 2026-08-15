import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  userId: string;
}

export interface JoinRoomPayload {
  chatId: string;
}

export interface LeaveRoomPayload {
  chatId: string;
}

export interface MessagePayload {
  chatId: string;
  message: unknown;
}

export interface TypingPayload {
  chatId: string;
}

export interface CallPayload {
  chatId: string;
  caller: unknown;
  receiver: unknown;
  type: "audio" | "video";
}

export interface OfferPayload {
  chatId: string;
  offer: RTCSessionDescriptionInit | unknown;
}

export interface AnswerPayload {
  chatId: string;
  answer: RTCSessionDescriptionInit | unknown;
}

export interface IceCandidatePayload {
  chatId: string;
  candidate: unknown;
}