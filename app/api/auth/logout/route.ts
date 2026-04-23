import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ message: "Logout successful" });
    res.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}