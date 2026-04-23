import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { addToGroup } from "../../../../services/chat.services";
import Chat from "@/models/Chat";

export async function PUT(req: Request) {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: { userId: string } | null = verifyToken(token);
    const userId = decoded?.userId;

    const body = await req.json();
    const { chatId, newUserId } = body;

    //   Check admin
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return Response.json({ message: "Chat not found" }, { status: 404 });
    }

    if (chat.groupAdmin?.toString() !== userId) {
      return Response.json(
        { message: "Only admin can add users" },
        { status: 403 }
      );
    }

    const updatedChat = await addToGroup(chatId, newUserId);

    return Response.json(
      { message: "User added successfully", chat: updatedChat },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Failed to add user" },
      { status: 500 }
    );
  }
}