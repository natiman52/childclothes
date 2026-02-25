"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import gsap from "gsap";

export default function ProductCard({ id, name, basePrice, images, categories }) {
    const { addToCart } = useCart();
    const cardRef = useRef(null);

    const mainImage = images?.[0]?.url;
    const firstCategory = categories?.[0]?.name;

    const onMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -8,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            duration: 0.4,
            ease: "power2.out",
        });
    };

    const onMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.4,
            ease: "power2.out",
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="group bg-[#f7f7f7] rounded-[1.5rem] p-3 transition-colors hover:bg-white relative overflow-hidden"
        >
            <div className="aspect-[4/5] relative overflow-hidden rounded-2xl mb-3 bg-white/50">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 opacity-20">
                            <path d="M20 20 L80 20 L80 80 L20 80 Z" fill="currentColor" />
                            <path d="M20 30 Q50 10 80 30" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                )}

                {/* Add to cart button on hover */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart({ id, name, price: basePrice, image: mainImage, category: firstCategory });
                    }}
                    className="absolute bottom-3 right-3 bg-primary text-white p-2.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all active:scale-90 z-20"
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className="px-1 pb-1">
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{firstCategory}</p>
                <h3 className="text-lg font-heading font-bold text-foreground mb-0.5 transition-colors group-hover:text-primary leading-tight">
                    <Link href={`/product/${id}`}>{name}</Link>
                </h3>
                <p className="text-xl font-black text-foreground">ETB {parseFloat(basePrice).toFixed(0)}</p>
            </div>
        </div>
    );
}

