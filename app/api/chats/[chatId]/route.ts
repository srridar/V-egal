import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { getChatById } from "@/services/chat.services";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest,  context: { params: Promise<{ chatId: string }> }) {
  try {
    await connectToDatabase();
    const userId = isAuthenticated(req);
    const { chatId } = await context.params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!chatId) {
      return NextResponse.json(
        { message: "chatId is required" },
        { status: 400 }
      );
    }
    
    const chat = await getChatById(chatId, userId);


    console.log("Fetched chat:", chat);

    return NextResponse.json(
      { data: chat },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("GET /api/chat/[chatId] error:", error);

    return NextResponse.json(
      { message: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}