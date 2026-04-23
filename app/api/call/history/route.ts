import { NextRequest, NextResponse } from "next/server";
import { getCallHistory } from "@/services/call.services";
import { isAuthenticated } from "@/lib/authGuard";


export async function GET(req: NextRequest) => {
    try {
        const userId = await isAuthenticated();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const calls = await getCallHistory(userId);

        return NextResponse.json(
            {
                success: true,
                message: "Call history retrieved successfully",
                calls,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Get call history route error:", error.message);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to retrieve call history",
            },
            { status: 500 }
        );
    }
} 