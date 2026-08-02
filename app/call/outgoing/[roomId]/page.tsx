"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "@/socket/client/socket";
import { PhoneOff, Loader2 } from "lucide-react";


export default function OutgoingCallPage() {
    const params = useParams();
    const router = useRouter();

    const roomId = params.roomId as string;

    const [status, setStatus] = useState("Calling...");
    const [isCancelled, setIsCancelled] = useState(false);

    useEffect(() => {
        const socket = getSocket();

        //  Listen for call accepted
        socket.on("call:accepted", (data) => {
            if (data.roomId === roomId) {
                setStatus("Accepted");

                router.push(`/call/${roomId}?caller=true`);
            }
        });

        //  Listen for call rejected
        socket.on("call:rejected", (data) => {
            if (data.roomId === roomId) {
                setStatus("Call Rejected");

                setTimeout(() => {
                    router.push("/chat");
                }, 1500);
            }
        });

        return () => {
            socket.off("call:accepted");
            socket.off("call:rejected");
        };
    }, [roomId, router]);

    //  Cancel call
    const cancelCall = () => {
        const socket = getSocket();

        setIsCancelled(true);

        socket.emit("call:rejected", {
            roomId,
        });

        router.push("/chat");
    };

    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white">

        
            <div className="relative flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full bg-green-500 opacity-20 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-green-500 opacity-30 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                    <PhoneOff />
                </div>
            </div>

            <h1 className="mt-8 text-xl font-semibold">{status}</h1>

            <p className="text-gray-400 text-sm mt-2">
                Waiting for user to accept call...
            </p>

            <button
                onClick={cancelCall}
                disabled={isCancelled}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 rounded-xl transition"
            >
                <PhoneOff size={18} />
                Cancel Call
            </button>
        </div>
    );
}