import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                include: {
                    _count: {
                        select: { orders: true }
                    },
                    orders: {
                        select: { totalPrice: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.user.count()
        ]);

        // Calculate total spent for each user
        const usersWithStats = users.map(user => {
            const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
            return {
                ...user,
                totalSpent,
                password: undefined // Never send password back
            };
        });

        return NextResponse.json({
            data: usersWithStats,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
