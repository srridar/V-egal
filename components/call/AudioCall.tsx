"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";

interface AudioCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;

  user: {
    id: string;
    name: string;
    avatar?: string;
  };

  status: "calling" | "ringing" | "connected";

  onEndCall: () => void;
}

export default function AudioCall({
  localStream,
  remoteStream,
  user,
  status,
  onEndCall,
}: AudioCallProps) {
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (!localStream) return;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });

    setIsMuted((prev) => !prev);
  };

  const toggleSpeaker = () => {
    setSpeakerOn((prev) => !prev);

    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = speakerOn;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">

      <audio ref={remoteAudioRef} autoPlay playsInline />

      <Image
        src={user.avatar || "/default-avatar.png"}
        alt={user.name}
        width={120}
        height={120}
        className="rounded-full object-cover border-4 border-zinc-700"
      />

      <h2 className="mt-6 text-2xl font-semibold">
        {user.name}
      </h2>

      <p className="mt-2 text-zinc-400 capitalize">
        {status}
      </p>

      <div className="mt-12 flex items-center gap-8">

        <button
          onClick={toggleMute}
          className="rounded-full bg-zinc-800 p-5 hover:bg-zinc-700 transition"
        >
          {isMuted ? (
            <MicOff className="text-red-500" size={28} />
          ) : (
            <Mic size={28} />
          )}
        </button>

        <button
          onClick={toggleSpeaker}
          className="rounded-full bg-zinc-800 p-5 hover:bg-zinc-700 transition"
        >
          <Volume2
            size={28}
            className={speakerOn ? "text-green-500" : ""}
          />
        </button>

        <button
          onClick={onEndCall}
          className="rounded-full bg-red-600 p-5 hover:bg-red-700 transition"
        >
          <PhoneOff size={28} />
        </button>

      </div>
    </div>
  );
}