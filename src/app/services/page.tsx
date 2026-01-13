"use client";

import React from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import {
    ArrowUpRight, Target, Eye, Code, Globe, Terminal, Users,
    Radar, FolderSearch, Lock, ArrowRight
} from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardTagline
} from "@/components/ui/card";

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
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

const offensiveServices = [
    {
        title: "Penetration Testing",
        tagline: "ADVERSARY SIMULATION",
        description: "Adversary simulation designed to expose real-world risks before attackers leverage them.",
        icon: Target,
        href: "/services/offensive/penetration-testing"
    },
    {
        title: "Vulnerability Management",
        tagline: "CONTINUOUS DISCOVERY",
        description: "Continuous asset discovery and risk prioritization for a proactive defense posture.",
        icon: Eye,
        href: "/services/offensive/vulnerability-management"
    }
];

const engineeringServices = [
    {
        title: "Secure Development",
        tagline: "SDLC & MODELING",
        description: "Embedding security into the SDLC. Code reviews, threat modeling, and secure design patterns.",
        icon: Code,
        href: "/services/engineering/secure-development"
    },
    {
        title: "Web & App Security",
        tagline: "APP HARDENING",
        description: "Hardening critical applications against OWASP Top 10 and advanced attack vectors.",
        icon: Globe,
        href: "/services/engineering/web-app-security"
    },
    {
        title: "DevSecOps Implementation",
        tagline: "PIPELINE SECURITY",
        description: "Automating security controls within CI/CD pipelines for velocity without compromise.",
        icon: Terminal,
        href: "/services/engineering/devsecops"
    },
    {
        title: "Strategic Consulting",
        tagline: "ADVISORY & CISO",
        description: "vCISO services, compliance readiness, and security roadmap development.",
        icon: Users,
        href: "/services/engineering/consulting"
    },
];

const tools = [
    { name: "Subdomain Finder", icon: Target },
    { name: "Port Radar", icon: Radar },
    { name: "Directory Scanner", icon: FolderSearch },
    { name: "SSL Analyzer", icon: Lock },
];

export default function ServicesPage() {
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
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            Security. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">Engineered.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-2xl mx-auto">
                            We don't just find vulnerabilities; we engineer resilience.
                            From offensive simulations to secure architecture, ZecurX delivers
                            precision cybersecurity services.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="w-full h-px bg-border/40 max-w-7xl mx-auto mb-16" />

            {/* OFFENSIVE SECURITY Grid */}
            <section className="relative z-10 px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            01 / Offensive Security
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-8"
                    >
                        {offensiveServices.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                            >
                                <Link
                                    href={item.href}
                                >
                                    <Card className="h-full flex flex-col hover:bg-muted/60 transition-colors border-border/40">
                                        <CardHeader className="pb-4">
                                            <CardTagline className="mb-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
                                                {item.tagline}
                                            </CardTagline>
                                            <CardTitle className="text-2xl font-manrope font-medium text-foreground">{item.title}</CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="mb-8 text-base font-light leading-relaxed line-clamp-3">
                                                {item.description}
                                            </CardDescription>
                                        </CardContent>

                                        <CardFooter className="justify-between mt-auto pt-4 border-t border-border/10">
                                            <span className="text-[11px] font-semibold text-muted-foreground/60 font-manrope uppercase tracking-widest group-hover:text-foreground/80 transition-colors">
                                                LEARN MORE
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SECURITY ENGINEERING Grid */}
            <section className="relative z-10 px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            02 / Security Engineering
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-8"
                    >
                        {engineeringServices.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="w-full md:w-[calc(50%-16px)] max-w-[500px]"
                            >
                                <Link
                                    href={item.href}
                                >
                                    <Card className="h-full flex flex-col hover:bg-muted/60 transition-colors border-border/40">
                                        <CardHeader className="pb-4">
                                            <CardTagline className="mb-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
                                                {item.tagline}
                                            </CardTagline>
                                            <CardTitle className="text-2xl font-manrope font-medium text-foreground">{item.title}</CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="mb-8 text-base font-light leading-relaxed line-clamp-3">
                                                {item.description}
                                            </CardDescription>
                                        </CardContent>

                                        <CardFooter className="justify-between mt-auto pt-4 border-t border-border/10">
                                            <span className="text-[11px] font-semibold text-muted-foreground/60 font-manrope uppercase tracking-widest group-hover:text-foreground/80 transition-colors">
                                                LEARN MORE
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* TOOLS HIGHLIGHT */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">
                                TOOLKIT
                            </span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-medium mb-4 text-foreground">
                                The VulnHunter Suite
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Our proprietary toolkit for automated reconnaissance and asset monitoring.
                            </p>
                        </div>
                        <Link href="/tools">
                            <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-card/50 border border-border/40 hover:bg-muted/20 transition-all duration-300">
                                <span className="text-sm font-semibold text-foreground/90">Explore Tools</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                        {tools.map((tool, index) => (
                            <Link href="/tools" key={index} className="group flex items-center justify-between p-5 border border-zinc-200 dark:border-white/5 bg-white/60 dark:bg-zinc-950/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 dark:hover:border-white/10 transition-all duration-300 rounded-lg backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-md bg-zinc-100 dark:bg-white/5 text-muted-foreground/70 dark:text-zinc-400 group-hover:text-primary dark:group-hover:text-white dark:group-hover:bg-white/10 transition-colors">
                                        <tool.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-muted-foreground dark:text-zinc-400 group-hover:text-foreground dark:group-hover:text-white transition-colors">{tool.name}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground/50 dark:text-zinc-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                        ))}
                    </div>
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
                            Secure your infrastructure.
                        </h2>
                        <p className="text-muted-foreground font-manrope">
                            Partner with ZecurX for a security posture that scales with your ambition.
                        </p>
                    </div>
                    <a
                        href="/contact"
                        className="group inline-flex items-center gap-2 text-lg font-manrope font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Contact Sales
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </a>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
