import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { removeFriend } from "@/services/friend.service";

type Params = {
  params: Promise<{
    friendId: string;
  }>;
};

export async function DELETE( req: NextRequest, { params }: Params) {
  try {
    const userId = await isAuthenticated(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { friendId } = await params;

    const response = await removeFriend(userId, friendId);

    return NextResponse.json(response, {
      status: response.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}