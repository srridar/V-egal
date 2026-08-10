"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/password-forgot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email }),
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b1c83] px-4 py-12 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 blur-2xl"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"></div>

            <div className="w-full max-w-md transform rounded-2xl bg-gray-100 p-8 shadow-xl border border-gray-100 transition-all">
                {!isSubmitted ? (
                    <>
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                Forgot Password
                            </h1>
                            <p className="mt-2.5 text-sm text-gray-500">
                                Enter your email address and we`&apos;`ll send you a secure link to reset your password.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        value={email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Success Screen State */
                    <div className="text-center py-4 animate-fadeIn">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                            Check your email
                        </h2>
                        <p className="mt-2.5 text-sm text-gray-500 max-w-xs mx-auto">
                            We have sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>.
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4"
                        >
                            Didn`&apos;`t receive it? Try again
                        </button>
                    </div>
                )}

                {/* Footer Navigation */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}