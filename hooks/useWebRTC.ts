"use client";

import { useRef } from "react";
import { sendOffer, sendAnswer, sendIceCandidate, } from "@/socket/client/socketEmitter";

const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },            //  STUN server (used to discover public IP for NAT traversal)
];



export const useWebRTC = (roomId: string) => {
    const localStream = useRef<MediaStream | null>(null);               // store local media (camera + mic)
    const remoteStream = useRef<MediaStream | null>(null);             // Store remote media (other user's stream)
    const peerConnection = useRef<RTCPeerConnection | null>(null);      //  Store peer connection instance (core WebRTC object)

    const startLocalStream = async () => {                                            //        get camera + mic 
        localStream.current = await navigator.mediaDevices.getUserMedia({             //        Ask browser permission for video + audio
            video: true,
            audio: true,
        });

        return localStream.current;                                                 // Return stream so UI can show it
    };




    //  create peer connection

    const createPeerConnection = () => {

        // Create new peer connection with STUN server
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        //  When browser finds network path (ICE candidate)

        pc.onicecandidate = (event) => {
            if (event.candidate) {

                // Send candidate to other user via socket
                sendIceCandidate(roomId, event.candidate);
            }
        };


        // When remote stream arrives from other user
        pc.ontrack = (event) => {

            // Save remote stream (video/audio from other user)
            remoteStream.current = event.streams[0];
        };

        // Store connection globally (inside hook)
        peerConnection.current = pc;

        return pc;
    };




    //    Create Offer (Caller side)   


    const createOffer = async () => {

        //   Create peer connection
        const pc = createPeerConnection();

        // Add all local tracks (video + audio) to connection 
        localStream.current?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream.current!);
        });

        //  Create WebRTC offer (SDP - session description)
        const offer = await pc.createOffer();

        // Set it as local description
        await pc.setLocalDescription(offer);

        // Send offer to other user via socket
        sendOffer(roomId, offer);

    }




    //     4. Handle Offer (Receiver side)
    const handleOffer = async (offer: any) => {

        // Create peer connection
        const pc = createPeerConnection();

        // Add local tracks (your camera/mic)
        localStream.current?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream.current!);
        });

        // Set received offer as remote description
         await pc.setRemoteDescription(offer);

        // Create answer
        const answer = await pc.createAnswer();

        // Set answer as local description
        await pc.setLocalDescription(answer);

        // Send answer back to caller
        sendAnswer(roomId, answer);
    };



    //    5  Handle Answer (Caller side)

    const handleAnswer = async (answer: any) => {

        // Set answer from receiver as remote description
        await peerConnection.current?.setRemoteDescription(
            new RTCSessionDescription(answer)
        );
    };



    //    6   Handle ICE Candidate
    const handleIceCandidate = async (candidate: any) => {
        try {
            // Add received ICE candidate to connection
            await peerConnection.current?.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        } catch (err) {
            console.error("ICE error:", err);
        }
    };


    //    7    End Call / Cleanup

    const endCall = () => {

        // Close connection
        peerConnection.current?.close();
        peerConnection.current = null;

        // Stop camera + mic
        localStream.current?.getTracks().forEach((t) => t.stop());
        localStream.current = null;
    };



    // Return all functions + streams
    return {
        startLocalStream,
        createOffer,
        handleOffer,
        handleAnswer,
        handleIceCandidate,
        endCall,
        localStream,
        remoteStream,
    };


}





