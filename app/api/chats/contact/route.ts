import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { getYourContacts } from "@/services/contact.services";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = isAuthenticated(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    //  Fetch contacts
    const contacts = await getYourContacts(userId);

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error: any) {
    console.error("GET CONTACTS ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}