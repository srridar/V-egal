import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { accessChat } from "../../../../services/chat.services";

export async function GET(req: NextRequest) {
  try {
    const userId = await isAuthenticated();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const receiverId = req.nextUrl.searchParams.get("receiverId"); // ✅ FIX

    if (!receiverId) {
      return Response.json(
        { message: "receiverId is required" },
        { status: 400 }
      );
    }

    const chat = await accessChat(userId, receiverId);

    return Response.json({ data: chat }, { status: 200 }); // consistent
  } catch (error: any) {
    return Response.json(
      { message: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}