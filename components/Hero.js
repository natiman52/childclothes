"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);
    const badgeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance animations
            gsap.from(textRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
            });

            gsap.from(imageRef.current, {
                x: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.2,
            });

            gsap.from(badgeRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: 0.8,
            });

            // Floating animation for badge
            gsap.to(badgeRef.current, {
                y: -15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative bg-secondary overflow-hidden">
            <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center min-h-[700px]">
                {/* Text Content */}
                <div ref={textRef} className="w-full md:w-1/2 z-10 text-center md:text-left space-y-6">
                    <p className="text-primary font-bold tracking-widest uppercase text-sm">Spring / 2026</p>
                    <h1 className="text-5xl md:text-7xl font-heading font-black leading-tight text-foreground">
                        New limited <br />
                        <span className="text-primary">edition collection</span> <br />
                        is here
                    </h1>
                    <div className="pt-8">
                        <Link href="/shop" className="btn-primary text-lg px-8 py-4 group">
                            Shop now <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Hero Image Container */}
                <div className="w-full md:w-1/2 relative h-[450px] md:h-[600px] mt-12 md:mt-0 flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-primary/10 rounded-full blur-3xl"></div>

                    <div ref={imageRef} className="relative w-full h-full z-10">
                        <Image
                            src="/images/tshirt.jpg"
                            alt="Hero Tshirt"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    {/* Floating badge */}
                    <div
                        ref={badgeRef}
                        className="absolute top-10 right-0 md:right-10 bg-foreground text-white p-6 rounded-3xl shadow-2xl rotate-12 hidden lg:block z-20"
                    >
                        <p className="text-sm font-bold opacity-80 mb-1 tracking-tight">Summer Favorites</p>
                        <p className="text-3xl font-black">$32.00</p>
                    </div>

                    {/* Subtle decorative circles */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl opacity-50"></div>
                    <div className="absolute top-20 left-20 w-20 h-20 bg-yellow-200/40 rounded-full blur-xl opacity-50 animate-pulse"></div>
                </div>
            </div>

            {/* Wavy bottom divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
}
