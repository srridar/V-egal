import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";


export async function PUT(request: Request) {
    try {
        const token = cookies().get("token")?.value;
        if (!token) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded: any = verifyToken(token);

        const body = await request.json();
        const { name, bio, avatar } = body;


        //   Update user
        const updatedUser = await User.findByIdAndUpdate(decoded.userId as string,
            {
                ...(name && { name }),
                ...(bio && { bio }),
                ...(avatar && { avatar }),
            },
            { new: true }
        ).select("-password");

        return Response.json(
            {
                message: "Profile updated successfully",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(
            { message: "Update failed" },
            { status: 500 }
        );
    }
}