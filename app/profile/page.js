"use client";

import { useState, useEffect } from "react";
import { User, Package, MapPin, Settings, LogOut, Camera, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const { user, logout } = useUserStore();
    const [editData, setEditData] = useState({
        photo: "",
        city: "",
        subcity: "",
        neighborhood: ""
    });

    useEffect(() => {
        if (user != null) {
            setEditData({
                photo: user.photo || "",
                city: user.address?.city || "Addis Ababa",
                subcity: user.address?.subcity || "Bole",
                neighborhood: user.address?.neighborhood || ""
            });
        } else {
            router.push("/login");
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    ...editData
                })
            });

            const data = await res.json();

            if (res.ok) {
                const updatedUser = { ...user, ...data.user };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSuccess("Profile updated successfully!");
                setIsEditing(false);
            } else {
                setError(data.error || "Failed to update profile");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="min-h-screen bg-secondary flex items-center justify-center font-bold">Loading...</div>;

    return (
        <div className="bg-secondary min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-black text-foreground">My Account</h1>
                    {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm animate-bounce">{success}</div>}
                    {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm">{error}</div>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === "overview" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-white/80 border border-border"}`}
                        >
                            <User size={18} /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === "orders" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-white/80 border border-border"}`}
                        >
                            <Package size={18} /> Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === "addresses" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-white/80 border border-border"}`}
                        >
                            <MapPin size={18} /> Addresses
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-red-500 hover:bg-red-50 transition-colors border border-red-100" onClick={handleLogout}>
                            <LogOut size={18} /> Sign Out
                        </button>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Profile Header */}
                                <div className="bg-white p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden border-4 border-secondary">
                                        {user.photo ? (
                                            <img src={user.photo} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={48} strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-2xl font-heading font-extrabold">{user.username}</h2>
                                        <p className="text-muted-foreground">{user.phone}</p>
                                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                            <div className="px-4 py-2 bg-secondary rounded-full text-sm font-bold">New Member</div>
                                            <div className="px-4 py-2 bg-secondary rounded-full text-sm font-bold capitalize">{user.role}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn-primary py-2 px-6"
                                    >
                                        Edit Profile
                                    </button>
                                </div>

                                {isEditing && (
                                    <div className="bg-white p-8 rounded-xl border-2 border-primary shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                                                <Settings className="text-primary" /> Update Profile Info
                                            </h3>
                                            <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                                        <Camera size={16} /> Photo URL
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editData.photo}
                                                        onChange={(e) => setEditData({ ...editData, photo: e.target.value })}
                                                        placeholder="https://example.com/photo.jpg"
                                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                                        <MapPin size={16} /> City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editData.city}
                                                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                                        placeholder="City"
                                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                                        <MapPin size={16} /> Subcity
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editData.subcity}
                                                        onChange={(e) => setEditData({ ...editData, subcity: e.target.value })}
                                                        placeholder="Subcity"
                                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                                        <MapPin size={16} /> Neighborhood
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editData.neighborhood}
                                                        onChange={(e) => setEditData({ ...editData, neighborhood: e.target.value })}
                                                        placeholder="Neighborhood"
                                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {loading ? "Saving..." : <><Save size={20} /> Save Changes</>}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Quick Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                                        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                                            <Package size={20} className="text-primary" /> Recent Activity
                                        </h3>
                                        <div className="p-4 bg-secondary rounded-lg text-center py-10">
                                            <p className="text-muted-foreground font-bold">No recent orders yet.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                                        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                                            <MapPin size={20} className="text-primary" /> Current Address
                                        </h3>
                                        <div className="p-4 bg-secondary rounded-lg">
                                            {user.address ? (
                                                <p className="text-foreground font-bold leading-relaxed">
                                                    {user.address.city}, {user.address.subcity}<br />
                                                    {user.address.neighborhood}
                                                </p>
                                            ) : (
                                                <p className="text-muted-foreground font-bold italic">No address added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="bg-white rounded-xl border border-border shadow-sm p-10 text-center">
                                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                                <h2 className="text-xl font-heading font-extrabold mb-2">No Orders Found</h2>
                                <p className="text-muted-foreground font-bold mb-6">You haven't placed any orders yet.</p>
                                <button onClick={() => router.push("/shop")} className="btn-primary py-3 px-8">Start Shopping</button>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-heading font-extrabold text-foreground">Managed Addresses</h2>
                                </div>
                                <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
                                    {user.address ? (
                                        <div className="border-2 border-primary p-6 rounded-xl relative">
                                            <div className="absolute top-4 right-4 text-xs font-bold bg-primary text-white px-2 py-1 rounded">DEFAULT</div>
                                            <h3 className="font-bold mb-2">Shipping Address</h3>
                                            <p className="text-muted-foreground font-bold mb-4">
                                                {user.address.city}, {user.address.subcity}<br />
                                                {user.address.neighborhood}
                                            </p>
                                            <button onClick={() => { setActiveTab("overview"); setIsEditing(true); }} className="text-sm font-bold border-b border-foreground">Edit</button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-muted-foreground font-bold mb-4">No addresses saved.</p>
                                            <button onClick={() => { setActiveTab("overview"); setIsEditing(true); }} className="btn-primary py-2 px-6">Add Address</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
