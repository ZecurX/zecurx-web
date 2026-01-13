"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    images: string[];
    stock: number;
    features: string[];
    tags: string[];
    delivery_days: number;
}

interface ProductDialogProps {
    product?: Product;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export default function ProductDialog({ product, trigger, onSuccess }: ProductDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: product?.name || "",
        price: product?.price || 0,
        stock: product?.stock || 0,
        delivery_days: product?.delivery_days || 5,
        description: product?.description || "",
        image: product?.image || "",
        images: product?.images?.join(", ") || "",
        features: product?.features?.join("\n") || "",
        tags: product?.tags?.join(", ") || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                price: parseFloat(formData.price.toString()),
                stock: parseInt(formData.stock.toString()),
                delivery_days: parseInt(formData.delivery_days.toString()),
                description: formData.description,
                image: formData.image,
                images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
                features: formData.features.split("\n").map(s => s.trim()).filter(Boolean),
                tags: formData.tags.split(",").map(s => s.trim()).filter(Boolean),
            };

            if (product?.id) {
                // Update existing product
                const response = await fetch(`/api/admin/products/${product.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to update product");
                }
            } else {
                // Create new product
                const response = await fetch("/api/admin/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to create product");
                }
            }

            setOpen(false);
            onSuccess?.();
            router.refresh();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (INR)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                                className="bg-muted/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                required
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delivery">Delivery Days</Label>
                            <Input
                                id="delivery"
                                type="number"
                                value={formData.delivery_days}
                                onChange={(e) => setFormData({ ...formData, delivery_days: Number(e.target.value) })}
                                required
                                className="bg-muted/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="bg-muted/50 min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Main Image</Label>
                        <div className="flex items-center gap-4">
                            {formData.image && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border/50">
                                    <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: "" })}
                                        className="absolute top-0 right-0 bg-black/50 text-white p-1 hover:bg-black/70"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setUploading(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append("file", file);

                                            const response = await fetch("/api/admin/upload", {
                                                method: "POST",
                                                body: formData,
                                            });

                                            if (!response.ok) {
                                                throw new Error("Upload failed");
                                            }

                                            const data = await response.json();
                                            setFormData(prev => ({ ...prev, image: data.url }));
                                        } catch (error) {
                                            console.error('Error uploading image:', error);
                                            alert('Error uploading image');
                                        } finally {
                                            setUploading(false);
                                        }
                                    }}
                                    disabled={uploading}
                                    className="bg-muted/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Additional Images</Label>
                        <div className="flex flex-wrap gap-4 mb-2">
                            {formData.images.split(",").map((img, index) => img.trim() && (
                                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border/50">
                                    <img src={img.trim()} alt={`Additional ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = formData.images.split(",").map(s => s.trim()).filter((_, i) => i !== index).join(", ");
                                            setFormData({ ...formData, images: newImages });
                                        }}
                                        className="absolute top-0 right-0 bg-black/50 text-white p-1 hover:bg-black/70"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length === 0) return;

                                setUploading(true);
                                try {
                                    const uploadedUrls: string[] = [];

                                    for (const file of files) {
                                        const formData = new FormData();
                                        formData.append("file", file);

                                        const response = await fetch("/api/admin/upload", {
                                            method: "POST",
                                            body: formData,
                                        });

                                        if (!response.ok) {
                                            console.error("Upload failed for file:", file.name);
                                            continue;
                                        }

                                        const data = await response.json();
                                        uploadedUrls.push(data.url);
                                    }

                                    const currentImages = formData.images ? formData.images.split(",").map(s => s.trim()).filter(Boolean) : [];
                                    setFormData(prev => ({
                                        ...prev,
                                        images: [...currentImages, ...uploadedUrls].join(", ")
                                    }));
                                } catch (error) {
                                    console.error('Error uploading images:', error);
                                    alert('Error uploading images');
                                } finally {
                                    setUploading(false);
                                }
                            }}
                            disabled={uploading}
                            className="bg-muted/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="features">Features (one per line)</Label>
                            <Textarea
                                id="features"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                className="bg-muted/50 min-h-[150px]"
                                placeholder="- Feature 1&#10;- Feature 2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Textarea
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="bg-muted/50 min-h-[150px]"
                                placeholder="Hardware, NFC, WiFi"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {product ? "Save Changes" : "Create Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
