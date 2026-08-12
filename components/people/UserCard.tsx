"use client";
import { toast } from "sonner";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  UserPlus,
  Clock,
  MessageCircle,
  Check,
  X, User
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cancleFriendRequest, acceptFriendRequest, rejectFriendRequest, AddFriend } from "@/helper/friend"
import { useRouter } from "next/navigation";

type UserStatus = "none" | "pending" | "received" | "friend";

interface UserCardProps {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
  status: UserStatus;
  onSuccess?: () => void;
}

const UserCard = ({
  id,
  username,
  avatar,
  bio,
  isOnline = false,
  status,
  onSuccess
}: UserCardProps) => {

  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isCurrentUser = currentUser?.id === id;

  const handleCancelRequest = async (requestId: string) => {
    try {
      const data = await cancleFriendRequest(requestId);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleAddFrined = async (receiverId: string) => {
    try {
      const data = await AddFriend(receiverId);
      console.log(data);
      onSuccess?.();  // Refresh parent
    } catch (error) {
      console.error(error);
      toast.error("Failed to sent friend request")
    }
  }


  const handleAcceptFriendReq = async (requestId: string) => {
    try {
      const data = await acceptFriendRequest(requestId);
      onSuccess?.();  // Refresh parent
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept friend request")
    }
  }

  const handleRejectFriendReq = async (requestId: string) => {
    try {
      const data = await rejectFriendRequest(requestId);
      onSuccess?.();  // Refresh parent
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject frined request")
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
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white shadow-sm transition hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={avatar || "/person2.png"}
            alt={username ? username.charAt(0) : "User"}
            width={36}
            height={36}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-800"
          />
          <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 ${isOnline ? "bg-emerald-500" : "bg-zinc-600"}`}
          />
        </div>

        <div>
          <h3 className="font-semibold text-white">{ username}</h3>
          {bio && (
            <p className="mt-1 max-w-xs truncate text-sm text-zinc-400">
              {bio}
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      {!isCurrentUser && (
        <div className="flex items-center gap-2">
          {status === "none" && (
            <Button
              onClick={() => handleAddFrined(id)}
              className="text-black hover:bg-zinc-800 flex gap-1 items-center"
            >
              <UserPlus className=" h-4 w-4" />
              Add Friend
            </Button>
          )}

          {status === "pending" && (
            <Button
              onClick={() => handleCancelRequest(id)}
              className="border border-zinc-800 text-zinc-500 opacity-80 flex gap-1 items-center"
            >
              <Clock className=" h-4 w-4" />
              Cancel Request
            </Button>
          )}

          {status === "friend" && (


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

            </div>


          )}

          {status === "received" && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleAcceptFriendReq(id)}
                className="bg-white text-black hover:bg-zinc-200"
              >
                <Check className="mr-2 h-4 w-4" />
                Accept
              </Button>

              <Button
                onClick={() => handleRejectFriendReq(id)}
                className="border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              >
                <X className="mr-2 h-4 w-4 text-zinc-400" />
                Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;