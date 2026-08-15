
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
};

export const generateToken = (userId: string) => {
    return jwt.sign(
        { userId },
        getJwtSecret(),
        {
            expiresIn: "7d",
        }
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(
            token,
            getJwtSecret()
        ) as { userId: string };
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
};

export const setAuthCookie = async (token: string) => {
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
    });
};

export const removeAuthCookie = async () => {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });
};

export const getUserFromToken = async () => {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    const decoded = verifyToken(token);

    return decoded ? decoded.userId : null;
};

