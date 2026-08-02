"use client";

import { useEffect, useRef } from "react";
import { Phone, PhoneOff } from "lucide-react";

type Props = {
  callerName: string;
  roomId: string;
  onAccept: () => void;
  onReject: () => void;
};

export default function IncomingCallModal({
  callerName,
  onAccept,
  onReject,
}: Props) {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🔊 start ringtone
  useEffect(() => {
    const audio = new Audio("/ringtone.mp3");
    audio.loop = true;
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Autoplay blocked:", err);
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  // 🔇 stop ringtone helper
  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAccept = () => {
    stopRingtone();
    onAccept();
  };

  const handleReject = () => {
    stopRingtone();
    onReject();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

      <div className="bg-[#111] p-8 rounded-2xl text-center w-[320px] shadow-2xl">

        <h2 className="text-white text-xl font-semibold mb-2">
          Incoming Call
        </h2>

        <p className="text-gray-400 mb-6">{callerName}</p>

        <div className="flex justify-center gap-6">

          {/* Reject */}
          <button
            onClick={handleReject}
            className="bg-red-500 p-4 rounded-full hover:scale-110 transition"
          >
            <PhoneOff className="text-white" />
          </button>

          {/* Accept */}
          <button
            onClick={handleAccept}
            className="bg-green-500 p-4 rounded-full hover:scale-110 transition"
          >
            <Phone className="text-white" />
          </button>

        </div>

      </div>
    </div>
  );
}