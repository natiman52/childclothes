import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    try {
        const where = categoryId ? {
            categories: {
                some: { id: categoryId }
            }
        } : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    images: true,
                    categories: true,
                    variations: true,
                    _count: {
                        select: { ratings: true, questions: true }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.product.count({ where })
        ]);

        return NextResponse.json({
            data: products,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
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
