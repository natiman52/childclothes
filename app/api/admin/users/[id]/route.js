import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                address: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                _count: {
                    select: { orders: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

        return NextResponse.json({
            ...user,
            totalSpent,
            password: undefined
        });
    } catch (error) {
        console.error("Error fetching user detail:", error);
        return NextResponse.json({ error: "Failed to fetch user detail" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updateData = {};

        // Handle specific actions
        if (body.action === 'reset_password') {
            updateData.password = "password";
        }
        if (body.action === 'ban') {
            updateData.role = "BANNED";
        }

        // Handle direct field updates
        if (body.username) updateData.username = body.username;
        if (body.photo !== undefined) updateData.photo = body.photo;
        if (body.role && !body.action) updateData.role = body.role;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ ...updatedUser, password: undefined });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
