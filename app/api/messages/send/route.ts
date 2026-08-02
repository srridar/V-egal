import { NextRequest } from "next/server";
import { sendMessage } from "@/services/message.service";
import { isAuthenticated } from "@/lib/authGuard";

export async function POST(req: NextRequest) {
  try {
    const userId = await isAuthenticated(req);

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { chatId, content, file, fileName, messageType } = body;

    if (!chatId || !messageType) {
      return Response.json(
        { message: "chatId and messageType required" },
        { status: 400 }
      );
    }

    const message = await sendMessage({
      chatId,
      senderId: userId,
      content,
      file,
      fileName,
      messageType,
    });

    return Response.json(
      { message: "Message sent", data: message },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}