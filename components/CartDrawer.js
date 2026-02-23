"use client";

import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
    const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300",
                    isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-300 transform",
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-secondary flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="text-primary" />
                            <h2 className="text-2xl font-heading font-black">Shopping Cart</h2>
                        </div>
                        <button onClick={() => setIsCartOpen(false)} className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mb-6 opacity-40">
                                    <ShoppingBag size={48} />
                                </div>
                                <p className="text-xl font-heading font-bold mb-2">Your cart is empty</p>
                                <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any <br /> items to the cart yet.</p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="btn-primary"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {cart.map((item) => (
                                    <li key={item.id} className="flex gap-4 group">
                                        <div className="w-24 h-24 bg-secondary rounded-2xl flex-shrink-0 relative overflow-hidden border border-secondary shadow-sm">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-2xl text-muted-foreground/30">👕</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="font-heading font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                                            <p className="text-muted-foreground font-medium mb-2">{item.category}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-black">ETB {item.price.toFixed(2)} x {item.quantity}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-muted-foreground hover:text-destructive p-2 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-6 border-t border-secondary bg-[#fcfcfc]">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-muted-foreground font-medium">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xl font-heading font-bold">Total</span>
                                <span className="text-3xl font-black text-primary">ETB {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Link href="/checkout/success" onClick={() => setIsCartOpen(false)}>
                            <button
                                className="w-full btn-primary justify-center text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
                                disabled={cart.length === 0}
                            >
                                Secure Checkout
                            </button>
                        </Link>
                        <p className="text-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-4">
                            Free shipping on orders over ETB 5000
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
