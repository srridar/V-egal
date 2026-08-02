import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { getAllFriends } from "@/services/friend.service";

export async function GET(req: NextRequest) {
  try {
   const userId = await isAuthenticated(req);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const response = await getAllFriends(userId);

    return NextResponse.json(response, {
      status: response.status,
    });
  } catch (error) {
    console.error("Get Friends Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch friends",
      },
      { status: 500 }
    );
  }
}