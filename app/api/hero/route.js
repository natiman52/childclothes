import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const hero = await prisma.hero.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!hero) {
            // Return default data if no hero is set in DB
            return NextResponse.json({
                title: "Premium Kid's Clothing",
                subtitle: "Discover our latest collection for your little ones",
                imageUrl: null,
                linkText: "Shop Now",
                linkUrl: "/shop",
                badgeText: "Spring Collection",
                badgePrice: "ETB 1500"
            });
        }

        return NextResponse.json(hero);
    } catch (error) {
        console.error("Error fetching hero:", error);
        return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
    }
}
