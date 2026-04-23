import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});


//   upload file function

export const uploadFile = async (file: File, folder: string) => {
    try {
        // ✅ Convert File → Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ✅ Convert Buffer → Base64
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
            folder: `VEGAL/${folder}`,
            resource_type: "auto",
        });

        return {
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
        };

    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
};

// 🔹 Delete File Function 
export const deleteFile = async (public_id: string) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error: any) {
        console.error("Delete Error:", error.message);
    }
};