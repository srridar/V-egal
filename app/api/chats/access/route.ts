import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { isAuthenticated } from "@/lib/authGuard";
import { accessChat } from "@/services/chat.services";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const userId = isAuthenticated(req);
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { targetUserId } = await req.json();
        const chat = await accessChat(userId, targetUserId);
        return NextResponse.json(
            {
                success: true,
                message: "Chat fetched successfully",
                chat,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}