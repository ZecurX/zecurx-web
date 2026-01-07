"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    features = []
}: ToolPageLayoutProps) {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-foreground/20">
            <CreativeNavBar />

            {/* Hero Section */}
            <section className="relative w-full bg-background overflow-hidden px-6 pt-32 pb-16">

                {/* Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">

                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-12"
                    >
                        <Link
                            href="/tools"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
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
                        className="flex flex-col md:flex-row md:items-start gap-8 mb-16"
                    >
                        <div className="p-4 bg-muted/50 rounded-xl border border-border">
                            <Icon className="w-10 h-10 text-foreground" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-manrope text-foreground">
                                {title}
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tool Interface Section */}
            <section className="px-6 pb-32">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-muted/20 border border-border rounded-2xl p-8 md:p-12"
                    >
                        {children}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-border/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Need Enterprise Access?</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Get unlimited API access, priority scanning, and dedicated support for your security team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="rounded-full h-12 px-8">
                                Contact Sales
                            </Button>
                        </Link>
                        <Link href="/tools">
                            <Button variant="outline" size="lg" className="rounded-full h-12 px-8 border-foreground/20 text-foreground hover:bg-muted">
                                View All Tools
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
