import { connectToDatabase } from "@/lib/db";
import { forgotPassword } from "@/services/auth.services";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();
    const result = await forgotPassword(email);

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}