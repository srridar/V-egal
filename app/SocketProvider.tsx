"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode, } from "react";
import { SOCKET_EVENTS } from "@/socket/socketEvents";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { initializeSocket, disconnectSocket } from "@/socket/client/socket";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

// React Context stores global socket information. Initially socket is null because user has not logged in yet.
const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});


interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  //    Read logged in user from Redux. Whenever user changes (login/logout), this component automatically reacts. 
  const user = useSelector((state: RootState) => state.auth.user);
  const [socket, setSocket] = useState<Socket | null>(null);   // Store socket instance. This value will be shared with the entire app.

  // Store connection status.  Used for:  Online badge, Reconnecting indicator, Disable Send button if offline
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    console.log(" Connected to socket server.");
    setConnected(true);
  };


  const handleDisconnect = (reason: string) => {
    console.log(" Disconnected from socket server. Reason: " + reason);
    setConnected(false);
  };

  const handleConnectError = (err: Error) => {
    console.error(" Socket Connection Error:", err.message);
  };

  const handleMessageError = (error: { message: string }) => {
    console.error(" Message Error:", error.message);
  };

  //  Initialize Socket on Login                           
  useEffect(() => {
    if (!user?.id) {
      disconnectSocket();
      setSocket(null);
      setConnected(false);

      return;
    }

    const socketInstance = initializeSocket(user.id);      // User logged in  Create socket connection.  
    setSocket(socketInstance);                            //  Save socket in React state.
    setConnected(socketInstance.connected);              //   Set initial connection state.


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

  const value = useMemo(() => ({ socket, connected, }), [socket, connected]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}