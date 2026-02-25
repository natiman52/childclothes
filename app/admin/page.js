"use client";

import { useEffect } from "react";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/admin/orders/active");
    }, [router]);

    return <LoadingSpinner />;
}
