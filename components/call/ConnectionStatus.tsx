"use client";

import {
  CheckCircle2,
  Loader2,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";

export type ConnectionState =
  | "new"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "failed"
  | "closed";

interface ConnectionStatusProps {
  status: ConnectionState;
  className?: string;
}

export default function ConnectionStatus({
  status,
  className = "",
}: ConnectionStatusProps) {
  const config = {
    new: {
      icon: <Loader2 size={16} className="animate-spin" />,
      text: "Preparing...",
      bg: "bg-zinc-800",
    },
    connecting: {
      icon: <Loader2 size={16} className="animate-spin" />,
      text: "Connecting...",
      bg: "bg-yellow-600",
    },
    connected: {
      icon: <CheckCircle2 size={16} />,
      text: "Connected",
      bg: "bg-emerald-600",
    },
    reconnecting: {
      icon: <Wifi size={16} className="animate-pulse" />,
      text: "Reconnecting...",
      bg: "bg-orange-600",
    },
    disconnected: {
      icon: <WifiOff size={16} />,
      text: "Disconnected",
      bg: "bg-zinc-700",
    },
    failed: {
      icon: <AlertTriangle size={16} />,
      text: "Connection Failed",
      bg: "bg-red-600",
    },
    closed: {
      icon: <WifiOff size={16} />,
      text: "Call Ended",
      bg: "bg-zinc-700",
    },
  };

  const current = config[status];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur ${current.bg} ${className}`}
    >
      {current.icon}
      <span>{current.text}</span>
    </div>
  );
}