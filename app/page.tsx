"use client"

import React from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const userId= user?.id;
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">

      {/* Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-green-500/20 to-blue-500/20 blur-3xl opacity-50"></div>

      {/* Top Glow Line */}
      <div className="absolute w-2/4 left-1/2 -translate-x-1/2 rounded-3xl h-2 bg-teal-600 top-32"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:45px_45px]"></div>

      <nav className="flex justify-between items-center px-8 py-4 relative z-10">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <MessageCircle className="text-green-400" size={22} />
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            V-EGAL
          </span>
        </h1>

      
        {loading ? (
          <div className="w-10 h-10 border-2 border-white/20 border-t-green-400 rounded-full animate-spin" />
        ) : user ? (
          <Link href={`/profile/${userId}`}>
            <Image
              src={user.avatar || "https://i.pravatar.cc/150"}
              alt=""
              width={40}
              height={40}
              className="rounded-full bg-gray-400 cursor-pointer border border-white/20 hover:scale-105 transition"
            />
          </Link>
        ) : (
          <Link href="/login">
            <button className="bg-white text-black px-4 py-2 rounded-lg">
              Sign In
            </button>
          </Link>
        )}
      </nav>


      <div className="flex flex-col items-center justify-center text-center mt-20 px-4 relative z-10">
        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight">
          Your chat <br />
          <span className="italic">command center</span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl">
          Real-time messaging, group chats, and seamless communication — all in one place.
        </p>

        <div className="flex gap-4 mt-8">
          <button className="bg-white text-black px-6 py-3 rounded-xl">
            Start Chatting →
          </button>
          <button className="bg-zinc-900 border border-zinc-700 px-6 py-3 rounded-xl">
            Sign In
          </button>
        </div>
      </div>


      <div className="max-w-4xl mx-auto mt-20 p-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold">Chat Dashboard</h2>

          <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-green-500"></div>
          </div>

          <div className="flex gap-4 mt-6">
            <div className="bg-black/40 px-4 py-3 rounded-lg">74% Active</div>
            <div className="bg-black/40 px-4 py-3 rounded-lg">8 Chats</div>
            <div className="bg-black/40 px-4 py-3 rounded-lg">1 Pending</div>
          </div>
        </div>
      </div>


      <div className="max-w-6xl mx-auto mt-24 px-6 relative z-10">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features for Modern Communication
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "Real-time Chat",
              desc: "Instant messaging with live updates and zero delay.",
              icon: "💬",
            },
            {
              title: "Audio Messages",
              desc: "Send and receive voice messages easily.",
              icon: "🎤",
            },
            {
              title: "Video Calls",
              desc: "High-quality video calling with friends and teams.",
              icon: "🎥",
            },
            {
              title: "Image Sharing",
              desc: "Share photos instantly in chats.",
              icon: "🖼️",
            },
            {
              title: "File & PDF Upload",
              desc: "Upload documents, PDFs, and other files.",
              icon: "📄",
            },
            {
              title: "Secure Messaging",
              desc: "End-to-end privacy and safe communication.",
              icon: "🔒",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:scale-[1.02] transition-all shadow-lg"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}