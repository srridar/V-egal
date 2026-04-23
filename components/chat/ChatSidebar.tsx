"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

export default function ChatSidebar() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "friends">("friends");

  const [contacts, setContacts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);

  const router = useRouter();

  const isContactUser = (userId: string) => {
    return contacts.some((chat: any) =>
      chat.users?.some((u: any) => u._id === userId)
    );
  };

  const getChatId = (userId: string) => {
    const chat = contacts.find((chat: any) =>
      chat.users.some((u: any) => u._id === userId)
    );
    return chat?._id;
  };


  const handleUserClick = (userId: string) => {
    if (isContactUser(userId)) {
      const chatId = getChatId(userId);
      if (chatId) {
        router.push(`/chat/${chatId}`);
      }
    } else {
      router.push(`/user/${userId}`);
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
      const response = await fetch("/api/allusers");
      const data = await response.json();

      if (response.ok) {
        setAllUsers(data.allUsers);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };


  const fetchContact = async () => {
    try {
      const response = await fetch("/api/chat/contact");
      const data = await response.json();

      if (response.ok) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };


  useEffect(() => {
    fetchAllUsers();
    fetchContact();
    fetchCurrentUser();
  }, []);


  const dataSource = filter === "all" ? allUsers : allUsers; 


  const filteredChats = dataSource.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-[320px] h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">


      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Chats</h1>
  
        <div className="flex flex-col items-start gap-1">
          <div onClick={()=>router.push(`/profile/${me?.id}`)} className="relative w-8 h-8">
            <Image
              src={me?.avatar || "https://i.pravatar.cc/150"}
              alt="user"
              fill
              sizes="40px"
              className="rounded-full object-cover"
            />
          </div>
        </div>

      </div>

    
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

     
      <div className="flex justify-center mb-4">
        <div className="flex bg-white/5 border border-white/10 rounded-full p-1 gap-1">
          <button onClick={() => setFilter("all")} className={`px-4 py-1.5 rounded-full text-sm ${filter === "all"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
              : "text-gray-300 hover:bg-white/10"
              }`}
          >
            All Users
          </button>

          <button
            onClick={() => setFilter("friends")}
            className={`px-4 py-1.5 rounded-full text-sm ${filter === "friends"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
              : "text-gray-300 hover:bg-white/10"
              }`}
          >
            Friends
          </button>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto px-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((user) => {
            const isContact = isContactUser(user._id);

            return (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${isContact
                  ? "hover:bg-white/10 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
                  }`}
              >
             
                <div className="relative w-10 h-10">
                  <Image
                    src={user.avatar || "https://i.pravatar.cc/150"}
                    alt="user"
                    fill
                    className="rounded-full object-cover"
                  />

                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-black rounded-full"></span>
                  )}
                </div>

              
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-white">
                    {user.name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {user.isOnline ? "Online" : "Offline"}
                  </p>
                </div>

                <div className="text-xs">
                  {isContact ? (
                    <span className="text-green-400">Connected</span>
                  ) : (
                    <span className="text-yellow-400">Not Connected</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 mt-6">No users found</p>
        )}
      </div>
    </div>
  );
}   