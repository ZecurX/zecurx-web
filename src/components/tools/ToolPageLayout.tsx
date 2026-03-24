"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { DotPattern } from "@/components/ui/dot-pattern";

interface ToolPageLayoutProps {
    title: string;
    description: string;
    icon: LucideIcon;
    children: React.ReactNode;
    features?: string[];
}

export default function ToolPageLayout({
    title,
    description,
    icon: Icon,
    children,
    features: _features = []
}: ToolPageLayoutProps) {
    return (
        <main className="relative min-h-screen bg-background font-sans">
            <div className="relative z-10 bg-background text-foreground selection:bg-foreground/20 overflow-hidden mb-[700px] md:mb-[420px]">
                <CreativeNavBar />

                {/* Hero Section */}
                <section className="relative w-full bg-background overflow-hidden px-4 pt-32 pb-12 contain-paint">
                    {/* Organic blue-white blobs */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto', contain: 'strict' }}>
                        <div
                            className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
                            style={{
                                background: "radial-gradient(circle at center, rgba(74, 111, 250, 0.15) 0%, transparent 70%)",
                                filter: "blur(60px)",
                                willChange: 'transform',
                            }}
                        />
                        <div
                            className="absolute top-1/3 right-[5%] w-[700px] h-[500px] rounded-full"
                            style={{
                                background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.14) 0%, transparent 65%)",
                                filter: "blur(70px)",
                                willChange: 'transform',
                            }}
                        />
                        <div
                            className="absolute top-[8%] left-[35%] w-[500px] h-[400px] rounded-full bg-foreground/5"
                            style={{
                                filter: "blur(40px)",
                                willChange: 'transform',
                            }}
                        />
                    </div>

                    <DotPattern
                        width={18}
                        height={18}
                        cr={1.1}
                        randomOpacity
                        className="text-slate-400/50 dark:text-slate-500/30"
                    />

                    <div className="max-w-5xl mx-auto relative z-10">
                        {/* Breadcrumb */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8 md:mb-12"
                        >
                            <Link
                                href="/tools"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-inter transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Tools
                            </Link>
                        </motion.div>

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-12 md:mb-16"
                        >
                            <div className="p-4 md:p-5 bg-muted/50 rounded-2xl border border-border/40 text-[#4a69e6] w-max shadow-sm backdrop-blur-sm">
                                <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-manrope text-foreground tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                                    {title.split(' ').slice(0, -1).join(' ')}{' '}
                                    <span className="text-[#4a69e6]" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2em" }}>
                                        {title.split(' ').slice(-1)[0]}
                                    </span>
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground font-inter max-w-2xl leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Tool Interface Section */}
                <section className="px-4 pb-20 md:pb-32 relative z-10 bg-transparent">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-12 overflow-x-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative font-inter"
                        >
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 rounded-2xl md:rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] pointer-events-none" />
                            {children}
                        </motion.div>
                    </div>
                </section>

                {/* Call To Action */}
                <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-border/40">
                    <div className="max-w-[1320px] mx-auto px-6 relative z-10">
                        <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-muted/20 backdrop-blur-sm p-10 md:p-20 text-center">
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                                    style={{
                                        background: "radial-gradient(circle at center, rgba(74, 111, 250, 0.1) 0%, transparent 60%)",
                                        filter: "blur(40px)",
                                    }}
                                />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-manrope text-foreground mb-6 tracking-tight">
                                    Need Enterprise Access?
                                </h2>
                                <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto font-inter">
                                    Get unlimited API access, priority scanning, and dedicated support for your security team.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/contact" className="group w-full sm:w-auto">
                                        <button className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 bg-[#4a69e6] text-white rounded-full px-8 py-4 text-base font-semibold font-inter cursor-pointer transition-all duration-300 hover:bg-[#3b5bdb] hover:shadow-[0_0_20px_rgba(74,111,250,0.4)] hover:-translate-y-0.5">
                                            Contact Sales
                                        </button>
                                    </Link>
                                    <Link href="/tools" className="group w-full sm:w-auto">
                                        <button className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 bg-transparent text-foreground rounded-full px-8 py-4 text-base font-semibold font-inter cursor-pointer border border-border/50 transition-all duration-300 hover:bg-muted/50 hover:border-border hover:-translate-y-0.5">
                                            View All Tools
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-0">
                <Footer />
            </div>
        </main>
    );
}