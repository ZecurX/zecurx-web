"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoreVertical, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductDialog from "./ProductDialog";
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

export default function ProductsList() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            if (!response.ok) {
                console.error("Error fetching products:", response.statusText);
                return;
            }
            const data = await response.json();
            if (data.products) {
                setProducts(data.products);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete product");
            }

            setProducts(products.filter(p => p.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };

    const refreshProducts = async () => {
        await fetchProducts();
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse bg-muted/30 p-4 rounded-xl h-14" />
                <div className="animate-pulse bg-card rounded-xl h-64" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/40 backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                    />
                </div>
                <ProductDialog onSuccess={refreshProducts} />
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
                <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/40 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-4">Product</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-center">Stock</div>
                        <div className="col-span-3">Tags</div>
                        <div className="col-span-1 border-border/40"></div>
                    </div>

                    <div className="divide-y divide-border/40">
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                                >
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                                            <Image src={product.image} alt="" fill className="object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">{product.name}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-sm">
                                        ₹{product.price.toLocaleString()}
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${product.stock > 10
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : product.stock > 0
                                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                            }`}>
                                            {product.stock} in stock
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex gap-1 flex-wrap">
                                        {product.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground border border-border/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <ProductDialog
                                                    product={product}
                                                    onSuccess={refreshProducts}
                                                    trigger={
                                                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted">
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </div>
                                                    }
                                                />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(product.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredProducts.length === 0 && (
                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                <Package className="w-12 h-12 mb-4 opacity-20" />
                                <p>No products found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                <AnimatePresence>
                    {filteredProducts.map((product) => (
                        <motion.article
                            key={product.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-2xl p-4 bg-background/70 backdrop-blur-xl border border-white/[0.08] dark:border-white/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)] space-y-3"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                                    <Image src={product.image} alt="" fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground">{product.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{product.description}</div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <ProductDialog
                                            product={product}
                                            onSuccess={refreshProducts}
                                            trigger={
                                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted">
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </div>
                                            }
                                        />
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm font-medium text-foreground">₹{product.price.toLocaleString()}</span>
                                <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${product.stock > 10
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : product.stock > 0
                                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                    }`}>
                                    {product.stock} in stock
                                </div>
                            </div>

                            {product.tags?.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {product.tags.slice(0, 4).map(tag => (
                                        <span key={tag} className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground border border-border/50">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.article>
                    ))}
                </AnimatePresence>

                {filteredProducts.length === 0 && (
                    <div className="rounded-2xl p-12 bg-background/70 backdrop-blur-xl border border-white/[0.08] dark:border-white/[0.06] text-center text-muted-foreground flex flex-col items-center">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
