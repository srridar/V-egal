"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

type Status =| "none" | "sent" | "received" | "accepted";

export default function UserProfile() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<Status>("none");
  const [requestId, setRequestId] = useState<string | null>(null);


  const fetchUser = async () => {
    if (!userId) return;
    const res = await fetch(`/api/user/${userId}`);

    if (!res.ok) return;

    const data = await res.json();

    setUser(data.user);
    setStatus(data.status);
    setRequestId(data.requestId); 
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);


  const sendRequest = async () => {
    const res = await fetch("/api/friendReq/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverId: userId }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("sent");
      setRequestId(data.request._id);
    }
  };




  //     cancel request
  const cancelRequest = async () => {
    if (!requestId) return;

    const res = await fetch("/api/friendReq/cancel", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),      
    });

    if (res.ok) {
      setStatus("none");
      setRequestId(null);
    }
  };

  //      accept request
  const acceptRequest = async () => {
    if (!requestId) return;

    const res = await fetch("/api/friendReq/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),
    });

    if (res.ok) {
      setStatus("accepted");
    }
  };

  // ✅ go to chat
  const goToChat = () => {
    router.push(`/chat/${userId}`); // or specific chatId route
  };

  if (!user) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="bg-white/10 p-6 rounded-2xl w-[350px] text-center">

        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={user.avatar || "https://i.pravatar.cc/150"}
            alt="user"
            fill
            sizes="80px"
            className="rounded-full object-cover"
          />
        </div>

        {/* Info */}
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-400">{user.bio}</p>

        {/* Actions */}
        <div className="mt-4 space-y-2">

          {status === "none" && (
            <button
              onClick={sendRequest}
              className="bg-blue-600 px-4 py-2 rounded-lg w-full"
            >
              Send Friend Request
            </button>
          )}

          {status === "sent" && (
            <button
              onClick={cancelRequest}
              className="bg-red-500 px-4 py-2 rounded-lg w-full"
            >
              Cancel Request
            </button>
          )}

          {status === "received" && (
            <button
              onClick={acceptRequest}
              className="bg-green-600 px-4 py-2 rounded-lg w-full"
            >
              Accept Request
            </button>
          )}

          {status === "accepted" && (
            <button
              onClick={goToChat}
              className="bg-purple-600 px-4 py-2 rounded-lg w-full"
            >
              Open Chat
            </button>
          )}

        </div>
      </div>
    </div>
  );
}