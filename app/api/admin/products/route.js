import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.basePrice) {
            return NextResponse.json({ error: "Name and base price are required" }, { status: 400 });
        }

        if (!body.variations || body.variations.length === 0) {
            return NextResponse.json({ error: "At least one variation is required" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description || "",
                basePrice: body.basePrice,
                // Handle categories if provided
                ...(body.categories && body.categories.length > 0 && {
                    categories: {
                        connect: body.categories.map(c => ({ id: c }))
                    }
                }),
                // Handle variations if provided
                ...(body.variations && body.variations.length > 0 && {
                    variations: {
                        create: body.variations.map(v => ({
                            size: v.size || null,
                            color: v.color || null,
                            additionalPrice: v.additionalPrice || 0,
                            quantity: v.quantity || 0
                        }))
                    }
                }),
                // Handle images if provided
                ...(body.images && body.images.length > 0 && {
                    images: {
                        create: body.images.map(img => ({
                            url: img.url
                        }))
                    }
                })
            },
            include: {
                categories: true,
                variations: true,
                images: true
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
