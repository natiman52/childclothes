import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    select: { totalPrice: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate total spent for each user
        const usersWithStats = users.map(user => {
            const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
            return {
                ...user,
                totalSpent,
                password: undefined // Never send password back
            };
        });

        return NextResponse.json(usersWithStats);
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
