import { MessageCircle, Lock } from "lucide-react";

export default function DefaultChatPage() {
  return (
   
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-6 rounded-full bg-zinc-900 p-6">
        <MessageCircle className="h-14 w-14 text-cyan-400" />
      </div>

      <h1 className="text-3xl font-bold">
        Select a conversation
      </h1>

      <p className="mt-3 max-w-md text-zinc-400">
        Choose a chat from the sidebar or start a new conversation with your friends.
      </p>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm text-zinc-500 flex gap-2 items-end">
        <Lock className="h-6 w-6"/> Your personal messages are private.
      </div>
    </div>
  );
}