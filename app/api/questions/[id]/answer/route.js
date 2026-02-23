import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req, { params }) {
    const { id } = await params;
    try {
        const { answer } = await req.json();

        if (answer === undefined) {
            return NextResponse.json({ error: "Answer is required" }, { status: 400 });
        }

        const question = await prisma.question.update({
            where: { id },
            data: { answer }
        });

        return NextResponse.json(question);
    } catch (error) {
        console.error("Answer question error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
