import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const isAuthenticated = async () => {
  const cookieStore = await cookies(); // ✅ Next.js 15 fix
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return null;
  }
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};