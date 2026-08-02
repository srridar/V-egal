import { NextRequest } from "next/server";
import { markMessagesAsSeen } from "@/services/message.service";
import { isAuthenticated } from "@/lib/authGuard";

export async function POST(req: NextRequest) {
  try {
    const userId = await isAuthenticated();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await req.json();

    if (!chatId) {
      return Response.json(
        { message: "chatId is required" },
        { status: 400 }
      );
    }

    await markMessagesAsSeen(chatId, userId);

    return Response.json(
      { message: "Messages marked as seen" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Failed to mark seen" },
      { status: 500 }
    );
  }
}