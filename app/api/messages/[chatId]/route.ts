import { NextRequest } from "next/server";
import { getMessages } from "@/services/message.service";
import { isAuthenticated } from "@/lib/authGuard";

export async function GET(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const userId = await isAuthenticated(req);

    if (!userId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { chatId } = await params;
    console.log("chatId:", chatId);

    if (!chatId) {
      return Response.json(
        { message: "chatId is required" },
        { status: 400 }
      );
    }

    const messages = await getMessages(chatId, userId);
    return Response.json(
      {
        message: "Messages fetched",
        data: messages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        message: error.message || "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
}