import { isAuthenticated } from "@/lib/authGuard";
import { fetchCurrentUser  } from "@/services/auth.services";


export async function GET() {
  try {
    const userId = await isAuthenticated();
    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await fetchCurrentUser(userId);

    return Response.json({ currentUser: user }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Failed to fetch current user" },
      { status: 500 }
    );
  }
}