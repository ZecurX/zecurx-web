'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, AlertCircle } from 'lucide-react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    stock?: number;
    features: string[];
    tags: string[];
    delay?: number;
}

export default function ProductCard({
    id,
    name,
    price,
    description,
    image,
    stock = 0,
    features,
    tags,
    delay = 0,
}: ProductCardProps) {

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full bg-background/50 border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all duration-300 rounded-2xl overflow-hidden"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/50 border-b border-border/40">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-background/80 backdrop-blur-md border border-border rounded-md text-foreground">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Stock Warning */}
                {stock <= 5 && stock > 0 && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-wider">
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
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Features (Compact) */}
                <ul className="space-y-1.5 mb-6 flex-1">
                    {features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground/80 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
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
                    </div>

                    <Link
                        href={`/checkout?itemId=${id}&itemName=${encodeURIComponent(name)}&price=${price}&type=hardware`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-lg"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
