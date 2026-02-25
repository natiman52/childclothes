"use client"
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function Hydrater() {
    const { hydrate, user } = useUserStore();
    useEffect(() => {
        hydrate();
    }, [user]);
    return null;
}