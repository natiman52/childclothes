import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const { id } = params;

        const order = await prisma.order.findUnique({
            where: { id },
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
                    include: {
                        address: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Fetch order detail error:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const { status, totalPrice } = await req.json();

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(totalPrice !== undefined && { totalPrice: parseFloat(totalPrice) })
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await prisma.order.delete({
            where: { id }
        });
        return NextResponse.json({ message: "Order deleted" });
    } catch (error) {
        console.error("Delete order error:", error);
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
