"use client"
import { useState } from "react";
import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
    const { cartCount, setIsCartOpen } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-secondary">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
                {/* Mobile Menu / Search Toggle */}
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="lg:hidden text-foreground p-2 hover:bg-secondary rounded-full transition-colors"
                >
                    {isSearchOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link href="/" className="text-3xl font-heading font-black tracking-tighter text-foreground flex-shrink-0">
                    ሰላም ልብስ
                </Link>

                {/* Desktop Search Bar */}
                <div className="hidden sm:flex flex-1 max-w-xl relative">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="w-full bg-secondary border-none rounded-full py-2 px-6 pl-12 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="p-2 hover:bg-secondary rounded-full border border-secondary transition-colors hidden md:block">
                        <Heart size={20} />
                    </button>
                    <Link href="/login" className="p-2 hover:bg-secondary rounded-full border border-secondary transition-colors">
                        <User size={20} />
                    </Link>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="p-2 hover:bg-secondary rounded-full border border-secondary transition-colors relative"
                    >
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar Dropdown */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-secondary ${isSearchOpen ? 'max-height-20 opacity-100 py-4 px-4' : 'max-h-0 opacity-0'}`}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search our collection..."
                        className="w-full bg-secondary border-none rounded-full py-3 px-6 pl-12 focus:ring-2 focus:ring-primary outline-none transition-all"
                        autoFocus={isSearchOpen}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                </div>
            </div>

            <style jsx>{`
                .max-height-20 {
                    max-height: 5rem;
                }
            `}</style>

            <CartDrawer />
        </nav>
    );
}
