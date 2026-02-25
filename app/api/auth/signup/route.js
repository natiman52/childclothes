import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const { username, phone, password, photo } = await req.json();
        console.log(req);
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { phone }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User with this phone number already exists" }, { status: 400 });
        }

        // Create user
        const newUser = await prisma.user.create({
            data: {
                username,
                phone,
                password, // Plain text as requested
                photo: photo || null,
            }
        });


        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                phone: newUser.phone,
                role: newUser.role
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
