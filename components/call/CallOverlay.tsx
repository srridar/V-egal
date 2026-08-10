"use client";

import { useCall } from "@/context/CallProviderContext";

import AudioCall from "./AudioCall";
import VideoCall from "./VideoCall";
import IncomingCallModal from "./IncomingCallModal";
import OutgoingCallModal from "./OutgoingCallModal";
import ConnectingCall from "./ConnectingCall";

export default function CallOverlay() {
  const {
    callStatus,
    callType,

    incomingCall,
    outgoingUser,

    localStream,
    remoteStream,

    isMuted,
    isCameraOff,
    speakerOn,

    acceptCall,
    rejectCall,
    endCall,

    toggleMute,
    toggleCamera,
    toggleSpeaker,
  } = useCall();

  // Nothing to show
  if (callStatus === "idle" && !incomingCall && !outgoingUser) {
    return null;
  }


  // Incoming Call
  if (incomingCall && callStatus === "ringing") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
        <IncomingCallModal
          callerName={incomingCall.caller.name}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      </div>
    );
  }

  // Outgoing Call
  if  (outgoingUser && callStatus === "calling" && callType){
    return (
      <OutgoingCallModal
        open={true}
        receiver={outgoingUser}
        callType={callType}
        status="calling"
        onCancel={endCall}
      />
    );
  }


  if (callStatus === "connecting") {
    console.log("Connecting call overlay rendered");
    const user = outgoingUser ?? incomingCall?.caller;
    if (!user) return null;

    return (
      <ConnectingCall
        user={user}
        onEndCall={endCall}
      />
    );
  }

  // Active Audio Call
  if (callType === "audio" && callStatus === "connected") {
    const user = outgoingUser ?? incomingCall?.caller;

    if (!user) return null;

    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-zinc-950">
        <AudioCall
          user={user}
          status="connected"
          localStream={localStream}
          remoteStream={remoteStream}
          onEndCall={endCall}
        />
      </div>
    );
  }

  // Active Video Call
  if (callType === "video" && callStatus === "connected") {
    const user = outgoingUser ?? incomingCall?.caller;
    if (!user) return null;

    return (
      <div className="fixed inset-0 z-9999 bg-black">
        <VideoCall
          user={user}
          status="connected"
          localStream={localStream}
          remoteStream={remoteStream}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          speakerOn={speakerOn}
          onToggleMute={toggleMute}
          onToggleCamera={toggleCamera}
          onToggleSpeaker={toggleSpeaker}
          onEndCall={endCall}
        />
      </div>
    );
  }

  return null;
}