"use client";

import React, { useState, useEffect } from 'react';
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { ArrowUpRight, Shield, Cloud, KeyRound, Code, Target, Brain, Settings, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

    const gridColor = mounted
        ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
        : 'transparent';

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">

            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), 
                                     linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                }}
            />

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

            <CreativeNavBar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-manrope font-light text-foreground leading-[1.1] mb-6"
                    >
                        Unified Security <br className="hidden md:block" />
                        <span className="font-semibold">Architecture</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-muted-foreground font-manrope font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        A comprehensive, AI-driven platform designed to predict, prevent, and respond to modern cyber threats across your entire digital estate.
                    </motion.p>
                </div>
            </section>

            {/* SECTION 1: CORE SECURITY */}
            <section className="px-6 pb-12 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            Core Protection
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreCapabilities.map((item, index) => (
                            <PlatformCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2: INTELLIGENCE & OPERATIONS */}
            <section className="px-6 pb-24 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            Intelligence & Operations
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {intelCapabilities.map((item, index) => (
                            <PlatformCard key={item.id} item={item} index={index} delay={0.2} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-manrope font-medium text-foreground mb-4">
                        Ready to secure your enterprise?
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        See how the ZecurX platform can transform your security posture with a personalized demo.
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors group"
                    >
                        Request Platform Demo
                        <ArrowUpRight className="w-5 h-5" />
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function PlatformCard({ item, index, delay = 0 }: { item: any, index: number, delay?: number }) {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + (index * 0.1) }}
            viewport={{ once: true }}
            className="group"
        >
            <Link href={`/platform/${item.id}`} className="block h-full">
                <div className="relative h-full p-6 bg-card/40 backdrop-blur-sm border border-border/60 rounded-xl hover:border-primary/50 hover:bg-muted/40 hover:-translate-y-1 transition-all duration-300 flex flex-col">

                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                            <Icon className="w-5 h-5" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>

                    {/* Content */}
                    <div className="mb-6 flex-grow">
                        <h3 className="text-lg font-manrope font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {item.description}
                        </p>
                    </div>

                    {/* Footer / Capabilities List */}
                    <div className="pt-4 border-t border-border/40">
                        <ul className="space-y-2">
                            {item.capabilities.map((cap: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-[11px] font-medium text-foreground/70">
                                    <div className="w-1 h-1 rounded-full bg-primary/70" />
                                    {cap}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </Link>
        </motion.div>
    );
}
