import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { accessChat, createGroupChat } from "../../../../services/chat.services";


export async function POST(req: Request) {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId;

    const body = await req.json();
    const { targetUserId, isGroup, name, users } = body;

    let chat;

    // ✅ 1-1 Chat
    if (!isGroup) {
      chat = await accessChat(userId, targetUserId);
    }

    // ✅ Group Chat
    else {
      chat = await createGroupChat({
        name,
        users,
        adminId: userId,
      });
    }

    return Response.json({ chat }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Chat creation failed" },
      { status: 500 }
    );
  }
}