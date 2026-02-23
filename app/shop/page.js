"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

const ALL_PRODUCTS = [
    { id: "1", name: "Waffle Textured Plush Set", price: 14.99, category: "Baby Boy", image: "/images/todler 2.jpg" },
    { id: "2", name: "Ribbed Jogging Set", price: 18.50, category: "Baby Girl", image: "/images/todler 1.jpg" },
    { id: "3", name: "Purl Knit Dungarees", price: 15.99, category: "Boys", image: "/images/kid 2.jpg" },
    { id: "4", name: "Cotton Jersey Top", price: 9.99, category: "Girls", image: "/images/kid 1.jpg" },
    { id: "5", name: "Cozy Wool Sweater", price: 24.50, category: "Boys", image: "/images/kid 2.jpg" },
    { id: "6", name: "Fluffy Pink Dress", price: 29.99, category: "Girls", image: "/images/kid 1.jpg" },
    { id: "7", name: "Denim Overall", price: 19.99, category: "Baby Boy", image: "/images/todler 2.jpg" },
    { id: "8", name: "Floral Romper", price: 12.50, category: "Baby Girl", image: "/images/todler 1.jpg" },
];

const CATEGORIES = ["All Products", "Baby Boy", "Baby Girl", "Boys", "Girls"];

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [priceRange, setPriceRange] = useState(100);
    const [sortBy, setSortBy] = useState("Latest");

    const filteredProducts = ALL_PRODUCTS
        .filter(p => selectedCategory === "All Products" || p.category === selectedCategory)
        .filter(p => p.price <= priceRange)
        .sort((a, b) => {
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            return 0; // Default: Latest (stays same in mock)
        });

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-secondary py-20 px-4 text-center">
                <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">Shop</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore our latest collections of high-quality, playful clothing for your children.
                </p>
            </div>

            {/* Product Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 space-y-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Categories</h3>
                            <ul className="space-y-3">
                                {CATEGORIES.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`transition-colors font-bold ${selectedCategory === cat ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Max Price: ${priceRange}</h3>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs font-bold text-muted-foreground mt-2">
                                <span>$0</span>
                                <span>$100</span>
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                            <p className="text-muted-foreground font-medium">Showing {filteredProducts.length} results</p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white border-2 border-secondary rounded-2xl px-6 py-3 font-bold outline-none focus:border-primary transition-colors cursor-pointer"
                            >
                                <option>Latest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-secondary rounded-[3rem]">
                                <p className="text-2xl font-bold opacity-30">No products match your filters</p>
                                <button
                                    onClick={() => { setSelectedCategory("All Products"); setPriceRange(100); }}
                                    className="mt-4 text-primary font-bold underline"
                                >
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
