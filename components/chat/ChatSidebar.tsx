
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Button from "../ui/Button";
import { toast } from "sonner";
import { AddFriend } from "@/helper/friend"
import type { User } from "@/types/call";


export default function ChatSidebar() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "friends" | "chat">("all");
  const [friends, setFriends] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();


  const handleUserClick = async (receiverId: string) => {
    try {
      const res = await fetch(`/api/chat/user?receiverId=${receiverId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      const chat = data.data;
      if (chat?._id) {
        router.push(`/chat/${chat._id}`);
      }
    } catch (error) {
      console.error("Error creating/fetching chat:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/currentuser");
      const data = await response.json();
      setMe(data.currentUser);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("/api/allusers");
      console.log(" all users are " + res.body);
      const data = await res.json();
      if (res.ok) {
        setAllUsers(data?.users || []);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setFriends(data.friends || []);
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  const messageHandler = async (id: string) => {
    try {
      const res = await fetch("/api/chats/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: id,      //   this stores the id of the user to whom we want to send a message
        }),
      });

      const data = await res.json();     // stores the chat data returned from the server in the data variable between these two users

      if (!res.ok) {
        throw new Error(data.message);
      }
      router.push(`/chat/${data.chat._id}`);
    } catch (err) {
      console.error(err);
    }
  };


  const handleAddFrined = async (receiverId: string) => {
    try {
      console.log(" receiver id is passing :" + receiverId);
      const data = await AddFriend(receiverId);
      console.log(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sent friend request")

    }
  }


  useEffect(() => {
    fetchAllUsers();
    fetchCurrentUser();
    fetchFriends();
  }, []);

  let dataSource: User[] = [];

  switch (filter) {
    case "all":
      dataSource = allUsers;
      break;

    case "friends":
      dataSource = friends;
      break;

    default:
      dataSource = [];
  }

  const filteredUsers = dataSource.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const visibleUsers = filteredUsers.filter(
    (user) => user.id !== currentUser?.id
  );

  const isFriend = (userId: string) => {
    return me?.friendList?.includes(userId) ?? false;
  };
  return (
    <div className="w-full h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h1 className="text-xl font-semibold bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Chats
        </h1>

        <div className="flex flex-col items-start gap-1">
          <div
            onClick={() => router.push("/profile")}
            className="relative w-8 h-8 cursor-pointer"
          >
            <Image
              src={me?.avatar || "/person2.png"}
              alt="user"
              fill
              sizes="40px"
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-white/5 border border-white/10 rounded-full p-1 gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm transition ${filter === "all"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
              : "text-gray-300 hover:bg-white/10"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("friends")}
            className={`px-4 py-1.5 rounded-full text-sm transition ${filter === "friends"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
              : "text-gray-300 hover:bg-white/10"
              }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* User List Container */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {visibleUsers.length > 0 ? (
          visibleUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-zinc-800 transition"
            >
              {/* Avatar */}
              <div className="relative">
                <Image
                  src={user.avatar || "/person.png"}
                  alt={user.username || "User Avatar"}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-zinc-800"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-white">
                  {user.username}
                </h2>
              </div>

              <div className="flex gap-1">
                {isFriend(user.id) ? (
                  <Button className="font-mono bg-violet-700" onClick={() => messageHandler(user?.id)}>
                    Chat
                  </Button>
                ) : (
                  <Button className="font-mono bg-blue-500" onClick={() => handleAddFrined(user?.id)}>
                    Add Friend
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-6">No users found</p>
        )}
      </div>
    </div>
  );
}