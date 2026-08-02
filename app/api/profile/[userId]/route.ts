import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getUserById } from "@/services/user.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase();

    const { userId } = await params;

    const result = await getUserById(userId);

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error: any) {
    console.error("Get User Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}