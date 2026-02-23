"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus, Minus, Star, Heart, Share2, ShoppingBag, Send } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import LoadingSpinner from "@/components/LoadingSpinner";


export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const queryClient = useQueryClient();
    const user = useUserStore((state) => state.user);

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    // Review/Question form states
    const [newRating, setNewRating] = useState({ stars: 5, comment: "" });
    const [newQuestion, setNewQuestion] = useState("");

    // Fetch Product Data
    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error("Failed to fetch product");
            const data = await res.json();
            return data;
        },
        onSuccess: (data) => {
            if (data.variations?.length > 0 && !selectedVariation) {
                setSelectedVariation(data.variations[0]);
            }
        }
    });

    // Mutations
    const ratingMutation = useMutation({
        mutationFn: async (ratingData) => {
            const res = await fetch(`/api/products/${id}/ratings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ratingData)
            });
            if (!res.ok) throw new Error("Failed to add rating");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", id] });
            setNewRating({ stars: 5, comment: "" });
        }
    });

    const questionMutation = useMutation({
        mutationFn: async (questionText) => {
            const res = await fetch(`/api/products/${id}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: questionText, userId: user.id })
            });
            if (!res.ok) throw new Error("Failed to add question");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", id] });
            setNewQuestion("");
        }
    });

    // Variation auto-selection effect
    useEffect(() => {
        if (product?.variations?.length > 0 && !selectedVariation) {
            setSelectedVariation(product.variations[0]);
        }
    }, [product, selectedVariation]);

    const handleAddRating = () => {
        if (!user) {
            router.push(`/login?message=Please login to rate products`);
            return;
        }
        ratingMutation.mutate({ ...newRating, userId: user.id });
    };

    const handleAddQuestion = () => {
        if (!user) {
            router.push(`/login?message=Please login to ask questions`);
            return;
        }
        questionMutation.mutate(newQuestion);
    };

    if (isProductLoading) return <LoadingSpinner />;


    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <Link href="/shop" className="btn-primary">Back to Shop</Link>
            </div>
        );
    }

    const currentPrice = parseFloat(product.basePrice) + (selectedVariation ? parseFloat(selectedVariation.additionalPrice) : 0);


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
                            {product.images?.length > 0 ? (
                                <Image
                                    src={product.images[selectedImage].url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">No Image</div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-5 gap-3">
                            {product.images?.map((img, idx) => (
                                <div
                                    key={img.id}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square bg-secondary rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer overflow-hidden relative ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}
                                >
                                    <Image src={img.url} alt="thumbnail" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6 md:mb-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
                                {product.categories?.map(c => c.name).join(", ")}
                            </p>
                            <h1 className="text-3xl md:text-5xl font-heading font-black mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < Math.round(product.ratings?.reduce((acc, r) => acc + r.stars, 0) / product.ratings?.length || 0) ? "currentColor" : "none"} className={i < Math.round(product.ratings?.reduce((acc, r) => acc + r.stars, 0) / product.ratings?.length || 0) ? "" : "text-secondary"} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">({product.ratings?.length || 0} Customer Reviews)</span>
                            </div>
                        </div>

                        <p className="text-2xl md:text-3xl font-black mb-6 md:mb-8">ETB {currentPrice.toFixed(2)}</p>

                        {/* Selection */}
                        <div className="space-y-6 md:space-y-8 mb-10 md:mb-12">
                            {product.variations?.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Select Variation</h3>
                                    <div className="flex flex-wrap gap-2 md:gap-3">
                                        {product.variations.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariation(v)}
                                                className={`px-4 py-2 border-2 rounded-xl font-bold transition-all active:scale-95 text-sm md:text-base ${selectedVariation?.id === v.id ? 'border-primary bg-primary/5' : 'border-secondary'}`}
                                            >
                                                {v.size} {v.color && `- ${v.color}`}
                                                {v.additionalPrice > 0 && ` (+${v.additionalPrice})`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}


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
                                    onClick={() => addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: currentPrice,
                                        image: product.images?.[0]?.url,
                                        variation: selectedVariation,
                                        quantity
                                    })}
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
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                    <div className="bg-secondary p-6 rounded-2xl text-center">
                                        <p className="text-4xl font-black mb-2">
                                            {(product.ratings?.reduce((acc, r) => acc + r.stars, 0) / product.ratings?.length || 0).toFixed(1)}
                                        </p>
                                        <div className="flex justify-center text-yellow-500 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < Math.round(product.ratings?.reduce((acc, r) => acc + r.stars, 0) / product.ratings?.length || 0) ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <p className="text-sm font-bold text-muted-foreground">Average Rating</p>
                                    </div>

                                    {/* Submisson form */}
                                    <div className="md:col-span-2 bg-secondary/20 p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold">Rate:</span>
                                            <div className="flex text-yellow-500">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={24}
                                                        fill={s <= newRating.stars ? "currentColor" : "none"}
                                                        className="cursor-pointer"
                                                        onClick={() => setNewRating({ ...newRating, stars: s })}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <textarea
                                                value={newRating.comment}
                                                onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
                                                placeholder="Write your review..."
                                                className="flex-1 bg-white border-none rounded-2xl p-4 outline-none ring-primary focus:ring-2"
                                            />
                                            <button onClick={handleAddRating} className="btn-primary w-12 h-12 rounded-2xl flex items-center justify-center p-0">
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {product.ratings?.map((review) => (
                                    <div key={review.id} className="p-8 bg-secondary/30 rounded-[2rem] border border-secondary">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="font-heading font-black text-lg mb-1">{review.user?.username || "Anonymous"}</p>
                                                <div className="flex text-yellow-500 gap-1">
                                                    {[...Array(review.stars)].map((_, i) => (
                                                        <Star key={i} size={14} fill="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-muted-foreground opacity-60">{new Date(review.createdAt).toLocaleDateString()}</span>
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
                                </div>

                                {/* Ask Question Form */}
                                <div className="bg-secondary/20 p-6 rounded-3xl flex gap-4">
                                    <input
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        placeholder="Ask a question..."
                                        className="flex-1 bg-white border-none rounded-2xl p-4 outline-none ring-primary focus:ring-2 font-medium"
                                    />
                                    <button onClick={handleAddQuestion} className="btn-primary px-8 rounded-2xl">Ask</button>
                                </div>

                                {product.questions?.map((q) => (
                                    <div key={q.id} className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">Q</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg mb-1">{q.text}</p>
                                                <div className="flex gap-3 text-xs font-bold text-muted-foreground opacity-60">
                                                    <span>{q.user?.username || "Anonymous"}</span>
                                                    <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {q.answer && (
                                            <div className="flex gap-4 pl-4 md:pl-8">
                                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-black text-xs">A</div>
                                                <p className="flex-1 text-muted-foreground leading-relaxed italic border-l-2 border-secondary pl-6">
                                                    {q.answer}
                                                </p>
                                            </div>
                                        )}
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
