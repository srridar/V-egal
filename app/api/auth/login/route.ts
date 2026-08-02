import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/services/auth.services";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const result = await loginUser(body);

    if (!result || !result.token) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const cookieStore =await cookies();

    cookieStore.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json(
      {
        message: result.message,
        user: result.user,
        userId: result.user.id,
      },
      { status: result.status || 200 }
    );
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}