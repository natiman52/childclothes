"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ShinyText from "./ShinyText";
export default function LoadingScreen() {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => setIsVisible(false),
            });

            tl.fromTo(
                textRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            )
                .to(textRef.current, {
                    y: -10,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.in",
                    delay: 0.4,
                })
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut",
                });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[999] bg-foreground flex items-center justify-center pointer-events-none"
        >
            <div ref={textRef} className="text-white text-4xl md:text-6xl font-heading font-black tracking-tighter">
                <ShinyText text="ሰላም ልብስ" />
            </div>
        </div>
    );
}
