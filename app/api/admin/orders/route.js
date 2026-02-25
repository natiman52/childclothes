import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        let where = {};
        if (status === "ACTIVE") {
            where = {
                status: {
                    in: ["NOT_DELIVERED", "ON_DELIVERY"]
                }
            };
        } else if (status === "HISTORY") {
            where = {
                status: {
                    in: ["DELIVERED", "RETURNED"]
                }
            };
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            username: true,
                            phone: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.order.count({ where })
        ]);

        return NextResponse.json({
            data: orders,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
