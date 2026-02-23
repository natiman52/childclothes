import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Fetch categories error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Create category error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
