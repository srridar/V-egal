import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { accessChat, createGroupChat } from "@/services/chat.services";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = isAuthenticated(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { targetUserId, isGroup, name, users } = body;

    let chat;

    //  1-to-1 Chat
    if (!isGroup) {
      if (!targetUserId) {
        return NextResponse.json(
          { message: "targetUserId is required" },
          { status: 400 }
        );
      }

      if (targetUserId === userId) {
        return NextResponse.json(
          { message: "You cannot chat with yourself" },
          { status: 400 }
        );
      }

      chat = await accessChat(userId, targetUserId);
    }

    //  Group Chat
    else {
      if (!name || !users || users.length < 2) {
        return NextResponse.json(
          { message: "Group must have name and at least 2 users" },
          { status: 400 }
        );
      }

      chat = await createGroupChat({
        name,
        users,
        adminId: userId,
      });
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.error("CREATE CHAT ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Chat creation failed" },
      { status: 500 }
    );
  }
}