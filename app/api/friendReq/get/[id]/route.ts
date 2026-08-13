import { NextRequest } from "next/server";
import { getParticularFriendRequest } from "@/services/friendRequest.services";
import { isAuthenticated } from "@/lib/authGuard";

export async function GET( req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await isAuthenticated(req);

    if (!userId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: requestId } = await params;

    if (!requestId) {
      return Response.json(
        { message: "Request ID is required" },
        { status: 400 }
      );
    }

    const request = await getParticularFriendRequest(requestId);

    if (
      request.sender._id.toString() !== userId &&
      request.receiver._id.toString() !== userId
    ) {
      return Response.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    return Response.json(
      {
        message: "Request fetched successfully",
        request,
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

