import { NextRequest, NextResponse } from "next/server";
import { changePassword } from "@/services/auth.services";
import { isAuthenticated } from "@/lib/authGuard";

export async function PUT(req: NextRequest) {
  try {
    const userId = await isAuthenticated();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

   
    const body = await req.json();

    const { currentPassword, newPassword, confirmPassword } = body;

    const result = await changePassword(userId, {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    return NextResponse.json(
      { success: true, ...result },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
} 