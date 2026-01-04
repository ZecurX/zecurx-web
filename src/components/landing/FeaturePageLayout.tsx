"use client";

import React from 'react';
import Image from 'next/image';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FeatureData {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    capabilities: {
        icon: React.ReactNode;
        title: string;
        description: string;
    }[];
    features: {
        title: string;
        description: string;
        points: string[];
        image?: string;
        component?: React.ReactNode;
    }[];
    stats: {
        value: string;
        label: string;
    }[];
}

interface FeaturePageLayoutProps {
    data: FeatureData;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export default function FeaturePageLayout({ data }: FeaturePageLayoutProps) {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const gridColor = mounted
        ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')
        : 'transparent';

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">

            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), 
                                     linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                }}
            />

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] dark:bg-blue-500/10" />
            </div>

            <CreativeNavBar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block"
                    >
                        {data.badge}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-6"
                    >
                        {data.title}
                        {data.subtitle && (
                            <>
                                <br />
                                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                                    {data.subtitle}
                                </span>
                            </>
                        )}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-muted-foreground font-manrope font-light leading-relaxed max-w-3xl mb-10"
                    >
                        {data.description}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button
                            size="lg"
                            className="pl-8 pr-2 py-2 h-auto gap-6 rounded-full text-base hover:scale-105 transition-transform duration-300 group"
                        >
                            Request Demo
                            <div className="w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                <span className="text-lg">↗</span>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full text-base font-medium"
                            asChild
                        >
                            <Link href="#">
                                Contact Us
                                <ArrowUpRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="text-primary font-manrope font-semibold tracking-widest text-xs uppercase mb-2 block">
                            Key Capabilities
                        </span>
                        <h2 className="text-3xl md:text-4xl font-manrope font-medium text-foreground">
                            What We Deliver
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {data.capabilities.map((capability, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group p-6 rounded-2xl bg-muted/30 backdrop-blur-md border border-border hover:border-foreground/10 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {capability.icon}
                                </div>
                                <h3 className="text-lg font-manrope font-semibold text-foreground mb-2">
                                    {capability.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {capability.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 px-6 py-16">
                <div className="max-w-7xl mx-auto">
                    {(() => {
                        const visualFeatureIndex = data.features.findIndex(f => f.component || f.image);
                        const visualFeature = data.features[visualFeatureIndex];
                        const textFeatures = data.features.filter((_, i) => i !== visualFeatureIndex);
                        const topFeature = textFeatures[0];
                        const bottomFeature = textFeatures[1];

                        const FeatureBlock = ({ feature }: { feature: typeof data.features[0] }) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="flex flex-col gap-8 items-center text-center max-w-4xl mx-auto mb-24 last:mb-0"
                            >
                                <div>
                                    <h3 className="text-2xl md:text-4xl font-manrope font-medium text-foreground mb-6">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                                        {feature.description}
                                    </p>
                                    <ul className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                                        {feature.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                                <span className="text-foreground/80">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );

                        return (
                            <div className="flex flex-col gap-12">
                                {/* Top Text Feature */}
                                {topFeature && <FeatureBlock feature={topFeature} />}

                                {/* Central Visual */}
                                {visualFeature && (visualFeature.component || visualFeature.image) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                        viewport={{ once: true }}
                                        className="w-full max-w-2xl mx-auto px-4 mb-24 relative z-10"
                                    >
                                        <div className="relative aspect-[16/9] rounded-3xl bg-white dark:bg-muted/5 border border-border/10 dark:border-border/5 shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                                            {/* Light mode gradient overlay for depth */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-transparent opacity-100 dark:opacity-0 pointer-events-none" />

                                            {visualFeature.component ? (
                                                <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-transparent">
                                                    {visualFeature.component}
                                                </div>
                                            ) : (
                                                <Image
                                                    src={visualFeature.image!}
                                                    alt={visualFeature.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Bottom Text Feature */}
                                {bottomFeature && <FeatureBlock feature={bottomFeature} />}
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-manrope font-medium text-foreground mb-2">
                            Ready to get started?
                        </h2>
                        <p className="text-muted-foreground font-manrope">
                            Schedule a consultation with our security experts.
                        </p>
                    </div>
                    <Link
                        href="#"
                        className="group inline-flex items-center gap-2 text-lg font-manrope font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Contact Us
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
