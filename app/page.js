"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ALL_PRODUCTS } from "@/lib/utils";
gsap.registerPlugin(ScrollTrigger);

const FEATURED_CATEGORIES = [
  { name: "Baby Boy", slug: "baby-boy", color: "bg-[#dbebff]", image: "/images/todler 2.jpg" },
  { name: "Baby Girl", slug: "baby-girl", color: "bg-[#ffe5f1]", image: "/images/todler 1.jpg" },
  { name: "Boys", slug: "boys", color: "bg-[#d5f5e3]", image: "/images/kid 2.jpg" },
  { name: "Girls", slug: "girls", color: "bg-[#fef9e7]", image: "/images/kid 1.jpg" },
];


export default function Home() {
  const categoriesRef = useRef(null);
  const productsRef = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    const sections = [
      { ref: categoriesRef, title: "h2", grid: ".grid" },
      { ref: productsRef, title: "h2", grid: ".grid" },
      { ref: benefitsRef, grid: ".grid > div" }
    ];

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        if (!section.ref.current) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.ref.current,
            start: "top 80%",
            once: true,
          }
        });

        if (section.title) {
          tl.from(section.ref.current.querySelector(section.title), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
        }

        if (section.grid) {
          const items = section.ref.current.querySelectorAll(section.grid);
          tl.from(items, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
          }, "-=0.4");
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <Hero />

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">ሰላም ልብስ</p>
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-12">Shop by category</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className="group block"
              >
                <div className={`aspect-[4/5] ${cat.color} rounded-[2rem] overflow-hidden mb-4 transition-transform group-hover:scale-95 relative`}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover mix-blend-multiply opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white text-foreground px-4 py-2 rounded-full font-bold text-sm shadow-xl">Explore</span>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Made with love</p>
              <h2 className="text-4xl md:text-6xl font-heading font-black">Explore our <br /> collections</h2>
            </div>
            <Link href="/shop" className="btn-primary">
              View all products <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ALL_PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 border-t border-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-5xl mb-6">🚚</div>
              <h3 className="text-2xl font-heading font-bold">Fast Shipping</h3>
              <p className="text-muted-foreground leading-relaxed">We ship all orders within 2-5 business days</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl mb-6">📦</div>
              <h3 className="text-2xl font-heading font-bold">Free shipping</h3>
              <p className="text-muted-foreground leading-relaxed">For all orders over ETB 5000</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl mb-6">💌</div>
              <h3 className="text-2xl font-heading font-bold">Happy to help you</h3>
              <p className="text-muted-foreground leading-relaxed">Any question? We are happy to help you by telegram</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
