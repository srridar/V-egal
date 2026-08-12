export type CallMediaType = "audio" | "video";

export type CallStatus =
    | "idle"
    | "calling"
    | "ringing"
    | "connecting"
    | "connected"
    | "ended"
    | "rejected"
    | "missed"
    | "busy";



export interface User {
  id: string;
  username: string;
  avatar?: string;
  friendList?: string[];
}


export type CallType = "audio" | "video";

export interface StartCallParams {
  chatId: string;
  caller: User;
  receiver: User;
}

export interface IncomingCall {
  roomId: string;
  caller: User;
  receiver: User;
  type: CallType;
  offer: RTCSessionDescriptionInit;
}


export interface CallContextType {
  callStatus: CallStatus;
  callType: CallType | null;
  incomingCall: IncomingCall | null;
  outgoingUser: User | null;

  localStream: MediaStream | null;
  remoteStream: MediaStream | null;

  isMuted: boolean;
  isCameraOff: boolean;
  speakerOn: boolean;

  startAudioCall: (params: StartCallParams) => Promise<void>;
  startVideoCall: (params: StartCallParams) => Promise<void>;
  receiveCall: (call: IncomingCall) => void;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleSpeaker: () => void;
}