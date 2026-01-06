"use client";

import React, { useState, useEffect } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const solutions = [
    {
        id: "digital-transformation",
        title: "Digital Transformation",
        tagline: "Secure Modernization",
        description: "Enable secure modernization while adopting cloud, automation, and emerging technologies.",
        stat: "Proven",
        statLabel: "Risk Reduction",
        featured: true,
    },
    {
        id: "ai-powered-soc",
        title: "AI-Powered SOC",
        tagline: "Next-Gen Operations",
        description: "Modernize your security operations with intelligence-driven detection and AI-powered response.",
        stat: "Faster",
        statLabel: "Response Time",
        featured: true,
    },
    {
        id: "zero-trust",
        title: "Zero Trust",
        tagline: "Never Trust, Always Verify",
        description: "Move beyond perimeter-based security to continuous verification and least-privilege access.",
        stat: "Strict",
        statLabel: "Verification",
    },
    {
        id: "ransomware-defense",
        title: "Ransomware Defense",
        tagline: "Multi-Layer Defense",
        description: "Multi-layered defense combining prevention, detection, and rapid recovery.",
        stat: "Rapid",
        statLabel: "Response SLA",
    },
    {
        id: "cloud-security",
        title: "Cloud Security",
        tagline: "Multi-Cloud Protection",
        description: "Secure your multi-cloud environments—AWS, Azure, GCP—with comprehensive visibility.",
        stat: "All",
        statLabel: "Cloud Platforms",
    },
    {
        id: "compliance",
        title: "Compliance",
        tagline: "Regulatory Alignment",
        description: "Achieve and maintain compliance with industry regulations and security frameworks.",
        stat: "Multi",
        statLabel: "Framework Support",
    },
];

export default function SolutionsPage() {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);

        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, []);

    const gridColor = mounted
        ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')
        : 'transparent';

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">

            <CreativeNavBar />

            {/* Hero Header */}
            <section className="relative w-full min-h-[50vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 pb-12">

                {/* Modern Grid Texture */}
                <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Subtle Top Glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-5xl mx-auto"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground text-sm font-medium mb-8 backdrop-blur-sm"
                        >
                            Security Solutions
                        </motion.span>

                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            Protect. Defend. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">Secure.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-2xl mx-auto">
                            Comprehensive cybersecurity aligned with your business priorities.
                            Enabling growth, resilience, and compliance at enterprise scale.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Solutions Grid - Unified Professional Layout */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {solutions.map((solution, index) => (
                            <motion.div
                                key={solution.id}
                                variants={itemVariants}
                                className={index < 2 ? "lg:col-span-1" : ""}
                            >
                                <Link
                                    id={solution.id}
                                    href={`/solutions/${solution.id}`}
                                    className="group relative block h-full p-8 rounded-2xl bg-muted/40 backdrop-blur-sm border border-border/50 hover:border-foreground/20 hover:bg-muted/60 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Subtle gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Corner accent */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Header with tagline */}
                                        <span className="text-primary font-manrope font-semibold tracking-widest text-[10px] uppercase mb-4">
                                            {solution.tagline}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-2xl font-manrope font-medium text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                                            {solution.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                                            {solution.description}
                                        </p>

                                        {/* Arrow indicator */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground/60 font-manrope uppercase tracking-wide group-hover:text-primary/60 transition-colors">
                                                Learn more
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
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
                    <a
                        href="#"
                        className="group inline-flex items-center gap-2 text-lg font-manrope font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Contact Us
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </a>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
