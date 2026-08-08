import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { addToGroup } from "@/services/chat.services";
import Chat from "@/models/Chat";
import { connectToDatabase } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = isAuthenticated(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { chatId, newUserId } = body;

    if (!chatId || !newUserId) {
      return NextResponse.json(
        { message: "chatId and newUserId are required" },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json(
        { message: "Chat not found" },
        { status: 404 }
      );
    }

    if (chat.groupAdmin?.toString() !== userId) {
      return NextResponse.json(
        { message: "Only admin can add users" },
        { status: 403 }
      );
    }

    const updatedChat = await addToGroup(chatId, newUserId);

    return NextResponse.json(
      {
        message: "User added successfully",
        chat: updatedChat,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ADD TO GROUP ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Failed to add user" },
      { status: 500 }
    );
  }
}