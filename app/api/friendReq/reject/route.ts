import { NextRequest } from "next/server";
import { rejectFriendRequest } from "@/services/friendreq.services";
import { isAuthenticated } from "@/lib/authGuard";

export async function POST(req: NextRequest) {
  try {
    const userId = await isAuthenticated();

    if (!userId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { requestId } = await req.json();

    if (!requestId) {
      return Response.json(
        { message: "Request ID is required" },
        { status: 400 }
      );
    }

    const request = await rejectFriendRequest(requestId, userId);
    
    if (request.receiver.toString() !== userId) {
      return Response.json(
        { message: "You are not allowed to reject this request" },
        { status: 403 }
      );
    }

    return Response.json(
      {
        message: "Friend request rejected",
        data: request,
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