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
                <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[120px] dark:bg-foreground/10" />
            </div>

            <CreativeNavBar />

            {/* Hero Section */}
            <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 relative z-10">
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
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-6"
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
                        className="text-lg md:text-xl text-muted-foreground font-manrope font-light leading-relaxed max-w-3xl mb-8 md:mb-10"
                    >
                        {data.description}
                    </motion.p>

                    {/* CTA Buttons - replaced with email capture */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <ServiceHeroEmailCapture serviceName={`${data.title} ${data.subtitle}`.trim()} />
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
                                className="h-full"
                            >
                                <Card className="h-full flex flex-col bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-300 backdrop-blur-sm group hover:shadow-lg hover:shadow-primary/5">
                                    <CardHeader className="pb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                            <div className="text-primary">
                                                {capability.icon}
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-manrope font-bold text-foreground group-hover:text-primary transition-colors">
                                            {capability.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base font-light leading-relaxed text-muted-foreground/90">
                                            {capability.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
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
                                viewport={{ once: true }}
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
                                        viewport={{ once: true }}
                                        className="w-full max-w-4xl mx-auto px-4 mb-24 relative z-10"
                                    >
                                        <div className="relative aspect-[16/9] rounded-[2rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
                                            {visualFeature.component ? (
                                                <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-transparent p-8">
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
            <section className="relative z-10 px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background px-8 py-16 md:p-20 text-center">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-background/30 rounded-full blur-[100px]" />
                            <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-primary/40 rounded-full blur-[80px]" />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-5xl font-manrope font-bold mb-6 tracking-tight">
                                Ready to secure your future?
                            </h2>
                            <p className="text-xl md:text-2xl text-background/80 font-light leading-relaxed max-w-2xl mx-auto">
                                Schedule a consultation with our security architects and see how ZecurX can transform your defense posture.
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="h-14 px-8 rounded-full bg-background text-foreground hover:bg-background/90 text-lg font-semibold shadow-xl">
                                    <Link href="/book-demo">
                                        Book a Demo
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white text-lg font-medium">
                                    <Link href="/contact">
                                        Contact Sales
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
