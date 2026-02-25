"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUploadThing } from "@/app/utils/uploadthing";
import Image from "next/image";

export default function AdminProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const isNew = id === "new";

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [basePrice, setBasePrice] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [variations, setVariations] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Fetch Categories for dropdown
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get("/categories");
            return data;
        }
    });

    // Fetch Product if not new
    const { data: product, isLoading } = useQuery({
        queryKey: ["admin-product", id],
        queryFn: async () => {
            if (isNew) return null;
            const { data } = await api.get(`/products/${id}`);
            return data;
        },
        enabled: !isNew
    });

    // Populate state on load
    useEffect(() => {
        if (product && !isNew) {
            setName(product.name || "");
            setDescription(product.description || "");
            setBasePrice(Number(product.basePrice || 0));
            setSelectedCategories(product.categories?.map(c => c.id) || []);
            setVariations(product.variations || []);
            setImages(product.images || []);
        }
    }, [product, isNew]);

    // Save Mutation (Create or Update)
    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            if (isNew) {
                const { data } = await api.post(`/admin/products`, payload);
                return data;
            } else {
                const { data } = await api.put(`/admin/products/${id}`, payload);
                return data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["admin-product", id] });
            alert(isNew ? "Product created successfully" : "Product updated successfully");
            setSelectedFiles([]);
            if (isNew) router.push("/admin/products");
        },
        onError: () => {
            alert("Failed to save product");
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/admin/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            alert("Product deleted successfully");
            router.push("/admin/products");
        },
        onError: () => {
            alert("Failed to delete product");
        }
    });

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            const uploadedImages = res.map(file => ({ url: file.url }));
            const allImages = [...images, ...uploadedImages];
            performSave(allImages);
        },
        onUploadError: (error) => {
            alert(`Upload failed: ${error.message}`);
        },
        headers: () => {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
        }
    });

    const handleSave = async () => {
        if (variations.length === 0) {
            alert("At least one variation (Size/Color/Price/Stock) is required.");
            return;
        }

        if (selectedFiles.length > 0) {
            await startUpload(selectedFiles);
        } else {
            performSave(images);
        }
    };

    const performSave = (finalImages) => {
        saveMutation.mutate({
            name,
            description,
            basePrice: Number(basePrice),
            categories: selectedCategories,
            variations: variations.map(v => ({
                size: v.size,
                color: v.color,
                quantity: Number(v.quantity),
                additionalPrice: Number(v.additionalPrice)
            })),
            images: finalImages.map(img => ({ url: img.url }))
        });
    };

    const handleAddVariation = () => {
        setVariations([...variations, { size: "", color: "", quantity: 0, additionalPrice: 0 }]);
    };

    const handleUpdateVariation = (index, field, value) => {
        const newVars = [...variations];
        newVars[index][field] = value;
        setVariations(newVars);
    };

    const handleRemoveVariation = (index) => {
        setVariations(variations.filter((_, i) => i !== index));
    };

    const onFileSelect = (e) => {
        if (e.target.files) {
            setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
        }
    };

    const handleRemoveSelectedFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    if (isLoading && !isNew) return <LoadingSpinner />;
    console.log(selectedFiles);
    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 bg-white border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-black">Edit Product</h1>
                        <p className="text-muted-foreground text-sm font-bold mt-1">Product ID: PRD-{id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button onClick={() => router.back()} className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-secondary text-foreground px-6 py-2 rounded-xl font-bold hover:bg-secondary/80 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveMutation.isPending || isUploading}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Save size={18} /> {saveMutation.isPending || isUploading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-heading font-black mb-4">Basic Information</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">Description</label>
                            <textarea
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 ring-primary transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">Base Price (ETB)</label>
                                <input
                                    type="number"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">Category</label>
                                <select
                                    value={selectedCategories[0] || ""}
                                    onChange={(e) => setSelectedCategories([e.target.value])}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all cursor-pointer"
                                >
                                    <option value="" disabled>Select a Category...</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Variations */}
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-heading font-black">Variations</h2>
                            <button onClick={handleAddVariation} className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                                <Plus size={16} /> Add Variation
                            </button>
                        </div>

                        <div className="space-y-4">
                            {variations.length === 0 && <p className="text-sm text-muted-foreground italic">No variations added.</p>}
                            {variations.map((v, idx) => (
                                <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-secondary/50 relative group">
                                    <div className="flex-1 space-y-1 min-w-[120px]">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Size</label>
                                        <input
                                            type="text"
                                            value={v.size || ""}
                                            placeholder="e.g. 4Y"
                                            onChange={(e) => handleUpdateVariation(idx, 'size', e.target.value)}
                                            className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 ring-primary"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-[120px]">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Color</label>
                                        <input
                                            type="text"
                                            value={v.color || ""}
                                            placeholder="e.g. Red"
                                            onChange={(e) => handleUpdateVariation(idx, 'color', e.target.value)}
                                            className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 ring-primary"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-[100px]">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Add. Price</label>
                                        <input
                                            type="number"
                                            value={v.additionalPrice || 0}
                                            onChange={(e) => handleUpdateVariation(idx, 'additionalPrice', e.target.value)}
                                            className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 ring-primary"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-[100px]">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Stock</label>
                                        <input
                                            type="number"
                                            value={v.quantity || 0}
                                            onChange={(e) => handleUpdateVariation(idx, 'quantity', e.target.value)}
                                            className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 ring-primary"
                                        />
                                    </div>
                                    <button onClick={() => handleRemoveVariation(idx)} className="mt-5 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Images */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-heading font-black">Images</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-1 ">
                            <div className="flex flex-wrap gap-1 w-full">
                                {images.map((img, idx) => (
                                    <div key={idx} className="h-35 aspect-square bg-secondary rounded-xl border border-border flex items-center justify-center relative group overflow-hidden">
                                        <img src={img.url} alt={`Preview ${idx}`} className="h-35 w-35 object-cover" />
                                        {idx === 0 && <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">MAIN</span>}
                                        <button
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-105"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="col-span-2 mt-4 space-y-4">
                                <div className="grid grid-cols-1">
                                    <div className="flex flex-wrap gap-1">
                                        {selectedFiles.map((file, idx) => (
                                            <div key={idx} className="h-35 aspect-square bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-center relative group overflow-hidden">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-[10px] text-white font-bold uppercase truncate px-2">{file.name}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveSelectedFile(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-md shadow-sm opacity-100 transition-opacity z-10 hover:scale-105"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] font-bold py-0.5 text-center">QUEUED</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Plus size={24} className="mb-2 text-primary" />
                                        <p className="text-sm font-bold text-muted-foreground">Click to select files</p>
                                    </div>
                                    <input type="file" multiple className="hidden" onChange={onFileSelect} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {!isNew && (
                        <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                            <h2 className="text-xl font-heading font-black text-red-600 mb-2">Danger Zone</h2>
                            <p className="text-sm font-medium text-red-500 mb-4">Once you delete a product, there is no going back. Please be certain.</p>
                            <button
                                onClick={() => { if (confirm("Are you sure you want to delete this product?")) deleteMutation.mutate() }}
                                disabled={deleteMutation.isPending}
                                className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                            >
                                Delete Product
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
