import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CallType = "audio" | "video";

export type CallStatus = "idel" | "callling" | "ringing" | "connecting" | "connected" | "ended" | "rejected" | "missed";

export interface ICall {
    _id: string;
    callerId: string;
    receiverId: string;
    chatId?: string;
    type: CallType;
    status: CallStatus;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
}



interface CallState {
    currentCall: ICall | null;
    incomingCall: ICall | null;
    outgoingCall: ICall | null;
    isCalling: boolean;
    isIncoming: boolean;
    isInCall: boolean;
    isMuted: boolean;
    isSpeakerOn: boolean;
    isVideoEnabled: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    loading: boolean;
    error: string | null;
}


const initialState: CallState = {
    currentCall: null,
    incomingCall: null,
    outgoingCall: null,
    isCalling: false,
    isIncoming: false,
    isInCall: false,
    isMuted: false,
    isSpeakerOn: false,
    isVideoEnabled: true,
    localStream: null,
    remoteStream: null,
    loading: false,
    error: null,
};


const callSlice = createSlice({
    name: "call",
    initialState,
    reducers: {

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        clearError(state) {
            state.error = null;
        },

        // incoming call
        receiveCall(state, action: PayloadAction<ICall>) {
            state.incomingCall = action.payload;   // This stores the incoming call information in Redux.
            state.currentCall = action.payload;
            state.isIncoming = true;    // it means  there is currently an incoming call
        },

        // outgoing call
        startCall(state, action: PayloadAction<ICall>) {
            state.outgoingCall = action.payload;
            state.currentCall = action.payload;
            state.isCalling = true;
        },

        // accept call

        acceptCall(state) {
            if (!state.currentCall) return;

            state.currentCall.status = "connected";
            state.isCalling = false;
            state.isIncoming = false;
            state.isInCall = true;
        },

        // reject call

        rejectCall(state) {
            if (state.currentCall) {
                state.currentCall.status = "rejected";
            }

            state.currentCall = null;
            state.incomingCall = null;
            state.outgoingCall = null;

            state.isCalling = false;
            state.isIncoming = false;
            state.isInCall = false;
        },

        endCall(state) {
            if (state.currentCall) {
                state.currentCall.status = "ended";
            }

            state.currentCall = null;
            state.incomingCall = null;
            state.outgoingCall = null;

            state.isCalling = false;
            state.isIncoming = false;
            state.isInCall = false;
            state.localStream = null;     // Local stream is your own audio/video captured from your microphone and camera.
            state.remoteStream = null;    // The remote stream is the audio/video received from the other user through WebRTC.
        },


        missedCall(state) {
            if (state.currentCall) {
                state.currentCall.status = "missed";
            }

            state.currentCall = null;
            state.incomingCall = null;
            state.isIncoming = false;
        },


        //   media control 

        toggleMute(state) {
            state.isMuted = !state.isMuted;
        },

        toggleSpeaker(state) {
            state.isSpeakerOn = !state.isSpeakerOn;
        },

        toggleVideo(state) {
            state.isVideoEnabled = !state.isVideoEnabled;
        },


        //  streams 

        setLocalStream(state, action: PayloadAction<MediaStream | null>) {
            state.localStream = action.payload;
        },

        setRemoteStream(state, action: PayloadAction<MediaStream | null>) {
            state.remoteStream = action.payload;
        },



        resetCallState(state) {
            Object.assign(state, initialState);
        },
    }
})



export const {
  setLoading, setError, clearError, receiveCall, startCall, acceptCall,
  rejectCall, endCall, missedCall, toggleMute, toggleSpeaker, toggleVideo,
  setLocalStream, setRemoteStream, resetCallState} = callSlice.actions;

export default callSlice.reducer;