
import cloudinary from "./cloudinary";

export const deleteFile = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Cloudinary file deletion failed");
  }
};

