import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name: body.name }
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Optionally check if products exist in category before deleting
        const count = await prisma.product.count({
            where: { categories: { some: { id } } }
        });

        if (count > 0) {
            return NextResponse.json({ error: "Cannot delete category with existing products. Remove products first." }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
