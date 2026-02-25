import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/utils";
import { signToken } from "@/lib/auth";

export async function POST(req) {
    try {
        const { identifier, password } = await req.json();
        const loginId = identifier;

        if (!loginId) {
            return NextResponse.json({ error: "Username or phone number is required" }, { status: 400 });
        }

        const normalizedId = normalizePhone(loginId);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: normalizedId },
                    { username: loginId }
                ]
            },
            include: { address: true }
        });


        if (!user || user.password !== password) {
            return NextResponse.json({ error: "Invalid phone number or password" }, { status: 401 });
        }

        // Generate token
        const token = await signToken({
            userId: user.id,
            username: user.username,
            role: user.role
        });

        return NextResponse.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                role: user.role,
                photo: user.photo,
                address: user.address
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
