import { NextRequest, NextResponse } from "next/server";
import { getUserProfile } from "@/services/auth.services";
import { connectToDatabase } from "@/lib/db";


export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await connectToDatabase();
    const { userId } = await params;
    const result = await getUserProfile(userId);
    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500, }
    );
  }
}