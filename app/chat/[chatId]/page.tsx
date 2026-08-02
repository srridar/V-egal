"use client";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatHeader from "@/components/chat/ChatHeader";
import { useEffect, useState } from "react";

type Props = {
  params: {
    chatId: string;
  };
};

interface Chat {
  _id: string;
  name: string;
  avatar?: string;
  receiverId?: string;
  isOnline?: boolean;
  lastSeen?: string;
  participants?: number;
  type: "private" | "group";
}



export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;



  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChat = async () => {
    try {
      setLoading(true);
      setError(null);
   
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result.message);
        return;
      }

      setChat(result.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center">
        Chat not found.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader chat={chat} />

      <div className="flex-1 overflow-hidden">
        <ChatWindow chatId={chat._id} />
      </div>
    </div>
  );
}

