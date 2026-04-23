import { NextRequest } from "next/server";
import { cancelFriendRequest } from "@/services/friendreq.services";
import { isAuthenticated } from "@/lib/authGuard";

export async function DELETE(req: NextRequest) {
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

    const result = await cancelFriendRequest(requestId, userId);

    return Response.json(
      {
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error cancelling request: ", error);
    return Response.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}