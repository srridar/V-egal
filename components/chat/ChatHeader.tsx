"use client";

import Image from "next/image";
import { Phone, Video, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  status?: string;
  avatar?: string;
  chatId?: string;
  isOnline?: boolean;
}

export default function ChatHeader({
  name,
  status,
  avatar,
  isOnline = false,
}: ChatHeaderProps) {
  return (
    <div className="w-full px-4 py-3 flex items-center justify-between bg-white/5 backdrop-blur-xl border-b border-white/10">

      <div className="flex items-center gap-3">

        <div className="relative w-10 h-10">
          <Image
            src={avatar || "https://i.pravatar.cc/150?img=3"}
            alt="user"
            fill
            className="rounded-full object-cover border border-white/20"
          />

  
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-black rounded-full ${
              isOnline ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        </div>

  
        <div>
          <h2 className="text-sm font-semibold">{name}</h2>
          <p className="text-xs text-gray-400">
            {status ? status : isOnline ? "Online" : "Offline"}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-4 text-gray-300">

        <button className="p-2 rounded-lg hover:bg-white/10 transition">
          <Phone size={18} />
        </button>

        <button className="p-2 rounded-lg hover:bg-white/10 transition">
          <Video size={18} />
        </button>

        <button className="p-2 rounded-lg hover:bg-white/10 transition">
          <MoreVertical size={18} />
        </button>

      </div>

    </div>
  );
}