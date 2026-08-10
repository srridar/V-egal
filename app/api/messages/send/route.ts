import { NextRequest } from "next/server";
import { sendMessage } from "@/services/message.service";
import { isAuthenticated } from "@/lib/authGuard";

export async function POST(req: NextRequest) {
    try {
        const userId = await isAuthenticated(req);

        if (!userId) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await req.formData();

        const chatId = formData.get("chatId") as string;
        const content = formData.get("content") as string | null;
        const messageType = formData.get("messageType") as
            | "text"
            | "image"
            | "file"
            | "audio"
            | "video";

        const file = formData.get("file");

        if (!chatId || !messageType) {
            return Response.json(
                { message: "chatId and messageType required" },
                { status: 400 }
            );
        }

        let uploadedFile: File | undefined;

        if (file instanceof File) {
            uploadedFile = file;
        }

        const message = await sendMessage({
            chatId,
            senderId: userId,
            content: content || undefined,
            file: uploadedFile,
            messageType,
        });

        return Response.json(
            {
                message: "Message sent",
                data: message,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("SEND MESSAGE ERROR:", error);

        return Response.json(
            {
                message: error.message || "Failed to send message",
            },
            { status: 500 }
        );
    }
}