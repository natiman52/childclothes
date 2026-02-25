import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");

    try {
        const products = await prisma.product.findMany({
            where: categoryId ? {
                categories: {
                    some: { id: categoryId }
                }
            } : {},
            include: {
                images: true,
                categories: true,
                variations: true,
                _count: {
                    select: { ratings: true, questions: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Fetch products error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const {
            name,
            description,
            basePrice,
            categoryIds,
            imageUrls,
            variations
        } = await req.json();

        if (!name || !basePrice) {
            return NextResponse.json({ error: "Name and basePrice are required" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                basePrice: parseFloat(basePrice),
                categories: {
                    connect: categoryIds?.map(id => ({ id })) || []
                },
                images: {
                    create: imageUrls?.map(url => ({ url })) || []
                },
                variations: {
                    create: variations?.map(v => ({
                        size: v.size,
                        color: v.color,
                        quantity: parseInt(v.quantity) || 0,
                        additionalPrice: parseFloat(v.additionalPrice) || 0
                    })) || []
                }
            },
            include: {
                images: true,
                categories: true,
                variations: true
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
