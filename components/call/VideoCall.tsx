"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import CallControls from "./CallControl";

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;

  user: {
    id: string;
    name: string;
    avatar?: string;
  };

  status: "calling" | "ringing" | "connected";

  isMuted: boolean;
  isCameraOff: boolean;
  speakerOn: boolean;

  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
}

export default function VideoCall({
  localStream,
  remoteStream,
  user,
  status,
  isMuted,
  isCameraOff,
  speakerOn,
  onToggleMute,
  onToggleCamera,
  onToggleSpeaker,
  onEndCall,
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="fixed inset-0 z-50 bg-black">

      {/* Remote Video */}
      {remoteStream ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center bg-zinc-900">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />

          <h2 className="mt-5 text-2xl font-semibold text-white">
            {user.name}
          </h2>

          <p className="mt-2 capitalize text-zinc-400">
            {status}
          </p>
        </div>
      )}

      {/* Local Preview */}
      <div className="absolute right-5 top-5 h-48 w-36 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg">

        {localStream && !isCameraOff ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-white">

            <Image
              src={user.avatar || "/default-avatar.png"}
              alt={user.name}
              width={60}
              height={60}
              className="rounded-full"
            />

            <p className="mt-3 text-xs">
              Camera Off
            </p>

          </div>
        )}

      </div>

      {/* Call Status */}
      <div className="absolute left-6 top-6 text-white">
        <h2 className="text-xl font-semibold">
          {user.name}
        </h2>

        <p className="text-sm capitalize text-zinc-300">
          {status}
        </p>
      </div>

      {/* Bottom Controls */}
      <CallControls
        isVideoCall
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        speakerOn={speakerOn}
        onToggleMute={onToggleMute}
        onToggleCamera={onToggleCamera}
        onToggleSpeaker={onToggleSpeaker}
        onEndCall={onEndCall}
      />

    </div>
  );
}