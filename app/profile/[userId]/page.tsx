"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  LogOut,
  Edit,
  ShieldCheck,
  MessageCircle,
  Key,
  Camera,
  Settings,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";


type UserType = {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  status: string;
};



type FriendRequestType = {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };

};

export default function ProfilePage() {

  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const [user, setUser] = useState<UserType | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(true);
  const [friendReq, setFriendReq] = useState<FriendRequestType[]>([]);

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);

      const response = await fetch(`/api/user/${userId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch profile");
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };



  const getAllFriendRequest = async () => {
    try {
      setRequestLoading(true);

      const response = await fetch("/api/friendReq/getall", {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch requests");
        return;
      }

      setFriendReq(result.data || []);
    } catch (error) {
      console.log("Error fetching requests:", error);
    } finally {
      setRequestLoading(false);
    }
  };



  const acceptRequest = async (requestId: string) => {

    const res = await fetch("/api/friendReq/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),
    });



    if (res.ok) {
      setFriendReq((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    }

  };


  const rejectRequest = async (requestId: string) => {

    const res = await fetch("/api/friendReq/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),

    });



    if (res.ok) {
      setFriendReq((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    }

  };


  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };


  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      getAllFriendRequest();
    }
  }, [userId]);


  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-400">User not found</div>;
  }

  return (
    <div className="relative z-10 min-h-screen bg-[#050505] text-slate-200 selection:bg-teal-500/30 overflow-x-hidden ">

      <div className="fixed inset-0 z-0 pointer-events-none 
  bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] 
  bg-[size:40px_40px]">
      </div>

      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto pt-12 pb-20 px-6 relative">

        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Account
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your public presence and security</p>
          </div>

          <button
            onClick={() => router.push("/chat")}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <MessageCircle className="text-teal-400 group-hover:rotate-12 transition-transform" size={18} />
            <span className="text-sm font-medium tracking-wide">MESSAGES</span>
          </button>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">

          <div className="lg:col-span-4 space-y-6">
            <div className="relative group bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 rounded-3xl text-center overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500 to-purple-500 animate-pulse blur-sm opacity-50"></div>
                <div className="relative w-full h-full rounded-full border-2 border-white/20 p-1">
                  <Image
                    src={user.avatar || "https://i.pravatar.cc/150"}
                    alt="avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-2 bg-[#050505] border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                  <Camera size={14} className="text-teal-400" />
                </button>
              </div>

              <h2 className="text-2xl font-semibold text-white tracking-tight">{user.name}</h2>
              <p className="text-gray-400 mt-2 text-sm leading-relaxed px-4 line-clamp-3">
                {user.bio || "No bio added yet. Tell the world who you are."}
              </p>

              <div className="mt-8 pt-8 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all font-medium border border-red-500/10"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings & Lists */}
          <div className="lg:col-span-8 space-y-6">

            {/* Personal Details Card */}
            <section className="bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 rounded-3xl relative overflow-hidden group">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <User className="text-teal-400" size={20} />
                  </div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                </div>
                <button onClick={() => router.push(`/profile/edit/${userId}`)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-400 hover:text-teal-300 transition-colors bg-teal-400/5 px-4 py-2 rounded-full border border-teal-400/20">
                  <Edit size={14} /> Edit Profile
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold">Display Name</label>
                  <div className="flex items-center gap-3 text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">
                    <User size={16} className="text-gray-500" />
                    <span>{user.name}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-tighter text-gray-500 font-bold">Email Address</label>
                  <div className="flex items-center gap-3 text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Mail size={16} className="text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-medium text-white">Pending Requests</h3>
                <span className="ml-auto bg-white/10 px-3 py-0.5 rounded-full text-xs">
                  {requestLoading ? "..." : friendReq.length}
                </span>
              </div>

              {requestLoading ? (
                <div className="py-10 text-center text-gray-400">
                  Loading requests...
                </div>
              ) : friendReq.length === 0 ? (
                <div className="py-10 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <p className="text-gray-500 italic">
                    No incoming requests at the moment
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {friendReq.map((req) => (
                    <div
                      key={req._id}
                      className="flex justify-between items-center bg-white/5 p-4 rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={req.sender.avatar || "https://i.pravatar.cc/150"}
                            alt="user"
                            fill
                            className="rounded-2xl object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {req.sender.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {req.sender.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptRequest(req._id)}
                          className="bg-teal-500 text-black px-4 py-2 rounded-xl text-sm font-bold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectRequest(req._id)}
                          className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <ShieldCheck className="text-amber-500" size={20} />
                </div>
                <h3 className="text-lg font-medium">Security & Access</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button onClick={() => router.push(`/profile/password/edit/${userId}`)} className="flex items-center justify-between group p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-left">
                  <div className="flex items-center gap-3">
                    <Key size={18} className="text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Change Password</p>
                      <p className="text-[10px] text-gray-500 uppercase">Update your credentials</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                </button>

                <button className="flex items-center justify-between group p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-left opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Two-Factor Auth</p>
                      <p className="text-[10px] text-gray-500 uppercase">Currently Disabled</p>
                    </div>
                  </div>
                </button>

              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}