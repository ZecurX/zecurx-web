"use client";

import React, { useState, useEffect } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

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
        id: "identity-security",
        title: "Identity Security",
        tagline: "Unified Protection",
        description: "Stop identity attacks with unified protection for every identity—human, non-human, AI, and SaaS.",
        stat: "80%",
        statLabel: "Breach Prevention",
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
        id: "endpoint-protection",
        title: "Endpoint Security",
        tagline: "AI-Powered Protection",
        description: "Unified endpoint protection powered by AI with real-time visibility across all endpoints.",
        stat: "24/7",
        statLabel: "Monitoring",
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
        id: "threat-intelligence",
        title: "Threat Intelligence",
        tagline: "Proactive Defense",
        description: "Real-time insights into attacker tactics, techniques, and procedures.",
        stat: "Real-time",
        statLabel: "Insights",
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

    const featuredSolutions = solutions.filter(s => s.featured);
    const regularSolutions = solutions.filter(s => !s.featured);

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

            {/* Featured Solutions - Large Cards */}
            <section className="relative z-10 px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {featuredSolutions.map((solution, index) => (
                            <motion.a
                                key={solution.id}
                                id={solution.id}
                                href={`#${solution.id}`}
                                variants={itemVariants}
                                className="group relative block p-8 md:p-10 rounded-3xl bg-muted/50 backdrop-blur-sm border border-border hover:border-foreground/20 transition-all duration-300 min-h-[320px] flex flex-col justify-between overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <p className="text-primary font-manrope font-semibold tracking-widest text-xs uppercase mb-4">
                                        {solution.tagline}
                                    </p>
                                    <h2 className="text-3xl md:text-4xl font-manrope font-medium text-foreground mb-4">
                                        {solution.title}
                                    </h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                                        {solution.description}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-end justify-between mt-8">
                                    <div>
                                        <span className="text-4xl md:text-5xl font-manrope font-bold text-foreground">
                                            {solution.stat}
                                        </span>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {solution.statLabel}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <ArrowUpRight className="w-5 h-5 text-foreground/80 group-hover:rotate-45 transition-all duration-300" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Regular Solutions - Grid matching home page card style */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {regularSolutions.map((solution) => (
                            <motion.a
                                key={solution.id}
                                id={solution.id}
                                href={`#${solution.id}`}
                                variants={itemVariants}
                                className="group relative p-6 rounded-2xl bg-muted/30 backdrop-blur-md border border-border hover:border-foreground/10 transition-all duration-300 overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-primary transition-colors" />
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground group-hover:rotate-45 transition-all duration-300" />
                                    </div>

                                    <h3 className="text-lg font-manrope font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {solution.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-manrope mb-4">
                                        {solution.tagline}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                        {solution.description}
                                    </p>

                                    <div className="flex items-baseline gap-2 pt-4 border-t border-border/50">
                                        <span className="text-2xl font-manrope font-bold text-foreground">
                                            {solution.stat}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {solution.statLabel}
                                        </span>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-6 py-16 border-t border-border">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
                    >
                        {[
                            { value: "8", label: "Security Solutions" },
                            { value: "24/7", label: "AI Monitoring" },
                            { value: "99.9%", label: "Uptime SLA" },
                            { value: "<4hr", label: "Response Time" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-manrope font-bold text-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
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
