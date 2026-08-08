"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Users,
} from "lucide-react";
import { useCall } from "@/context/CallProviderContext";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface ChatHeaderProps {
  chat: {
    _id: string;
    type: "private" | "group";

    name?: string;
    avatar?: string;

    receiver?: {
      _id: string;
      name: string;
      username?: string;
      avatar?: string;
      isOnline?: boolean;
      lastSeen?: string;
    };

    participants?: any[];
    lastMessage?: any;
  };
}



export default function ChatHeader({ chat }: ChatHeaderProps) {
  const router = useRouter();

  const openProfile = () => {
    if (chat.type === "private" && chat.receiver) {
      router.push(`/profile/${chat.receiver._id}`);
    }
  };

  const displayName =
    chat.type === "private"
      ? chat.receiver?.name || "Unknown User"
      : chat.name || "Unnamed Group";

  const displayAvatar =
    chat.type === "private"
      ? chat.receiver?.avatar || "/default-avatar.png"
      : chat.avatar || "/default-avatar.png";

  const isOnline =
    chat.type === "private"
      ? chat.receiver?.isOnline
      : false;

  const lastSeen =
    chat.type === "private"
      ? chat.receiver?.lastSeen
      : undefined;


  const { startAudioCall, startVideoCall } = useCall();

  const currentUser = useSelector(
    (state: RootState) => state.auth.user
  );

  const handleAudioCall = () => {
    if ( chat.type !== "private" ||  !chat.receiver ||  !currentUser ) {
      return;
    }
    startAudioCall({
      chatId: chat._id,
      caller: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      receiver: {
        id: chat.receiver._id,
        name: chat.receiver.name,
        avatar: chat.receiver.avatar,
      },
    });
  };


  const handleVideoCall = () => {
    if (
      chat.type !== "private" || !chat.receiver ||!currentUser) {
      return;
    }

    startVideoCall({
      chatId: chat._id,
      caller: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      receiver: {
        id: chat.receiver._id,
        name: chat.receiver.name,
        avatar: chat.receiver.avatar,
      },
    });
  };


  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/chat")}
          className="rounded-lg p-2 hover:bg-zinc-800 transition md:hidden"
        >
          <ArrowLeft size={20} />
        </button>

        <div
          onClick={openProfile}
          className="relative cursor-pointer"
        >
          <Image
            src={displayAvatar || "/public/person2.png"}
            alt={displayName}
            width={50}
            height={50}
            className="h-12 w-12 rounded-full object-cover"
          />

          {chat.type === "private" && isOnline && (
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
          )}
        </div>

        <div
          onClick={openProfile}
          className="cursor-pointer"
        >
          <h2 className="font-semibold text-teal-500">
            {displayName}
          </h2>

          {chat.type === "private" ? (
            <p className="text-xs text-zinc-400">
              {isOnline
                ? "Online"
                : lastSeen
                  ? `Last seen ${new Date(lastSeen).toLocaleString()}`
                  : "Offline"}
            </p>
          ) : (
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Users size={13} />
              <span>
                {chat.participants?.length ?? 0} members
              </span>
            </div>
          )}
        </div>

      </div>

      <div className="flex items-center gap-2">

        <button  onClick={handleAudioCall}  className="rounded-lg p-2 transition hover:bg-zinc-800" >
          <Phone size={20} />
        </button>

        <button onClick={handleVideoCall} className="rounded-lg p-2 transition hover:bg-zinc-800">
          <Video size={20} />
        </button>

        <button className="rounded-lg p-2 transition hover:bg-zinc-800">
          <MoreVertical size={20} />
        </button>

      </div>

    </header>
  );
}