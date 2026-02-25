"use client";

import { useState, useEffect } from "react";
import { User, Package, MapPin, Settings, LogOut, Camera, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useUploadThing } from "@/app/utils/uploadthing";
import Image from "next/image";
import { format } from "date-fns";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const { user, logout, setUser } = useUserStore();
    const [editData, setEditData] = useState({
        photo: "",
        city: "",
        subcity: "",
        neighborhood: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (user != null) {
            setEditData({
                photo: user?.photo || "",
                city: user?.address?.city || "Addis Ababa",
                subcity: user?.address?.subcity || "Bole",
                neighborhood: user?.address?.neighborhood || ""
            });
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            const photoUrl = res[0].url;
            performUpdate(photoUrl);
        },
        onUploadError: (err) => {
            setError(`Failed to upload photo: ${err.message}`);
            setLoading(false);
        },
        headers: () => {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (selectedFile) {
            await startUpload([selectedFile]);
        } else {
            await performUpdate();
        }
    };

    const performUpdate = async (uploadedPhotoUrl) => {
        try {
            const finalData = {
                userId: user.id,
                ...editData
            };
            if (uploadedPhotoUrl) finalData.photo = uploadedPhotoUrl;

            const { data } = await axios.post("/api/user/update", finalData);

            const updatedUser = { ...user, ...data.user };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setSuccess("Profile updated successfully!");
            setIsEditing(false);
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch user orders
    const { data: orders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ["user-orders", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const { data } = await api.get(`/orders?userId=${user.id}`);
            return data;
        },
        enabled: !!user?.id
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "DELIVERED": return "bg-green-100 text-green-700";
            case "ON_DELIVERY": return "bg-blue-100 text-blue-700";
            case "RETURNED": return "bg-red-100 text-red-700";
            default: return "bg-yellow-100 text-yellow-700";
        }
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, " ").toLowerCase();
    };
    console.log("profile", user);
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
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden border-4 border-secondary relative group/profile">
                                        {user.photo ? (
                                            <Image src={user.photo} alt={user.username} fill className="object-cover" />
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
                                                <div className="space-y-2 flex flex-col items-center justify-center">
                                                    <div className="relative w-32 h-32 bg-secondary rounded-full overflow-hidden border-4 border-primary/20 group/edit-avatar">
                                                        {previewUrl ? (
                                                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                                        ) : editData.photo ? (
                                                            <Image src={editData.photo} alt="Current" fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                                <User size={48} />
                                                            </div>
                                                        )}
                                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/edit-avatar:opacity-100 transition-opacity cursor-pointer">
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                            <Camera size={24} className="text-white" />
                                                        </label>
                                                        {previewUrl && (
                                                            <button
                                                                type="button"
                                                                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full z-10"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Change Profile Picture</p>
                                                    {selectedFile && (
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">New Image Queued</span>
                                                    )}
                                                </div>
                                                <div className="md:grid md:grid-cols-1 gap-4 space-y-4">
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
                                        {ordersLoading ? (
                                            <div className="p-4 bg-secondary rounded-lg text-center animate-pulse">Loading orders...</div>
                                        ) : orders.length > 0 ? (
                                            <div className="space-y-3">
                                                {orders.slice(0, 3).map((order) => (
                                                    <div key={order.id} className="p-3 bg-secondary rounded-lg flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-sm">Order #{order.id.slice(-6)}</p>
                                                            <p className="text-[10px] text-muted-foreground font-bold uppercase">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(order.status)}`}>
                                                            {formatStatus(order.status)}
                                                        </span>
                                                    </div>
                                                ))}
                                                {orders.length > 3 && (
                                                    <button onClick={() => setActiveTab("orders")} className="w-full text-center text-xs font-bold text-primary hover:underline">View All Orders</button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-secondary rounded-lg text-center py-10">
                                                <p className="text-muted-foreground font-bold">No recent orders yet.</p>
                                            </div>
                                        )}
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
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-heading font-extrabold text-foreground">Order History</h2>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">{orders.length} TOTAL</span>
                                </div>

                                {ordersLoading ? (
                                    <div className="bg-white rounded-xl border border-border p-10 text-center animate-pulse">
                                        <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                                        <p className="text-muted-foreground font-bold">Loading your orders...</p>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:border-primary transition-colors">
                                                <div className="p-6">
                                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-black text-lg">Order #{order.id}</h3>
                                                            </div>
                                                            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                                                                Placed on: {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                                                {formatStatus(order.status)}
                                                            </span>
                                                            <p className="text-xl font-heading font-black text-primary">ETB {parseFloat(order.totalPrice).toLocaleString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-secondary pt-6">
                                                        <div className="flex -space-x-4 overflow-hidden mb-4">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="relative w-12 h-12 rounded-lg border-2 border-white bg-secondary overflow-hidden shadow-sm">
                                                                    {item.product?.images?.[0]?.url ? (
                                                                        <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">?</div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {order.items.length > 1 && (
                                                                <div className="ml-6 flex items-center text-xs font-bold text-muted-foreground">
                                                                    + {order.items.length - 1} more items
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <p className="text-muted-foreground font-bold">{order.totalQuantity} items</p>
                                                            <button className="text-primary font-black flex items-center gap-1 hover:underline">
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-border shadow-sm p-14 text-center">
                                        <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                                        <h2 className="text-xl font-heading font-extrabold mb-2">No Orders Found</h2>
                                        <p className="text-muted-foreground font-bold mb-6">You haven't placed any orders yet.</p>
                                        <button onClick={() => router.push("/shop")} className="btn-primary py-3 px-8">Start Shopping</button>
                                    </div>
                                )}
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
