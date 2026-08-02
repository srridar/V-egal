import { createContext, useState, useRef, useEffect, useContext } from "react";
import { CallContextType, User, IncomingCall, CallType, CallStatus } from "@/types/call";
import { getSocket } from "@/socket/client/socket";
import type { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/socket/client/socketEvent";


export interface StartCallParams {
  chatId: string;
  caller: User;
  receiver: User;
}


const CallContext = createContext<CallContextType | null>(null);

export function CallProvider({ children }: { children: React.ReactNode; }) {

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callType, setCallType] = useState<CallType>("audio");
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [outgoingUser, setOutgoingUser] = useState<User | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  async function createLocalStream(type: CallType) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video",
    });
    setLocalStream(stream);
    return stream;
  }


  async function createPeer(type: CallType) {

    const peer = new RTCPeerConnection({           //   The browser creates a brand-new WebRTC connection object. 
      iceServers: [                                //   iceServers are used to help establish a connection between peers, especially when they are behind NATs or firewalls.
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    //  STUN server is used to discover the public IP address of a device behind a NAT (Network Address Translation). It helps in establishing peer-to-peer connections by allowing devices to find out their public-facing IP addresses and ports.

    peerRef.current = peer;           //  The newly created peer connection is stored in a ref (peerRef) for later use, such as adding tracks, handling ICE candidates, and managing the connection state.

    const stream = await createLocalStream(type);   // The function createLocalStream is called to obtain the user's media stream (audio and/or video) based on the specified call type (audio or video). This stream will be used for the call.

    stream.getTracks().forEach((track) => {      // this code iterates over each track (audio or video) in the local media stream and adds it to the peer connection. This allows the remote peer to receive the local media during the call.
      peer.addTrack(track, stream);
    });

    peer.ontrack = (event) => {              // this code sets up an event listener for the ontrack event of the peer connection. When a remote track is received from the other peer, this event is triggered, and the received track is added to the remoteStream state, allowing the local user to see/hear the remote user's media.
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };
    //  ICE (Interactive Connectivity Establishment) is a framework used in WebRTC to find the best path for media to flow between peers. It helps establish a direct connection between two devices, even if they are behind NATs or firewalls. ICE candidates are potential network paths that can be used for this connection.
    peer.onicecandidate = (event) => {         //  this code sets up an event listener for the onicecandidate event of the peer connection. When a new ICE candidate is generated (which helps establish the connection), this event is triggered, and the candidate is sent to the remote peer via the socket connection.
      if (!event.candidate || !outgoingUser) return;

      socketRef.current?.emit("ice-candidate", {
        candidate: event.candidate,
        receiverId: outgoingUser.id,
      });
    };

    peer.onconnectionstatechange = () => {
      console.log(peer.connectionState);

      switch (peer.connectionState) {
        case "connecting":
          setCallStatus("connecting");
          break;

        case "connected":
          setCallStatus("connected");
          break;

        case "disconnected":
        case "failed":
        case "closed":
          endCall();
          break;
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log("ICE:", peer.iceConnectionState);
    };

    return peer;
  }


  async function startAudioCall({ chatId, caller, receiver, }: StartCallParams) {
    try {
      setOutgoingUser(receiver);         // noting happending till now only react state is updated
      setCallType("audio");              // noting happending till now only react state is updated saying it is audio call
      setCallStatus("calling");


      const peer = await createPeer("audio");       //  exection leaves this function and goes to createPeer function and creates a peer connection and returns it

      //  till now 
      //       peer = RTCPeerConnection

      // ✓ Microphone attached
      // ✓ Event listeners registered
      // ✓ Local stream created

      // ❌ No connection yet
      // ❌ Receiver doesn't know anything yet
      // ❌ Server doesn't know anything yet



      const offer = await peer.createOffer();       // The browser generates an SDP (Session Description Protocol) offer, which describes the media capabilities and preferences of the caller. This offer will be sent to the receiver to initiate the call.

      //       The browser creates an SDP (Session Description Protocol) offer.

      // Think of it like introducing yourself before making a phone call.

      // The browser asks itself:

      // What media do I want to send?
      // Audio only or video too?
      // Which codecs do I support?
      // How should encryption work?
      // What ICE gathering process should be used?

      // Then it creates a large text description.



      await peer.setLocalDescription(offer);    // The generated offer is set as the local description of the peer connection. This means that the caller is now ready to send its media capabilities to the receiver. It tells the browser:

      //  "This offer is now officially my offer."

      socketRef.current?.emit(SOCKET_EVENTS.CALL_INCOMING, {             // This is the first moment your application talks to the server.Everything before this happened only inside the caller's browser.
        roomId: chatId,
        caller,
        receiver,
        type: "audio",
        offer,
      });

    } catch (err) {
      console.error(err);
    }
  }


  async function startVideoCall({ chatId, caller, receiver, }: StartCallParams) {
    try {
      setOutgoingUser(receiver);
      setCallType("video");
      setCallStatus("calling");

      const peer = await createPeer("video");

      const offer = await peer.createOffer();

      await peer.setLocalDescription(offer);

      socketRef.current?.emit(SOCKET_EVENTS.CALL_INCOMING, {
        roomId: chatId,
        caller,
        receiver,
        type: "video",
        offer,
      });

    } catch (err) {
      console.error(err);
    }
  }

  function receiveCall(call: IncomingCall) {
    setIncomingCall(call);
    setOutgoingUser(call.caller);
    setCallType(call.type);
    setCallStatus("ringing");
  }

  async function acceptCall() {
    if (!incomingCall) return;

    const peer = await createPeer(incomingCall.type);
    await peer.setRemoteDescription(incomingCall.offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socketRef.current?.emit(SOCKET_EVENTS.CALL_ACCEPTED, {
      answer,
      receiverId: incomingCall.caller.id,
    });

    setIncomingCall(null);
    setCallStatus("connecting");
  }

  function rejectCall() {
    if (incomingCall) {
      socketRef.current?.emit(SOCKET_EVENTS.CALL_REJECTED, {
        receiverId: incomingCall.caller.id,
      });
    }

    setIncomingCall(null);
    setCallStatus("idle");
  }

  function endCall() {
    socketRef.current?.emit(SOCKET_EVENTS.CALL_ENDED, {
      receiverId: outgoingUser?.id,
    });

    peerRef.current?.close();
    peerRef.current = null;

    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());

    setLocalStream(null);
    setRemoteStream(null);

    setOutgoingUser(null);
    setIncomingCall(null);

    setCallStatus("ended");

    setTimeout(() => {
      setCallStatus("idle");
    }, 1000);
  }

  function toggleMute() {
    if (!localStream) return;
    const muted = !isMuted;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
    setMuted(muted);
  }

  function toggleCamera() {
    if (!localStream) return;
    const cameraOff = !isCameraOff;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !cameraOff;
    });
    setCameraOff(cameraOff);
  }

  function toggleSpeaker() {
    setSpeakerOn((prev) => !prev);
  }

  // Socket listeners
  useEffect(() => {
    socketRef.current = getSocket();
    const activeSocket = socketRef?.current;
    if (!activeSocket) return;

    // 1. Handle incoming call offer from another user
    const handleIncomingCall = (data: IncomingCall) => {
      receiveCall(data);
    };

    // 2. Caller receives the answer from the receiver
    const handleCallAnswered = async ({ answer }: {
      answer: RTCSessionDescriptionInit;
    }) => {
      if (peerRef.current) {
        try {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        } catch (err) {
          console.error("Failed to set remote description on answer:", err);
        }
      }
    };

    // 3. Handle incoming ICE candidates
    const handleIceCandidate = async ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (peerRef.current && candidate) {
        try {
          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    };

    // 4. Handle recipient rejecting the call
    const handleCallRejected = () => {
      endCall();
    };

    // 5. Handle remote peer ending the call
    const handleCallEnded = () => {
      endCall();
    };

    // Attach listeners
    activeSocket.on(SOCKET_EVENTS.CALL_INCOMING, handleIncomingCall);
    activeSocket.on(SOCKET_EVENTS.CALL_ACCEPTED, handleCallAnswered);
    activeSocket.on(SOCKET_EVENTS.ICE_CANDIDATE, handleIceCandidate);
    activeSocket.on(SOCKET_EVENTS.CALL_REJECTED, handleCallRejected);
    activeSocket.on(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);

    // Clean up event listeners on unmount
    return () => {
      activeSocket.off(SOCKET_EVENTS.CALL_INCOMING, handleIncomingCall);
      activeSocket.off(SOCKET_EVENTS.CALL_ACCEPTED, handleCallAnswered);
      activeSocket.off(SOCKET_EVENTS.ICE_CANDIDATE, handleIceCandidate);
      activeSocket.off(SOCKET_EVENTS.CALL_REJECTED, handleCallRejected);
      activeSocket.off(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);
    };
  }, []);



  return (
    <CallContext.Provider
      value={{
        callStatus,
        callType,
        incomingCall,
        outgoingUser,
        localStream,
        remoteStream,
        isMuted,
        isCameraOff,
        speakerOn,
        startAudioCall,
        startVideoCall,
        receiveCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleCamera,
        toggleSpeaker,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}


export function useCall() {
  const context = useContext(CallContext);

  if (!context) {
    throw new Error(
      "useCall must be used inside CallProvider"
    );
  }

  return context;
}