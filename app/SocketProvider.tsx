"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { initializeSocket, disconnectSocket } from "@/lib/socket/socket";
import { SOCKET_EVENTS } from "@/lib/socket/socketEvents";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
      return;
    }

    const socketInstance = initializeSocket();
    setSocket(socketInstance);
    setConnected(socketInstance.connected);

    const handleConnect = () => {
      console.log("Connected to socket server:", socketInstance.id);
      setConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("Disconnected from socket server:", reason);
      setConnected(false);
    };

    const handleConnectError = (err: Error) => {
      console.error("Socket Connection Error:", err.message);
      setConnected(false);
    };

    const handleMessageError = (error: { message: string }) => {
      console.error("Message Error:", error.message);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("connect_error", handleConnectError);
    socketInstance.on(SOCKET_EVENTS.MESSAGE_ERROR, handleMessageError);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.off(SOCKET_EVENTS.MESSAGE_ERROR, handleMessageError);
    };
  }, [user?.id]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}