"use client";

import { useState } from "react";
import { User, Package, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

const dummyUser = {
    name: "Sarah Johnson",
    phone: "+1 (708) 555-0123",
    orders: [
        { id: "ORD-7234", date: "Feb 15, 2026", status: "Delivered", total: "$84.00", items: 3 },
        { id: "ORD-9102", date: "Jan 28, 2026", status: "Delivered", total: "$126.50", items: 5 },
        { id: "ORD-1156", date: "Jan 10, 2026", status: "Delivered", total: "$45.00", items: 2 }
    ],
    addresses: [
        { id: 1, type: "Default Shipping", street: "123 Maple Avenue", city: "Oak Park", state: "IL", zip: "60302" }
    ]
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="bg-secondary min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-heading font-black mb-8 text-foreground">My Account</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === "overview" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-white/80 border border-border"
                                }`}
                        >
                            <User size={18} /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === "orders" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-white/80 border border-border"
                                }`}
                        >
                            <Package size={18} /> Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === "addresses" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-white/80 border border-border"
                                }`}
                        >
                            <MapPin size={18} /> Addresses
                        </button>
                        <button
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold bg-white text-foreground hover:bg-white/80 border border-border transition-colors"
                        >
                            <Settings size={18} /> Settings
                        </button>
                        <button
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-red-500 hover:bg-red-50 transition-colors border border-red-100"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Profile Header */}
                                <div className="bg-white p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <User size={48} strokeWidth={1.5} />
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-2xl font-heading font-extrabold">{dummyUser.name}</h2>
                                        <p className="text-muted-foreground">{dummyUser.phone}</p>
                                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                            <div className="px-4 py-2 bg-secondary rounded-full text-sm font-bold">3 Orders</div>
                                            <div className="px-4 py-2 bg-secondary rounded-full text-sm font-bold">Bronze Member</div>
                                        </div>
                                    </div>
                                    <button className="btn-primary py-2 px-6">Edit Profile</button>
                                </div>

                                {/* Quick Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                                        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                                            <Package size={20} className="text-primary" /> Recent Order
                                        </h3>
                                        <div className="p-4 bg-secondary rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold">{dummyUser.orders[0].id}</span>
                                                <span className="text-sm text-green-600 font-bold">{dummyUser.orders[0].status}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{dummyUser.orders[0].date} • {dummyUser.orders[0].total}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                                        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                                            <MapPin size={20} className="text-primary" /> Default Address
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {dummyUser.addresses[0].street}<br />
                                            {dummyUser.addresses[0].city}, {dummyUser.addresses[0].state} {dummyUser.addresses[0].zip}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h2 className="text-xl font-heading font-extrabold">Order History</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-secondary text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                                <th className="px-6 py-4">Order ID</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Items</th>
                                                <th className="px-6 py-4">Total</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {dummyUser.orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                                                    <td className="px-6 py-4 font-bold">{order.id}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">{order.items} items</td>
                                                    <td className="px-6 py-4 font-bold">{order.total}</td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-primary hover:underline font-bold flex items-center gap-1">
                                                            View <ChevronRight size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-heading font-extrabold text-foreground">Managed Addresses</h2>
                                    <button className="btn-primary py-2 text-sm">+ Add New Address</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {dummyUser.addresses.map((address) => (
                                        <div key={address.id} className="bg-white p-6 rounded-xl border-2 border-primary shadow-sm relative">
                                            <div className="absolute top-4 right-4 text-xs font-bold bg-primary text-white px-2 py-1 rounded">DEFAULT</div>
                                            <h3 className="font-bold mb-2">{address.type}</h3>
                                            <p className="text-muted-foreground mb-4">
                                                {address.street}, {address.city}, {address.state} {address.zip}
                                            </p>
                                            <div className="flex gap-4">
                                                <button className="text-sm font-bold border-b border-foreground">Edit</button>
                                                <button className="text-sm font-bold text-red-500">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
