"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import SocketProvider from "./SocketProvider";
import { CallProvider } from "@/context/CallProviderContext";
import CallOverlay from "@/components/call/CallOverlay";

export default function Providers({children }: { children: React.ReactNode;}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <CallProvider>
            {children}
            <CallOverlay /> 
          </CallProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
}