"use client";

import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";

export default function CategoryPage() {
    const { slug } = useParams();
    const decodedSlug = typeof slug === 'string' ? decodeURIComponent(slug) : String(slug);

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await axios.get("/api/products");
            return data;
        }
    });

    const filteredProducts = products.filter(p => p.categories?.some(c => c.name.toLowerCase() === decodedSlug.toLowerCase()));

    const categoryName = decodedSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (isLoading) return <LoadingSpinner />;

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
