import { NextRequest } from "next/server";
import { deleteMessageForEveryone } from "@/services/message.service";
import { isAuthenticated } from "@/lib/authGuard";

export async function DELETE(req: NextRequest) {
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

    await deleteMessageForEveryone(messageId, userId);

    return Response.json(
      { message: "Message deleted for everyone" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}