"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#202122] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-xl border border-gray-100 transition-all">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Reset Password
          </h1>
          <p className="mt-2.5 text-sm text-gray-500">
            Please enter and confirm your secure new password below.
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-fadeIn">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <div>{error}</div>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-100 animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
            <div>{message}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                disabled={isLoading || !!message}
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                disabled={isLoading || !!message}
                value={confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!message}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Footer Link */}
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