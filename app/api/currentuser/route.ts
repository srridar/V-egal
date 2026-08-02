import { isAuthenticated } from "@/lib/authGuard";
import { getUserProfile  } from "@/services/auth.services";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const userId = await isAuthenticated(req);
    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await getUserProfile(userId);

    return Response.json({ currentUser: user }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { message: "Failed to fetch current user" },
      { status: 500 }
    );
  }
}