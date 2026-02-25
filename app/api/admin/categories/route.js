import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }
        const newCategory = await prisma.category.create({
            data: {
                name: body.name,
                imageUrl: body.imageUrl,
            }
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
