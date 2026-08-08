"use client";

import Image from "next/image";
import { LoaderCircle, PhoneOff } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Props {
  user: User;
  onEndCall: () => void;
}

export default function ConnectingCall({
  user,
  onEndCall,
}: Props) {
  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center">

      <Image
        src={user.avatar || "/default-avatar.png"}
        alt={user.name}
        width={120}
        height={120}
        className="rounded-full border-4 border-zinc-700"
      />

      <h2 className="mt-6 text-3xl font-semibold text-white">
        {user.name}
      </h2>

      <p className="mt-3 text-green-400 font-medium">
        Audio Call Accepted
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <LoaderCircle
          className="w-10 h-10 text-white animate-spin"
        />

        <p className="text-zinc-400">
          Connecting securely...
        </p>
      </div>

      <button
        onClick={onEndCall}
        className="absolute bottom-14 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 transition hover:bg-red-700"
      >
        <PhoneOff className="text-white w-8 h-8" />
      </button>

    </div>
  );
}