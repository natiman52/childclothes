"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import gsap from "gsap";

export default function ProductCard({ id, name, price, image, category }) {
    const { addToCart } = useCart();
    const cardRef = useRef(null);

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
            className="group bg-[#f7f7f7] rounded-[2rem] p-4 transition-colors hover:bg-white relative overflow-hidden"
        >
            <div className="aspect-square relative overflow-hidden rounded-3xl mb-4 bg-white/50">
                {image ? (
                    <Image
                        src={image}
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
                        addToCart({ id, name, price, image, category });
                    }}
                    className="absolute bottom-4 right-4 bg-primary text-white p-4 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all active:scale-90 z-20"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="px-2 pb-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{category}</p>
                <h3 className="text-xl font-heading font-bold text-foreground mb-1 transition-colors group-hover:text-primary">
                    <Link href={`/product/${id}`}>{name}</Link>
                </h3>
                <p className="text-2xl font-black text-foreground">ETB {price.toFixed(2)}</p>
            </div>
        </div>
    );
}
