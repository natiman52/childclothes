import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const hero = await prisma.hero.findFirst({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(hero || {});
    } catch (error) {
        console.error("Error fetching hero for admin:", error);
        return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const hero = await prisma.hero.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        let updatedHero;
        if (hero) {
            updatedHero = await prisma.hero.update({
                where: { id: hero.id },
                data: {
                    title: body.title,
                    subtitle: body.subtitle,
                    imageUrl: body.imageUrl,
                    linkText: body.linkText,
                    linkUrl: body.linkUrl,
                    badgeText: body.badgeText,
                    badgePrice: body.badgePrice
                }
            });
        } else {
            updatedHero = await prisma.hero.create({
                data: {
                    title: body.title,
                    subtitle: body.subtitle,
                    imageUrl: body.imageUrl,
                    linkText: body.linkText,
                    linkUrl: body.linkUrl,
                    badgeText: body.badgeText,
                    badgePrice: body.badgePrice
                }
            });
        }

        return NextResponse.json(updatedHero);
    } catch (error) {
        console.error("Error updating hero:", error);
        return NextResponse.json({ error: "Failed to update hero data" }, { status: 500 });
    }
}
