"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear the cart when reaching the success page
        if (clearCart) clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="bg-green-100 p-6 rounded-full animate-bounce">
                        <CheckCircle size={64} className="text-green-600" />
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl font-heading font-black mb-4">Order Placed!</h1>
                    <p className="text-muted-foreground text-lg">
                        Thank you for your purchase. We&apos;ve received your order and are getting it ready for shipment.
                    </p>
                </div>

                <div className="bg-secondary p-8 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between font-bold">
                        <span>Order Number</span>
                        <span className="text-foreground">#DB-2026-X891</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Estimated Delivery</span>
                        <span className="text-foreground">3-5 Business Days</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Link href="/shop" className="btn-primary py-5 rounded-2xl justify-center text-lg w-full">
                        Continue Shopping <ArrowRight size={20} />
                    </Link>
                    <Link href="/" className="flex items-center justify-center gap-2 font-bold text-muted-foreground hover:text-foreground transition-colors">
                        <ShoppingBag size={18} /> Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
