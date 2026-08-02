"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Camera,
    ChevronLeft,
    Save,
    User,
    Mail,
    Info,
    CheckCircle2,
} from "lucide-react";
import Image from "next/image";

type UserType = {
    username: string;
    email: string;
    bio: string;
    avatar: string;
};

export default function EditProfilePage() {
    const params = useParams();
    const userId = params?.userId as string;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [user, setUser] = useState<UserType | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);


    useEffect(() => {
      
        const fetchUserProfile = async () => {
            try {
                setInitialLoading(true);
                const response = await fetch(`/api/auth/profile/${userId}`, {
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
                setInitialLoading(false);
            }
        };

        if (userId) fetchUserProfile();
    }, [userId]);


    const handleImageChange = (file: File) => {
        setAvatarFile(file);

        setUser((prev) =>
            prev
                ? {
                    ...prev,
                    avatar: URL.createObjectURL(file),
                }
                : prev
        );
    };


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const form = new FormData();
            if (user?.username) form.append("name", user.username);
            if (user?.bio) form.append("bio", user.bio);
            if (avatarFile) {
                form.append("avatar", avatarFile);
            }

            const res = await fetch("/api/auth/update-profile", { method: "PUT", body: form });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            if (res.ok) {
                router.push(`/profile`)
            }

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };


    if (initialLoading || !user) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-white gap-4">

                {/* Spinner */}
                <div className="w-10 h-10 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />

                {/* Text */}
                <p className="text-sm text-slate-400 tracking-wide">
                    Loading profile...
                </p>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans p-6">
            <div className="max-w-2xl mx-auto">

                {/* Top Navigation */}
                <div className="flex items-center justify-between mb-10">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Profile</span>
                    </button>

                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                        <CheckCircle2 size={14} />
                        All changes synced
                    </div>
                </div>

                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                    <p className="text-slate-400 mt-1">
                        Update your personal presence and contact details.
                    </p>
                </header>

                <form onSubmit={handleSave} className="space-y-8">

                    {/* Avatar Upload Section */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-8">

                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-purple-500">
                                <Image
                                    src={user.avatar || "https://i.pravatar.cc/150"}
                                    alt="Profile Preview"
                                    width={128}
                                    height={128}
                                    className="rounded-full border-4 border-[#0a0a0a] object-cover w-full h-full"
                                />
                            </div>

                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity border-2 border-dashed border-white/30">
                                <Camera className="text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files?.[0] &&
                                        handleImageChange(e.target.files[0])
                                    }
                                />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-semibold text-white">
                                Profile Picture
                            </h3>
                            <p className="text-sm text-slate-400 mt-1 mb-4">
                                PNG, JPG or GIF. Max 2MB. Recommended 400x400px.
                            </p>
                        </div>
                    </section>

                    {/* Form Fields */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-6">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <User size={16} className="text-slate-500" />
                                Display Name
                            </label>

                            <input
                                type="text"
                                value={user.username || ""}
                                onChange={(e) =>
                                    setUser({ ...user, username: e.target.value })
                                }
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Mail size={16} className="text-slate-500" />
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={user.email || ""}
                                disabled
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Info size={16} className="text-slate-500" />
                                About / Bio
                            </label>

                            <textarea
                                rows={4}
                                value={user.bio || ""}
                                onChange={(e) =>
                                    setUser({ ...user, bio: e.target.value })
                                }
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />

                            <p className="text-right text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                                {(user.bio || "").length} / 160 Characters
                            </p>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">

                        <button
                            type="button"
                            className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {loading ? "Saving..." : "Save Changes"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}