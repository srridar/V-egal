import { NextRequest, NextResponse } from "next/server";
import { rejectCall } from "@/services/call.services";
import { isAuthenticated } from "@/lib/authGuard";


export async function POST(req: NextRequest) {

    try {
        const userId = isAuthenticated(req);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const { roomId } = await req.json();

        if (!roomId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Room ID is required",
                },
                { status: 400 }
            );
        }

        const call = await rejectCall(roomId, userId);

        return NextResponse.json(
            {
                success: true,
                message: "Call rejected successfully",
                call,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Reject call route error:", error.message);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to reject call",
            },
            { status: 500 }
        );
    }

}