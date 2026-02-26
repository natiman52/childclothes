"use client";

import { create } from "zustand";

export const useShopStore = create((set) => ({
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),
}));
