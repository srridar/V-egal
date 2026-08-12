"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { User } from '@/types/call'

interface AudioCallProps {
  user: User;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  status: | "calling" | "ringing" | "connecting" | "connected";
  duration?: string;
  onEndCall: () => void;
}

export default function AudioCall({
  user,
  localStream,
  remoteStream,
  status,
  duration,
  onEndCall,
}: AudioCallProps) {
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  // Attach remote stream

  useEffect(() => {
    if (!remoteAudioRef.current || !remoteStream) return;
    remoteAudioRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  //  clean up remote audio element on unmount
  useEffect(() => {
    return () => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
      }
    };
  }, []);

   // Mute microphone
   
  const toggleMute = () => {
    if (!localStream) return;
    const nextMuted = !isMuted;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });

    setIsMuted(nextMuted);
  };

  // Toggle speaker

  const toggleSpeaker = () => {
    if (!remoteAudioRef.current) return;
    const nextSpeaker = !speakerOn;
    remoteAudioRef.current.muted = !nextSpeaker;
    setSpeakerOn(nextSpeaker);
  };

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-zinc-950 text-white">

      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
      />

      <Image
        src={user.avatar || "/default-avatar.png"}
        alt={user.username}
        width={140}
        height={140}
        priority
        className="rounded-full border-4 border-zinc-700 object-cover"
      />

      <h2 className="mt-6 text-3xl font-semibold">{user.username}</h2>
      <p className="mt-2 text-zinc-400 capitalize"> {status} </p>
     
      {status === "connected" && duration && (
        <p className="mt-2 text-green-400 text-lg font-medium"> {duration}  </p>
      )}

      <div className="mt-14 flex items-center gap-8">
        <button onClick={toggleMute}  disabled={status !== "connected"}  className="rounded-full bg-zinc-800 p-5 transition hover:bg-zinc-700 disabled:opacity-50">
          {isMuted ? ( <MicOff size={28} className="text-red-500" />) : ( <Mic size={28} /> )}
        </button>

        <button
          onClick={toggleSpeaker}
          disabled={status !== "connected"}
          className="rounded-full bg-zinc-800 p-5 transition hover:bg-zinc-700 disabled:opacity-50"
        >
          {speakerOn ? (
            <Volume2 size={28} className="text-green-500" />
          ) : (
            <VolumeX  size={28} className="text-red-500" />
          )}
        </button>

        <button   onClick={onEndCall} className="rounded-full bg-red-600 p-5 transition hover:bg-red-700">
          <PhoneOff size={30} />
        </button>

      </div>
    </div>
  );
}