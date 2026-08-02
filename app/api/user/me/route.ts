import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import { isAuthenticated } from "@/lib/authGuard";
import type { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const userId = await isAuthenticated(req);

        if (!userId) {
            return Response.json(
                { message: "UserId required" },
                { status: 404 }
            );
        }

        return Response.json(
            { user },
            { status: 200 }
        );

    } catch (error: any) {
        return Response.json(
            { message: "Invalid token" },
            { status: 401 }
        );
    }
}