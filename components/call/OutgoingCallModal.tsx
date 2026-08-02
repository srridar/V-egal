"use client";

import Image from "next/image";
import { PhoneOff, Phone, Video } from "lucide-react";

interface OutgoingCallModalProps {
  open: boolean;

  receiver: {
    id: string;
    name: string;
    avatar?: string;
  };

  callType: "audio" | "video";

  status?: "calling" | "ringing" | "connected";

  onCancel: () => void;
}

export default function OutgoingCallModal({
  open,
  receiver,
  callType,
  status = "calling",
  onCancel,
}: OutgoingCallModalProps) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-[360px] rounded-3xl bg-zinc-900 p-8 text-center shadow-2xl">


        {/* Avatar */}
        <div className="relative mx-auto w-fit">

          <Image
            src={receiver.avatar || "/default-avatar.png"}
            alt={receiver.name}
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-zinc-700"
          />

          {/* Ring animation */}
          {status !== "connected" && (
            <span className="absolute inset-0 animate-ping rounded-full border-2 border-teal-500 opacity-40" />
          )}

        </div>


        {/* Name */}
        <h2 className="mt-6 text-2xl font-semibold text-white">
          {receiver.name}
        </h2>


        {/* Call Status */}
        <div className="mt-3 flex justify-center items-center gap-2 text-zinc-400">

          {callType === "video" ? (
            <Video size={18}/>
          ) : (
            <Phone size={18}/>
          )}

          <span className="capitalize">
            {status === "connected"
              ? "Connected"
              : "Calling..."
            }
          </span>

        </div>

        {/* Cancel Button */}
        {status !== "connected" && (
          <button
            onClick={onCancel}
            className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition"
          >
            <PhoneOff 
              size={28}
              className="text-white"
            />
          </button>
        )}


        {/* Connected State */}
        {status === "connected" && (
          <p className="mt-8 text-sm text-emerald-500">
            Call connected
          </p>
        )}

      </div>

    </div>
  );
}