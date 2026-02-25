import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        address: true
                    }
                },
                items: {
                    include: {
                        product: true,
                        variation: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order detail:", error);
        return NextResponse.json({ error: "Failed to fetch order detail" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // 1. Fetch current order to check status transition and items
        const currentOrder = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!currentOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // 2. Handle item removal
        if (body.removedItemIds && body.removedItemIds.length > 0) {
            await prisma.orderItem.deleteMany({
                where: {
                    id: { in: body.removedItemIds },
                    orderId: id
                }
            });
        }

        // 3. Handle Inventory Sync (on transition to DELIVERED)
        if (body.status === "DELIVERED" && currentOrder.status !== "DELIVERED") {
            // Refetch items in case some were just removed
            const itemsToDecrement = await prisma.orderItem.findMany({
                where: { orderId: id }
            });

            for (const item of itemsToDecrement) {
                if (item.variationId) {
                    await prisma.variation.update({
                        where: { id: item.variationId },
                        data: {
                            quantity: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
            }
        }

        // Admin might update status, totalPrice, shippingCost, or taxCost
        const updateData = {};
        if (body.status) updateData.status = body.status;
        if (body.totalPrice !== undefined) updateData.totalPrice = body.totalPrice;
        if (body.shippingCost !== undefined) updateData.shippingCost = body.shippingCost;
        if (body.taxCost !== undefined) updateData.taxCost = body.taxCost;

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                        variation: true
                    }
                }
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Delete order items first (or handle via prisma cascade)
        await prisma.orderItem.deleteMany({
            where: { orderId: id }
        });

        await prisma.order.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
