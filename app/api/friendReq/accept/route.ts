import { NextRequest } from "next/server";
import { acceptFriendRequest } from "@/services/friendRequest.services";
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

        const { requestId } = await req.json();    // requestId = ID of the FriendRequest document (NOT the user ID).

        if (!requestId) {
            return Response.json(
                { message: "Request ID is required" },
                { status: 400 }
            );
        }

        const result = await acceptFriendRequest(requestId, userId);   // this requestId is friendRequest id

        return Response.json(
            {
                message: "Friend request accepted",
                data: result,
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