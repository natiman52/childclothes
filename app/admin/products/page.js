"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import Pagination from "@/components/Pagination";

export default function AdminProductsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const { data: productData = { data: [], total: 0, pages: 0 }, isLoading } = useQuery({
        queryKey: ["admin-products", page],
        queryFn: async () => {
            const { data } = await api.get(`/products?page=${page}`);
            return data;
        }
    });

    const products = productData.data;

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/admin/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            alert("Product deleted successfully");
        }
    });

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    console.log(productData);
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-heading font-black">Products</h1>
                    <p className="text-muted-foreground text-sm font-bold mt-1">Manage your store's inventory</p>
                </div>
                <button
                    onClick={() => router.push('/admin/products/new')}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-border shadow-sm">
                <table className="w-full min-w-[700px] divide-y divide-border">
                    <thead>
                        <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                            <th className="p-4">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">Stock</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                        {products.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-muted-foreground">No products found.</td></tr>
                        ) : products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-border hover:bg-secondary/20 transition-colors cursor-pointer"
                                onClick={() => router.push(`/admin/products/${product.id}`)}
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden relative">
                                            {product.images?.[0]?.url ? (
                                                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="text-xl">👕</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">ID: {product.id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    {product.categories?.map(c => c.name).join(', ') || "Uncategorized"}
                                </td>
                                <td className="p-4 font-bold">ETB {Number(product.basePrice).toFixed(2)}</td>
                                <td className="p-4 text-center font-bold">
                                    {product.variations?.reduce((sum, v) => sum + v.quantity, 0) || 0}
                                </td>
                                <td className="p-4">
                                    <span className={`px - 3 py - 1 rounded - full text - xs font - bold ${(product.variations?.reduce((sum, v) => sum + v.quantity, 0) || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        } `}>
                                        {(product.variations?.reduce((sum, v) => sum + v.quantity, 0) || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => router.push(`/ admin / products / ${product.id} `)}
                                            className="p-2 text-muted-foreground hover:text-blue-600 bg-secondary/50 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Product"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, product.id)}
                                            disabled={deleteMutation.isPending}
                                            className="p-2 text-muted-foreground hover:text-red-600 bg-secondary/50 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={productData.page || 1}
                totalPages={productData.pages || 1}
                onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
        </div>
    );
}
