"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import { acceptFriendRequest, rejectFriendRequest } from "@/helper/friend"
import { toast } from "sonner";


interface FriendRequestCardProps {
  id: string;
  username: string;
  avatar?: string;
  onSuccess: () => void;
}

const FriendRequestCard = ({ id, username, avatar, onSuccess }: FriendRequestCardProps) => {

  const handleAcceptFriendReq = async (requestId: string) => {
    try {
      const data = await acceptFriendRequest(requestId);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept frined request")
    }
  }

  const handleRejectFriendReq = async (requestId: string) => {
    try {
      const data = await rejectFriendRequest(requestId);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject frined request")
    }
  }


  return (
    <div className="flex items-center justify-between rounded-xl border bg-black p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <Image
          src={avatar || "/person2.png"}
          alt={username ? username.charAt(0) : "User"}
          width={36}
          height={36}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-800"
        />

        <div>
          <h3 className="font-semibold">{username}</h3>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => handleAcceptFriendReq(id)}>
          <Check className="mr-1 h-4 w-4" />
          Accept
        </Button>

        <Button onClick={() => handleRejectFriendReq(id)}>
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>

    </div>
  );
};

export default FriendRequestCard;