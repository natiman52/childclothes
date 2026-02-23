"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { ChevronLeft, ShoppingBag, Truck, MapPin, Phone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { useUserStore } from "@/store/useUserStore";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [orderDone, setOrderDone] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login?redirect=/checkout");
        }
    }, [user, router]);


    const handlePlaceOrder = async () => {
        if (!user || cart.length === 0) return;

        setLoading(true);
        try {
            const orderItems = cart.map(item => ({
                productId: item.id,
                variationId: item.variation?.id,
                quantity: item.quantity,
                price: item.price
            }));

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    items: orderItems
                })
            });

            if (res.ok) {
                setOrderDone(true);
                clearCart();
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Place order error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (orderDone) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-bounce text-primary">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 text-center">Order Placed!</h1>
                <p className="text-muted-foreground text-center max-w-md mb-12 text-lg">
                    Thank you for your order. We will call you soon at <span className="font-bold text-foreground">{user?.phone}</span> to confirm your delivery.
                </p>
                <Link href="/shop" className="btn-primary px-12 py-4 rounded-2xl text-lg shadow-xl shadow-primary/20">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (cart.length === 0 && !loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/shop" className="btn-primary">Go to Shop</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <Link href="/shop" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-bold">
                    <ChevronLeft size={20} /> Back to shop
                </Link>

                <h1 className="text-4xl md:text-6xl font-heading font-black mb-12">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Info */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Delivery Info */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-secondary/50">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-secondary rounded-2xl text-primary">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-2xl font-heading font-bold">Delivery Address</h2>
                            </div>

                            {user?.address ? (
                                <div className="space-y-2 opacity-80">
                                    <p className="text-xl font-bold">{user.username}</p>
                                    <p className="text-lg">{user.address.city}, {user.address.subcity}</p>
                                    <p className="text-lg">{user.address.neighborhood}</p>
                                    <div className="flex items-center gap-2 text-primary font-bold pt-4">
                                        <Phone size={18} /> {user.phone}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-secondary/50 rounded-2xl border-2 border-dashed border-secondary text-center">
                                    <p className="font-bold mb-4">No address saved</p>
                                    <Link href="/profile" className="text-primary font-black underline">Add address in Profile</Link>
                                </div>
                            )}
                        </div>

                        {/* Payment Note */}
                        <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/20">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary text-white rounded-2xl">
                                    <Truck size={24} />
                                </div>
                                <h2 className="text-2xl font-heading font-bold">Pay on Delivery</h2>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                No online payment needed today! Once you place the order, our team will call you at <span className="font-bold text-foreground">{user?.phone}</span> to confirm the items and schedule delivery. You will pay when you receive your items.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-secondary sticky top-24">
                            <h2 className="text-2xl font-heading font-bold mb-8">Order Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.variation?.id || 'def'}`} className="flex gap-4">
                                        <div className="w-20 h-20 bg-secondary rounded-2xl overflow-hidden relative flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-bold line-clamp-1">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {item.variation && `${item.variation.size} ${item.variation.color || ''}`}
                                            </p>
                                            <p className="font-black text-primary">ETB {parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-secondary">
                                <div className="flex justify-between text-muted-foreground font-bold">
                                    <span>Subtotal</span>
                                    <span>ETB {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground font-bold">
                                    <span>Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-2xl font-heading font-bold">Total</span>
                                    <span className="text-4xl font-black text-primary">ETB {cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !user?.address}
                                className={`w-full btn-primary py-6 rounded-[1.5rem] mt-10 text-xl shadow-2xl shadow-primary/20 ${loading && 'opacity-70 pointer-events-none'}`}
                            >
                                {loading ? "Placing Order..." : "Place Order"}
                            </button>

                            {!user?.address && (
                                <p className="text-center text-red-500 text-sm font-bold mt-4 animate-bounce">
                                    Please add a delivery address to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
