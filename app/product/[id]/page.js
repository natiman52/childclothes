"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus, Minus, Star, Heart, Share2, ShoppingBag } from "lucide-react";
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
    const [activeTab, setActiveTab] = useState("description");

    const product = ALL_PRODUCTS.find((p) => p.id === id);

    const reviews = [
        { id: 1, user: "Elena M.", rating: 5, date: "Feb 10, 2026", comment: "The quality is amazing! The fabric is so soft for my baby's skin. Definitely worth the price." },
        { id: 2, user: "Mark R.", rating: 4, date: "Jan 25, 2026", comment: "Great fit and beautiful design. Shipping was a bit slow, but the product is excellent." },
        { id: 3, user: "Sarah T.", rating: 5, date: "Jan 12, 2026", comment: "Absolutely love this set! It's even cuter in person. Will be buying more colors." }
    ];

    const questions = [
        { id: 1, user: "Jessica W.", date: "Feb 05, 2026", question: "Is this item true to size?", answer: "Yes! Most customers find it fits perfectly. We recommend check the size chart if you're unsure." },
        { id: 2, user: "David L.", date: "Jan 30, 2026", question: "What is the material composition?", answer: "This set is made from 100% organic waffle-weave cotton." }
    ];

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
            <div className="container mx-auto px-4 py-8 md:py-12">
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
                        <div className="aspect-square relative bg-[#f7f7f7] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-sm">
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
                                <div key={i} className="aspect-square bg-secondary rounded-xl md:rounded-2xl border-2 border-transparent hover:border-primary transition-all cursor-pointer overflow-hidden relative">
                                    <Image src={product.image} alt="thumbnail" fill className="object-cover opacity-50 hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6 md:mb-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">{product.category}</p>
                            <h1 className="text-3xl md:text-5xl font-heading font-black mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-yellow-500">
                                    <Star size={18} fill="currentColor" />
                                    <Star size={18} fill="currentColor" />
                                    <Star size={18} fill="currentColor" />
                                    <Star size={18} fill="currentColor" />
                                    <Star size={18} className="text-secondary" fill="currentColor" />
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">({reviews.length} Customer Reviews)</span>
                            </div>
                        </div>

                        <p className="text-2xl md:text-3xl font-black mb-6 md:mb-8">ETB {product.price.toFixed(2)}</p>

                        {/* Selection */}
                        <div className="space-y-6 md:space-y-8 mb-10 md:mb-12">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Select Size</h3>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {['0-3M', '3-6M', '6-12M', '1-2Y', '2-3Y'].map((size) => (
                                        <button key={size} className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center border-2 border-secondary rounded-xl font-bold hover:border-primary transition-all active:scale-95 text-sm md:text-base">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="flex items-center bg-secondary rounded-2xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-8 md:w-12 text-center font-black text-lg md:text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => addToCart({ ...product, quantity })}
                                    className="flex-1 btn-primary py-4 md:py-5 rounded-2xl justify-center text-base md:text-lg shadow-xl shadow-primary/20"
                                >
                                    <span className="hidden sm:inline">Add to cart</span>
                                    <ShoppingBag className="sm:hidden" size={24} />
                                </button>

                                <button className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 border-secondary rounded-2xl hover:border-primary transition-all text-muted-foreground hover:text-primary">
                                    <Heart size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 md:pt-8 border-t border-secondary flex items-center gap-6 md:gap-8">
                            <span className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                                <Share2 size={18} /> <span className="hidden sm:inline">Share this product</span>
                            </span>
                            <span className="text-sm font-bold opacity-60">
                                SKU: <span className="text-foreground">PRD-{id}2026</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16 md:mt-24">
                    <div className="flex border-b border-secondary mb-10 overflow-x-auto no-scrollbar">
                        {["description", "reviews", "questions"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 font-heading font-black text-lg capitalize transition-all relative whitespace-nowrap ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl">
                        {activeTab === "description" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-2xl font-heading font-bold mb-6">Product Details</h3>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                                        {product.description}
                                    </p>
                                    <ul className="space-y-3 text-muted-foreground text-lg list-disc pl-5">
                                        <li>Premium organic cotton blend</li>
                                        <li>Breathable waffle-texture fabric</li>
                                        <li>Reinforced seams for active play</li>
                                        <li>Machine washable and pre-shrunk</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-heading font-bold">What parents are saying</h3>
                                    <button className="btn-primary py-2 px-6 text-sm">Write Review</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                    <div className="bg-secondary p-6 rounded-2xl text-center">
                                        <p className="text-4xl font-black mb-2">4.8</p>
                                        <div className="flex justify-center text-yellow-500 mb-2">
                                            <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                                        </div>
                                        <p className="text-sm font-bold text-muted-foreground">Average Rating</p>
                                    </div>
                                </div>
                                {reviews.map((review) => (
                                    <div key={review.id} className="p-8 bg-secondary/30 rounded-[2rem] border border-secondary">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="font-heading font-black text-lg mb-1">{review.user}</p>
                                                <div className="flex text-yellow-500 gap-1">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} size={14} fill="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-muted-foreground opacity-60">{review.date}</span>
                                        </div>
                                        <p className="text-muted-foreground text-lg leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "questions" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-heading font-bold">Community Q&A</h3>
                                    <button className="btn-primary py-2 px-6 text-sm">Ask Question</button>
                                </div>
                                {questions.map((q) => (
                                    <div key={q.id} className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">Q</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg mb-1">{q.question}</p>
                                                <div className="flex gap-3 text-xs font-bold text-muted-foreground opacity-60">
                                                    <span>{q.user}</span>
                                                    <span>{q.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pl-4 md:pl-8">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-black text-xs">A</div>
                                            <p className="flex-1 text-muted-foreground leading-relaxed italic border-l-2 border-secondary pl-6">
                                                {q.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
