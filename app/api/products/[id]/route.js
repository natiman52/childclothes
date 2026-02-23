import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                categories: true,
                variations: true,
                ratings: {
                    include: { user: { select: { username: true, photo: true } } },
                    orderBy: { createdAt: "desc" }
                },
                questions: {
                    include: { user: { select: { username: true, photo: true } } },
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Fetch product error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = await params;
    try {
        const {
            name,
            description,
            basePrice,
            categoryIds,
            imageUrls,
            variations
        } = await req.json();

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                basePrice: basePrice ? parseFloat(basePrice) : undefined,
                categories: categoryIds ? {
                    set: categoryIds.map(cid => ({ id: cid }))
                } : undefined,
                images: imageUrls ? {
                    deleteMany: {},
                    create: imageUrls.map(url => ({ url }))
                } : undefined,
                variations: variations ? {
                    deleteMany: {},
                    create: variations.map(v => ({
                        size: v.size,
                        color: v.color,
                        quantity: parseInt(v.quantity) || 0,
                        additionalPrice: parseFloat(v.additionalPrice) || 0
                    }))
                } : undefined
            },
            include: {
                images: true,
                categories: true,
                variations: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
