"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Tag, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminCategoriesPage() {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");

    const queryClient = useQueryClient();

    // Fetch Categories
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const { data } = await api.get("/categories");
            return data;
        }
    });

    // Create Category Mutation
    const createMutation = useMutation({
        mutationFn: async (name) => {
            const { data } = await api.post("/admin/categories", { name });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setNewName("");
            setIsAdding(false);
        },
        onError: (error) => {
            alert(error.response?.data?.error || "Failed to create category");
        }
    });

    // Update Category Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, name }) => {
            const { data } = await api.put(`/admin/categories/${id}`, { name });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setEditingId(null);
            setEditName("");
        },
        onError: (error) => {
            alert(error.response?.data?.error || "Failed to update category");
        }
    });

    // Delete Category Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/admin/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
            alert(error.response?.data?.error || "Failed to delete category");
        }
    });

    const handleCreate = () => {
        if (!newName.trim()) return;
        createMutation.mutate(newName);
    };

    const handleUpdate = (id) => {
        if (!editName.trim()) return;
        updateMutation.mutate({ id, name: editName });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-heading font-black">Categories</h1>
                    <p className="text-muted-foreground text-sm font-bold mt-1">Manage product categories</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => setIsAdding(true)}
                        disabled={isAdding}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List View */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-b border-border">
                            {/* Add New Category Row */}
                            {isAdding && (
                                <div className="p-6 border-b md:border-b-0 md:border-r border-border bg-secondary/20 flex flex-col justify-between group h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <Tag size={24} />
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="New Category Name"
                                            className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 ring-primary mb-3"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCreate}
                                                disabled={createMutation.isPending}
                                                className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors flex justify-center items-center gap-1 disabled:opacity-50"
                                            >
                                                <Check size={16} /> Save
                                            </button>
                                            <button
                                                onClick={() => { setIsAdding(false); setNewName(""); }}
                                                className="flex-1 bg-secondary text-foreground py-2 rounded-lg text-sm font-bold hover:bg-secondary/80 transition-colors flex justify-center items-center gap-1"
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Categories List */}
                            {categories.length === 0 && !isAdding ? (
                                <div className="p-8 text-center text-muted-foreground col-span-full">No categories found.</div>
                            ) : categories.map((category) => (
                                <div key={category.id} className="p-6 border-b md:border-b-0 lg:border-r border-border last:border-0 hover:bg-secondary/10 transition-colors flex flex-col justify-between group h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors rounded-xl flex items-center justify-center">
                                            <Tag size={24} />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {editingId === category.id ? (
                                                <>
                                                    <button onClick={() => handleUpdate(category.id)} disabled={updateMutation.isPending} className="p-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"><Check size={16} /></button>
                                                    <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"><X size={16} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => { setEditingId(category.id); setEditName(category.name); }}
                                                        className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        disabled={deleteMutation.isPending}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {editingId === category.id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full bg-white border border-border rounded-lg px-3 py-1.5 text-lg font-black font-heading outline-none focus:ring-2 ring-primary mb-1"
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="font-heading font-black text-xl mb-1">{category.name}</h3>
                                        )}
                                        <p className="text-sm font-bold text-muted-foreground">{category._count?.products || 0} Products</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Col - This column is now empty as add/edit forms are integrated into the list view */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-6">
                        <h2 className="text-xl font-heading font-black mb-6">Category Management</h2>
                        <p className="text-muted-foreground text-sm">
                            Use the "Add Category" button above to create new categories.
                            Click on a category to edit its name or delete it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
