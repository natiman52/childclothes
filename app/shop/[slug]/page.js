"use client";

import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const ALL_PRODUCTS = [
    { id: "1", name: "Waffle Textured Plush Set", price: 300, category: "Baby Boy", categorySlug: "baby-boy", image: "/images/todler 2.jpg" },
    { id: "2", name: "Ribbed Jogging Set", price: 350, category: "Baby Girl", categorySlug: "baby-girl", image: "/images/todler 1.jpg" },
    { id: "3", name: "Purl Knit Dungarees", price: 400, category: "Boys", categorySlug: "boys", image: "/images/kid 2.jpg" },
    { id: "4", name: "Cotton Jersey Top", price: 270, category: "Girls", categorySlug: "girls", image: "/images/kid 1.jpg" },
    { id: "5", name: "Cozy Wool Sweater", price: 190, category: "Boys", categorySlug: "boys", image: "/images/kid 2.jpg" },
    { id: "6", name: "Fluffy Pink Dress", price: 350, category: "Girls", categorySlug: "girls", image: "/images/kid 1.jpg" },
    { id: "7", name: "Denim Overall", price: 220, category: "Baby Boy", categorySlug: "baby-boy", image: "/images/todler 2.jpg" },
    { id: "8", name: "Floral Romper", price: 300, category: "Baby Girl", categorySlug: "baby-girl", image: "/images/todler 1.jpg" },
];

export default function CategoryPage() {
    const { slug } = useParams();

    const filteredProducts = ALL_PRODUCTS.filter(p => p.categorySlug === slug);
    const categoryName = filteredProducts.length > 0 ? filteredProducts[0].category : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-secondary py-20 px-4 text-center">
                <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">{categoryName}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Shop our collection of curated items for {categoryName}.
                </p>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold opacity-30">No products found in this category.</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
