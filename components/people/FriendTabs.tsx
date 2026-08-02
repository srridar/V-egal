"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  UserCheck,
  UserRoundPlus,
  Send,
} from "lucide-react";

interface FriendTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

const FriendTabs = ({ value, onValueChange }: FriendTabsProps) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-zinc-950 p-1 border border-zinc-800 rounded-lg">
        <TabsTrigger
          value="users"
          className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Users</span>
        </TabsTrigger>

        <TabsTrigger
          value="friends"
          className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all"
        >
          <UserCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Friends</span>
        </TabsTrigger>

        <TabsTrigger
          value="requests"
          className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all"
        >
          <UserRoundPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Requests</span>
        </TabsTrigger>

        <TabsTrigger
          value="sent"
          className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Sent</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FriendTabs;