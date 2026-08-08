"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface RemoteVideoProps {
  stream: MediaStream | null;

  user: {
    name: string;
    avatar?: string;
  };

  isVideoEnabled?: boolean;

  className?: string;
}

export default function RemoteVideo({
  stream,
  user,
  isVideoEnabled = true,
  className = "",
}: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  if (!stream || !isVideoEnabled) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-zinc-900 ${className}`}
      >
        <Image
          src={user.avatar || "/public/person2.png"}
          alt={user.name}
          width={140}
          height={140}
          className="rounded-full border-4 border-zinc-700 object-cover"
        />

        <h2 className="mt-5 text-2xl font-semibold text-white">
          {user.name}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Camera Off
        </p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className={`h-full w-full object-cover ${className}`}
    />
  );
}