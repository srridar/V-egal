import { MessageCircleMore } from "lucide-react";

export default function EmptyMessages() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <MessageCircleMore className="h-16 w-16 text-zinc-700" />

      <h2 className="mt-5 text-2xl font-semibold">
        No messages yet
      </h2>

      <p className="mt-2 text-zinc-400">
        This is the beginning of your conversation.
      </p>

      <p className="text-zinc-500">
        Send your first message below.
      </p>
    </div>
  );
}