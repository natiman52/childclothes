import { createUploadthing } from "uploadthing/next";
import { verifyToken } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .middleware(async ({ req }) => {
            const authHeader = req.headers.get("Authorization");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new Error("Unauthorized");
            }

            const token = authHeader.split(" ")[1];
            const payload = await verifyToken(token);

            if (!payload) {
                throw new Error("Unauthorized");
            }

            return { userId: payload.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            return { uploadedBy: "Admin" };
        }),
};
