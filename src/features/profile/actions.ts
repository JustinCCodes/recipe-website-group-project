"use server";

import { v2 as cloudinary } from "cloudinary";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Type
type FormState = {
  error?: string;
  success?: boolean;
  url?: string;
};

export async function updateProfilePictureAction(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "You must be logged in." };
  }

  const file = formData.get("profilePicture") as File;
  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profile_pictures",
            transformation: [{ width: 400, height: 400, crop: "fill" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        profileImageUrl: result.secure_url,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error("Upload failed:", error);
    return { error: "Failed to upload image." };
  }
}
