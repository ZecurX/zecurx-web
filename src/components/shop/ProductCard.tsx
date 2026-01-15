'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, AlertCircle, Truck } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    images?: string[]; // Array of images for hover effect
    stock?: number;
    features: string[];
    tags: string[];
    delay?: number;
    deliveryDays?: number; // Estimated delivery in days
}

export default function ProductCard({
    id,
    name,
    price,
    description,
    image,
    images,
    stock = 0,
    features,
    tags,
    delay = 0,
    deliveryDays = 20,
}: ProductCardProps) {
    const allImages = Array.from(new Set(images ? [image, ...images] : [image])).filter(Boolean);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleMouseEnter = () => {
        if (allImages.length > 1) {
            setCurrentImageIndex(1);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImageIndex(0);
    };

    const cycleImage = () => {
        if (allImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full bg-card/50 border border-border/40 hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 rounded-3xl overflow-hidden backdrop-blur-sm"
        >
            {/* Image Section */}
            <div
                className="relative aspect-[4/3] overflow-hidden bg-muted/50 border-b border-border/40 cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={cycleImage}
            >
                <img
                    src={allImages[currentImageIndex]}
                    alt={name}
                    className="w-full h-full object-contain p-4 transition-all duration-700 group-hover:scale-105"
                    key={currentImageIndex}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {allImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                        {allImages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                                    ? 'bg-foreground w-4'
                                    : 'bg-foreground/30'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-background/80 backdrop-blur-md border border-border/50 rounded-full text-foreground shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Stock Warning */}
                {stock <= 5 && stock > 0 && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-wider z-10">
                        <AlertCircle className="w-3 h-3" />
                        <span>{stock} left</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-6">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-xl font-manrope font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-light">
                        {description}
                    </p>
                </div>

                {/* Features (Compact) */}
                <ul className="space-y-2 mb-6 flex-1">
                    {features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Price</span>
                            <span className="text-lg font-bold text-foreground">{formatPrice(price)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Truck className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase tracking-wider font-semibold">Delivery</span>
                            </div>
                            <span className="text-xs font-medium text-foreground/80 mt-0.5">
                                ~{deliveryDays} days
                            </span>
                        </div>
                    </div>

                    <Link
                        href={`/checkout?itemId=${id}&itemName=${encodeURIComponent(name)}&price=${price}&type=hardware`}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-opacity rounded-full shadow-lg hover:shadow-xl"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                    </Link>
                </div>
            </div>
        </motion.div>


    );
}
