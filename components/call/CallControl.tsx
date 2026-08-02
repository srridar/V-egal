"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
} from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  isCameraOff?: boolean;
  speakerOn?: boolean;
  isVideoCall?: boolean;

  onToggleMute: () => void;
  onToggleCamera?: () => void;
  onToggleSpeaker?: () => void;
  onEndCall: () => void;
}

export default function CallControls({
  isMuted,
  isCameraOff = false,
  speakerOn = true,
  isVideoCall = false,
  onToggleMute,
  onToggleCamera,
  onToggleSpeaker,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-5 rounded-full bg-zinc-900/90 px-6 py-4 shadow-xl backdrop-blur">

      {/* Microphone */}
      <button
        onClick={onToggleMute}
        className="rounded-full bg-zinc-800 p-4 transition hover:bg-zinc-700"
      >
        {isMuted ? (
          <MicOff className="text-red-500" size={24} />
        ) : (
          <Mic size={24} className="text-white" />
        )}
      </button>

      {/* Camera (Video calls only) */}
      {isVideoCall && (
        <button
          onClick={onToggleCamera}
          className="rounded-full bg-zinc-800 p-4 transition hover:bg-zinc-700"
        >
          {isCameraOff ? (
            <VideoOff className="text-red-500" size={24} />
          ) : (
            <Video className="text-white" size={24} />
          )}
        </button>
      )}

      {/* Speaker */}
      <button
        onClick={onToggleSpeaker}
        className="rounded-full bg-zinc-800 p-4 transition hover:bg-zinc-700"
      >
        {speakerOn ? (
          <Volume2 className="text-white" size={24} />
        ) : (
          <VolumeX className="text-red-500" size={24} />
        )}
      </button>

      {/* End Call */}
      <button
        onClick={onEndCall}
        className="rounded-full bg-red-600 p-4 transition hover:bg-red-700"
      >
        <PhoneOff className="text-white" size={24} />
      </button>

    </div>
  );
}