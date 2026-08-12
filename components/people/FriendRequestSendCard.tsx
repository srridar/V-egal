"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Clock } from "lucide-react";
import { cancleFriendRequest } from "@/helper/friend"
import { toast } from "sonner";
import { useState } from "react";


interface FriendRequestCardProps {
    id: string;
    username: string;
    avatar?: string;
    bio?: string;
    onSuccess?: () => void;

}

const FriendRequestSendCard = ({ id, username, avatar, bio, onSuccess }: FriendRequestCardProps) => {

    const [cancelled, setCancelled] = useState(false);

    const handleCancelRequest = async (requestId: string) => {
        const toastId = toast.loading("Cancelling request...");
        try {
            await cancleFriendRequest(requestId);
            setCancelled(true);
            toast.success("Friend request cancelled", {
                id: toastId,
            });

            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel friend request", {
                id: toastId,
            });
        }
    };

    return (
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 hover:bg-zinc-800/50">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Image
                        src={avatar || "/person2.png"}
                        alt={username ? username.charAt(0) : "User"}
                        width={36}
                        height={36}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-800"
                    />
                </div>

                <div>
                    <h3 className="font-semibold text-white"> { username} </h3>
                    {bio && ( <p className="mt-1 max-w-sm truncate text-sm text-zinc-400"> {bio} </p> )}
                </div>
            </div>

            <Button
                disabled={cancelled}
                onClick={() => handleCancelRequest(id)}
                className={`flex items-center gap-2 ${cancelled
                    ? "bg-green-700 text-white cursor-not-allowed"
                    : "border border-yellow-700 bg-yellow-950 text-yellow-300 hover:bg-yellow-900"
                    }`}
            >
                <Clock className="h-4 w-4" />
                {cancelled ? "Cancelled" : "Cancel Request"}
            </Button>

        </div>
    );
};

export default FriendRequestSendCard;