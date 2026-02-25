"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading amazing clothes...</p>
        </div>
    );
}
