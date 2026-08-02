import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export const isAuthenticated = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};