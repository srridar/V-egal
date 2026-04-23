import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { sendFriendRequest } from "@/services/friendreq.services";

export async function POST(req: NextRequest) {
    try {
        const userId = await isAuthenticated();
        if (!userId) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { receiverId } = await req.json();

        if (!receiverId) {
            return Response.json(
                { message: "receiverId required" },
                { status: 400 }
            );
        }

        const request = await sendFriendRequest(userId, receiverId);

        return Response.json(
            {
                message: "Request sent",
                request,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error sending friend request:", error);
        return Response.json(
            { message: error.message || "Failed to send request" },
            { status: 500 }
        );
    }
}