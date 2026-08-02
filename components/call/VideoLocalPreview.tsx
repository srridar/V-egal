"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CameraOff } from "lucide-react";

interface VideoLocalPreviewProps {
  stream: MediaStream | null;

  user: {
    name: string;
    avatar?: string;
  };

  isCameraOff: boolean;

  className?: string;
}

export default function VideoLocalPreview({
  stream,
  user,
  isCameraOff,
  className = "",
}: VideoLocalPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream && !isCameraOff) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream, isCameraOff]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-xl bg-zinc-900 ${className}`}
    >
      {stream && !isCameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">

          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CameraOff size={14} />
            <span>Camera Off</span>
          </div>

        </div>
      )}

      {/* Self badge */}
      <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white backdrop-blur">
        You
      </div>
    </div>
  );
}