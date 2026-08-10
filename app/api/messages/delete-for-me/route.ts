import { NextRequest } from "next/server";
import { deleteMessageForMe } from "@/services/message.service";
import { isAuthenticated } from "@/lib/authGuard";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await isAuthenticated(req);

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await req.json();

    if (!messageId) {
      return Response.json(
        { message: "messageId is required" },
        { status: 400 }
      );
    }

    await deleteMessageForMe(messageId, userId);

    return Response.json(
      { message: "Message hidden for you" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Failed" },
      { status: 500 }
    );
  }
}