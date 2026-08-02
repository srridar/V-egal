"use client";

import { useEffect, useMemo, useState } from "react";

interface CallTimerProps {
  isRunning: boolean;
  startTime?: number;
  className?: string;
}

export default function CallTimer({
  isRunning,
  startTime,
  className = "",
}: CallTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const [internalStart, setInternalStart] = useState<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setElapsed(0);
      setInternalStart(null);
      return;
    }

    const startedAt = startTime ?? internalStart ?? Date.now();

    if (!internalStart && !startTime) {
      setInternalStart(startedAt);
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, internalStart]);

  const formatted = useMemo(() => {
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    return `${pad(minutes)}:${pad(seconds)}`;
  }, [elapsed]);

  return (
    <div className={`rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur ${className}`}>
      {formatted}
    </div>
  );
}
