"use client";

import { create } from "zustand";

export const useUserStore = create((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, isAuthenticated: true });
        } else {
            localStorage.removeItem("user");
            set({ user: null, isAuthenticated: false });
        }
    },

    logout: () => {
        localStorage.removeItem("user");
        set({ user: null, isAuthenticated: false });
    },

    hydrate: () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                set({ user, isAuthenticated: true });
            } catch (e) {
                console.error("Failed to hydrate user", e);
                localStorage.removeItem("user");
            }
        }
    }
}));
