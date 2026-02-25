import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
    const { id: productId } = await params;
    try {
        const { userId, text } = await req.json();

        if (!userId || !text) {
            return NextResponse.json({ error: "UserId and text are required" }, { status: 400 });
        }

        const question = await prisma.question.create({
            data: {
                text,
                userId,
                productId
            }
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error("Ask question error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
