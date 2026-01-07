"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Shield, Zap, Cpu, ArrowRight, Package, AlertCircle } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import RazorpayCheckout from '@/components/academy/RazorpayCheckout';

const products = [
    {
        id: "flipper-zero-auth",
        name: "Authentic Flipper Zero",
        price: 64999,
        description: "The portable multi-tool for geeks and ethical hackers. Perfect for exploring wireless protocols, radio systems, and hardware hacking.",
        image: "/images/flipper-zero.png",
        stock: 2,
        features: [
            "Sub-1 GHz Transceiver",
            "RFID & NFC Reader/Writer",
            "Infrared Transceiver",
            "GPIO Hardware Interface",
            "iButton Support",
            "Fully Open Source Firmware"
        ],
        tags: ["Radio", "NFC", "Hardware"]
    }
];

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
                            <ShoppingBag className="w-3 h-3" />
                            <span>Cyber Hardware</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            The ZecurX <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Gear Shop</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Equip yourself with professional-grade hardware for advanced security research and penetration testing.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 gap-12">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="group relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 rounded-3xl bg-muted/20 border border-border/50 overflow-hidden"
                            >
                                {/* Background Glow */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />

                                {/* Image Side */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-background/50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {product.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md border border-white/10 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {product.stock <= 5 && (
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full text-red-500 text-xs font-semibold">
                                            <AlertCircle className="w-3 h-3" />
                                            Limited Stock: {product.stock} units left
                                        </div>
                                    )}
                                </div>

                                {/* Content Side */}
                                <div className="flex flex-col justify-center">
                                    <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
                                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {product.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2 text-sm text-foreground/80">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-border/50">
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-widest font-semibold text-[10px]">Price</div>
                                            <div className="text-4xl font-bold">₹{product.price.toLocaleString('en-IN')}</div>
                                        </div>

                                        <div className="flex-1 w-full flex flex-col gap-2">
                                            <RazorpayCheckout
                                                itemId={product.id}
                                                itemName={product.name}
                                                itemDescription={`Purchase of ${product.name}`}
                                                amount={product.price}
                                                metadata={{ type: 'hardware' }}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/20"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                                Buy Now
                                            </RazorpayCheckout>
                                            <p className="text-[10px] text-center text-muted-foreground italic">
                                                Secure payment processed via Razorpay. Fast delivery nationwide.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST SECTION */}
            <section className="py-24 border-t border-border/50 bg-muted/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Authentic Gear</h3>
                            <p className="text-sm text-muted-foreground">Certified authentic hardware sourced directly from original manufacturers.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                <Package className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Priority Shipping</h3>
                            <p className="text-sm text-muted-foreground">Discrete packaging with express tracked shipping for all hardware orders.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Activation</h3>
                            <p className="text-sm text-muted-foreground">Get immediate access to ZecurX Academy tutorials for your new tool.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
