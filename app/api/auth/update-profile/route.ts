import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "@/services/auth.services";
import { isAuthenticated } from "@/lib/authGuard";
import { uploadFile } from "@/lib/upload";
import { deleteFile } from "@/lib/deleteFile";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = isAuthenticated(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const bio = formData.get("bio") as string | null;
    const password = formData.get("password") as string | null;
    const file = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined;
    let avatarPublicId: string | undefined;

    //         Only upload if file exists
    if (file && file.size > 0) {
      const existingUser = await User.findById(userId);

      const uploaded = await uploadFile(file, "avatars");

      avatarUrl = uploaded.url;
      avatarPublicId = uploaded.public_id;

      //       Delete old image
      if (existingUser?.avatarPublicId) {
        await deleteFile(existingUser.avatarPublicId);
      }
    }

    //         Create update payload
    const updatePayload: any = {
      name: name || undefined,
      bio: bio || undefined,
      password: password || undefined,
    };

    //  Only update avatar if new uploaded
    if (avatarUrl && avatarPublicId) {
      updatePayload.avatar = avatarUrl;
      updatePayload.avatarPublicId = avatarPublicId;
    }

    const updatedUser = await updateProfile(userId, updatePayload);

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}