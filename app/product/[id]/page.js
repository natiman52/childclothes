"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus, Minus, Star, Heart, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const ALL_PRODUCTS = [
    { id: "1", name: "Waffle Textured Plush Set", price: 14.99, category: "Baby Boy", image: "/images/todler 2.jpg", description: "This waffle textured plush set is designed for maximum comfort and style. Made from premium soft cotton, it's perfect for casual wear and keeping your little one cozy throughout the day." },
    { id: "2", name: "Ribbed Jogging Set", price: 18.50, category: "Baby Girl", image: "/images/todler 1.jpg", description: "Our ribbed jogging set offers a modern look with a focus on ease of movement. The soft, stretchy fabric ensures your child stays comfortable whether playing at home or out on an adventure." },
    { id: "3", name: "Purl Knit Dungarees", price: 15.99, category: "Boys", image: "/images/kid 2.jpg", description: "Classic purl knit dungarees that combine durability with a timeless aesthetic. Features adjustable straps and reinforced stitching for active boys who love to explore." },
    { id: "4", name: "Cotton Jersey Top", price: 9.99, category: "Girls", image: "/images/kid 1.jpg", description: "A simple yet elegant cotton jersey top that's a staple for any wardrobe. Soft against the skin and easy to style with various bottoms for any occasion." },
    { id: "5", name: "Cozy Wool Sweater", price: 24.50, category: "Boys", image: "/images/kid 2.jpg", description: "Keep them warm with our cozy wool sweater. Crafted from a blend of fine wool, it provides excellent insulation without being bulky." },
    { id: "6", name: "Fluffy Pink Dress", price: 29.99, category: "Girls", image: "/images/kid 1.jpg", description: "A dreamy fluffy pink dress that's perfect for parties and special events. Multi-layered tulle and a soft lining make it as comfortable as it is beautiful." },
    { id: "7", name: "Denim Overall", price: 19.99, category: "Baby Boy", image: "/images/todler 2.jpg", description: "Rugged yet soft denim overalls designed for the smallest explorers. Practical pockets and easy-snap closures for quick changes." },
    { id: "8", name: "Floral Romper", price: 12.50, category: "Baby Girl", image: "/images/todler 1.jpg", description: "Adorable floral romper with a vintage vibe. Delicate prints and ruffled details make this a standout piece for sunny days." },
];

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const product = ALL_PRODUCTS.find((p) => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <Link href="/shop" className="btn-primary">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                {/* Breadcrumbs / Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ChevronLeft size={20} /> Back to previous
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square relative bg-[#f7f7f7] rounded-[3rem] overflow-hidden shadow-sm">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Thumbnails placeholder */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-secondary rounded-2xl border-2 border-transparent hover:border-primary transition-all cursor-pointer overflow-hidden relative">
                                    <Image src={product.image} alt="thumbnail" fill className="object-cover opacity-50 hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">{product.category}</p>
                            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-yellow-500">
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} className="text-secondary" fill="currentColor" />
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">(12 Customer Reviews)</span>
                            </div>
                        </div>

                        <p className="text-3xl font-black mb-8">${product.price.toFixed(2)}</p>

                        <div className="prose prose-slate max-w-none mb-12">
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Selection */}
                        <div className="space-y-8 mb-12">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['0-3M', '3-6M', '6-12M', '1-2Y', '2-3Y'].map((size) => (
                                        <button key={size} className="w-16 h-12 flex items-center justify-center border-2 border-secondary rounded-xl font-bold hover:border-primary transition-all active:scale-95">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-secondary rounded-2xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => addToCart({ ...product, quantity })}
                                    className="flex-1 btn-primary py-5 rounded-2xl justify-center text-lg shadow-xl shadow-primary/20"
                                >
                                    Add to cart
                                </button>

                                <button className="w-16 h-16 flex items-center justify-center border-2 border-secondary rounded-2xl hover:border-primary transition-all text-muted-foreground hover:text-primary">
                                    <Heart size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-secondary flex items-center gap-8">
                            <span className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                                <Share2 size={18} /> Share this product
                            </span>
                            <span className="text-sm font-bold opacity-60">
                                SKU: <span className="text-foreground">PRD-{id}2026</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
