import { NextRequest } from "next/server";
import { getAllFriendRequest } from "@/services/friendreq.services";
import { isAuthenticated } from "@/lib/authGuard";


export async function GET(req: NextRequest) {
    try {
        const userId = await isAuthenticated();
        if (!userId) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const requests = await getAllFriendRequest(userId);

        return Response.json(
            {
                message: "Requests fetched successfully",
                data: requests,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(
            { message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}


