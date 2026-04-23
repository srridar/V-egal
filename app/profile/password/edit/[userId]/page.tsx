"use client";

import { useState } from "react";
import {
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";


export default function ChangePasswordPage() {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    //     handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/password-change", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            alert("Password updated successfully 🔐");

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Input field component
    const PasswordField = ({
        label,
        value,
        onChange,
        visible,
        toggle,
        placeholder,
    }: any) => (
        <div className="space-y-2">
            <label className="text-sm text-slate-300">{label}</label>

            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-end mb-8">
                    <div className="flex items-end gap-2 text-emerald-500 text-xs bg-emerald-500/10 px-3 py-1 rounded-full">
                        <ShieldCheck size={14} />
                        Secure Area
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">
                    Change Password
                </h1>
                <p className="text-slate-400 mb-8">
                    Keep your account secure by updating your password.
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="max-w-xl space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md"
                >

                    {/* Current */}
                    <PasswordField
                        label="Current Password"
                        value={form.currentPassword}
                        onChange={(e: any) =>
                            setForm({ ...form, currentPassword: e.target.value })
                        }
                        visible={show.current}
                        toggle={() =>
                            setShow({ ...show, current: !show.current })
                        }
                        placeholder="Enter current password"
                    />

                    {/* New */}
                    <PasswordField
                        label="New Password"
                        value={form.newPassword}
                        onChange={(e: any) =>
                            setForm({ ...form, newPassword: e.target.value })
                        }
                        visible={show.new}
                        toggle={() => setShow({ ...show, new: !show.new })}
                        placeholder="Enter new password"
                    />

                    {/* Confirm */}
                    <PasswordField
                        label="Confirm Password"
                        value={form.confirmPassword}
                        onChange={(e: any) =>
                            setForm({ ...form, confirmPassword: e.target.value })
                        }
                        visible={show.confirm}
                        toggle={() =>
                            setShow({ ...show, confirm: !show.confirm })
                        }
                        placeholder="Re-enter new password"
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold transition"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                {/* Warning */}
                <p className="text-xs text-slate-500 mt-4 text-center">
                    Never share your password with anyone.
                </p>
            </div>
        </div>
    );
}