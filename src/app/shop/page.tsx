"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Zap, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import ProductCard from '@/components/shop/ProductCard';


const products = [
    {
        id: "flipper-zero-auth",
        name: "Authentic Flipper Zero",
        price: 64999,
        description: "The portable multi-tool for geeks and ethical hackers. Perfect for exploring wireless protocols, radio systems, and hardware hacking.",
        image: "/images/flipper-zero.png",
        images: [
            "/images/flipper-zero-use.png",
            "/images/flipper-zero-side.png",
            "/images/flipper-zero-back-clean.png"
        ],
        stock: 2,
        deliveryDays: 12, // Updated delivery time
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
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                {/* ... existing hero code ... */}
                {/* Modern Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Subtle Top Glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8 tracking-tighter">
                            ZecurX Shop
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-manrope font-light leading-relaxed max-w-2xl mb-12">
                            Professional-grade hardware for advanced security research and penetration testing.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <a
                                href="#products"
                                className="inline-flex items-center gap-2 text-foreground font-semibold border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
                            >
                                <span>Browse Gear</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>




            {/* PRODUCTS GRID */}
            <section id="products" className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-5xl font-manrope font-light text-foreground mb-6">
                                Essential Hardware
                            </h2>
                            <p className="text-muted-foreground max-w-xl text-lg font-light">
                                Tools of the trade for the modern security professional.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="relative group"
                            >
                                <ProductCard {...product} delay={index * 0.1} />
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* TRUST SECTION */}
            <section className="py-24 border-y border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
                        {[
                            {
                                icon: Shield,
                                title: 'Authentic Gear',
                                description: 'Certified authentic hardware sourced directly from original manufacturers.',
                            },
                            {
                                icon: Package,
                                title: 'Priority Shipping',
                                description: 'Discrete packaging with express tracked shipping for all hardware orders.',
                            },
                            {
                                icon: Zap,
                                title: 'Instant Activation',
                                description: 'Get immediate access to ZecurX Academy tutorials for your new tool.',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 border border-border/50">
                                    <item.icon className="w-6 h-6 text-foreground/80" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-4">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ENTERPRISE CTA */}
            <section className="py-32 bg-foreground text-background">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                            Bulk Procurement
                        </h2>
                        <p className="text-background/80 text-xl font-light leading-relaxed mb-12 max-w-md">
                            Equip your entire Red Team with industry-standard hardware.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground font-semibold hover:bg-background/90 transition-colors"
                        >
                            <span>Contact Sales</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-full h-px bg-background/20 mb-8" />
                        <div className="w-full h-px bg-background/20 mb-8 ml-12" />
                        <div className="w-full h-px bg-background/20 ml-24" />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
