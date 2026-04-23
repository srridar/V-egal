import { NextRequest, NextResponse } from "next/server";
import { createCall } from "@/services/call.services";
import { isAuthenticated } from "@/lib/authGuard";


export async function POST(req: NextRequest) {
    try {

        const userId = await isAuthenticated();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { receiverId, type } = body;

        if (!receiverId) {
            return NextResponse.json(
                { success: false, message: "Receiver ID is required" },
                { status: 400 }
            );
        }

        if (!["audio", "video"].includes(type)) {
            return NextResponse.json(
                { success: false, message: "Invalid call type" },
                { status: 400 }
            );
        }

        if (receiverId === userId) {
            return NextResponse.json(
                { success: false, message: "You cannot call yourself" },
                { status: 400 }
            );
        }

        const call = await createCall(userId, receiverId, type);
        return NextResponse.json(
            {
                success: true,
                message: "Call created successfully",
                call,
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Create call route error:", error.message);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create call",
            },
            { status: 500 }
        );
    }
}