"use client";

import React from "react";

interface MessageBubbleProps {
    text: string;
    sender: "me" | "other";
    time?: string;
    seen?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender, time, seen, }) => {
    const isMe = sender === "me";

    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm 
                    ${isMe
                        ? "bg-gradient-to-r from-green-700 to-teal-700 text-black"
                        : "bg-white/5 backdrop-blur-md border border-white/10 text-white"
                    }`}
            >
                <p>{text}</p>

                <div className="flex items-center justify-end gap-1 mt-1">
                    {time && (
                        <span className="text-[10px] opacity-70">{time}</span>
                    )}

                    {isMe && seen && (
                        <span className="text-[10px] text-blue-200">✓✓</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;