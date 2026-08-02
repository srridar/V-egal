import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '../../../../services/auth.services';
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";



export async function POST(req: NextRequest) {
  try {

    await connectToDatabase();
    console.log("Connected to database successfully");

    const body = await req.json();
    const result = await registerUser(body);
    const cookieStore = await cookies();

    cookieStore.set("token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json(
      {
        message: result.message,
        user: result.user,
      },
      { status: result.status }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}











