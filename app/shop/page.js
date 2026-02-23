"use client"
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Filter, X, ChevronDown } from "lucide-react";
import { ALL_PRODUCTS } from "@/lib/utils";

const CATEGORIES = ["All Products", "Baby Boy", "Baby Girl", "Boys", "Girls"];

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [priceRange, setPriceRange] = useState(500);
    const [sortBy, setSortBy] = useState("Latest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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

            {/* Filter Toggle Button */}
            <div className="container sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-secondary py-4 px-4 flex justify-between items-center mb-4 mx-auto">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 font-bold px-6 py-3 bg-secondary rounded-2xl hover:bg-secondary/80 transition-all text-sm"
                >
                    <Filter size={18} className="text-primary" />
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </button>
                <div className="text-xs font-bold text-muted-foreground">
                    {filteredProducts.length} items
                </div>
            </div>

            {/* Product Grid Container */}
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className={`flex flex-col lg:flex-row transition-all duration-300 ${isFilterOpen ? 'lg:gap-12' : 'lg:gap-0'}`}>

                    {/* Filters Sidebar Overlay (Mobile) */}
                    {isFilterOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-[100] lg:hidden transition-opacity"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}

                    {/* Filters Sidebar */}
                    <aside className={`
                        fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-[101] p-8 shadow-2xl transition-all duration-300 
                        lg:relative lg:inset-auto lg:z-auto lg:shadow-none lg:p-0 overflow-hidden
                        ${isFilterOpen
                            ? 'translate-x-0 lg:w-64 lg:opacity-100'
                            : '-translate-x-full lg:w-0 lg:opacity-0 lg:pointer-events-none'
                        }
                    `}>
                        <div className="flex justify-between items-center mb-10 lg:hidden">
                            <h2 className="text-2xl font-heading font-black">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6">Categories</h3>
                                <ul className="space-y-4">
                                    {CATEGORIES.map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    if (window.innerWidth < 1024) setIsFilterOpen(false);
                                                }}
                                                className={`transition-colors font-bold text-lg lg:text-base ${selectedCategory === cat ? 'text-foreground' : 'text-muted-foreground hover:text-primary'}`}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex justify-between">
                                    <span>Max Price</span>
                                    <span className="text-foreground">ETB {priceRange}</span>
                                </h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="500"
                                    step="10"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs font-bold text-muted-foreground mt-4">
                                    <span>ETB 0</span>
                                    <span>ETB 500</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full lg:hidden btn-primary py-4 mt-8"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
                            <p className="hidden md:block text-muted-foreground font-medium">Showing {filteredProducts.length} results</p>
                            <div className="w-full sm:w-auto flex items-center gap-4">
                                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Sort by:</span>
                                <div className="relative flex-1 sm:flex-none">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full appearance-none bg-secondary border-none rounded-2xl px-6 py-3 font-bold outline-none ring-primary focus:ring-2 transition-all cursor-pointer pr-12"
                                    >
                                        <option>Latest</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" size={18} />
                                </div>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-secondary rounded-[3rem]">
                                <p className="text-2xl font-bold opacity-30 px-6">No products match your filters</p>
                                <button
                                    onClick={() => { setSelectedCategory("All Products"); setPriceRange(100); }}
                                    className="mt-6 btn-primary px-8"
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
