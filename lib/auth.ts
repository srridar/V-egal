import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// 🔹 Generate Token
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔹 Verify Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};

// 🔹 Set Cookie
export const setAuthCookie = (token: string) => {
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
};

// 🔹 Remove Cookie (Logout)
export const removeAuthCookie = () => {
  cookies().set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
};

// 🔹 Get Current User ID from Cookie
export const getUserFromToken = () => {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};