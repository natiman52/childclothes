import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const { userId, items } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Order items are required" }, { status: 400 });
        }

        // Calculate initial totals
        let totalQuantity = 0;
        let totalPrice = 0;

        const orderItemsData = items.map(item => {
            const itemPrice = parseFloat(item.price);
            const qty = parseInt(item.quantity);
            totalQuantity += qty;
            totalPrice += itemPrice * qty;

            return {
                productId: item.productId,
                variationId: item.variationId || null,
                quantity: qty,
                price: itemPrice
            };
        });

        const order = await prisma.order.create({
            data: {
                userId: userId || null,
                totalPrice,
                totalQuantity,
                status: "NOT_DELIVERED",
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        const orders = await prisma.order.findMany({
            where: userId ? { userId } : {},
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1 }
                            }
                        },
                        variation: true
                    }
                },
                user: {
                    select: {
                        username: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
