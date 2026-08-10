"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";

import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Video,
  UserPlus,
  ShieldBan,
  Flag,
  Mail,
  PhoneCall,
  Calendar,
  Clock,
  BadgeCheck,
} from "lucide-react";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner'


type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  isVerified: boolean;
  lastSeen?: string;
  createdAt: string;
};

export default function OtherUserProfilePage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);


  const fetchUserProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/profile/${userId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setUser(data.user);

    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch to profile");
    }
  }


  useEffect(() => {
    fetchUserProfile(userId);
  }, [dispatch, userId]);


  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-all rounded-xl pl-2 pr-4 flex gap-1 items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl">

          <div className="h-44 bg-gradient-to-b from-zinc-800/30 to-transparent relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />
          </div>

          <div className="px-6 md:px-10 pb-10 -mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-full blur-md opacity-30 group-hover:opacity-40 transition-opacity" />
                  <Image
                    src={user?.avatar || "/public/person2.png"}
                    alt={user?.username || "person"}
                    width={140}
                    height={140}
                    className="rounded-full border-4 border-black relative z-10 shadow-xl object-cover aspect-square"
                  />
                  {user?.isOnline && (
                    <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 border-2 border-black z-20 ring-4 ring-emerald-500/20" />
                  )}
                </div>

                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                      {user?.username || user?.name}
                    </h1>
                    {user?.isVerified && (
                      <BadgeCheck className="text-blue-500 h-5 w-5 fill-blue-500/10" />
                    )}
                  </div>
                  <p className="text-sm font-mono text-zinc-500">ID: {String(user?._id).substring(0, 8)}...</p>
                </div>

                <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                  {user?.bio}
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2 w-full justify-center lg:justify-start">
                  <Button className="bg-zinc-800 text-black hover:bg-zinc-900 shadow-sm font-medium rounded-xl px-2 py-1 transition-all flex gap-2 items-center">
                    <UserPlus className="mr-2 h-4 w-4 stroke-[2.5]" />
                    Add Friend
                  </Button>

                  <Button
                    className="border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>

                <div className="flex gap-2">
                  <Button
                    className="border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 rounded-xl w-10 h-10"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button  className="border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-xl w-10 h-10">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-zinc-900 lg:pl-8 w-full">

              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Information</h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-900/60">
                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400"><Mail className="h-4 w-4" /></div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-zinc-500 font-medium">Email Address</p>
                      <p className="text-sm text-zinc-300 truncate font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-900/60">
                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400"><PhoneCall className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Phone Number</p>
                      <p className="text-sm text-zinc-300 font-medium">{user?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-900/60">
                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400"><Calendar className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Member Since</p>
                      <p className="text-sm text-zinc-300 font-medium">{user?.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-900/60">
                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400"><Clock className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Activity Status</p>
                      <p className="text-sm text-zinc-300 font-medium">
                        {user?.isOnline ? <span className="text-emerald-400 font-semibold">Online now</span> : `Seen ${user?.lastSeen}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-900" />
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Safety & Privacy</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className="w-full justify-start text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 rounded-xl h-10 text-xs font-medium transition-all"
                  >
                    <ShieldBan className="mr-2 h-4 w-4" />
                    Block {user?.username || user?.name}
                  </Button>

                  <Button
                    className="w-full justify-start text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-xl h-10 text-xs font-medium transition-all"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Report Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div >
  );
}