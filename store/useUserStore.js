"use client";

import { create } from "zustand";

export const useUserStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isHydrated: false,
    setUser: (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, isAuthenticated: true });
        }
    },

    logout: () => {
        localStorage.removeItem("user");
        set({ user: null, isAuthenticated: false });
    },

    hydrate: () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && !get().isHydrated) {
            try {
                const user = JSON.parse(storedUser);
                set({ user, isAuthenticated: true });
            } catch (e) {
                console.error("Failed to hydrate user", e);
                localStorage.removeItem("user");
            }
        }
        set({ isHydrated: true });
    }
}));
