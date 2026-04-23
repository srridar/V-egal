import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";


export async function GET() {
    try {
        const token = cookies().get("token")?.value;
        if (!token) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded: any = verifyToken(token);
        const user = await User.findById(decoded.userId).select("-password");



        if (!user) {
            return Response.json(
                { message: "User not found" },
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