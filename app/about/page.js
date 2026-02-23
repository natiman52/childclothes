"use client";

import Image from "next/image";
import { Heart, ShieldCheck, Sparkles, Truck } from "lucide-react";

const values = [
    {
        icon: <Heart className="text-primary" size={32} />,
        title: "Made with Love",
        description: "Every garment is chosen and handled with the utmost care for your little ones."
    },
    {
        icon: <ShieldCheck className="text-primary" size={32} />,
        title: "Premium Quality",
        description: "We use only the finest, softest fabrics that are safe and comfortable for delicate skin."
    },
    {
        icon: <Sparkles className="text-primary" size={32} />,
        title: "Playful Designs",
        description: "Our clothes are designed to inspire joy and imagination in every child's world."
    },
    {
        icon: <Truck className="text-primary" size={32} />,
        title: "Reliable Service",
        description: "Fast shipping and easy returns because we know parents are busy enough already."
    }
];

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center bg-secondary overflow-hidden">
                <div className="container mx-auto px-4 text-center z-10">
                    <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 animate-in slide-in-from-bottom duration-700">
                        Our Story.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom duration-1000">
                        Designing a world where every child feels premium, comfortable, and most importantly, happy.
                    </p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
            </section>

            {/* Mission Section */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Our Mission</h2>
                    <h3 className="text-3xl md:text-4xl font-heading font-extrabold mb-8">
                        Modern clothing for the modern child.
                    </h3>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                        De Bébé was born from a simple observation: children's clothing should be as durable as it is beautiful. We believe that childhood is a time of exploration, and clothes should never get in the way of a good adventure.
                    </p>
                    <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary">
                            <p className="font-bold">Our Workshop Placeholder</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="bg-secondary py-24 px-4">
                <div className="container mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Why De Bébé?</h2>
                        <h3 className="text-3xl md:text-4xl font-heading font-extrabold">Our core values guide everything we do.</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-6">{value.icon}</div>
                                <h4 className="text-xl font-heading font-bold mb-4">{value.title}</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 px-4 text-center">
                <div className="container mx-auto max-w-2xl">
                    <h2 className="text-3xl font-heading font-extrabold mb-8 italic">"Building the foundation of a lifetime, one outfit at a time."</h2>
                    <p className="text-muted-foreground mb-12">- The De Bébé Team</p>
                    <button className="btn-primary py-4 px-10 text-lg">
                        Shop Our Collection
                    </button>
                </div>
            </section>
        </div>
    );
}
