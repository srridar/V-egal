// app/(chat)/layout.tsx

import ChatSidebar from "@/components/chat/ChatSidebar";

export default function ChatLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div className="flex h-[100dvh] overflow-hidden ">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>


      <div className="hidden md:block  border-r shrink-0">
        <ChatSidebar />
      </div>

      <div className="flex-1 flex flex-col  ">
        {children}
      </div>

    </div>
  );
}