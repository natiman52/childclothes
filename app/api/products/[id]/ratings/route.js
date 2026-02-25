import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
    const { id: productId } = await params;
    try {
        const { userId, stars, comment } = await req.json();

        if (!userId || !stars) {
            return NextResponse.json({ error: "UserId and stars are required" }, { status: 400 });
        }

        const rating = await prisma.rating.create({
            data: {
                stars: parseInt(stars),
                comment,
                userId,
                productId
            }
        });

        return NextResponse.json(rating, { status: 201 });
    } catch (error) {
        console.error("Add rating error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
