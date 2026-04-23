import { isAuthenticated } from "@/lib/authGuard";
import { getYourContacts } from "../../../../services/contact.services";

export async function GET() {
  try {
    const userId = await isAuthenticated();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const contacts = await getYourContacts(userId);

    return Response.json({ contacts }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}