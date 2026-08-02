import { NextRequest } from "next/server";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest";
import { isAuthenticated } from "@/lib/authGuard";

export async function GET( req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  try {
    const currentUserId = isAuthenticated(req);

    if (!currentUserId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;

    const user = await User.findById(userId).select(
      "name email avatar bio contacts"
    );

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    let status: "none" | "sent" | "received" | "accepted" = "none";
    let requestId: string | null = null;                         //  yo vanako tyo  FriendRequest ko id vanko ho hai 


    if (user.contacts.includes(currentUserId)) {
      status = "accepted";
    } else {
      const sentReq = await FriendRequest.findOne({
        sender: currentUserId,
        receiver: userId,
        status: "pending",
      });

      if (sentReq) {
        status = "sent";
        requestId = sentReq._id.toString();
      }

      // ✅ check request (you received)
      const receivedReq = await FriendRequest.findOne({
        sender: userId,
        receiver: currentUserId,
        status: "pending",
      });

      if (receivedReq) {
        status = "received";
        requestId = receivedReq._id.toString();
      }
    }

    console.log("the requestId is " + requestId);

    return Response.json(
      {
        user,
        status,
        requestId,    // 🔥 THIS IS WHAT YOU NEED
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Error fetching user" },
      { status: 500 }
    );
  }
}