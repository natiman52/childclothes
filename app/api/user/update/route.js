import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const { userId, photo, city, subcity, neighborhood } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Update user photo and address
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                photo: photo,
                address: {
                    upsert: {
                        create: {
                            city: city || "Addis Ababa",
                            subcity: subcity || "Bole",
                            neighborhood: neighborhood || ""
                        },
                        update: {
                            city: city,
                            subcity: subcity,
                            neighborhood: neighborhood
                        }
                    }
                }
            },
            include: {
                address: true
            }
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                phone: updatedUser.phone,
                role: updatedUser.role,
                photo: updatedUser.photo,
                address: updatedUser.address
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
