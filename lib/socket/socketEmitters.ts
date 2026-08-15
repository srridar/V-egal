import { SOCKET_EVENTS } from "./socketEvents";
import { getSocket } from "./socket";

import {
  SendMessagePayload,
  DeleteMessagePayload,
  EditMessagePayload,
  JoinRoomPayload,
  LeaveRoomPayload,
  CallUserPayload,
  OfferPayload,
  AnswerPayload,
  IceCandidatePayload,
  CallEndedPayload,
  CallRejectedPayload,
  CallAcceptedPayload,
} from "./socketTypes";

const requireSocket = () => {
  const socket = getSocket();

  if (!socket) {
    throw new Error("Socket is not initialized");
  }

  if (!socket.connected) {
    throw new Error("Socket is not connected");
  }

  return socket;
};

/*
|--------------------------------------------------------------------------
| ROOM
|--------------------------------------------------------------------------
*/

export const joinRoom = (
  payload: JoinRoomPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.JOIN_ROOM,
    payload
  );
};

export const leaveRoom = (
  payload: LeaveRoomPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.LEAVE_ROOM,
    payload
  );
};

/*
|--------------------------------------------------------------------------
| MESSAGE
|--------------------------------------------------------------------------
*/

export const sendMessage = (
  payload: SendMessagePayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.SEND_MESSAGE,
    payload
  );
};

export const deleteMessage = (
  payload: DeleteMessagePayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.DELETE_MESSAGE,
    payload
  );
};

export const editMessage = (
  payload: EditMessagePayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.EDIT_MESSAGE,
    payload
  );
};

/*
|--------------------------------------------------------------------------
| CALL
|--------------------------------------------------------------------------
*/

export const callUser = (
  payload: CallUserPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.CALL_USER,
    payload
  );
};

export const acceptCall = (
  payload: CallAcceptedPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.CALL_ACCEPTED,
    payload
  );
};

export const rejectCall = (
  payload: CallRejectedPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.CALL_REJECTED,
    payload
  );
};

export const endCall = (
  payload: CallEndedPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.CALL_ENDED,
    payload
  );
};

/*
|--------------------------------------------------------------------------
| WEBRTC
|--------------------------------------------------------------------------
*/

export const sendOffer = (
  payload: OfferPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.OFFER,
    payload
  );
};

export const sendAnswer = (
  payload: AnswerPayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.ANSWER,
    payload
  );
};

export const sendIceCandidate = (
  payload: IceCandidatePayload
): void => {
  const socket = requireSocket();

  socket.emit(
    SOCKET_EVENTS.ICE_CANDIDATE,
    payload
  );
};