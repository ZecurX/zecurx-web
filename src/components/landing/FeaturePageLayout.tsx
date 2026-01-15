"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ServiceHeroEmailCapture from "@/components/services/ServiceHeroEmailCapture";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

interface FeatureData {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    heroImage?: string;
    heroImageClassName?: string;
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

import CTASection from '@/components/landing/CTASection';

import { AbstractDashboard } from '@/components/services/ui/AbstractDashboard';

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
        <main className="bg-white dark:bg-black min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">

            {/* Grid Background - REMOVED for seamless black look */}
            {/* <div className="absolute inset-0 z-0" ... /> */}

            {/* Background Ambience - REMOVED for pitch black background */}
            {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[120px] dark:bg-foreground/10" />
            </div> */}

            <CreativeNavBar />

            {/* Hero Section */}
            <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div>
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
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-6"
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
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg md:text-xl text-muted-foreground font-manrope font-light leading-relaxed mb-8 md:mb-10 max-w-xl"
                            >
                                {data.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <ServiceHeroEmailCapture serviceName={`${data.title} ${data.subtitle}`.trim()} />
                            </motion.div>
                        </div>

                        {/* Right Image */}
                        {data.heroImage && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                            >
                                <Image
                                    src={data.heroImage}
                                    alt={`${data.title} ${data.subtitle}`}
                                    fill
                                    className={cn(
                                        "object-cover dark:invert dark:hue-rotate-180",
                                        data.heroImageClassName
                                    )}
                                    priority
                                />
                            </motion.div>
                        )}
                    </div>
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
                        viewport={{ once: true, amount: 0.1 }}
                        className={cn(
                            "grid md:grid-cols-2 gap-px bg-border/50 border border-border/50",
                            data.capabilities.length === 4 ? "lg:grid-cols-2" : "lg:grid-cols-3"
                        )}
                    >
                        {data.capabilities.map((capability, index) => {
                            const formattedIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="group relative p-8 h-full flex flex-col justify-between bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors duration-500"
                                >
                                    <div className="mb-8">
                                        <span className="block font-mono text-xs text-muted-foreground/60 mb-4 tracking-widest">
                                            /{formattedIndex}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-manrope font-semibold text-foreground tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                                            {capability.title}
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base border-t border-border/50 pt-6 group-hover:text-foreground/80 transition-colors">
                                        {capability.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 px-6 py-20">
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
                                viewport={{ once: true, amount: 0.2 }}
                                className="flex flex-col gap-8 items-center text-center max-w-4xl mx-auto mb-24 last:mb-0"
                            >
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-manrope font-semibold text-foreground mb-6">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xl text-muted-foreground font-light leading-relaxed mb-10 max-w-2xl mx-auto">
                                        {feature.description}
                                    </p>
                                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-left max-w-2xl mx-auto">
                                        {feature.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <span className="text-foreground/80 font-medium">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );

                        return (
                            <div className="flex flex-col gap-16">
                                {/* Top Text Feature */}
                                {topFeature && <FeatureBlock feature={topFeature} />}

                                {/* Central Visual */}
                                {visualFeature && (visualFeature.component || visualFeature.image) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        className="w-full max-w-5xl mx-auto mb-24 relative z-10"
                                    >
                                        <AbstractDashboard title={visualFeature.title}>
                                            {visualFeature.component ? (
                                                <div className="transform scale-110 md:scale-125 transition-transform duration-700">
                                                    {visualFeature.component}
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-full min-h-[300px]">
                                                    <Image
                                                        src={visualFeature.image!}
                                                        alt={visualFeature.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                        </AbstractDashboard>
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
            <CTASection />

            <Footer />
        </main>
    );
}
