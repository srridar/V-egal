"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slices/authSlice";
import { toast } from "sonner";

export default function RegisterPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value,});
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            dispatch(setUser(data.user));
            router.push("/chat");
            toast.success("Account created successfully");

        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error("Registration Failed !" + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative overflow-hidden ">

            <div className="absolute inset-0 bg-linear-to-br from-yellow-500/20 via-green-500/20 to-blue-500/20 blur-3xl opacity-50"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

                <h1 className="text-3xl font-bold font-serif  text-center mb-2 bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Create Account
                </h1>

                <p className="text-gray-400 text-center mb-6">Join and start chatting instantly</p>


                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm  text-gray-300">Full Name</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            placeholder="____Sushil Kumar____"
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={form.email}
                            placeholder="________@gamil.com"
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="............."
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-linear-to-r from-green-400 to-teal-800 text-black font-semibold hover:opacity-90 transition"
                    >
                        Register →
                    </button>
                </form>

                <p className="text-sm text-gray-400 text-center mt-6">
                    Already have an account?{" "}
                    <Link href="/login">
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            Sign In
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}