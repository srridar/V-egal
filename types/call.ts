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
  name: string;
  avatar?: string;
}

export type CallType = "audio" | "video";

export interface StartCallParams {
  chatId: string;
  caller: {
    id: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar?: string;
  };
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
  callType: CallType;
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