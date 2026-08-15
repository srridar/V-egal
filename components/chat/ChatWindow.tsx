"use client";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MessageBubble from "./MessageBubble";
import EmptyMessages from "@/components/chat/conversation/EmptyMessages";
import { onEvent, offEvent, getSocket } from "@/lib/socket/socket";
import { joinRoom, leaveRoom, sendMessage } from "@/lib/socket/socketEmitters";
import { SOCKET_EVENTS } from "@/lib/socket/socketEvents";

interface Message {
    _id: string;
    content: string;
    sender: { _id: string };
    createdAt: string;
    messageType?: "text" | "image" | "video" | "audio" | "file";
    tempId?: string;
}

interface ReceiveMessage {
    conversationId: string;
    message: {
        id: string;
        senderId: string;
        content: string;
        messageType: "text" | "image" | "video" | "audio" | "file";
        createdAt: string;
    };
    tempId?: string;
}

export default function ChatWindow({ chatId }: { chatId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/messages/${chatId}`, { credentials: "include" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to load messages");
            setMessages(result.data ?? []);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            toast.error(error instanceof Error ? error.message : "Error loading messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!chatId) return;

        const socket = getSocket();
        if (!socket) {
            console.warn("ChatWindow: socket is not initialized");
            return;
        }

        if (!socket.connected) {
            console.warn("ChatWindow: socket is not connected");
            return;
        }

        setMessages([]);
        joinRoom({ roomId: chatId });
        fetchMessages();

        return () => {
            leaveRoom({ roomId: chatId });
        };
    }, [chatId]);

    useEffect(() => {
        const receiveMessage = (payload: ReceiveMessage) => {
            const incomingMessage: Message = {
                _id: payload.message.id,
                content: payload.message.content,
                sender: { _id: payload.message.senderId },
                createdAt: payload.message.createdAt,
                messageType: payload.message.messageType,
                tempId: payload.tempId,
            };

            setMessages((previous) => {
                if (payload.tempId) {
                    const exists = previous.some((message) => message._id === payload.tempId);
                    if (exists) return previous.map((message) => message._id === payload.tempId ? incomingMessage : message);
                }

                if (previous.some((message) => message._id === incomingMessage._id)) return previous;
                return [...previous, incomingMessage];
            });
        };

        onEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, receiveMessage);
        return () => offEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, receiveMessage);
    }, []);

    useEffect(() => {
        const handleMessageError = (error: { message: string }) => toast.error(error.message);

        onEvent(SOCKET_EVENTS.MESSAGE_ERROR, handleMessageError);
        return () => offEvent(SOCKET_EVENTS.MESSAGE_ERROR, handleMessageError);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        const content = input.trim();
        if (!content) return;

        if (!currentUser?.id) {
            toast.error("You must be logged in to send a message.");
            return;
        }

        const socket = getSocket();
        if (!socket) {
            toast.error("Connection is not initialized.");
            return;
        }

        if (!socket.connected) {
            toast.error("You are currently offline.");
            return;
        }

        const tempId = crypto.randomUUID();
        setInput("");

        const optimisticMessage: Message = {
            _id: tempId,
            content,
            sender: { _id: currentUser.id },
            createdAt: new Date().toISOString(),
            messageType: "text",
            tempId,
        };

        setMessages((previous) => [...previous, optimisticMessage]);

        try {
            sendMessage({ conversationId: chatId, content, messageType: "text", tempId });
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((previous) => previous.filter((message) => message._id !== tempId));
            setInput(content);
            toast.error(error instanceof Error ? error.message : "Failed to send message.");
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
                <div className="relative">

                    <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl animate-pulse"></div>
                    <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-teal-500 animate-spin"></div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium tracking-[0.2em] text-white/90 uppercase">
                        Loading Messages
                    </span>
                    <div className="w-24 h-[1px] bg-white/10 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_70%)]">
                {messages.length === 0 ? (
                    <EmptyMessages />
                ) : (
                    messages.map((msg) => {
                        return (
                            <MessageBubble
                                key={msg._id}
                                text={msg.content}
                                sender={msg.sender._id === currentUser?.id ? "me" : "other"}
                                time={new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                })}
                                seen
                            />
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>


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