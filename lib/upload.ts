
import cloudinary from "./cloudinary";

export type UploadFolder =
    | "image"
    | "file"
    | "audio"
    | "video"
    | "avatars";

export const uploadFile = async (
    file: File,
    folder: UploadFolder
) => {
    try {
        if (!file) {
            throw new Error("No file provided");
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const base64 = `data:${file.type};base64,${buffer.toString(
            "base64"
        )}`;

        const result = await cloudinary.uploader.upload(
            base64,
            {
                folder: `VEGAL/${folder}`,
                resource_type: "auto",
            }
        );

        return {
            url: result.secure_url,
            public_id: result.public_id,
            bytes: result.bytes,
            format: result.format,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        throw new Error("Cloudinary upload failed");
    }
};

