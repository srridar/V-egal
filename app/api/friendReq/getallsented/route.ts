
import { NextRequest } from "next/server";
import { getSentFriendRequestsByYou } from "@/services/friendRequest.services";
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

    console.log(" getting all sented friend request by :"+ userId);
    const requests = await getSentFriendRequestsByYou(userId);
    console.log(requests);

    return Response.json(
      {
        message: "Requests fetched successfully",
        requests,
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


