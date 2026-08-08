import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { accessChat } from "@/services/chat.services";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { receiverId: string } }) {
  try {
    await connectToDatabase();
    const userId = isAuthenticated(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

     const { receiverId } = params;

    if (!receiverId || receiverId.trim() === "") {
      return NextResponse.json(
        { message: "receiverId is required" },
        { status: 400 }
      );
    }

    if (receiverId === userId) {
      return NextResponse.json(
        { message: "You cannot chat with yourself" },
        { status: 400 }
      );
    }

    const chat = await accessChat(userId, receiverId);

    return NextResponse.json(
      { data: chat },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("GET /api/chat error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to access chat" },
      { status: 500 }
    );
  }
}