"use client";

import Image from "next/image";
import { MessageCircle, UserX, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { removeFriend } from "@/helper/friend"
import { useRouter } from "next/navigation";

interface FriendCardProps {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
  onSuccess: () => void;
}


const FriendCard = ({
  id,
  name,
  username,
  avatar,
  bio,
  isOnline = false,
  onSuccess
}: FriendCardProps) => {

  const router = useRouter();
  const handleRemoveFriend = async (friendId: string) => {
    try {
      const data = await removeFriend(friendId);
      console.log(data);
      onSuccess?.();

    } catch (error) {
      console.log(error);
    }
  }

  const viewProfile = (id: string) => {
    router.push(`profile/${id}`)          // we need to give the other freind profile routing 
  }

  const messageHandler = async () => {
    try {
      const res = await fetch("/api/chats/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      router.push(`/chat/${data.chat._id}`);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 hover:bg-zinc-800/50">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={avatar || "/person2.png"}
            alt={name ? name.charAt(0) : "User"}
            width={36}
            height={36}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-800"
          />

          <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-emerald-500" : "bg-zinc-600"}`} />
        </div>

        <div>
          <h3 className="font-semibold text-white">  {name || username} </h3>

          {bio && (
            <p className="mt-1 max-w-sm truncate text-sm text-zinc-400">
              {bio}
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <Button
          onClick={messageHandler}
          className="bg-white text-black hover:bg-zinc-200 flex gap-1 items-center"
        >
          <MessageCircle className="mr-1 h-4 w-4 text-black" />
          <span className="text-black">Message</span>
        </Button>

        <Button
          onClick={() => viewProfile(id)}
          className="border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 flex gap-1 items-center"
        >
          <User className="mr-1 h-4 w-4" />
          Profile
        </Button>

        <Button
          onClick={() => handleRemoveFriend(id)}
          className="border border-red-900 bg-red-950 text-red-300 hover:bg-red-900 flex gap-1 items-center"
        >
          <UserX className="mr-1 h-4 w-4" />
          Unfriend
        </Button>
      </div>
    </div>
  );
};

export default FriendCard;