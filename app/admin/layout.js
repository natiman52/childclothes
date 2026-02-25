"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PackageSearch, Users, ShoppingBag, LayoutDashboard, LogOut, Tag, ShieldAlert, History, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isHydrated } = useUserStore();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isHydrated) {
            if (user?.role === "ADMIN") {
                setIsAuthorized(true);
            } else {
                router.push("/");
            }
        }
    }, [user, isHydrated, router]);

    const links = [
        { href: "/admin/orders/active", label: "Active Orders", icon: <ShoppingBag size={20} /> },
        { href: "/admin/orders/history", label: "Order History", icon: <History size={20} /> },
        { href: "/admin/products", label: "Products", icon: <PackageSearch size={20} /> },
        { href: "/admin/categories", label: "Categories", icon: <Tag size={20} /> },
        { href: "/admin/users", label: "Users", icon: <Users size={20} /> },
        { href: "/admin/hero", label: "Hero Content", icon: <Sparkles size={20} /> },
    ];

    if (!isHydrated || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner />
                    <p className="font-bold text-muted-foreground animate-pulse">Checking Authorization...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-border md:min-h-screen flex flex-col">
                <div className="p-6 border-b border-border">
                    <Link href="/admin" className="flex items-center gap-2 text-xl font-heading font-black text-primary">
                        <LayoutDashboard size={24} /> Admin Panel
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto hidden md:block">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === link.href ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile horizontal nav */}
                <nav className="flex md:hidden overflow-x-auto p-4 gap-2 bg-white border-b border-border">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${pathname === link.href ? 'bg-primary text-white shadow-md' : 'bg-secondary text-muted-foreground'}`}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border mt-auto hidden md:block">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all">
                        <LogOut size={20} /> Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
