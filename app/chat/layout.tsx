import ChatSidebar from "@/components/chat/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-black text-white">

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <aside className="hidden w-[360px] shrink-0 border-r border-zinc-800 md:block ">
        <ChatSidebar />
      </aside>

      <main className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}

