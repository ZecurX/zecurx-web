'use client';

import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, AlertCircle, Truck, Check, Cpu, Wifi, Radio } from 'lucide-react';
import { useState, MouseEvent, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductImages } from '@/lib/productImages';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    images?: string[];
    stock?: number;
    features: string[];
    tags: string[];
    delay?: number;
    deliveryDays?: number;
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
    const { addItem } = useCart();
    
    const allImages = getProductImages(name, image, images);
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [cycleInterval, setCycleInterval] = useState<NodeJS.Timeout | null>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleMouseEnter = () => {
        if (allImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            }, 2000);
            setCycleInterval(interval);
        }
    };

    const handleMouseLeave = () => {
        if (cycleInterval) {
            clearInterval(cycleInterval);
            setCycleInterval(null);
        }
        setCurrentImageIndex(0);
    };

    const cycleImage = () => {
        if (allImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }
    };

    useEffect(() => {
        return () => {
            if (cycleInterval) {
                clearInterval(cycleInterval);
            }
        };
    }, [cycleInterval]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            onMouseMove={handleMouseMove}
            className="group relative flex flex-col h-full bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors duration-500"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            var(--primary-20, rgba(var(--primary-rgb), 0.15)),
                            transparent 80%
                        )
                    `
                }}
            />

            <div
                className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={cycleImage}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80 z-10" />
                
                <AnimatePresence mode="sync">
                    <motion.img
                        src={allImages[currentImageIndex]}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ 
                            duration: 0.6, 
                            ease: [0.4, 0, 0.2, 1]
                        }}
                    />
                </AnimatePresence>

                <div className="absolute top-3 right-3 z-20">
                    {stock === 0 ? (
                        <div className="px-3 py-1 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider">Out of Stock</span>
                        </div>
                    ) : stock <= 5 ? (
                        <div className="px-3 py-1 bg-orange-500/10 backdrop-blur-md border border-orange-500/20 rounded-full flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider">Low Stock: {stock}</span>
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-wider">In Stock</span>
                        </div>
                    )}
                </div>

                <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2 max-w-[80%]">
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-background/80 backdrop-blur-md border border-border/50 rounded text-foreground/80 shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {allImages.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 rounded-full transition-all duration-300 ${index === currentImageIndex
                                    ? 'bg-primary w-4'
                                    : 'bg-muted-foreground/30 w-1'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-5 pt-4 relative z-10">
                <Link href={`/shop/${id}`} className="block group/title">
                    <h3 className="text-lg font-manrope font-bold text-foreground mb-1 leading-tight group-hover/title:text-primary transition-colors line-clamp-1">
                        {name}
                    </h3>
                </Link>
                
                <div className="flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground/90 line-clamp-2 mb-4 font-light leading-relaxed group-hover:text-foreground/80 transition-colors">
                        {description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                        {features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 overflow-hidden">
                                <div className="w-6 h-6 rounded bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                    {idx === 0 ? <Cpu className="w-3 h-3 text-primary" /> : <Wifi className="w-3 h-3 text-primary" />}
                                </div>
                                <span className="text-[10px] font-medium text-gray-300 truncate">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Price</span>
                        <span className="text-lg font-mono font-bold text-foreground tracking-tight">{formatPrice(price)}</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem({ id, name, price, image: allImages[0], deliveryDays });
                            setIsAdded(true);
                            setTimeout(() => setIsAdded(false), 2000);
                        }}
                        disabled={stock === 0}
                        className={`
                            relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300
                            ${stock === 0
                                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                : isAdded
                                    ? 'bg-green-500 text-white shadow-[0_0_20px_-5px_#22c55e]'
                                    : 'bg-foreground text-background hover:bg-primary hover:text-white hover:shadow-[0_0_20px_-5px_var(--primary)]'
                            }
                        `}
                    >
                        {isAdded ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                            </>
                        ) : stock === 0 ? (
                            <>
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Empty</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add</span>
                            </>
                        )}
                    </button>
                </div>
                
                <div className="mt-3 pt-3 border-t border-dashed border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Truck className="w-3 h-3" />
                        <span>Ships in {deliveryDays} days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-green-500" />
                        <span>Verified</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
