"use client";

import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

interface Message {
    _id: string;
    text: string;
    sender: {
        _id: string;
    };
    createdAt: string;
}

export default function ChatWindow({ chatId }: { chatId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/message/${chatId}`, {
                credentials: "include",
            });
            const result = await res.json();
            if (res.ok) {
                setMessages(result.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatId) {
            fetchMessages();
        }
    }, [chatId]);


    const handleSend = async () => {
        if (!input.trim()) return;
        const text = input;
        setInput("");

        setMessages((prev) => [
            ...prev,
            {
                _id: Date.now().toString(),
                text,
                sender: { _id: "me" },
                createdAt: new Date().toISOString(),
            },
        ]);

        try {
            await fetch(`/api/message/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    chatId,
                    text,
                }),
            });

            fetchMessages();
        } catch (err) {
            console.error("Send failed", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
                {/* Sleek Custom Spinner */}
                <div className="relative">
                    {/* Outer Glow */}
                    <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl animate-pulse"></div>

                    {/* The Spin Ring */}
                    <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-teal-500 animate-spin"></div>
                </div>

                {/* Modern Loading Message */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium tracking-[0.2em] text-white/90 uppercase">
                        Loading Messages
                    </span>
                    {/* Animated Progress Line */}
                    <div className="w-24 h-[1px] bg-white/10 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>

                {/* Optional: Add this to your globals.css for the shimmer effect */}
                <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">

            {/* Messages */}
            <div className="flex-1 overflow-y-scroll p-4 space-y-4 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_70%)]">

                {messages.map((msg) => (
                    <MessageBubble
                        key={msg._id}
                        text={msg.text}
                        sender={msg.sender._id === "me" ? "me" : "other"}
                        time={new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        seen={true}
                    />
                ))}

            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-3">

                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm placeholder-gray-400"
                    />

                    <button
                        onClick={handleSend}
                        className="p-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-black hover:scale-105 transition"
                    >
                        <Send size={18} />
                    </button>

                </div>
            </div>

        </div>
    );
}