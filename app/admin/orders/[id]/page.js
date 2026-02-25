"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Package, User as UserIcon, Truck, MapPin, Phone, CreditCard, Save, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState("NOT_DELIVERED");
    const [shippingCost, setShippingCost] = useState(0);
    const [taxCost, setTaxCost] = useState(0);
    const [removedItemIds, setRemovedItemIds] = useState([]);

    const { data: order, isLoading } = useQuery({
        queryKey: ["admin-order", id],
        queryFn: async () => {
            const { data } = await api.get(`/admin/orders/${id}`);
            return data;
        }
    });

    useEffect(() => {
        if (order) {
            setStatus(order.status);
            setShippingCost(Number(order.shippingCost || 0));
            setTaxCost(Number(order.taxCost || 0));
            setRemovedItemIds([]); // Reset on new order load
        }
    }, [order]);

    const visibleItems = order?.items?.filter(item => !removedItemIds.includes(item.id)) || [];
    const subtotal = visibleItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const totalPrice = subtotal + Number(shippingCost) + Number(taxCost);

    const handleSaveChanges = () => {
        updateOrderMutation.mutate({
            status,
            shippingCost: Number(shippingCost),
            taxCost: Number(taxCost),
            totalPrice: Number(totalPrice),
            removedItemIds
        });
    };

    const handleRemoveItem = (itemId) => {
        if (visibleItems.length <= 1) {
            alert("An order must have at least one item. If you want to cancel the order, please change its status or delete the order entirely.");
            return;
        }
        setRemovedItemIds(prev => [...prev, itemId]);
    };

    const deleteOrderMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/admin/orders/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            alert("Order deleted successfully");
            router.push("/admin");
        },
        onError: () => {
            alert("Failed to delete order");
        }
    });

    const updateOrderMutation = useMutation({
        mutationFn: async (updateData) => {
            const { data } = await api.put(`/admin/orders/${id}`, updateData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            setRemovedItemIds([]);
            alert("Order updated successfully");
        },
        onError: () => {
            alert("Failed to update order");
        }
    });

    if (isLoading) return <LoadingSpinner />;
    if (!order) return <div className="p-8 text-center mt-20">Order not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
                <button onClick={() => router.back()} className="p-2 bg-white border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-heading font-black">Order #{order.id.slice(-8).toUpperCase()}</h1>
                    <p className="text-muted-foreground text-sm font-bold mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-white border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 ring-primary cursor-pointer"
                    >
                        <option value="NOT_DELIVERED">Not Delivered</option>
                        <option value="ON_DELIVERY">On Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="RETURNED">Returned</option>
                    </select>
                    <button
                        onClick={handleSaveChanges}
                        disabled={updateOrderMutation.isPending}
                        className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-black hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-heading font-black mb-6 flex items-center gap-2">
                            <Package size={20} className="text-primary" /> Order Items
                        </h2>
                        <div className="space-y-4">
                            {visibleItems.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-secondary/50 relative group">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-200 shadow-sm z-10"
                                        title="Remove item"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden relative">
                                        {item.product?.images?.[0]?.url ? (
                                            <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="text-xl">👕</div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex justify-between">
                                        <div>
                                            <h3 className="font-bold text-foreground">{item.product?.name || "Unknown Product"}</h3>
                                            <p className="text-sm font-bold text-muted-foreground">
                                                {item.variation ? `Size: ${item.variation.size || 'N/A'} - Color: ${item.variation.color || 'N/A'}` : 'No variation'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-foreground">ETB {Number(item.price).toFixed(2)}</p>
                                            <p className="text-sm font-bold text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-heading font-black mb-6 flex items-center gap-2">
                            <CreditCard size={20} className="text-primary" /> Payment Summary
                        </h2>
                        <div className="space-y-4 text-sm font-bold">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>ETB {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Shipping</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">ETB</span>
                                    <input
                                        type="number"
                                        value={shippingCost}
                                        onChange={(e) => setShippingCost(e.target.value)}
                                        className="w-24 bg-secondary/30 border border-border rounded-lg px-2 py-1 text-right focus:ring-2 ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <span>Tax</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">ETB</span>
                                    <input
                                        type="number"
                                        value={taxCost}
                                        onChange={(e) => setTaxCost(e.target.value)}
                                        className="w-24 bg-secondary/30 border border-border rounded-lg px-2 py-1 text-right focus:ring-2 ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                                <span className="text-lg font-black text-foreground">Total</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-primary font-black text-2xl">ETB {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 relative overflow-hidden">
                            {order.user?.photo ? (
                                <Image src={order.user.photo} alt={order.user.username} fill className="object-cover" />
                            ) : (
                                <UserIcon size={32} />
                            )}
                        </div>
                        <h2 className="text-xl font-heading font-black">{order.user?.username || "Guest User"}</h2>
                        <p className="text-sm font-bold text-muted-foreground mb-4">
                            Joined {order.user?.createdAt ? new Date(order.user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                        {order.user?.phone && (
                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-foreground bg-secondary py-2 rounded-xl">
                                <Phone size={16} className="text-primary" /> {order.user.phone}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h2 className="text-xl font-heading font-black mb-6 flex items-center gap-2">
                            <MapPin size={20} className="text-primary" /> Delivery Details
                        </h2>
                        {order.user?.address ? (
                            <div className="space-y-3 text-sm font-bold">
                                <div className="p-4 bg-secondary/30 rounded-xl border border-secondary/50">
                                    <p className="text-muted-foreground mb-1">City / Subcity</p>
                                    <p className="text-foreground text-base">{order.user.address.city}, {order.user.address.subcity}</p>
                                </div>
                                <div className="p-4 bg-secondary/30 rounded-xl border border-secondary/50">
                                    <p className="text-muted-foreground mb-1">Neighborhood</p>
                                    <p className="text-foreground text-base">{order.user.address.neighborhood}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-secondary/30 rounded-xl border border-secondary/50 text-center text-sm font-bold text-muted-foreground">
                                No address provided
                            </div>
                        )}
                    </div>

                    <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                        <h2 className="text-xl font-heading font-black text-red-600 mb-2">Danger Zone</h2>
                        <p className="text-sm font-medium text-red-500 mb-4">Once you delete an order, it cannot be recovered. Please be absolutely certain.</p>
                        <button
                            onClick={() => { if (confirm("Are you sure you want to delete this order?")) deleteOrderMutation.mutate() }}
                            disabled={deleteOrderMutation.isPending}
                            className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} /> Delete Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
