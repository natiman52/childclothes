"use client";

import { useState } from "react";
import { Plus, Minus, Search } from "lucide-react";

const faqs = [
    {
        category: "Orders & Shipping",
        items: [
            {
                question: "How long does shipping take?",
                answer: "Standard shipping usually takes 3-5 business days. Express shipping options are available at checkout if you need your items sooner."
            },
            {
                question: "Can I track my order?",
                answer: "Yes, once your order ships, you will receive a tracking number via email or SMS to follow its progress."
            },
            {
                question: "Do you ship internationally?",
                answer: "Currently, we ship within Ethiopia. We are working on expanding our reach to international customers soon!"
            }
        ]
    },
    {
        category: "Returns & Exchanges",
        items: [
            {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for unworn items with tags still attached. Returns are easy and free for our customers."
            },
            {
                question: "How do I exchange an item?",
                answer: "To exchange an item, please start a return for the original item and place a new order for the desired size or color."
            }
        ]
    },
    {
        category: "Product & Sizing",
        items: [
            {
                question: "How do I know what size to buy?",
                answer: "We provide a detailed size chart on every product page. If you're between sizes, we generally recommend sizing up for kids."
            },
            {
                question: "Are your clothes machine washable?",
                answer: "Most of our items are machine washable. Please check the care label on each garment for specific instructions."
            }
        ]
    }
];

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-secondary last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors group"
            >
                <span className="text-lg font-bold font-heading">{question}</span>
                <div className="flex-shrink-0 ml-4">
                    {isOpen ? <Minus className="text-primary" /> : <Plus className="group-hover:text-primary transition-colors" />}
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <p className="text-muted-foreground leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="bg-secondary py-20 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-black mb-6">How can we help?</h1>
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full px-6 py-4 rounded-full border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all pl-14"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-3xl">
                    {faqs.map((category, idx) => (
                        <div key={idx} className="mb-16 last:mb-0">
                            <h2 className="text-2xl font-heading font-extrabold mb-8 text-primary uppercase tracking-wider text-sm">
                                {category.category}
                            </h2>
                            <div className="bg-white rounded-xl">
                                {category.items.map((item, itemIdx) => (
                                    <FAQItem key={itemIdx} question={item.question} answer={item.answer} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Still have questions */}
            <section className="bg-secondary py-20 px-4 text-center">
                <div className="container mx-auto max-w-xl">
                    <h2 className="text-3xl font-heading font-extrabold mb-4">Still have questions?</h2>
                    <p className="text-muted-foreground mb-8">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-[#d46d45] transition-colors">
                            Contact Us
                        </button>
                        <button className="bg-white text-foreground border border-border px-8 py-3 rounded-md font-bold hover:bg-secondary transition-colors">
                            Live Chat
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
