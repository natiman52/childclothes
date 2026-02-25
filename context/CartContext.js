"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localstorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error("Failed to parse cart from localstorage", error);
            }
        }
    }, []);

    // Save cart to localstorage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const variantId = product.variation?.id;
            const existingIndex = prev.findIndex(
                (item) => item.id === product.id && item.variation?.id === variantId
            );

            if (existingIndex !== -1) {
                const newCart = [...prev];
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    quantity: newCart[existingIndex].quantity + (product.quantity || 1)
                };
                return newCart;
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
        setIsCartOpen(true);
    };


    const removeFromCart = (id, variationId) => {
        setCart((prev) => prev.filter((item) => !(item.id === id && item.variation?.id === variationId)));
    };

    const clearCart = () => {
        setCart([]);
    };
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity, 0);


    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
