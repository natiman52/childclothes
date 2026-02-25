import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validate variations: at least one is required
        if (body.variations && body.variations.length === 0) {
            return NextResponse.json({ error: "At least one variation is required" }, { status: 400 });
        }

        // Start a transaction
        const updatedProduct = await prisma.$transaction(async (tx) => {
            // Update basic info
            const updateData = {};
            if (body.name) updateData.name = body.name;
            if (body.description !== undefined) updateData.description = body.description;
            if (body.basePrice !== undefined) updateData.basePrice = body.basePrice;

            // Handle categories (disconnect all then connect provided)
            if (body.categories) {
                updateData.categories = {
                    set: [], // clear existing
                    connect: body.categories.map(c => ({ id: c }))
                };
            }

            const productData = await tx.product.update({
                where: { id },
                data: updateData
            });

            // Handle variations: we delete all existing variations and create new ones based on the payload.
            // This is simpler than doing an upsert for each one when managing arrays from frontend.
            if (body.variations) {
                await tx.variation.deleteMany({
                    where: { productId: id }
                });

                if (body.variations.length > 0) {
                    await tx.variation.createMany({
                        data: body.variations.map(v => ({
                            productId: id,
                            size: v.size || null,
                            color: v.color || null,
                            additionalPrice: v.additionalPrice || 0,
                            quantity: v.quantity || 0
                        }))
                    });
                }
            }

            // Handle images identically (delete and recreate)
            // Note: In real app, you'd manage cloud uploads before this. Here we just store URLs.
            if (body.images) {
                await tx.productImage.deleteMany({
                    where: { productId: id }
                });

                if (body.images.length > 0) {
                    await tx.productImage.createMany({
                        data: body.images.map(img => ({
                            productId: id,
                            url: img.url
                        }))
                    });
                }
            }

            // Return full product
            return tx.product.findUnique({
                where: { id },
                include: { categories: true, variations: true, images: true }
            });
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
