"use client";

import { Search, Filter, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function OrderHistoryPage() {
    const router = useRouter();
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ["admin-orders-history"],
        queryFn: async () => {
            const { data } = await api.get("/admin/orders");
            // Filter only delivered and returned orders
            return data.filter(order => order.status === "DELIVERED" || order.status === "RETURNED");
        },
        refetchInterval: 60000
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-heading font-black">Order History</h1>
                    <p className="text-muted-foreground text-sm font-bold mt-1">Review completed and returned orders</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input type="text" placeholder="Search order history..." className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-primary" />
                    </div>
                    <button className="p-2.5 bg-white border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 text-muted-foreground text-sm border-b border-border">
                                <th className="p-4 font-bold">Order ID</th>
                                <th className="p-4 font-bold">Customer</th>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Total</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-muted-foreground">No historical orders found.</td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                                    className="border-b border-border hover:bg-secondary/20 transition-colors cursor-pointer"
                                >
                                    <td className="p-4 font-bold text-foreground">#{order.id.slice(-8).toUpperCase()}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-foreground">{order.user?.username || "Guest User"}</p>
                                        <p className="text-xs text-muted-foreground">{order.user?.phone || "N/A"}</p>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold">ETB {Number(order.totalPrice).toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-muted-foreground hover:text-primary transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
