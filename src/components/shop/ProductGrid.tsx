"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Search, Cpu } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

interface TransformedProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    images: string[];
    stock: number;
    deliveryDays: number;
    features: string[];
    tags: string[];
}

function transformProduct(dbProduct: any): TransformedProduct {
    return {
        id: dbProduct.id,
        name: dbProduct.name,
        price: Number(dbProduct.price),
        description: dbProduct.description,
        image: dbProduct.image,
        images: dbProduct.images || [],
        stock: dbProduct.stock,
        deliveryDays: dbProduct.delivery_days || 20,
        features: dbProduct.features || [],
        tags: dbProduct.tags || [],
    };
}

const CATEGORIES = ["All", "Hardware", "Tools", "Wireless", "RFID"];

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
];

function matchesCategory(tags: string[], category: string): boolean {
    if (!tags || !Array.isArray(tags)) return false;
    const lowerTags = tags.map(t => (t || '').toLowerCase());
    
    switch (category) {
        case 'wireless':
            return lowerTags.some(t => t.includes('wifi') || t.includes('wireless') || t.includes('radio') || t.includes('sdr') || t.includes('bluetooth'));
        case 'hardware':
            return lowerTags.some(t => t.includes('hardware') || t.includes('sbc') || t.includes('device'));
        case 'tools':
            return lowerTags.some(t => t.includes('tools') || t.includes('usb') || t.includes('hid'));
        case 'rfid':
            return lowerTags.some(t => t.includes('rfid') || t.includes('nfc'));
        default:
            return lowerTags.some(t => t.includes(category));
    }
}

export default function ProductGrid({ initialProducts }: { initialProducts: any[] }) {
    const products = useMemo(() => initialProducts.map(transformProduct), [initialProducts]);
    
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (activeCategory !== "All") {
            const category = activeCategory.toLowerCase();
            result = result.filter(p => matchesCategory(p.tags, category));
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }

        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        return result;
    }, [activeCategory, searchQuery, products, sortBy]);

    return (
        <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="flex justify-center mb-12">
                     <div className="relative group w-full max-w-md">
                        <div className="relative flex items-center bg-background border border-input rounded-full p-1 shadow-sm focus-within:ring-2 focus-within:ring-ring">
                            <Search className="w-5 h-5 text-muted-foreground ml-3" />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground/70 focus:ring-0 py-3 px-3 text-sm focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 border-b border-border/40 pb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <SlidersHorizontal className="w-5 h-5 text-muted-foreground mr-2" />
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    activeCategory === cat 
                                    ? 'bg-foreground text-background shadow-md' 
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative" ref={sortDropdownRef}>
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showSortDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg z-50 overflow-hidden">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setShowSortDropdown(false);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                                            sortBy === option.value
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border/30 rounded-3xl bg-muted/5">
                        <Cpu className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                        <button 
                            onClick={() => {setActiveCategory("All"); setSearchQuery("");}}
                            className="mt-4 text-primary hover:text-primary/80 text-sm font-semibold uppercase tracking-wider"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <ProductCard 
                                    {...product} 
                                    delay={0}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
