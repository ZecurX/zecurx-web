"use client";

import React, { useState, useEffect } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { ArrowUpRight, Shield, Cloud, KeyRound, Code, Target, Brain, Settings, Lock } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
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

// Group 1: Core Security
const coreCapabilities = [
    {
        id: "endpoint-security",
        title: "Endpoint Security",
        tagline: "Behavior-Based Protection",
        description: "Continuous endpoint visibility and behavior-based protection. AI models detect abnormal behavior and zero-day activity.",
        capabilities: ["Behavioral Analysis", "Ransomware Rollback", "Device Control"],
        icon: Shield,
    },
    {
        id: "cloud-security",
        title: "Cloud Security",
        tagline: "Multi-Cloud Visibility",
        description: "Unified visibility across multi-cloud and hybrid environments with AI-powered posture analysis.",
        capabilities: ["CSPM & CWPP", "Container Security", "IaC Scanning"],
        icon: Cloud,
    },
    {
        id: "identity-security",
        title: "Identity Security",
        tagline: "Zero Trust Access",
        description: "Focus on identity behavior and access risk. AI detects identity abuse and triggers automated restrictions.",
        capabilities: ["Identity Threat Detection", "Risk-Based Auth", "Privileged Access"],
        icon: KeyRound,
    },
    {
        id: "application-security",
        title: "Application Security",
        tagline: "Secure SDLC",
        description: "Security integrated across the application lifecycle. AI prioritizes risks and automates remediation.",
        capabilities: ["SAST/DAST Integration", "API Security", "Runtime Protection"],
        icon: Code,
    },
];

// Group 2: Intelligence & Operations
const intelCapabilities = [
    {
        id: "threat-intelligence",
        title: "Threat Intelligence",
        tagline: "Proactive Hunting",
        description: "Global threat intelligence with proactive hunting. AI correlates threat data to surface hidden threats.",
        capabilities: ["Dark Web Monitoring", "Threat Feeds", "Adversary Profiling"],
        icon: Target,
    },
    {
        id: "ai-detection",
        title: "AI Detection",
        tagline: "ML-Powered Analytics",
        description: "High-confidence detections with contextual intelligence. AI-driven correlation automates response actions.",
        capabilities: ["UEBA", "Network Traffic Analysis", "Automated Investigation"],
        icon: Brain,
    },
    {
        id: "security-automation",
        title: "Security Automation",
        tagline: "SOAR Capabilities",
        description: "Automation across detection, investigation, and response workflows. AI-driven playbooks for strategic focus.",
        capabilities: ["Playbook Automation", "Case Management", "Integrations Fabric"],
        icon: Settings,
    },
    {
        id: "data-protection",
        title: "Data Protection",
        tagline: "DLP & Encryption",
        description: "Data-centric security with visibility into usage and movement. AI enforces protection policies.",
        capabilities: ["Data Classification", "Insider Risk", "Encryption Mgmt"],
        icon: Lock,
    },
];

export default function PlatformPage() {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

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
                            Unified Security <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">Architecture.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed max-w-2xl mx-auto">
                            A comprehensive, AI-driven platform designed to predict, prevent, and respond to modern cyber threats across your entire digital estate.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Protection Grid */}
            <section className="relative z-10 px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            Core Protection
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-8"
                    >
                        {coreCapabilities.map((item, index) => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                className="w-full md:w-[calc(50%-16px)] max-w-[500px]"
                            >
                                <Link
                                    href={`/platform/${item.id}`}
                                >
                                    <Card className="h-full flex flex-col hover:bg-muted/60 transition-colors border-border/40">
                                        <CardHeader className="pb-4">
                                            <CardTagline className="mb-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
                                                {item.tagline}
                                            </CardTagline>
                                            <CardTitle className="text-2xl font-manrope font-medium text-foreground">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="mb-8 line-clamp-3 text-base font-light leading-relaxed">
                                                {item.description}
                                            </CardDescription>

                                            <div className="mt-auto">
                                                {/* Capabilities list removed for cleaner look as per "minimal" request, or kept if essential? 
                                                   User said "content change" but "same layout". Reference image DOES NOT show a list. 
                                                   It shows Title, Description, Footer. I will hide the list to match the "clean" reference. */}
                                            </div>
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

            {/* Intelligence & Operations Grid */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            Intelligence & Operations
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-8"
                    >
                        {intelCapabilities.map((item, index) => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                            >
                                <Link
                                    href={`/platform/${item.id}`}
                                >
                                    <Card className="h-full flex flex-col hover:bg-muted/60 transition-colors border-border/40">
                                        <CardHeader className="pb-4">
                                            <CardTagline className="mb-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
                                                {item.tagline}
                                            </CardTagline>
                                            <CardTitle className="text-2xl font-manrope font-medium text-foreground">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="mb-8 line-clamp-3 text-base font-light leading-relaxed">
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
                            Ready to secure your enterprise?
                        </h2>
                        <p className="text-muted-foreground font-manrope">
                            See how the ZecurX platform can transform your security posture.
                        </p>
                    </div>
                    <a
                        href="/book-demo"
                        className="group inline-flex items-center gap-2 text-lg font-manrope font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Request Platform Demo
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    </a>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
