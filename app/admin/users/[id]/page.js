"use client";

import { ChevronLeft, Key, User as UserIcon, ShieldAlert, ShoppingBag, MapPin, Phone, Camera, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import { useUploadThing } from "@/app/utils/uploadthing";

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    const { data: user, isLoading } = useQuery({
        queryKey: ["admin-user", id],
        queryFn: async () => {
            const { data } = await api.get(`/admin/users/${id}`);
            return data;
        }
    });

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setRole(user.role || "");
        }
    }, [user]);

    const userUpdateMutation = useMutation({
        mutationFn: async (updateData) => {
            const { data } = await api.put(`/admin/users/${id}`, updateData);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
            if (variables.action === "reset_password") {
                alert("Password reset to 'password' successfully.");
            } else if (variables.action === "ban") {
                alert("User banned successfully.");
            } else {
                alert("User updated successfully.");
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            const photoUrl = res[0].url;
            performSave(photoUrl);
        },
        onUploadError: (err) => {
            alert(`Failed to upload profile photo: ${err.message}`);
        },
        headers: () => {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (selectedFile) {
            await startUpload([selectedFile]);
        } else {
            performSave();
        }
    };

    const performSave = (photoUrl) => {
        const payload = {
            username,
            role
        };
        if (photoUrl) payload.photo = photoUrl;
        userUpdateMutation.mutate(payload);
    };

    if (isLoading) return <LoadingSpinner />;
    if (!user) return <div className="p-8 text-center mt-20">User not found.</div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 bg-white border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-black">User Profile</h1>
                        <p className="text-muted-foreground text-sm font-bold mt-1">User ID: {id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => userUpdateMutation.mutate({ action: "ban" })}
                        disabled={userUpdateMutation.isPending || user.role === "BANNED"}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                    >
                        <ShieldAlert size={18} /> {user.role === "BANNED" ? "Banned" : "Ban User"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={userUpdateMutation.isPending || isUploading || (!selectedFile && username === user.username && role === user.role)}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-primary text-white border border-primary px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isUploading || userUpdateMutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 relative overflow-hidden border-4 border-secondary group/avatar">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            ) : user.photo ? (
                                <Image src={user.photo} alt={user.username} fill className="object-cover" />
                            ) : (
                                <UserIcon size={40} />
                            )}

                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                <Camera size={24} className="text-white" />
                            </label>

                            {previewUrl && (
                                <button
                                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full translate-x-1/4 -translate-y-1/4 hover:scale-110 transition-transform z-10"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        {selectedFile && (
                            <div className="mb-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    New Photo Queued
                                </span>
                            </div>
                        )}
                        <div className="space-y-4 text-left">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 ring-primary transition-all cursor-pointer"
                                >
                                    <option value="CLIENT">Client</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="BANNED">Banned</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border space-y-3">
                            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                <Phone size={16} className="text-primary" /> {user.phone}
                            </div>
                            {user.address && (
                                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground text-left">
                                    <MapPin size={16} className="text-primary flex-shrink-0" />
                                    <span>{user.address.city}, {user.address.subcity}<br />{user.address.neighborhood}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-heading font-black mb-4">Security</h2>
                        <p className="text-sm font-medium text-muted-foreground mb-4">Reset this user's password to "password". They will be forced to change it upon next login.</p>
                        <button
                            onClick={() => userUpdateMutation.mutate({ action: "reset_password" })}
                            disabled={userUpdateMutation.isPending}
                            className="w-full py-3 bg-secondary text-foreground hover:bg-secondary/80 border border-border rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Key size={18} /> Reset Password
                        </button>
                    </div>
                </div>

                {/* Right Column - Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <p className="text-sm font-bold text-muted-foreground mb-1">Total Orders</p>
                            <p className="text-3xl font-heading font-black text-primary">{user._count?.orders || 0}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <p className="text-sm font-bold text-muted-foreground mb-1">Total Spent</p>
                            <p className="text-3xl font-heading font-black text-primary">ETB {Number(user.totalSpent).toFixed(2) || "0.00"}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <p className="text-sm font-bold text-muted-foreground mb-1">Joined</p>
                            <p className="text-xl font-heading font-black text-primary mt-2">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-heading font-black mb-6 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-primary" /> Recent Orders
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-secondary/50 text-muted-foreground text-xs border-b border-border">
                                        <th className="p-3 font-bold uppercase tracking-wider">Order ID</th>
                                        <th className="p-3 font-bold uppercase tracking-wider">Date</th>
                                        <th className="p-3 font-bold uppercase tracking-wider">Status</th>
                                        <th className="p-3 font-bold uppercase tracking-wider text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium">
                                    {user.orders?.length === 0 ? (
                                        <tr><td colSpan="4" className="p-4 text-center text-muted-foreground">No recent orders.</td></tr>
                                    ) : user.orders?.map((order) => (
                                        <tr key={order.id} className="border-b border-border hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                                            <td className="p-4 font-bold text-primary">#{order.id.slice(-8).toUpperCase()}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'ON_DELIVERY' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'RETURNED' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-black text-foreground">ETB {Number(order.totalPrice).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
