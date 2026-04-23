"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import ChatHeader from "@/components/chat/ChatHeader";
import { useEffect, useState } from "react";

type Props = {
  params: {
    receiverId: string;
  };
};

export default function ChatPage({ params }: Props) {
  const { receiverId } = params;

  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrCreateChat = async () => {
    try {
      const res = await fetch(`/api/chat?receiverId=${receiverId}`, {
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result.message);
        return;
      }

      setChat(result.data); // contains full chat
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrCreateChat();
  }, [receiverId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!chat) return <div className="p-4 text-red-500">Chat not found</div>;

  // get other user
  const receiver = chat.users.find((u: any) => u._id !== receiverId);

  return (
    <div className="flex flex-col flex-1">

      <ChatHeader
        name={receiver?.name || "User"}
        avatar={receiver?.avatar}
        chatId={chat._id}
      />

      {/* ONLY PASS CHAT ID */}
      <ChatWindow chatId={chat._id} />

    </div>
  );
}