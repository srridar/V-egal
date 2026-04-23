import { isAuthenticated } from "@/lib/authGuard";
import { getAllUsers } from "@/services/contact.services";

export async function GET() {
  try {
    const userId = await isAuthenticated();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const allUsers = await getAllUsers(userId);

    return Response.json({ allUsers }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}