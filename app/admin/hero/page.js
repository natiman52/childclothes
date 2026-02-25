"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles, Image as ImageIcon, Link as LinkIcon, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUploadThing } from "@/app/utils/uploadthing";
import Image from "next/image";
import Hero from "@/components/Hero";

export default function AdminHeroPage() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [badgeText, setBadgeText] = useState("");
    const [badgePrice, setBadgePrice] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const { data: hero, isLoading } = useQuery({
        queryKey: ["admin-hero"],
        queryFn: async () => {
            const { data } = await api.get("/admin/hero");
            return data;
        }
    });

    useEffect(() => {
        if (hero) {
            setTitle(hero.title || "");
            setSubtitle(hero.subtitle || "");
            setImageUrl(hero.imageUrl || "");
            setLinkText(hero.linkText || "Shop Now");
            setLinkUrl(hero.linkUrl || "/shop");
            setBadgeText(hero.badgeText || "Summer Favorites");
            setBadgePrice(hero.badgePrice || "ETB 1500");
        }
    }, [hero]);

    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.put("/admin/hero", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-hero"] });
            queryClient.invalidateQueries({ queryKey: ["hero"] });
            alert("Hero content updated successfully");
            setSelectedFile(null);
        },
        onError: () => {
            alert("Failed to update hero content");
        }
    });

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            const uploadedUrl = res[0].url;
            performSave(uploadedUrl);
        },
        onUploadError: (error) => {
            alert(`Upload failed: ${error.message}`);
        }
    });

    const handleSave = async () => {
        if (!title) {
            alert("Title is required");
            return;
        }

        if (selectedFile) {
            await startUpload([selectedFile]);
        } else {
            performSave(imageUrl);
        }
    };

    const performSave = (finalImageUrl) => {
        saveMutation.mutate({
            title,
            subtitle,
            imageUrl: finalImageUrl,
            linkText,
            linkUrl,
            badgeText,
            badgePrice
        });
    };

    const onFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-heading font-black flex items-center gap-2">
                        <Sparkles size={32} className="text-primary" /> Hero Management
                    </h1>
                    <p className="text-muted-foreground text-sm font-bold mt-1">Customize the first thing your customers see</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saveMutation.isPending || isUploading}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 w-full sm:w-auto justify-center"
                >
                    <Save size={20} /> {saveMutation.isPending || isUploading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-foreground">Main Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Trendy Kids Collection"
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-foreground">Subtitle</label>
                            <textarea
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                rows={3}
                                placeholder="e.g. Quality clothes for your little ones with great prices."
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 ring-primary transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-foreground">Button Text</label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-foreground">Button Link</label>
                                <div className="relative">
                                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-foreground">Badge Text</label>
                                <input
                                    type="text"
                                    value={badgeText}
                                    onChange={(e) => setBadgeText(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-foreground">Badge Price</label>
                                <input
                                    type="text"
                                    value={badgePrice}
                                    onChange={(e) => setBadgePrice(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 ring-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                            <ImageIcon size={20} className="text-primary" /> Hero Banner Image
                        </h2>

                        {imageUrl && !selectedFile && (
                            <div className="mb-4 relative aspect-[21/9] w-full bg-secondary rounded-xl overflow-hidden border border-border">
                                <Image src={imageUrl} alt="Hero preview" fill className="object-cover" />
                                <button
                                    onClick={() => setImageUrl("")}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <Save size={16} className="rotate-45" /> {/* Using Save as a generic cross placeholder if Trash2 not handy */}
                                </button>
                            </div>
                        )}

                        {selectedFile && (
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-blue-900 truncate max-w-[200px]">{selectedFile.name}</p>
                                        <p className="text-xs font-bold text-blue-700">Ready to upload</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedFile(null)} className="text-red-500 font-bold text-sm hover:underline">Remove</button>
                            </div>
                        )}

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Plus size={24} className="mb-2 text-primary" />
                                <p className="text-sm font-bold text-muted-foreground">Click to change banner image</p>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Recommended: 1920x800px</p>
                            </div>
                            <input type="file" className="hidden" onChange={onFileSelect} accept="image/*" />
                        </label>
                    </div>
                </div>

                {/* Right side: Preview */}
                <div className="space-y-6">
                    <h2 className="text-lg font-black flex items-center gap-2">Live Preview</h2>
                    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-2xl relative h-[700px] scale-[0.5] origin-top-left w-[200%]">
                        <Hero
                            title={title}
                            subtitle={subtitle}
                            imageUrl={selectedFile ? URL.createObjectURL(selectedFile) : (imageUrl || "/images/tshirt.jpg")}
                            linkText={linkText}
                            linkUrl={linkUrl}
                            badgeText={badgeText}
                            badgePrice={badgePrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
