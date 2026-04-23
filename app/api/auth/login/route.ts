import { loginUser } from '../../../../services/auth.services';
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";



export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const result = await loginUser(body);

    if (!result || !result.token) {
      return Response.json(   
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json(
      {
        message: result.message,
        user: result.user,
        userId: result.user.id,
      },
      { status: result.status }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Login failed" },
      { status: 401 }
    );
  }
}