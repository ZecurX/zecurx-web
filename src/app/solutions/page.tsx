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
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const solutions = [
    {
        id: "digital-transformation",
        title: "Digital Transformation",
        tagline: "Secure Modernization",
        description: "Enable secure modernization while adopting cloud, automation, and emerging technologies.",
        stat: "60%",
        statLabel: "Risk Reduction",
        featured: true,
    },
    {
        id: "ai-powered-soc",
        title: "AI-Powered SOC",
        tagline: "Next-Gen Operations",
        description: "Modernize your security operations with intelligence-driven detection and AI-powered response.",
        stat: "95%",
        statLabel: "Faster Response",
        featured: true,
    },
    {
        id: "zero-trust",
        title: "Zero Trust",
        tagline: "Never Trust, Always Verify",
        description: "Move beyond perimeter-based security to continuous verification and least-privilege access.",
        stat: "100%",
        statLabel: "Verification",
    },
    {
        id: "ransomware-defense",
        title: "Ransomware Defense",
        tagline: "Multi-Layer Defense",
        description: "Multi-layered defense combining prevention, detection, and rapid recovery.",
        stat: "<4hr",
        statLabel: "Response SLA",
    },
    {
        id: "cloud-security",
        title: "Cloud Security",
        tagline: "Multi-Cloud Protection",
        description: "Secure your multi-cloud environments—AWS, Azure, GCP—with comprehensive visibility.",
        stat: "3+",
        statLabel: "Cloud Platforms",
    },
    {
        id: "compliance",
        title: "Compliance",
        tagline: "Regulatory Alignment",
        description: "Achieve and maintain compliance with industry regulations and security frameworks.",
        stat: "20+",
        statLabel: "Frameworks",
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

            {/* Background Ambience - subtle blue glow only */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] dark:bg-blue-500/10" />
            </div>

            <CreativeNavBar />

            {/* Hero Header */}
            <section className="pt-32 pb-6 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase mb-4 block"
                    >
                        Security Solutions
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-8"
                    >
                        Protect. <br />
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                            Defend. Secure.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-muted-foreground font-manrope font-light leading-relaxed max-w-2xl"
                    >
                        Comprehensive cybersecurity aligned with your business priorities.
                        Enabling <span className="text-foreground font-medium">growth, resilience, and compliance</span> at enterprise scale.
                    </motion.p>
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
