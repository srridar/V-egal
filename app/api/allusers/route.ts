import { isAuthenticated } from "@/lib/authGuard";
import { getAllUsers } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(req:NextRequest) {
  try {

    await connectToDatabase();
    const userId =  isAuthenticated(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const allUsers = await getAllUsers();

    return NextResponse.json( allUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}