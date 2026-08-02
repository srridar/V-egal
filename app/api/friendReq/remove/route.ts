import { NextRequest, NextResponse } from "next/server";
import { removeFriend } from "@/services/friend.service";
import { isAuthenticated } from "@/lib/authGuard";

export async function DELETE(req: NextRequest) {
  try {
    const userId = isAuthenticated(req);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { friendId } = await req.json();

    if (!friendId) {
      return NextResponse.json(
        {
          success: false,
          message: "Friend ID is required",
        },
        { status: 400 }
      );
    }

    const result = await removeFriend(userId, friendId);

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}