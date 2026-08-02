"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useWebRTC } from "@/hooks/useWebRTC";

import { setupSocketListeners, removeSocketListeners } from "@/socket/socketListners";
import { joinCallRoom } from "@/socket/client/socketEmitter";


export default function CallPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const roomId = params.roomId as string;
    const isCaller = searchParams.get("caller") === "true";

    const {
        startLocalStream,
        createOffer,
        handleOffer,
        handleAnswer,
        handleIceCandidate,
        endCall,
        localStream,
        remoteStream,
    } = useWebRTC(roomId);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const init = async () => {

            const stream = await startLocalStream();    //  Start camera

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            //  Join socket room
            joinCallRoom(roomId);

            //  Setup socket listeners
            setupSocketListeners(roomId, {
                onOffer: handleOffer,
                onAnswer: handleAnswer,
                onIceCandidate: handleIceCandidate,
            });

            // ✅ ONLY caller creates offer
            if (isCaller) {
                await createOffer();
            }
        };

        init();

        return () => {
            endCall();
            removeSocketListeners();
        };

    }, []);

    useEffect(() => {                       //    Update remote stream when available
        if (remoteStream.current && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream.current;
        }
    }, [remoteStream]);


    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">

            <h1 className="text-white text-xl">Video Call</h1>
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-150 h-75 bg-gray-800 rounded"
            />

            <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-50 h-37.5 bg-gray-700 rounded absolute bottom-4 right-4"
            />

            <button
                onClick={endCall}
                className="bg-red-500 px-6 py-2 rounded mt-4"
            >
                End Call
            </button>
        </div>
    );


}



///         correct way of calling it        ---    router.push(`/call/${roomId}?caller=true`);