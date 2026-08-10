"use client";

import { useMemo, useState, useEffect } from "react";
import SearchBar from "@/components/people/SearchBar";
import FriendTabs from "@/components/people/FriendTabs";
import UserCard from "@/components/people/UserCard";
import FriendRequestCard from "@/components/people/FriendRequestCard";
import EmptyState from "@/components/people/EmptyState";
import FriendCard from "@/components/people/FriendCard";
import FriendRequestSendCard from "@/components/people/FriendRequestSendCard";
import { IUser } from "@/types/user";

type UserStatus = "friend" | "received" | "pending" | "none";

export default function PeoplePage() {
  const [tab, setTab] = useState("users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [friends, setFriends] = useState<IUser[]>([]);
  const [requests, setRequests] = useState([]);
  const [requestsSent, setRequestsSent] = useState([])

  const getUserStatus = (userId: string): UserStatus => {

    // Already friends
    if (friends.some((f: any) => f._id === userId)) {
      return "friend";
    }

    // Incoming request
    if (requests.some((r: any) => r.user._id === userId)) {
      return "received";
    }

    // Sent request
    if (requestsSent.some((r: any) => r.user._id === userId)) {
      return "pending";
    }

    return "none";
  };

  const fetchAllUser = async () => {
    try {
      const res = await fetch("/api/allusers");
      const data = await res.json();
      if (res.ok) {
        setUsers(data?.users)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends");
      const data = await res.json();

      if (res.ok) {
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await fetch("/api/friendReq/getall");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setRequests(data.data.requests);
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
    }
  }

  const fetchFriendRequestsSent = async () => {
    try {
      const res = await fetch("/api/friendReq/getallsented");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setRequestsSent(data.data.requests);
    } catch (error) {
      console.error("Failed to fetch friend requests sent by you:", error);
    }
  }

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter(
      (user) => 
        user.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);


  const refreshData = async () => {
    await Promise.all([
      fetchAllUser(),
      fetchFriends(),
      fetchFriendRequests(),
      fetchFriendRequestsSent(),
    ]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">
      <div className="mx-auto max-w-5xl space-y-6 p-6">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            People
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Discover users, manage friends and friend requests.
          </p>
        </div>


        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search people..."
          />
        </div>


        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2">
          <FriendTabs
            value={tab}
            onValueChange={setTab}
          />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

          {tab === "users" && (
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <EmptyState
                  title="No Users Found"
                  description="Try searching with another keyword."
                />
              ) : (
                filteredUsers.map((user: any) => (
                  <UserCard
                    key={user._id}
                    id={user._id}
                    name={user.name}
                    username={user.username}
                    avatar={user.avatar}
                    bio={user.bio}
                    isOnline={user.isOnline}
                    status={getUserStatus(user._id)}
                    onSuccess= {refreshData}
                  />
                ))
              )}
            </div>
          )}

          {/* FRIENDS */}
          {tab === "friends" && (
            <div className="space-y-4">
              {friends.length === 0 ? (
                <EmptyState
                  title="No Friends"
                  description="You don't have any friends yet."
                />
              ) : (
                friends.map((friend: any) => (
                  <FriendCard
                    key={friend._id}
                    id={friend._id}
                    name={friend.name}
                    username={friend.username}
                    avatar={friend.avatar}
                    bio={friend.bio}
                    isOnline={friend.isOnline}
                    onSuccess={refreshData}
                  />
                ))
              )}
            </div>
          )}

          {/* RECEIVED REQUESTS */}
          {tab === "requests" && (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <EmptyState
                  title="No Friend Requests"
                  description="You don't have any pending requests."
                />
              ) : (
                requests.map((request: any) => (
                  <FriendRequestCard
                    key={request.requestId}
                    id={request.requestId}
                    name={request.user.name}
                    username={request.user.username}
                    avatar={request.user.avatar}
                    onSuccess={refreshData}
                  />
                ))
              )}
            </div>
          )}

          {/* SENT REQUESTS */}
          {tab === "sent" && (
            <div className="space-y-4">
              {requestsSent.length === 0 ? (
                <EmptyState
                  title="No Sent Requests"
                  description="You haven't sent any friend requests."
                />
              ) : (
                requestsSent.map((request: any) => (
                  <FriendRequestSendCard
                    key={request.requestId}
                    id={request.requestId}
                    name={request.user.name}
                    username={request.user.username}
                    avatar={request.user.avatar}
                    bio={request.user.bio}
                    onSuccess={refreshData}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}