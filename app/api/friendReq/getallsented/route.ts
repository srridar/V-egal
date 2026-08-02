import { NextRequest } from "next/server";
import { getSentFriendRequests } from "@/services/friendRequest.services";
import { isAuthenticated } from "@/lib/authGuard";


export async function GET(req: NextRequest) {
    try {
        const userId = await isAuthenticated(req);
        if (!userId) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const requests = await getSentFriendRequests(userId);

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


