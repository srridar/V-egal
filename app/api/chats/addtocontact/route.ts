import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authGuard";
import { addToYourContacts } from "@/services/contact.services";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = isAuthenticated(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json(
        { message: "Contact ID is required" },
        { status: 400 }
      );
    }

    if (contactId === userId) {
      return NextResponse.json(
        { message: "You cannot add yourself" },
        { status: 400 }
      );
    }

    const contacts = await addToYourContacts(userId, contactId);

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error: any) {
    console.error("ADD CONTACT ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Failed to add contact" },
      { status: 500 }
    );
  }
}


